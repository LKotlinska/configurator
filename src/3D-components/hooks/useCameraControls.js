import { useRef, useEffect } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as THREE from "three";

// OrbitControls setup
export function useCameraControls(camera, renderer, controlsRef, dir) {
  const updateLightRef = useRef(() => {});

  useEffect(() => {
    if (!camera || !renderer) return;

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableRotate = false; // user can't rotate object by clicking on canvas
    controls.enableZoom = true; // zoom handled by OrbitControls
    controls.enablePan = false; // don't let the user pan the object away

    // Zoom limits
    controls.minDistance = 0.8;
    controls.maxDistance = 2;

    controls.target.set(0, 0, 0);
    controls.update();

    // Offset light: follows the camera but not coaxially, to avoid a flat look
    const lightOffset = new THREE.Vector3(1.5, 1, 0.5);

    function updateLight() {
      const rotatedOffset = lightOffset
        .clone()
        .applyQuaternion(camera.quaternion);
      dir.position.copy(camera.position).add(rotatedOffset);
      dir.target.position.copy(controls.target);
      dir.target.updateMatrixWorld();
    }

    updateLightRef.current = updateLight;

    return () => controls.dispose();
  }, [camera, renderer, controlsRef, dir]);

  return updateLightRef;
}
