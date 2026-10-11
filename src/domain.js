/** Recovered from production v11. Minifier aliases are retained deliberately; this is not the lost original source.
 * Exact pre-recovery segment SHA256: ef18323471d139fff6b78380a681f12d236b5f31c052b421157be8b10ce9693f
 */

const Bx = Array.from({ length: 88 }, (i, e) => {
  const t = e + 21, n = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"][t % 12];
  return { midi: t, name: `${n}${Math.floor(t / 12) - 1}`, black: [1, 3, 6, 8, 10].includes(t % 12), frequency: 440 * 2 ** ((t - 69) / 12), node: `piano_key_${String(t).padStart(3, "0")}` };
});
const FURNITURE = [["客厅沙发", true, "anim_sofa_edge"], ["茶几", false], ["电视", true, "screen_TV"], ["电视柜", false], ["客厅落地灯", false], ["三角钢琴", false], ["琴凳", false], ["电脑桌", false], ["电脑主机", true, "anim_pc_fan_01"], ["电脑显示器", true, "screen_PC"], ["电脑椅", true, "anim_chair_swivel"], ["桌面灯", false], ["餐桌及四把配套餐椅", true, "anim_dining_edge"], ["连续厨柜及内嵌设备", true, "anim_hood_fan"], ["床及成套床头柜、内置灯", true, "anim_bed_edge"], ["阅读摇椅", true, "anim_rocker"], ["书架及内置阅读灯", false], ["衣柜", false], ["玄关鞋柜与换鞋凳固定组合", false], ["卫生间台盆柜", false], ["奶白主题循环扇", true, "anim_fan_blades"], ["奶白空气净化设备", true, "anim_purifier_louver"], ["奶白落地摆钟", true, "anim_clock_pendulum"]].map(([i, e, t], n) => ({ id: `F${String(n + 1).padStart(2, "0")}`, name: i, animated: e, node: t, day: "未验证", night: "未验证" }));
function kx(i) {
  return i && !i.cancelled && !i.multi && i.distance <= 7 && i.duration < 650;
}
function zx(i, e, t, n = 0) {
  const s = Math.max(0, i + n), r = t + 1, a = Math.floor(s / r) % e;
  return { index: a, next: (a + 1) % e, mix: Math.max(0, Math.min(1, s % r - t)) };
}

export { Bx, kx, zx, Bx as PIANO_KEYS, kx as isTap, zx as slideState, FURNITURE };
