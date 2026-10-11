# 验证说明

`npm test` 执行领域逻辑、模型对象、几何射线、贴图及材质回归检查。`npm run build` 生成 `dist/`；`node scripts/resource-budget.mjs` 在构建后检查静态资源预算。报告写入 `delivery/`，不纳入版本控制。

浏览器验证另行运行：先启动 `npm run dev`，再执行 `npm run test:browser`。现有脚本默认使用 `/usr/bin/chromium`，可通过 `CHROMIUM_PATH` 指定已安装 Chromium 的路径，通过 `TEST_URL` 选择开发服务地址。脚本产生的截图和指标不等于真实手机验收。

本次仓库准备没有执行浏览器或真实手机测试。iOS Safari、Android Chrome、真实触控与音频延迟、持续运行性能及受限网络冷启动仍需目标设备实测；源码检查和构建通过不能替代这些验证。
