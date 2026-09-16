import { useRef, useEffect } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as THREE from "three";

export function useCameraControls(camera, renderer, controlsRef, dir) {
  const updateLightRef = useRef(() => {});

  useEffect(() => {
    if (!camera || !renderer) return;

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;

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
