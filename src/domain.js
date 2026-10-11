export const PIANO_KEYS = Array.from({ length: 88 }, (_, i) => {
  const midi = i + 21;
  const pitch = [
    "C",
    "C♯",
    "D",
    "D♯",
    "E",
    "F",
    "F♯",
    "G",
    "G♯",
    "A",
    "A♯",
    "B",
  ][midi % 12];
  return {
    midi,
    name: `${pitch}${Math.floor(midi / 12) - 1}`,
    black: [1, 3, 6, 8, 10].includes(midi % 12),
    frequency: 440 * 2 ** ((midi - 69) / 12),
    node: `piano_key_${String(midi).padStart(3, "0")}`,
  };
});
export const FURNITURE = [
  ["客厅沙发", true, "anim_sofa_edge"],
  ["茶几", false],
  ["电视", true, "screen_TV"],
  ["电视柜", false],
  ["客厅落地灯", false],
  ["三角钢琴", false],
  ["琴凳", false],
  ["电脑桌", false],
  ["电脑主机", true, "anim_pc_fan_01"],
  ["电脑显示器", true, "screen_PC"],
  ["电脑椅", true, "anim_chair_swivel"],
  ["桌面灯", false],
  ["餐桌及四把配套餐椅", true, "anim_dining_edge"],
  ["连续厨柜及内嵌设备", true, "anim_hood_fan"],
  ["床及成套床头柜、内置灯", true, "anim_bed_edge"],
  ["阅读摇椅", true, "anim_rocker"],
  ["书架及内置阅读灯", false],
  ["衣柜", false],
  ["玄关鞋柜与换鞋凳固定组合", false],
  ["卫生间台盆柜", false],
  ["奶白主题循环扇", true, "anim_fan_blades"],
  ["奶白空气净化设备", true, "anim_purifier_louver"],
  ["奶白落地摆钟", true, "anim_clock_pendulum"],
].map(([name, animated, node], i) => ({
  id: `F${String(i + 1).padStart(2, "0")}`,
  name,
  animated,
  node,
  day: "未验证",
  night: "未验证",
}));
export function isTap(g) {
  return g && !g.cancelled && !g.multi && g.distance <= 7 && g.duration < 650;
}
export function slideState(time, count, hold, offset = 0) {
  const t = Math.max(0, time + offset),
    cycle = hold + 1,
    idx = Math.floor(t / cycle) % count;
  return {
    index: idx,
    next: (idx + 1) % count,
    mix: Math.max(0, Math.min(1, (t % cycle) - hold)),
  };
}
