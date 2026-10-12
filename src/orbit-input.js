/** Cancel input in the pinned OrbitControls without advancing the visible camera.
 * Calling update() here would consume damping and move the frame being preserved.
 * Release every captured pointer explicitly: the vendor only releases the last
 * pointer on pointerup, whereas a cancelled multitouch gesture may capture another.
 */
const cancelling = new WeakSet();

export function cancelOrbitGesture(controls) {
  if (!controls || cancelling.has(controls)) return;
  cancelling.add(controls);
  try {
    const pointers = [...(controls._pointers || [])];
    const hadGesture = pointers.length > 0 || (controls.state !== undefined && controls.state !== -1);
    const element = controls.domElement;

    // Clear ownership before releasing capture: lostpointercapture handlers can
    // synchronously ask to cancel again, and must never restart a surviving finger.
    if (controls._pointers) controls._pointers.length = 0;
    if (controls._pointerPositions) {
      for (const id of Object.keys(controls._pointerPositions)) delete controls._pointerPositions[id];
    }
    if (controls._onPointerMove) element?.removeEventListener?.('pointermove', controls._onPointerMove);
    if (controls._onPointerUp) element?.removeEventListener?.('pointerup', controls._onPointerUp);
    controls._sphericalDelta?.set(0, 0, 0);
    controls._panOffset?.set(0, 0, 0);
    if ('_scale' in controls) controls._scale = 1;
    if ('_performCursorZoom' in controls) controls._performCursorZoom = false;
    if ('state' in controls) controls.state = -1;
    if ('_controlActive' in controls) controls._controlActive = false;
    if (controls._interceptControlUp) {
      element?.getRootNode?.()?.removeEventListener?.('keyup', controls._interceptControlUp, { capture: true });
    }
    for (const id of pointers) {
      try {
        if (!element?.hasPointerCapture || element.hasPointerCapture(id)) element?.releasePointerCapture?.(id);
      } catch { /* The browser may already have released an interrupted pointer. */ }
    }
    if (hadGesture) controls.dispatchEvent?.({ type: 'end' });
  } finally {
    cancelling.delete(controls);
  }
}
