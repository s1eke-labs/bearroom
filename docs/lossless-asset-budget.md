# 无损资源预算优化

本次仅重编码运行时模型内 10 张 RGB8 PNG 的 IDAT 压缩数据，再对整个 GLB 进行 Zopfli gzip 无损编码。没有修改编辑用模型、贴图母版、GI、JPEG、调色板透明 PNG、几何、法线、UV、材质、采样器、节点或控制逻辑；没有降低分辨率、位深或颜色通道。

## 结果

- 原 gzip 模型：18,713,768 字节
- 新 gzip 模型：17,610,286 字节
- 减少：1,103,482 字节（约 1.052 MiB）
- 解码后的 GLB：35,915,484 → 34,733,080 字节
- 在原分发包 20,957,846 字节基础上，新模型使总包降至 19,854,364 字节；相对 20 MiB 上限余量 1,117,156 字节。其他并行代码改动需由最终 build/budget 实测计入。

## 等价性证据

`recovery/lossless-png-equivalence.json` 记录原/新模型及每张受影响 PNG 的哈希、原/新字节数、尺寸、位深、颜色类型、解码通道哈希，以及所有非 IDAT 块（包括 IHDR、EXIF、DPI、颜色信息等）的逐字节哈希。

- Python/Pillow 在转换时比较解码后的原始 RGB 通道字节，且保留原 PNG 中除 IDAT 以外的每一个完整块，顺序和 CRC 也不改变。
- 独立 Node 验证器使用 zlib 和 PNG 五种过滤器还原像素，重新核对原图、新图和证书。
- 同一验证器确认所有非图片数据视图逐字节相同、除二进制布局外完整 JSON 相同。
- 材质保护检查只对证书中 10 个精确的新压缩哈希恢复原哈希身份；像素/元数据必须再次通过证书核对。未知或篡改图像不获得豁免。
- 现有浴室、植物、家具等保护检查继续保留。CPU 回归不代替本次未执行的设备/WebGL 视觉验收。

## 重现

需要已有 Pillow 和 python-zopfli 的 Python 解释器；脚本不会安装依赖。保留输入 gzip 副本，输出必须使用不同路径。

1. `python scripts/optimize-embedded-png.py before.glb.gz png.glb.gz`
2. `/usr/bin/python3 scripts/optimize-gzip.py png.glb.gz final.glb.gz --iterations 1`
3. `node scripts/prove-lossless-png.mjs before.glb.gz final.glb.gz png.glb.gz.png-equivalence.json`

运行时仅继续使用原有 gzip 路径，不引入 Brotli 支持要求。发布的内容寻址分片及 manifest 已更新，恢复流程会校验分片和完整压缩文件。编辑用源资产保持原样。

## Final integrated release

After adding worker loading, retries, cleanup, input fixes and adaptive preparation, the complete distribution is 19,870,238 bytes: 1,087,608 bytes smaller than the original v19 distribution and 1,101,282 bytes below the 20 MiB limit. CI now requires at least 1 MiB headroom. This is a file-size result, not measured GPU memory or FPS.
