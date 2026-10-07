# 美术参考图生成记录

生成日期：2026-10-08。工具：内置 imagegen（`image_gen.imagegen`）。所有图均为不透明背景，输出保留在本目录。用户原始图片未修改。

这些图用于确定美术方向，不是模型渲染结果，也不属于相框、电视和显示器最终需单独生成的贴图组。参考的采用范围与已知结构限制见[美术参考说明](../art-direction.md)。尺寸、布局和功能规则以[场景需求](../requirements.md)为准。

当前采用方向是用户认可的萌系偏写实效果。以下保留实际调用的完整提示词，首图提示词中的旧三渲二描述不覆盖最新风格要求。

## 雨夜整体参考

输出：[loft-night-v1.png](loft-night-v1.png)。生图；输入用户玩偶多视角图 `../1.jpg`。生成结果的萌系偏写实质感已获用户认可。首图提示词保留了当时的三渲二设定，用于记录真实生成输入；后续实现与再生成应遵循当前文档中的萌系偏写实方向。

```text
Use case: stylized-concept
Asset type: art-direction reference for a future Blender-modelled Three.js mobile interior, NOT a finished application.
Create one exceptionally polished full-frame 3D-to-2D cel-shaded anime slice-of-life interior illustration of a cute cream bear themed 125-square-metre duplex loft at RAINY NIGHT. Landscape 3:2 composition, no title or text, no multi-panel layout, no people.
Input reference: /home/debian/Git/bearroom/docs/1.jpg is ONLY the plush character shape reference; use its cream-white big round head, small round ears, simple black dot eyes and muzzle, stubby body and limbs in a clearly visible stuffed toy sitting on the sofa. Do not reproduce the photo, grid, labels, hands, or collage.
Architecture: about 10 metres wide by 8 metres deep, 5.8 metre high double-height volume. North is the far window wall. Ground floor 80 square metres; mezzanine 45 square metres covers the southern/rear-to-camera part, northern window-side living space remains double height. Show a coherent inviting cutaway dollhouse view from the southeast looking northwest, elevated enough to understand both levels, front walls and roof cut away solely for visibility. Mezzanine bedroom and reading nook are nearer camera and its edge must not hide the window-side living room; integrate real stair connection at the left/northwest folding toward the southern upper floor, continuous railings. Do not put the mezzanine over the far north window. Preserve spacious circulation and physically credible furniture scale.
Room contents: central north-facing double-height lounge with generously rounded ivory upholstered sofa, blush cushions, cozy cream rug, pale ash rounded low table, cute white bear plush. Northeast window-side cream BABY GRAND piano and bench, distinguish its curved grand-piano body, lid and black/white keys, keys facing the open south viewing area. East/right computer nook with a matching cream desk, thin monitor, blush keycaps, matching chair and translucent side-panel PC with visible fans. Southwest tucked kitchen with rounded cream cabinets and small round dining table. Upper southern mezzanine contains a proper bed, low storage and a reading nook, all visible enough to communicate inhabited home. Distinct stairs, doors and substantial floor slab thickness.
Style: highly refined detailed Blender-like geometry with visible bevels, upholstered seams, fabric thickness, key structure, joinery and elegant proportions; sophisticated CLEAN anime cel shading, controlled tonal bands, crisp thin charcoal silhouette and selected structural outlines, not thick comic hatching, not realistic photography, not low-poly blocks. Cream, warm beige, pale natural wood, restrained blush pink, little charcoal trim. Soft tactile surfaces have subtle non-busy texture; no plastic shine on all objects.
Lighting: carefully composed warm pools from living floor lamp, gentle indirect cove lighting, stair step lights, warm pendant over dining, under-cabinet task light, reading and bedside lamps, localized desk light and restrained pastel PC interior lights. Light must visibly illuminate neighboring surfaces with believable shadows, no universal glowing outlines. Outside tall north windows is an intimate cool-blue rainy street with visibly wet pavement, quiet reflections of street lamps, a few raindrops on glazing. Strong warm interior / cool exterior color contrast, rich but readable shadows, white bear face and piano keys retain detail, restrained bloom only. Whole scene feels peaceful, cute, premium and lived in.
Composition: broad legible room relationships, calm negative space, clear focal hierarchy living/plush then piano then computer then upper bedroom. Avoid excessive tiny clutter, candy theme park, giant bears as architecture, toy-scale miniature proportions, futuristic gamer RGB, washed out beige fog, lens blur, floating furnishings, stairs ending nowhere, unrealistic mirror-floor indoors. No captions, watermarks, logos, UI. This is a style reference, not a measured floor plan.
```

## 白天整体参考

输出：[loft-day-v1.png](loft-day-v1.png)。编辑；输入 `loft-night-v1.png`，要求保持同一空间与构图，改变日照和窗外天气。

