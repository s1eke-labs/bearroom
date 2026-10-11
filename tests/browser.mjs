import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const output = "delivery/browser";
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: [
    "--no-sandbox",
    "--enable-unsafe-swiftshader",
    "--use-angle=swiftshader",
    "--disable-dev-shm-usage",
  ],
});
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  hasTouch: true,
  recordVideo: process.env.RECORD_VIDEO
    ? { dir: output, size: { width: 390, height: 844 } }
    : undefined,
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
await page.goto(process.env.TEST_URL || "http://localhost:5173", {
  waitUntil: "networkidle",
});
await page.waitForFunction(() => window.__bearroom?.ready, { timeout: 180000 });
await page.waitForTimeout(2500);
const report = {
  environment: await page.evaluate(() => ({
    userAgent: navigator.userAgent,
    viewport: [innerWidth, innerHeight],
    renderer: "Chromium headless software WebGL; NOT physical phone",
  })),
  checks: [],
  metrics: {},
};
const views = {
  V01: { pos: [17, 14, 23], target: [0, 2, 0] },
  V02: { pos: [12, 10, 15], target: [0, 2, 0] },
  V03: { pos: [-0.4, 1.4, 0.2], target: [-0.9, 1, -2] },
  V04: { pos: [4, 2.4, 3.1], target: [3.6, 1.15, 0.2] },
  V05: { pos: [4.5, 3.4, 0.2], target: [3, 1, -2.5] },
  V06: { pos: [3.2, 1.5, -0.7], target: [3.2, 0.9, -1.9] },
  V07: { pos: [7, 7.5, 9], target: [0, 3.7, 2] },
  V08: { pos: [0, 3, 7], target: [-2, 1, 2] },
};
for (const [name, v] of Object.entries(views)) {
  if (name === "V02") await page.setViewportSize({ width: 844, height: 390 });
  else await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate((v) => window.__bearroom.setCamera(v.pos, v.target), v);
  for (const mode of ["night", "day"]) {
    await page.evaluate((m) => window.__bearroom.setMode(m), mode);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${output}/${name}-${mode}.png` });
  }
}
await page.setViewportSize({ width: 390, height: 844 });
await page.evaluate(() =>
  window.__bearroom.setCamera([4.5, 3.4, 0.2], [3, 1, -2.5]),
);
let cam = await page.evaluate(() => window.__bearroom.camera);
await page.locator("#night").click();
await page.waitForTimeout(1600);
report.checks.push({
  name: "mode changes preserve camera",
  passed:
    JSON.stringify(cam) ===
    JSON.stringify(await page.evaluate(() => window.__bearroom.camera)),
});
const before = await page.evaluate(
  () => window.__bearroom.metrics.noteEvents.length,
);
await page.mouse.move(160, 350);
await page.mouse.down();
await page.mouse.move(280, 430, { steps: 12 });
await page.mouse.up();
report.checks.push({
  name: "drag does not trigger piano",
  passed:
    before ===
    (await page.evaluate(() => window.__bearroom.metrics.noteEvents.length)),
});
for (let i = 0; i < 10; i++) {
  await page.locator(i % 2 ? "#night" : "#day").click();
  await page.waitForTimeout(120);
}
report.checks.push({
  name: "10 transitions keep scene ready",
  passed: await page.evaluate(() => window.__bearroom.ready),
});
for (const mode of ["night", "day"]) {
  await page.evaluate((m) => {
    window.__bearroom.setMode(m);
    window.__bearroom.metrics.frameTimes.length = 0;
  }, mode);
  const duration = Number(process.env.OBSERVE_SECONDS || 60);
  for (let i = 0; i < duration; i++) {
    const a = (i / duration) * Math.PI * 1.7;
    await page.evaluate(
      ({ a }) =>
        window.__bearroom.setCamera(
          [Math.sin(a) * 14, 7 + Math.sin(a * 0.7) * 3, Math.cos(a) * 14],
          [0, 2, 0],
        ),
      { a },
    );
    await page.waitForTimeout(1000);
  }
  report.metrics[mode] = await page.evaluate(() => window.__bearroom.report());
}
report.errors = errors;
report.assets = await page.evaluate(() => ({
  keys: window.__bearroom.keyCount,
  animationNodes: window.__bearroom.animations,
  screens: window.__bearroom.screens,
}));
report.mobile = "未验证";
await fs.writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
await context.close();
await browser.close();
if (errors.length) process.exitCode = 1;
console.log(JSON.stringify(report, null, 2));
