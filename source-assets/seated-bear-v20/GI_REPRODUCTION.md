# 新坐姿 GI 与 runtime 配对复现

最终稳定母版经臀部支撑修订后重新进行了真实 Cycles CPU 光线追踪，没有沿用先前候选的照度数据，也没有把旧源哈希改写为新源哈希。

- 母版 SHA-256：`a52b85508b36419f019ab3afc0a684aad2641124412a9b4955747c0413fcc041`
- 烘焙脚本 SHA-256：`b3536a0e42aa536e85e3087875662134290d9b5fea22c55545a7be5391ffce97`
- 最终 GI SHA-256：`89303bdab076205d294920d02eb2caa4fccb8367c57533f78180fd8f3ac1edd6`，104,856 字节
- Blender 4.3.2，Cycles CPU，实际烘焙耗时 22.86 秒；夜间、白天、白天天空各 96 samples，三项物理控制各 32 samples，256×256 浮点 atlas
- 三个正式层分别包含 2,880 个 radiance 分量。独立读取真实 EXR 像素、重新应用已声明的探针回填后，全部匹配最终 JSON 的六位小数舍入结果
- 间接光黑反射控制比率为 0；天空方向/绝对单位校准最大误差 0.0000511553，小于 0.003；独立光源/辐射单位测试最大相对误差 0.000000487670，小于 0.00001
- 160 个采样点全部通过新母版的独立几何净空检查，最小净空约 20 mm；17 个局部重定位、2 个显式同区域回填；40 个浴室探针继续隔离
- 12 个源灯锚点变换与度量单位保持不变；五株植物透明轮廓、浴室固定遮挡物、静态 PC 物件及动态转子排除规则保持原契约

### 保留原灯光方向

原客厅灯瞄准点固定为 `[-0.9424259662628174, 0.9112450480461121, 1.8003298044204712]`。新坐姿令熊包围盒中心移动约 19.60 mm，但不再用新包围盒重瞄灯具。新烘焙与 runtime 的目标值都必须与已接受 v17/v19 基线精确相等，灯位、功率、颜色、范围、天空源和增益逐项不变，没有放宽全局灯光校准。

新版 GLB light-pair 检查读取真实模型灯锚点，并要求 `src/main.js` 恰好存在一个明确的固定目标分支；其目标值必须与不可变基线精确相等。新熊中心另行报告，不充当容差。人工将 runtime 目标改动 0.1 m 的负例已被拒绝。函数执行行为另由项目的 `seated-bear-light-target` 测试覆盖。

相对已上线 v19，夜间、白天、天空分别有 440、551、538 个分量改变，平均绝对变化为 0.000113706、0.0000446052、0.00000383889；这些是新几何引起的实际传输变化，灯光源参数仍完全相同。

### 可重现文件与依赖

必须保存 `gi-rebuild/` 中的 bake、runner、GLB pairing 和两个单位测试脚本，以及 `light-validation/` 中的十个 runner/pairing 所用 Python 脚本。唯一新增只读数据 fixture 为 `light-validation/accepted-v19-irradiance.json`（104,797 字节，SHA-256 `c59a89176e513322673f796dfa788ec1be1a452a072a80142ad94030692008e9`），用于证明新版正式数组确实不同于此前上线数据。原 v17 校准 GI 继续复用仓库现有 `source-assets/baked-gi-v17/irradiance.json`。

运行依赖：Blender 4.3.2（自带 bpy/NumPy）、Python 3（NumPy、Pillow）、bash 与 coreutils。新脚本没有硬编码临时工作目录。

可将脚本复制到临时目录运行，避免在仓库里留下 EXR、日志或生成审计报告：

```sh
ROOT="$(pwd)"
WORK="$(mktemp -d)"
cp -R source-assets/seated-bear-v20/gi-rebuild "$WORK/"
cp -R source-assets/seated-bear-v20/light-validation "$WORK/"
# NEW_SOURCE 是最终稳定母版路径；OLD_V19_SOURCE 是旧 v19 母版路径。
bash "$WORK/gi-rebuild/run_frozen_gi_v20.sh" \
  "$NEW_SOURCE" a52b85508b36419f019ab3afc0a684aad2641124412a9b4955747c0413fcc041 \
  "$WORK/baked-gi-v20" "$ROOT/source-assets" "$OLD_V19_SOURCE"
python "$WORK/gi-rebuild/verify_glb_light_pairing.py" \
  --glb "$CANONICAL_GLB" --gi "$WORK/baked-gi-v20/irradiance.json" \
  --runtime-main "$ROOT/src/main.js" \
  --baseline-gi "$ROOT/source-assets/baked-gi-v17/irradiance.json" \
  --output "$WORK/light-validation/final-glb-light-pairing.json"
```

