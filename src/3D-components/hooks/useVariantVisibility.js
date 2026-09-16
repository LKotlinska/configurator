// /hooks/useVariantVisibility.js
import { useEffect } from "react";
import * as THREE from "three";

// Same bounding box logic as original
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

export function useVariantVisibility(
  partsRef,
  variant,
  armrestOption,
  loaded,
  boundingBoxRef,
) {
  useEffect(() => {
    if (!loaded) return;

    // Same logic as original
    for (const [variantKey, parts] of Object.entries(partsRef.current)) {
      const isActiveVariant = variantKey === variant;
      parts.root.visible = isActiveVariant;
      if (!isActiveVariant) continue;

      parts.standardArmrest.visible = armrestOption === "standard";
      parts.singleArmrest.visible = armrestOption === "single";
      parts.noArmrest.visible = armrestOption === "none";

      parts.standardCushion.visible = armrestOption === "standard";
      parts.singleCushion.visible = armrestOption === "single";
    }

    // Same bounding box update
    boundingBoxRef.current = computeVisibleWorldBox(
      partsRef.current[variant]?.root,
    );
  }, [variant, armrestOption, loaded]);
}
