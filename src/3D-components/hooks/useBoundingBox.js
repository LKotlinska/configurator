import { useEffect } from "react";
import * as THREE from "three";

// Calculate bounding box for all visible meshes
function computeVisibleWorldBox(root) {
  if (!root) return null;
  const box = new THREE.Box3();

  function recurse(obj) {
    if (!obj.visible) return;
    if (obj.geometry) {
      obj.geometry.computeBoundingBox?.();
      if (obj.geometry.boundingBox) {
        const localBox = obj.geometry.boundingBox.clone();
        localBox.applyMatrix4(obj.matrixWorld);
        box.union(localBox);
      }
    }
    obj.children.forEach(recurse);
  }

  recurse(root);
  return box.isEmpty() ? null : box;
}

export function useBoundingBox(partsRef, variant, loaded, boundingBoxRef) {
  useEffect(() => {
    if (!loaded) return;

    const root = partsRef.current[variant]?.root;
    // Recalculate bounding-box after each user toggle
    boundingBoxRef.current = computeVisibleWorldBox(root);
  }, [variant, loaded, partsRef, boundingBoxRef]);
}
