import { useEffect, useRef } from "react";
import * as THREE from "three";

// Raycasting: User must click the object to rotate
export function useRaycastInteraction(renderer, camera, modelRef, controlsRef) {
  const raycaster = useRef(new THREE.Raycaster());
  const pointerNDC = useRef(new THREE.Vector2());

  // Hover cursor
  const isHoveringRef = useRef(false);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (!renderer || !camera) return;

    const dom = renderer.domElement;

    function getPointerNDC(event) {
      const rect = dom.getBoundingClientRect();
      pointerNDC.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNDC.current.y =
        -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function onPointerDown(event) {
      if (!modelRef.current) return; // model not loaded yet
      getPointerNDC(event);
      raycaster.current.setFromCamera(pointerNDC.current, camera);
      const intersects = raycaster.current.intersectObject(
        modelRef.current,
        true,
      );

      if (intersects.length > 0) {
        controlsRef.current.enableRotate = true;
        isDraggingRef.current = true;
        dom.style.cursor = "grabbing";
      }
    }

    function onPointerUp() {
      controlsRef.current.enableRotate = false; // turned off until next click on the object
      isDraggingRef.current = false;
      dom.style.cursor = isHoveringRef.current ? "grab" : "default";
    }

    function onPointerMove(event) {
      if (!modelRef.current) return; // model not loaded yet
      if (isDraggingRef.current) return; // Grabbing prior to hover

      getPointerNDC(event);
      raycaster.current.setFromCamera(pointerNDC.current, camera);
      const intersects = raycaster.current.intersectObject(
        modelRef.current,
        true,
      );

      const nowHovering = intersects.length > 0;
      if (nowHovering !== isHoveringRef.current) {
        isHoveringRef.current = nowHovering;
        dom.style.cursor = isHoveringRef.current ? "grab" : "default";
      }
    }

    function onPointerLeave() {
      isHoveringRef.current = false;
      dom.style.cursor = "default";
    }

    // capture: true makes sure our raycast decision runs before OrbitControls' own pointerdown handler decides whether to start rotating
    dom.addEventListener("pointerdown", onPointerDown, { capture: true });
    dom.addEventListener("pointerup", onPointerUp);
    dom.addEventListener("pointerleave", onPointerUp);
    dom.addEventListener("pointermove", onPointerMove);
    dom.addEventListener("pointerleave", onPointerLeave);

    return () => {
      dom.removeEventListener("pointerdown", onPointerDown, { capture: true });
      dom.removeEventListener("pointerup", onPointerUp);
      dom.removeEventListener("pointerleave", onPointerUp);
      dom.removeEventListener("pointermove", onPointerMove);
      dom.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [renderer, camera, modelRef, controlsRef]);

  return {
    raycaster: raycaster.current,
    pointerNDC: pointerNDC.current,
  };
}