```text
Use case: stylized-concept, image edit.
Asset type: matched DAYTIME art-direction reference for a future Blender/Three.js mobile loft.
Edit the supplied image /home/debian/Git/bearroom/docs/references/loft-night-v1.png into its SUNNY DAY counterpart. Preserve the same camera position, lens, crop, room geometry, mezzanine, staircase, window mullions, railings, furniture positions, proportions, bear plush, piano, computer nook, materials and small object placement as faithfully as possible. Preserve the original landscape aspect ratio. This is ONE image of the SAME room.
The original image's cute yet realistically rendered material quality was specifically approved. Retain that premium cozy semi-realistic 3D archviz appearance: rounded cream upholstered furniture with visible soft fabric, pale natural wood, restrained blush pink, realistic bevels, stitching, thickness, soft shadows. Do NOT introduce cel-shaded tonal bands, heavy black outlines, hand-drawn illustration, low-poly simplification, overly stylized comic effects or photographic people.
Change lighting and outdoor weather only: clear bright late morning sun entering diagonally through the tall far/right glazing. Visible well-defined yet natural window-mullion sun shadows and warm sun patches stretch onto the living-room floor, sofa edge, ivory grand piano and parts of the mezzanine. Slightly golden sunlight balanced with blue daylight fill, realistic surface bounce light. Preserve cream-white furniture and plush facial detail without blown whites. Areas under mezzanine stay readable with gentle bounced daylight. Turn off stair lights, floor/bedside lamps, kitchen undercabinet lamps and most indoor bulbs or leave them visually unobtrusive; PC fan lights and monitor remain faintly visible and properly exposed.
Outside show the same street and building positions in natural clear daylight. Remove active rain streaks and raindrops from glazing, no rainy-night reflections or nocturnal streetlamp glow. Keep street materials consistent but daytime and no excessive wet mirror glare. Soft clear blue outdoor sky illumination, no foggy beige overexposure.
Keep everything sharp enough to study, beautiful real material variations, peaceful bear themed home. No additional text, labels, logos, people or new room elements. Do not change architecture or transform/remove the piano, computer or bear.
```

## 电脑桌近景参考

输出：[computer-corner-v1.png](computer-corner-v1.png)。参考生成；输入 `loft-night-v1.png`、用户玩偶图 `../1.jpg` 和 `../2.jpg`。

```text
Use case: stylized-concept, reference-conditioned generation.
Asset type: one high-quality COMPUTER NOOK close-up art-direction image, landscape 3:2.
Reference roles: /home/debian/Git/bearroom/docs/references/loft-night-v1.png establishes the APPROVED warm cute semi-realistic material and lighting style, cream/light-wood/blush palette and rainy-night home context. /home/debian/Git/bearroom/docs/1.jpg establishes the exact white bear plush head/body/face proportions; /home/debian/Git/bearroom/docs/2.jpg establishes soft cream fur, delicate seams and black embroidered simple face. These bear photos are character references only, do not copy collages, hands, paper grid, labels or tags.
Create a new close three-quarter view of a complete thoughtfully designed matching computer desk set in this loft. Camera just above desk height, all major parts readable and in focus. Premium cute semi-realistic 3D archviz render with fine model detail and tactile soft materials, not cartoon cel shading or black outlined illustration. Rounded pale ash desktop with cream rounded legs and drawer body, roughly 1.6m wide. One slim cream 27-inch monitor on a proper stand at left/center, one compact cream glass-side PC case on the right of desktop with translucent subtly reflective side panel, believable clearly visible layered motherboard/GPU and neatly routed cables, three case fans with individually visible curved blades and gentle warm blush interior glow. Correct case panel thickness, edge bevels, vents, unobtrusive screws. No rainbow gamer RGB. The fan image is static concept art; blades must still be readable.
A matching keyboard with separate cream and muted blush keycaps, warm pink large desk mat with stitched edge, cream mouse, a tiny round desk speaker, a calm task lamp casting a real warm pool onto the desktop. One 12cm white round-head short-body bear plush at the left desk corner, matching user references including black dot eyes and tiny embroidered mouth, small rounded ears, stubby limbs and subtle blush cheeks. Monitor wallpaper is a simple cute sleepy bear expression on a pale cream and blush background, face readable, no small text, no brand names, no interface.
Matching cream ergonomic upholstered chair in foreground angled slightly toward viewer, with a rounded blush seat insert, tangible cushion thickness, fine seams, armrests, credible back support, stem and five-foot wheeled base; do not let the chair occlude the keyboard or PC.
Restrained surrounding decor: small bear picture frame, one little plant and a book, pale wood floor, a glimpse of cool-blue rainy window and softly blurred distant piano to tie it to the loft; rest of the desk stays functional and uncluttered. Warm task lamp, balanced shadows, PC glass must show internals rather than reflecting them away. Cream parts retain fine detail, distinct wood/fabric/glass/metal responses, not all surfaces shiny plastic. Refined inviting livable mood, physically plausible assembly and no floating objects. No people, no collage, no captions, no watermarks.
```

