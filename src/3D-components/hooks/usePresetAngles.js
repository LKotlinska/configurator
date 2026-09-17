import { useEffect } from "react";
import * as THREE from "three";

export function usePresetAngles(camera, controls, goToPresetRef) {
  useEffect(() => {
    if (!camera || !controls) return;

    // Preset angles
    const presets = {
      angle1: new THREE.Vector3(-1.2, 1.5, 1.2),
      angle2: new THREE.Vector3(0, 1.5, 0.8),
      angle3: new THREE.Vector3(1.2, 1.5, 1.2),
    };

    function goToPreset(pos, animated = true) {
      if (!animated) {
        camera.position.copy(pos);
        controls.update();
        return;
      }

      const start = camera.position.clone();
      const startTime = performance.now();
      const duration = 500;

      function step(now) {
        const t = Math.min((now - startTime) / duration, 1);
        camera.position.lerpVectors(start, pos, t);
        controls.update();
        if (t < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    }

    // Expose so an outer menu component can call
    goToPresetRef.current = (key) => goToPreset(presets[key]);
  }, [camera, controls, goToPresetRef]);
}
