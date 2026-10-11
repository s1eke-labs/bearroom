# v19 scene interactions

The new runtime interactions are pointer/touch taps on real exported scene geometry. They use the active fixed or walking camera and the first visible, unclipped hit. Existing opaque foreground blocks interaction. PC-case glass is itself a case target, so its empty-looking panels remain tappable.

## Bathroom door

Tapping the moving door leaf or its hardware toggles the existing bathroom hinge. Its name, local-Y axis and -90° open direction are preserved. Fixed-view taps have no active player and update the same dynamic collider directly. Walking taps retain the existing 1.5 m contextual range, 18-sample full swing sweep, and capsule collision rejection. E and the contextual door button use that same safety path. One door state persists across fixed/walking camera transitions; exit still restores the camera, clipping, visibility and controls exactly.

This is the existing instantaneous hinge transition with a preflight collision sweep, not a new timed door animation. No collision structure is rebuilt per rendered frame.

## PC case

Tapping any case surface toggles session-only case power. Off freezes the current transforms of all nine fan rotors and sets all four shared RGB emissive-zone intensities to zero. These zones remain excluded from the generic day/night emissive loop, and the PC update path returns before any fan/RGB writes while off. Lighting changes, camera changes, and returning from hidden/offscreen views do not switch the case back on.

Power-on resumes using elapsed powered time, excluding the off interval. The existing portrait local clock and separate monitor slideshow remain as before. No lights, shadows, geometry, timers or persistent storage are added.

## Computer keyboard

This concerns the computer keyboard on the desk, independently of all 88 piano keys and their audio.

The source asset batches the computer keys together with other desk parts. Startup indexes disconnected components in just two existing desk meshes, welding coincident position seams for identification without rewriting topology. The exact authored component dimensions select 75 keycaps and one spacebar and exclude the mouse, chassis, drawer fronts and desk supports. The spacebar overlaps five lower cap centers in the inherited geometry; each cap still has an exposed raycast point, independently verified.

The two geometries are cloned once, including independent position/index buffers. Only vertices of the clicked component translate 4 mm down and back over 220 ms along the real top-face local +Y normal. Authored normals, bevels, UVs and materials remain unchanged. Repeated clicks restart from the current depression using immutable rest positions, so offsets never accumulate. Only active key components and their attribute update ranges are visited per frame. There are no additional draw calls, whole-scene traversals or collision rebuilds for key animation.

Keyboard taps produce cosmetic motion only: no text input, synthetic keyboard events, navigation, command execution, audio, focus changes or storage. Blur, page hide, help and visibility interruption restore pressed vertices. The existing piano tap/audio implementation remains unchanged.

## Input and preparation preservation

Fixed-view tap eligibility retains the original <=7 pixel / <650 ms primary-pointer thresholds and original camera/zoom restoration after an accepted tap. Pointer-up position also counts, preventing a missing move event from turning a drag into a tap. Cancel, lost capture, multitouch, help dialogs, releases over UI and releases outside the canvas do not activate targets. Walking additionally rejects taps during movement, joystick use and look drags, including movement that starts and stops during a gesture.

The runtime changes are an exact finite hook list in `recovery/room-interaction-hooks.json`, applied after the existing v18 hook list. Four-topology first-switch shader preparation and readiness gating are unchanged. Keyboard clones are created before preparation, so their real draw/upload path participates in it. No scene controls become ready early.

## Verification boundary

Tests exercise actual exported geometry/raycast hits, isolated typed arrays, real key-top triangle normals, exact rest recovery, synthetic DOM gesture interruption, nine rotor transforms/four emissive zones, persistent door state and existing swept-capsule safety. Frozen camera, vendor, piano/audio, lighting and preparation tests still run. Asset and renderer-output budgets are verified separately by the full build.

These CPU/source tests do not establish WebGL appearance, acoustic output, touch-device usability, GPU performance or screenshot flicker elimination. The environment's supported browser WebGL path remains unavailable; no browser or socket restriction was bypassed. A real supported-browser and device review remains required.
