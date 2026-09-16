import { useEffect, useRef } from "react";
import * as THREE from "three";

// Append a HTML element at the top right corner of 3D object. Update with every frame
export function useScreenSpaceTag(camera, containerEl, boxRef, offsetPx) {
  const elRef = useRef(null);
  const offsetRef = useRef(offsetPx);
  offsetRef.current = offsetPx;

  useEffect(() => {
    if (!camera || !containerEl) return;

    const corner = new THREE.Vector3();
    let frameId;

    function loop() {
      const el = elRef.current;
      const box = boxRef.current;

      if (el) {
        if (!box) {
          el.style.display = "none";
        } else {
          const { clientWidth: w, clientHeight: h } = containerEl;
          let minX = Infinity;
          let maxX = -Infinity;
          let minY = Infinity;
          let anyInFront = false;

          // Find all corners of object and find viewport min/max
          for (let i = 0; i < 8; i++) {
            corner.set(
              i & 1 ? box.max.x : box.min.x,
              i & 2 ? box.max.y : box.min.y,
              i & 4 ? box.max.z : box.min.z,
            );
            corner.project(camera);
            if (corner.z > 1) continue; // behind camera

            anyInFront = true;
            const px = (corner.x * 0.5 + 0.5) * w;
            const py = (corner.y * -0.5 + 0.5) * h;
            if (px < minX) minX = px;
            if (px > maxX) maxX = px;
            if (py < minY) minY = py;
          }

          if (!anyInFront) {
            el.style.display = "none";
          } else {
            const { x: ox = 0, y: oy = 0 } = offsetRef.current ?? {};
            el.style.display = "";
            // Append to higher right corner
            el.style.transform = `translate(${maxX + ox}px, ${minY + oy}px)`;
          }
        }
      }
      frameId = requestAnimationFrame(loop);
    }

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [camera, containerEl, boxRef]);

  return elRef;
}
