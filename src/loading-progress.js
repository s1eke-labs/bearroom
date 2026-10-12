/** Truthful load status, independent of the DOM and of the loading pipeline.
 * Each checkpoint is one work unit, NOT a duration or an estimate of time left.
 * Only retained texture/upload/batch counts earn a partial work unit. Download
 * bytes are current-attempt diagnostics: discarded retry bytes never earn work.
 * The final ready checkpoint is reserved until the caller confirms the first
 * frame. Time is used only to throttle announcements, never to advance progress.
 */
export const LOADING_STAGES = Object.freeze([
  ['download', '下载空间模型'], ['decompress', '解压空间模型'],
  ['parse', '解析家具模型'], ['scene', '整理家具与场景'],
  ['textures', '载入画作与屏幕图像'], ['screens', '设置画作与屏幕'],
  ['pc', '准备机箱'], ['gi', '载入间接光数据'], ['gi-apply', '应用间接光'],
  ['walk', '准备漫游路径'], ['upload', '上传材质与纹理'],
  ['warm', '准备楼层与昼夜光照'], ['frame', '绘制首帧'],
].map(([id, label]) => Object.freeze({ id, label })));

const conciseLabels = Object.freeze({
  download: '下载房间', decompress: '展开房间', parse: '整理家具',
  scene: '布置房间', textures: '载入画作', screens: '布置画作',
  pc: '准备机箱', gi: '载入光照', 'gi-apply': '布置光照',
  walk: '准备漫游', upload: '准备材质', warm: '准备光照', frame: '呈现房间',
});

// Keep measured diagnostics in the snapshot, outside the minimal loading UI.
export function loadingPresentation(state) {
  const terminal = state.status !== 'loading';
  const label = terminal ? state.label : conciseLabels[state.stage] || state.label;
  const detail = ['failed', 'cancelled'].includes(state.status) ? state.detail : '';
  return { label, detail, announcement: [label, detail].filter(Boolean).join('。') };
}

const labels = new Map(LOADING_STAGES.map(stage => [stage.id, stage.label]));
const countableWork = new Set(['textures', 'upload', 'warm']);
const backgroundLabels = { textures: '画作与屏幕', gi: '间接光' };
const defaultClock = {
  now: () => performance.now(),
  setTimeout: (...args) => setTimeout(...args),
  clearTimeout: id => clearTimeout(id),
};
const report = (callback, value) => { try { callback?.(value); } catch { /* Status UI must not break loading. */ } };
const nonnegative = value => Number.isFinite(value) && value >= 0;
const positiveInteger = value => Number.isInteger(value) && value > 0;

export function formatLoadingBytes(bytes) {
  if (!nonnegative(bytes)) return '';
  if (bytes < 1000) return `${Math.floor(bytes)} B`;
  if (bytes < 1000 ** 2) return `${(bytes / 1000).toFixed(1)} KB`;
  return `${(bytes / 1000 ** 2).toFixed(1)} MB`;
}

function measuredDetail(record) {
  let detail = '';
  if (record.kind === 'bytes') {
    const received = formatLoadingBytes(record.received);
    // An absent or inconsistent Content-Length is not a usable denominator.
    detail = record.total > 0 && record.total >= record.received
      ? `${received} / ${formatLoadingBytes(record.total)}` : `已收到 ${received} · 总大小未知`;
  } else if (record.kind === 'count') {
    detail = `${record.completed} / ${record.total} ${record.unit || '项'}`;
  } else if (record.done) detail = '已完成';
  if (record.attempt > 1 && !record.done) {
    detail = [`第 ${record.attempt}${record.maxAttempts ? ` / ${record.maxAttempts}` : ''} 次尝试`, detail].filter(Boolean).join(' · ');
  }
  return detail;
}

/**
 * Keep one manager for the loading UI. begin() invalidates every callback from
 * an older generation, including pending announcements. Each run is captured by
 * its async work; parallel update()/complete() never change its primary stage.
 *
 * Signal abort silences updates but does not infer cancellation: error handling
 * also aborts peer requests. The owner must call fail() or cancel(); both remain
 * allowed after abort. Terminal snapshots cannot be changed by later callbacks.
 */
