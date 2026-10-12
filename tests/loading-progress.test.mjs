import test from 'node:test';
import assert from 'node:assert/strict';
import { createLoadingProgress, formatLoadingBytes, LOADING_STAGES } from '../src/loading-progress.js';

function fakeClock() {
  let now = 0, nextId = 0;
  const timers = new Map();
  return {
    now: () => now,
    setTimeout(callback, delay) { const id = ++nextId; timers.set(id, { callback, at: now + delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
    tick(milliseconds) {
      const target = now + milliseconds;
      while (true) {
        const pending = [...timers].filter(([, timer]) => timer.at <= target).sort((a, b) => a[1].at - b[1].at)[0];
        if (!pending) break;
        now = pending[1].at; timers.delete(pending[0]); pending[1].callback();
      }
      now = target;
    },
    pending: () => timers.size,
  };
}

function harness(options = {}) {
  const changes = [], announcements = [], clock = fakeClock();
  const manager = createLoadingProgress({ clock, onChange: state => changes.push(state), onAnnounce: text => announcements.push({ text, at: clock.now() }), ...options });
  const run = manager.begin();
  return { manager, run, changes, announcements, clock, state: () => run.snapshot() };
}

test('loading starts at zero with an unknown current stage, not a pretend percentage', () => {
  const { state } = harness();
  assert.equal(state().stage, 'download');
  assert.equal(state().workProgress, 0);
  assert.equal(state().completedStages, 0);
  assert.equal(state().totalStages, LOADING_STAGES.length + 1);
  assert.equal(state().indeterminate, true);
  assert.equal(state().stageProgress, null);
  assert.equal(state().detail, '正在连接服务器');
  assert.doesNotMatch(state().label + state().detail, /%|剩余|预计/);
  assert.equal(Object.isFrozen(state()), true);
});

test('known bytes are real current-attempt diagnostics, not earned checkpoint work', () => {
  const { run, state } = harness();
  run.attempt('download', { attempt: 1, maxAttempts: 3 });
  run.update('download', { received: 512, total: 1024, attempt: 1 });
  assert.equal(state().detail, '512 B / 1.0 KB');
  assert.deepEqual(state().stageProgress, { completed: 512, total: 1024, unit: 'bytes' });
  assert.equal(state().indeterminate, false);
  assert.equal(state().workProgress, 0);
  run.update('download', { received: 1024, total: 1024, attempt: 1 });
  assert.equal(state().workProgress, 0);
  run.complete('download');
  assert.equal(state().workProgress, 1 / state().totalStages);
});

test('missing Content-Length remains indeterminate and still reports received bytes', () => {
  const { run, state } = harness();
  run.update('download', { received: 3145728, total: 0 });
  assert.equal(state().detail, '已收到 3.1 MB · 总大小未知');
  assert.equal(state().stageProgress, null);
  assert.equal(state().indeterminate, true);
  run.update('download', { received: 4194304, total: 1024 });
  assert.equal(state().detail, '已收到 4.2 MB · 总大小未知');
  assert.equal(state().stageProgress, null, 'inconsistent Content-Length cannot invent completion');
});

test('retry resets visible bytes without retaining discarded work or accepting an old attempt', () => {
  const { run, state } = harness();
  run.update('textures', { completed: 7, total: 14, unit: '张' });
  run.update('download', { received: 900, total: 1000, attempt: 1 });
  const earned = state().workProgress;
  run.attempt('download', { attempt: 2, maxAttempts: 3 });
  assert.equal(state().detail, '第 2 / 3 次尝试 · 已收到 0 B · 总大小未知');
  assert.equal(state().stageProgress, null);
  assert.equal(state().workProgress, earned);
  run.update('download', { received: 10, total: 1000, attempt: 2 });
  assert.equal(state().detail, '第 2 / 3 次尝试 · 10 B / 1.0 KB');
  const current = state();
  assert.equal(run.update('download', { received: 1000, total: 1000, attempt: 1 }), false);
  assert.equal(run.attempt('download', { attempt: 1 }), false);
  assert.equal(state(), current);
  assert.equal(state().workProgress, earned);
});

test('parallel texture and GI work is visible without replacing the critical-path stage', () => {
  const { run, state } = harness();
  run.stage('parse');
  run.update('textures', { completed: 6, total: 14, unit: '张' });
  run.update('gi', { received: 4096, total: 8192, attempt: 1 });
  assert.equal(state().stage, 'parse');
  assert.equal(state().label, '解析家具模型');
  assert.equal(state().indeterminate, true);
  assert.equal(state().stageProgress, null);
  assert.equal(state().secondary, '画作与屏幕 6 / 14 张 · 间接光 4.1 KB / 8.2 KB');
  run.complete('gi');
  run.complete('textures');
  assert.equal(state().stage, 'parse');
  assert.equal(state().secondary, '画作与屏幕 14 / 14 张 · 间接光 4.1 KB / 8.2 KB');
  assert.equal(run.update('textures', { completed: 3, total: 14 }), false);
});

test('all actual work milestones and retained counts advance monotonically; only ready reaches one', () => {
  const { run, state, changes, clock } = harness();
  run.update('textures', { completed: 1, total: 14 });
  assert.equal(state().workProgress, (1 / 14) / state().totalStages);
  run.update('textures', { completed: 14, total: 14 });
  run.complete('textures');
  const beforeTime = state().workProgress;
  clock.tick(60000);
  assert.equal(state().workProgress, beforeTime, 'time cannot advance progress');
  run.stage('upload');
  run.update('upload', { completed: 3, total: 8, unit: '张' });
  run.update('upload', { completed: 8, total: 8, unit: '张' });
  run.complete('upload');
  run.stage('warm');
  run.update('warm', { completed: 1, total: 20, unit: '批' });
  run.update('warm', { completed: 20, total: 20, unit: '批' });
  for (const { id } of LOADING_STAGES) run.complete(id);
  assert.equal(state().workProgress, LOADING_STAGES.length / (LOADING_STAGES.length + 1));
  assert.ok(changes.every(state => state.workProgress < 1));
  run.ready();
  assert.equal(state().status, 'ready');
  assert.equal(state().workProgress, 1);
  assert.equal(state().completedStages, state().totalStages);
  assert.equal(state().indeterminate, false);
  assert.ok(changes.every((value, index) => index === 0 || value.workProgress >= changes[index - 1].workProgress));
});

test('count inventories reject stale or inconsistent totals instead of hiding regressions', () => {
  const { run, state } = harness();
  run.stage('warm');
  run.update('warm', { completed: 5, total: 20, unit: '批' });
  const current = state();
  for (const value of [{ completed: 4, total: 20 }, { completed: 5, total: 30 }, { completed: 30, total: 20 }, { completed: 1.5, total: 20 }, { completed: NaN, total: 20 }]) {
    assert.equal(run.update('warm', value), false);
    assert.equal(state(), current);
  }
  assert.deepEqual(state().stageProgress, { completed: 5, total: 20, unit: '批' });
  assert.equal(run.attempt('warm', { attempt: 2 }), false);
  assert.equal(run.update('warm', { received: 0, total: 100 }), false);
  assert.equal(state(), current, 'a counter cannot silently turn into retryable bytes');
});

test('shader wait is indeterminate while keeping completed batches visible', () => {
  const { run, state } = harness();
  run.stage('warm');
  run.update('warm', { completed: 12, total: 40, unit: '批' });
  run.stage('warm', { detail: '等待显卡编译着色器', indeterminate: true });
  assert.equal(state().indeterminate, true);
  assert.equal(state().detail, '等待显卡编译着色器 · 12 / 40 批');
  assert.deepEqual(state().stageProgress, { completed: 12, total: 40, unit: '批' });
  const work = state().workProgress;
  run.stage('warm', { indeterminate: false });
  assert.equal(state().indeterminate, false);
  assert.equal(state().detail, '12 / 40 批');
  assert.equal(state().workProgress, work);
});

test('unknown parsing, scene creation and navigation never acquire invented fractions', () => {
  const { run, state, clock } = harness();
  for (const id of ['decompress', 'parse', 'scene', 'walk', 'frame']) {
    run.stage(id);
    const work = state().workProgress;
    clock.tick(90000);
    assert.equal(state().indeterminate, true);
    assert.equal(state().stageProgress, null);
    assert.equal(state().detail, '正在处理，当前步骤无法统计细分进度');
    assert.equal(state().workProgress, work);
    run.complete(id);
  }
});

test('unmeasurable stages have visible explanations without hiding explicit or completed details', () => {
  const { run, state } = harness();
  run.stage('gi');
  assert.equal(state().detail, '正在连接服务器');
  run.stage('parse', { detail: '正在读取家具材质' });
  assert.equal(state().detail, '正在读取家具材质');
  run.complete('parse');
  assert.equal(state().detail, '已完成');
  run.stage('scene');
  assert.equal(state().detail, '正在处理，当前步骤无法统计细分进度');
  run.fail({ detail: '场景准备未完成' });
  assert.equal(state().detail, '场景准备未完成');
});

test('visual updates remain immediate while rapid stages and byte changes announce at most once per second', () => {
  const { run, changes, announcements, clock } = harness();
  assert.equal(announcements.length, 1);
  run.update('download', { received: 100, total: 1000 });
  run.update('download', { received: 200, total: 1000 });
  run.stage('decompress');
  run.stage('parse');
  assert.equal(changes.length, 5);
  assert.equal(announcements.length, 1);
  assert.equal(clock.pending(), 1);
  clock.tick(999);
  assert.equal(announcements.length, 1);
  clock.tick(1);
  assert.equal(announcements.length, 2);
  assert.equal(announcements[1].text, '解析家具模型。正在处理，当前步骤无法统计细分进度');
  run.stage('walk');
  run.update('textures', { completed: 3, total: 14, unit: '张' });
  clock.tick(1000);
  assert.equal(announcements[2].text, '准备漫游路径。正在处理，当前步骤无法统计细分进度。画作与屏幕 3 / 14 张');
  assert.equal(clock.pending(), 0);
});

test('terminal announcements are immediate and cancel a pending stale announcement', () => {
  const { run, announcements, clock, state } = harness();
  run.stage('parse');
  clock.tick(100);
  run.fail({ label: '家具解析未完成', detail: '请重新载入' });
  assert.equal(announcements.length, 2);
  assert.equal(announcements[1].at, 100);
  assert.equal(announcements[1].text, '家具解析未完成。请重新载入');
  assert.equal(clock.pending(), 0);
  clock.tick(10000);
  assert.equal(announcements.length, 2);
  assert.equal(state().status, 'failed');
});

test('abort stops late progress but the owner can still diagnose failure instead of falsely reporting cancellation', () => {
  const { manager, clock, announcements } = harness();
  const controller = new AbortController();
  const run = manager.begin({ signal: controller.signal });
  run.stage('parse');
  controller.abort(new Error('bad model'));
  const current = run.snapshot();
  assert.equal(run.update('textures', { completed: 14, total: 14 }), false);
  assert.equal(run.complete('parse'), false);
  assert.equal(run.ready(), false);
  assert.equal(run.snapshot(), current);
  assert.equal(clock.pending(), 0);
  assert.equal(run.fail({ detail: '家具解析未完成' }), true);
  assert.equal(run.snapshot().status, 'failed');
  assert.doesNotMatch(announcements.at(-1).text, /取消/);
});

test('ready, failed and cancelled states freeze all callbacks and cannot become another terminal state', () => {
  for (const method of ['ready', 'fail', 'cancel']) {
    const { run, state, changes } = harness();
    run[method]();
    const terminal = state(), size = changes.length;
    assert.equal(run.stage('download'), false);
    assert.equal(run.attempt('download', { attempt: 2 }), false);
    assert.equal(run.update('textures', { completed: 14, total: 14 }), false);
    assert.equal(run.complete('download'), false);
    assert.equal(run.ready(), false);
    assert.equal(run.fail(), false);
    assert.equal(run.cancel(), false);
    assert.equal(state(), terminal);
    assert.equal(changes.length, size);
    if (method !== 'ready') assert.ok(state().workProgress < 1);
  }
});

test('new generations reset to zero and ignore every old callback and pending announcement', () => {
  const { manager, run: old, clock, changes, announcements } = harness();
  old.update('textures', { completed: 14, total: 14 });
  old.complete('download');
  const next = manager.begin();
  assert.equal(next.snapshot().workProgress, 0);
  assert.equal(next.snapshot().generation, old.snapshot().generation + 1);
  const count = changes.length, announcementCount = announcements.length;
  assert.equal(old.stage('parse'), false);
  assert.equal(old.update('textures', { completed: 14, total: 14 }), false);
  assert.equal(old.complete('parse'), false);
  assert.equal(old.ready(), false);
  assert.equal(old.fail(), false);
  assert.equal(old.cancel(), false);
  clock.tick(10000);
  assert.equal(changes.length, count);
  assert.equal(announcements.length, announcementCount);
});

test('context recovery uses its own real checkpoint inventory and starts from zero', () => {
  const { manager, run } = harness();
  run.ready();
  const recovery = manager.begin({ stages: ['upload', 'warm', 'frame'], initialStage: 'upload' });
  assert.equal(recovery.snapshot().stage, 'upload');
  assert.equal(recovery.snapshot().workProgress, 0);
  assert.equal(recovery.snapshot().totalStages, 4);
  assert.equal(recovery.complete('download'), false);
  recovery.complete('upload');
  assert.equal(recovery.snapshot().workProgress, .25);
});

test('external generation guards and disposal prevent further UI events', () => {
  const { manager, clock, changes } = harness();
  let current = true;
  const run = manager.begin({ isCurrent: () => current });
  run.stage('parse');
  const size = changes.length;
  current = false;
  assert.equal(run.ready(), false);
  assert.equal(run.fail(), false);
  clock.tick(1000);
  assert.equal(changes.length, size);
  manager.dispose();
  current = true;
  assert.equal(run.update('download', { received: 1, total: 2 }), false);
  assert.equal(clock.pending(), 0);
});

test('observers cannot break loading and bytes formatting is stable', () => {
  const manager = createLoadingProgress({ onChange() { throw Error('UI error'); }, onAnnounce() { throw Error('AT error'); } });
  const run = manager.begin();
  assert.doesNotThrow(() => run.ready());
  assert.equal(run.snapshot().status, 'ready');
  assert.equal(formatLoadingBytes(0), '0 B');
  assert.equal(formatLoadingBytes(1000), '1.0 KB');
  assert.equal(formatLoadingBytes(1000000), '1.0 MB');
  assert.equal(formatLoadingBytes(-1), '');
  assert.equal(formatLoadingBytes(Infinity), '');
  assert.throws(() => createLoadingProgress({ announceIntervalMs: -1 }), TypeError);
  assert.throws(() => manager.begin({ stages: [] }), TypeError);
  assert.throws(() => manager.begin({ stages: ['parse', 'parse'] }), TypeError);
  assert.throws(() => manager.begin({ stages: ['made-up'] }), TypeError);
});
