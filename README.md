# 小熊的家 · bearroom

按 `docs/requirements.md`、`docs/art-direction.md`、`docs/quality-standards.md` 实现的 Three.js 交互 Loft。

## 本地运行

Node.js 22.12+，执行 `npm ci`、`npm run dev`。`npm run dev`、`npm run build` 与 `npm test` 会先自动执行 `node scripts/compress-model.mjs`，从 `source-assets/bearroom.glb.br` 无损还原原始GLB、验证SHA-256，再生成gzip传输包；正式构建 `npm run build`，静态产物位于 `dist/`，服务器需从根路径提供该目录。代码依赖由 `package-lock.json` 锁定。

## 操作

- 手机：单指拖动转动，双指捏合缩放，双指拖动平移
- 桌面：左键拖动转动，右键拖动平移，滚轮缩放
- 直接轻点模型上的琴键发声，没有演奏面板或自动切镜头
- 雨夜为默认模式，晴日/雨夜按钮不改变镜头，不重置轮播与家具动效
- 音符为 Web Audio 合成钢琴音色；首次有效点按在事件中解锁音频

## 实现边界

主要模型来自 Blender，运行时不使用基础几何体替代家具或建筑。雨线是实时天气粒子；环境反射捕获仅用于照明。Blender 源文件与生成原图保存于制作交付目录，运行用资产在 `public/assets/`。

坐标：Blender X=东、Y=北、Z=上；glTF / Three.js X=东、Y=上、Z=南。下层10×8米，上层南侧10×4.5米，合计125平方米。

23件固定家具统计参见 `src/domain.js`，其中12件有昼夜持续自身动效。所有88个琴键模型 `piano_key_021` 至 `piano_key_108` 分别映射MIDI21–108，A4=440Hz。

屏幕素材为13张独立生成内容：PC6张、电视4张、相框3张。PC静置16秒、电视静置23秒，各1秒柔和交叉淡化，时间错开。当前实现预加载全部13张，避免轮播空白。

## 测试与验收

`npm test` 检查琴键连续映射、52/36黑白数、23件/12动效分母、手势判定、轮播时间，以及GLB对象和13张运行贴图。

`npm run test:browser` 对已经启动的开发服务执行桌面Chromium检查（默认 `/usr/bin/chromium`，可用 `CHROMIUM_PATH` 指定已安装浏览器路径），记录浏览器、视口、实际截图和指标。开发构建有 `window.__bearroom` 诊断接口，生产构建移除接口。诊断调用不能作为真实手机触控或真实音频延迟的验收证据。

真实 iOS Safari / Android Chrome、10分钟持续运行、20Mbps/80ms冷启动、实际声音延迟在取得对应设备和测量结果之前均为“未验证”。桌面模拟视口只证明布局与有限交互，不代表手机性能通过。运行验证范围见 `docs/verification.md`。

## 资源传输

浏览器请求 `assets/bearroom.glb.gz`（13,779,984字节），使用随应用打包的fflate无损解压成原始GLB，再由GLTFLoader解析。`assets/bearroom.glb`（23,585,256字节）保留用于资产检查，不在网页启动时请求。所有13张图像均为独立WebP，无外部CDN依赖。

材质修订：15张真实PBR贴图嵌入GLB，20种表面材质保留基色、法线与粗糙度。织物/木材不再使用运行时正弦颜色条纹。`node scripts/resource-budget.mjs` 验证资源上限，`npm test` 包含GLB贴图与色因子回归测试。离线Blender导出重载验证通过；当前云端浏览器禁用WebGL，网页画面和真实手机性能等待用户设备验证。

## 仓库内容

仓库包含应用源码、锁定依赖、测试、资源处理脚本、需求/美术参考，以及运行所需的无损压缩模型源和贴图。`source-assets/bearroom.glb.br` 是Git中的模型源；`public/assets/bearroom.glb` 与 `.glb.gz` 均自动重建，不纳入Git。还原完全使用Node.js内置Brotli，无需Git LFS、额外依赖或网络下载。`docs/` 内图片是设计输入，不是运行画面验收截图。`delivery/` 仅保留空目录占位；检查脚本会在本机重新生成报告，不提交历史输出。

不包含 node_modules、dist、部署身份信息、历史压缩交付包、Blender备份或浏览器截图。当前可编辑Blender工程与原始制作图另行保存，并不是构建网页的必需输入。资源说明见 `docs/assets.md`。

## EdgeOne 自动部署

`.github/workflows/deploy-edgeone.yml` 在每次推送到 `master` 时运行，也可在 Actions 页面选择 `master` 手动触发。流程使用 Node.js 22、`npm ci`、测试、生产构建和资源预算检查，通过后将 `dist/` 发布到 EdgeOne 生产环境；CLI 固定为 `edgeone@1.6.41`。

首次使用需在 GitHub 仓库的 **Settings → Secrets and variables → Actions → Secrets** 中配置仓库 Secret `EDGEONE_API_TOKEN`，值为 EdgeOne 控制台生成的 API Token。不要放入普通 Variables、源码或构建配置；令牌仅注入部署步骤，不参与前端构建。

项目名使用工作流环境变量 `EDGEONE_PROJECT_NAME`，自动取 `${{ github.event.repository.name }}`，无需写死仓库名。已有同名 EdgeOne 项目须为“直接上传”类型；不存在时 CLI 会自动创建。仓库改名也会改变目标项目名，请先确认对应项目。详见 [EdgeOne CLI 官方文档](https://pages.edgeone.ai/document/edgeone-cli)。

生产部署串行运行，不取消正在执行的发布；部署前再次检查公开仓库 `master` 最新提交，跳过已被新提交取代的任务，避免旧版本在新版本之后发布。缺少令牌、测试失败、构建失败或资源预算超限都会阻止发布。