export function createLoadingProgress({ onChange, onAnnounce, clock = defaultClock, announceIntervalMs = 1000 } = {}) {
  if (!nonnegative(announceIntervalMs)) throw new TypeError('announceIntervalMs must be nonnegative and finite');
  let generation = 0, current = null;

  return {
    begin({ signal, isCurrent = () => true, stages = LOADING_STAGES.map(stage => stage.id), initialStage = stages[0] } = {}) {
      if (!Array.isArray(stages) || !stages.length || new Set(stages).size !== stages.length || stages.some(id => !labels.has(id))) {
        throw new TypeError('stages must be a nonempty list of unique loading checkpoint IDs');
      }
      if (!stages.includes(initialStage)) throw new TypeError('initialStage must be a loading checkpoint');
      current?.dispose();
      const ownGeneration = ++generation;
      const records = new Map(stages.map(id => [id, {
        label: labels.get(id), detail: '', done: false, kind: null,
        attempt: 0, maxAttempts: 0, received: 0, completed: 0, total: 0,
        unit: '', workFraction: 0, workTotal: null, indeterminate: undefined,
      }]));
      let stage = initialStage, status = 'loading', disposed = false;
      let terminalLabel = '', terminalDetail = '', timer = null;
      let lastAnnouncement = '', lastAnnouncedAt = -Infinity, latestSnapshot;
      const ownsGeneration = () => !disposed && ownGeneration === generation && isCurrent();
      const canUpdate = () => ownsGeneration() && status === 'loading' && !signal?.aborted;
      const clearAnnouncement = () => { if (timer !== null) clock.clearTimeout(timer); timer = null; };

      function snapshot() {
        const record = records.get(stage);
        const measured = measuredDetail(record);
        const currentDetail = [record.detail, measured].filter(Boolean).join(' · ');
        const fallbackDetail = stage === 'download' || stage === 'gi'
          ? '正在连接服务器' : '正在处理，当前步骤无法统计细分进度';
        const detail = terminalDetail || currentDetail || (status === 'loading' && !record.done ? fallbackDetail : '');
        let stageProgress = null;
        if (record.kind === 'bytes' && record.total > 0 && record.total >= record.received) {
          stageProgress = Object.freeze({ completed: record.received, total: record.total, unit: 'bytes' });
        } else if (record.kind === 'count' && record.total > 0 && record.completed <= record.total) {
          stageProgress = Object.freeze({ completed: record.completed, total: record.total, unit: record.unit || '项' });
        }
        const completedStages = [...records.values()].filter(value => value.done).length + (status === 'ready' ? 1 : 0);
        const completedWork = [...records.values()].reduce((sum, value) => sum + (value.done ? 1 : value.workFraction), 0) + (status === 'ready' ? 1 : 0);
        const secondary = Object.entries(backgroundLabels).flatMap(([id, label]) => {
          const value = records.get(id);
          if (!value || id === stage) return [];
          const measured = measuredDetail(value);
          if (!measured) return [];
          return [`${label} ${measured}`];
        }).join(' · ');
        return Object.freeze({
          generation: ownGeneration, stage, status,
          label: terminalLabel || record.label, detail, secondary,
          workProgress: completedWork / (records.size + 1),
          completedStages, totalStages: records.size + 1,
          indeterminate: status === 'loading' && (record.indeterminate === true || (!record.done && !stageProgress)),
          stageProgress,
        });
      }

      function announce(immediate = false) {
        if (!ownsGeneration() || (status === 'loading' && signal?.aborted)) return;
        const text = loadingPresentation(latestSnapshot).announcement;
        if (text === lastAnnouncement) { clearAnnouncement(); return; }
        const remaining = announceIntervalMs - (clock.now() - lastAnnouncedAt);
        if (immediate || remaining <= 0) {
          clearAnnouncement(); lastAnnouncement = text; lastAnnouncedAt = clock.now();
          report(onAnnounce, text);
        } else if (timer === null) {
          timer = clock.setTimeout(() => { timer = null; announce(); }, remaining);
        }
      }

      function emit(immediate = false) {
        latestSnapshot = snapshot();
        report(onChange, latestSnapshot);
        announce(immediate);
      }

      function applyAttempt(record, { attempt, maxAttempts } = {}) {
        if (record.kind === 'count' || !positiveInteger(attempt) || attempt < record.attempt) return false;
        if (attempt > record.attempt) {
          record.attempt = attempt; record.received = 0; record.total = 0;
          record.kind = 'bytes'; record.detail = '';
        }
        if (positiveInteger(maxAttempts) && maxAttempts >= attempt) record.maxAttempts = maxAttempts;
        return true;
      }

      function terminal(nextStatus, { label, detail } = {}) {
        if (!ownsGeneration() || status !== 'loading') return false;
        status = nextStatus;
        terminalLabel = label || (nextStatus === 'ready' ? '一切就绪' : nextStatus === 'cancelled' ? '载入已取消' : '小熊的家暂时没有准备好');
        terminalDetail = detail || (nextStatus === 'cancelled' ? '可以随时重新载入' : nextStatus === 'failed' ? '请重试' : '');
        if (nextStatus === 'ready') {
          for (const record of records.values()) record.done = true;
          terminalDetail = detail || '准备完成';
        }
        signal?.removeEventListener('abort', clearAnnouncement);
        emit(true);
        return true;
      }

      const run = {
        stage(id, { label, detail, indeterminate } = {}) {
          if (!canUpdate() || !records.has(id)) return false;
          stage = id;
          const record = records.get(id);
          if (typeof label === 'string') record.label = label;
          // Re-entering a stage clears its old transient text/wait state.
          record.detail = typeof detail === 'string' ? detail : '';
          record.indeterminate = indeterminate;
          emit(); return true;
        },
        attempt(id, value) {
          const record = records.get(id);
          if (!canUpdate() || !record || record.done || !applyAttempt(record, value)) return false;
          emit(); return true;
        },
        update(id, value = {}) {
          const record = records.get(id);
          if (!canUpdate() || !record || record.done) return false;
          if (value.attempt !== undefined && !applyAttempt(record, value)) return false;
          if (value.received !== undefined) {
            if (record.kind === 'count' || !nonnegative(value.received) || value.received < record.received) return false;
            record.kind = 'bytes'; record.received = value.received;
            record.total = nonnegative(value.total) ? value.total : 0;
          } else if (value.completed !== undefined) {
            if (record.kind === 'bytes' || !Number.isInteger(value.completed) || !nonnegative(value.completed) || !Number.isInteger(value.total) || !nonnegative(value.total) || value.completed > value.total) return false;
            if (record.kind === 'count' && value.completed < record.completed) return false;
            // Counted work has a fixed inventory. Reject a changed denominator
            // rather than retain an inflated peak and call it completed work.
            if (record.workTotal !== null && value.total !== record.workTotal) return false;
            record.kind = 'count'; record.completed = value.completed; record.total = value.total;
            if (typeof value.unit === 'string') record.unit = value.unit;
            if (value.total > 0) {
              record.workTotal = value.total;
              if (countableWork.has(id)) record.workFraction = value.completed / value.total;
            }
          } else return false;
          emit(); return true;
        },
        complete(id) {
          const record = records.get(id);
          if (!canUpdate() || !record || record.done) return false;
          record.done = true; record.detail = ''; record.indeterminate = false;
          if (record.kind === 'count') record.completed = record.total;
          emit(); return true;
        },
        ready: options => canUpdate() && terminal('ready', options),
        fail: options => terminal('failed', options),
        cancel: options => terminal('cancelled', options),
        snapshot: () => latestSnapshot,
        dispose() {
          disposed = true; clearAnnouncement();
          signal?.removeEventListener('abort', clearAnnouncement);
        },
      };
      current = run;
      signal?.addEventListener('abort', clearAnnouncement, { once: true });
      emit(true);
      return run;
    },
    dispose() { current?.dispose(); current = null; },
  };
}
