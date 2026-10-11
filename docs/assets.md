# 运行资源

- `source-assets/bearroom.glb.br`：Git中保留的标准模型源，11,742,468字节；是项目Blender导出GLB的无损Brotli压缩，不改变几何或贴图。放在 `public/` 外，避免复制进网页发布目录。
- `public/assets/bearroom.glb`：从Brotli源自动还原的原始场景（23,585,256字节，不提交至Git）。包含家具、88个独立琴键及内嵌PBR图像，用于测试、资源检查及生成传输文件。还原后SHA-256必须等于 `b8bfc48bc6bb5bfa0678b99e01def6892a0febd725d46f5641b7d46f9fcd725c`，否则脚本中止。
- `public/assets/bearroom.glb.gz`：同一模型的无损 gzip 传输文件（由 npm 的 predev、prebuild 和 pretest 自动生成，不提交至 Git）；网页实际请求此文件，通过 fflate 解压。不是发布备份包。运行 `node scripts/compress-model.mjs` 可重新生成并验证字节一致性。
- `public/assets/textures/pc-01.webp` 至 `pc-06.webp`、`tv-01.webp` 至 `tv-04.webp`、`frame-01.webp` 至 `frame-03.webp`：项目独立生成的屏幕和相框图像。
- `docs/1.jpg`、`2.jpg`、`3.jpg` 和 `docs/references/`：需求及美术方向参考，不是在线运行截图；保留以支持现有设计文档中的链接。

运行不依赖外部 HDR 或贴图 CDN。模型中的 PBR 图像嵌入 GLB。可编辑 Blender 工程、制作中间稿及原始高分辨率图像不属于本仓库的网页构建输入。

本说明记录现有项目资料中的来源，不对参考素材的版权或对外再许可作额外声明。本次导入未新增开放源代码许可证。

## 模型重建与更新

`npm run dev`、`npm run build` 和 `npm test` 会自动使用Node.js内置Brotli还原模型、验证SHA-256并生成gzip。无需Git LFS、额外压缩依赖或网络下载。仅克隆代码并安装锁定依赖即可构建。

更新模型时，用Node.js `zlib.brotliCompressSync` 无损压缩新的GLB，替换 `source-assets/bearroom.glb.br`，同时将 `scripts/compress-model.mjs` 中 `expectedSha256` 更新为新GLB的SHA-256；重新运行测试与构建。不要提交生成的原始GLB或gzip文件。
