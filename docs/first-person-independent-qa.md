# Independent first-person QA

## Result

The implemented indoor walking mode passes independent CPU and event-input tests against the actual frozen room asset. It covers both floors, the authored staircase in both directions, common-area circulation, desk and piano approaches, and the bathroom through its interactive door. There is no character/avatar geometry.

These checks are not browser-rendered visual approval, real mobile touch acceptance, audio listening tests, or device FPS/memory measurements. Ordinary browser execution was unavailable in this environment. No browser security or graphics restriction was bypassed.

## Reproducible checks

- `node --test tests/first-person-independent.test.mjs tests/walk-navigation-independent.test.mjs`
- `npm test` for the complete existing and new regression suite
- Parent integration runs the final production build, distribution verification and static size budget after source edits settle.

The independent files are `tests/first-person-independent.test.mjs`, `tests/walk-navigation-independent.test.mjs`, and their CPU-only event-target helpers in `tests/walk-qa-helpers.mjs`.

## Actual asset traversal

- Continuous lower circulation from the entry spawn to the stair approach, without teleporting between waypoints.
- Ascending and descending all 18 authored treads. Independent Three.js raycasts verify sampled foot heights against actual triangle surfaces, rather than a synthetic ramp or fake stairs.
- Continuous upstairs circulation past the bed and reading area and back to the stairs.
- Valid standing viewpoints at the desk and piano. All 88 piano keys have an unobstructed CPU raycast target from the valid first-person position `(2.05, 0.014, 3.55)`.
- Authored bathroom door initially blocks passage. Opening permits entry and exit. Both opening and closing reject a player occupying the swing. Restoring the mode restores the exact hinge quaternion.
- Exterior walls, window glass, the front-door perimeter, furniture, bed, low stair overhead structure and loft railings block movement. No falling/free flight or exterior escape was observed.
- Safe lower and upper spawns, invalid-position rejection, bounded diagonal movement, long-frame clamping, and deterministic random loft exploration.
- Walkable triangle normals are checked against the configured slope threshold. Vertical step changes remain within the configured 22 cm cap.

## Input and camera integration

- Three repeated enter/exit cycles for each of the five fixed-view presets preserve the exact isometric position, quaternion, up vector, projection, zoom, pan target, clipping arrays and visibility state.
- Isometric camera algorithms remain unchanged outside walking; finite reviewed main hooks are covered by the existing full recovery-AST guards.
- Real navigation and the controller are tested together after the runtime transform-freeze routine, including the complete stair roundtrip, keyboard bathroom-door interaction, and exact return to the original fixed frame.
- Keyboard diagonals are normalized; yaw-relative movement and fallback key values work; controller delta is capped at 50 ms.
- Simultaneous touch movement and look have independent pointers. Pointer cancellation, lost capture, blur, page hide, visibility change and help-modal interruption clear their relevant input state.
- Stationary taps may play piano notes. Walking, joystick use, dragging, multitouch, cancelled pointers, or a movement key pressed during a gesture suppress notes.
- Pitch is bounded. Stair eye-height easing stays within the checked headroom and keeps horizontal movement exact.
- Resize updates perspective aspect and, on exit, refits the saved fixed preset without losing zoom. Escape exits walking.
- The visual-only ceiling is separate from the authored root and never casts shadows. It is visible only while walking, does not enlarge fixed-view room bounds, and is removed/disposed without deleting its shared wall material. No model or GI asset was changed for it; existing bake lighting is an approximation for this closure.

## Issues caught and fixed

1. Stair descent easing initially put the eye about 1.9 cm above the checked 1.75 m capsule. A clamp now limits the eye to 1.69 m above the feet, leaving near-plane clearance. The combined real-stair test guards it.
2. The centered bathroom action overlapped the joystick on narrow portrait screens. The narrow-screen rule now places it above the joystick with at least 16 px vertical clearance by source geometry.
3. The original joystick media query missed wide hybrid-touch devices with a fine primary pointer. The final CSS includes `any-pointer: coarse`, and its exact availability rule is regression tested.

## Resource and acceptance caveats

The static collision structure indexes approximately 695k authored triangles plus a small separate moving-door collider. Reported typed-array collision storage is 27,417,144 bytes (about 26.15 MiB), additional to render assets and device/driver costs. This is a CPU allocation estimate, not measured peak GPU or total browser memory.

Responsive button dimensions, safe-area offsets, focus transfer and event behavior were source/event tested. Actual browser pixel layout, touch-device behavior, rendered first-person quality, acoustics and sustained phone performance remain unverified. The final static download budget must come from the final built distribution, not this report.