runner 对最终源哈希、原 v19 源哈希、原 v17 校准 GI 哈希均进行严格校验，不覆盖已有正式 GI。原 v19 源必须为 `96c4f90312490c45489c64a4f836094a2f80d4a7bd077a093494eac72948d173`，原 v17 GI 必须为 `107ef50f0ec636d401df4631133ea0061ef14944ab2c325c16b39ea072962971`。两份母版都只读。

六张原始 EXR、真实 bake 日志、逐项审计报告和 source-only evidence manifest 留作执行证据，不要求提交到仓库。runtime 只保留一份当前 GI。完整 GLB 几何等价性由独立资源审计覆盖，light/material seal 不替代该检查。

既有局限不变：低频探针可能发生薄物体漏光；玻璃焦散、动态物件的间接遮挡及动态自发光反弹不包含在本次静态烘焙中；Cycles 灯光半影与 runtime 有限距离衰减仍是已明确记录的近似。


## 最终 canonical runtime 封存

灯位、材质、透明轮廓与 lossless gzip 的最终 seal 已全部通过：

- Canonical GLB：34,733,200 字节，SHA-256 `1dd9a211538747e36a0e132f78cdfb50c6248ea08be5fd31273c2b430bed258c`
- Gzip：17,538,872 字节，SHA-256 `5527e5d8e340f5e96b5c3b2c011bca96262a3946f95012037e39f4428bde7e57`，解压后与 canonical GLB 逐字节相等
- 10 个实际 runtime fixture 锚点全部精确匹配，客厅固定目标差值为 0；9 个浴室材质和 5 株植物的传输契约全部配对

此前已获证的 PNG 无损压缩使 `oak-normal`、`oak-roughness` 的编码字节不同于源 packed PNG。新版材质验证不放宽像素或材质要求：仅允许 `recovery/lossless-png-equivalence.json` 现有固定证书（SHA-256 `16c58b2719687909112fb5bf6f828bf27cc13085d82f6fa56c55ed8853ed8999`）列出的 after-hash → before-hash 映射，并独立重验实际 PNG 每个 CRC、1024×1024 RGB8 解码像素哈希、每个非 IDAT chunk 的合并哈希。因此颜色元数据、尺寸、位深、像素通道均须原样；证书或 PNG 出现其他变化直接失败。

继续上面的临时目录命令即可完成物理材质与 gzip seal：

```sh
python "$WORK/light-validation/validate_runtime_transport_pair_v20.py" \
  --source "$NEW_SOURCE" --glb "$CANONICAL_GLB" \
  --gi "$WORK/baked-gi-v20/irradiance.json" \
  --source-materials "$WORK/light-validation/final-source-transport-materials.json" \
  --light-pair "$WORK/light-validation/final-glb-light-pairing.json" \
  --png-certificate "$ROOT/recovery/lossless-png-equivalence.json" \
  --output "$WORK/light-validation/final-runtime-transport-pair.json"
python "$WORK/light-validation/seal_runtime_gi_v20.py" \
  --source "$NEW_SOURCE" --glb "$CANONICAL_GLB" --gzip "$CANONICAL_GZIP" \
  --gi "$WORK/baked-gi-v20/irradiance.json" \
  --light-pair "$WORK/light-validation/final-glb-light-pairing.json" \
  --materials-pair "$WORK/light-validation/final-runtime-transport-pair.json" \
  --source-manifest "$WORK/light-validation/source-only-validation-manifest.json" \
  --output "$WORK/light-validation/final-canonical-gi-seal.json"
```

源文件、脚本与照明基线哈希是配对标准；wall-clock 耗时随机器变化。新重跑的 `irradiance.json` 会记录本次耗时，因此完整文件哈希可以随重跑变化，而物理设置、真实 atlas 及六位 radiance 数组仍须通过上述检查。
