import { useEffect } from "react";
import * as THREE from "three";
import { createDimension } from "../helpers/createDimension";

export function useDimensions(scene, gltf, dimensionPlatesRef, rulerMeshesRef) {
  useEffect(() => {
    if (!scene || !gltf) return;

    // --- Dimensions ---
    // Define positions in lines
    const offsetWidth104 = new THREE.Vector3(0, 0, -0.1);
    const offsetDepth104 = new THREE.Vector3(-0.5, -0.9, 0.4);
    const offsetHeight104 = new THREE.Vector3(-0.5, -0.5, -0.1);
    const offsetWidth108 = new THREE.Vector3(0.4, 0.9, -0.1);
    const offsetDepth108 = new THREE.Vector3(-0.1, 0, 0.35);
    const offsetHeight108 = new THREE.Vector3(-0.1, 0.4, -0.1);

    // --- Model 104 ---
    // Fetch dimension lines in 3D object
    const linjal104 = gltf.scene.getObjectByName("08_Linjal_ES104");

    // Create 3 dimension plates & append to scene
    const plateDepth104 = createDimension("71");
    const plateWidth104 = createDimension("69");
    const plateHeight104 = createDimension("89");

    plateDepth104.attachTo(linjal104, offsetDepth104);
    plateWidth104.attachTo(linjal104, offsetWidth104);
    plateHeight104.attachTo(linjal104, offsetHeight104);

    scene.add(plateDepth104.group);
    scene.add(plateWidth104.group);
    scene.add(plateHeight104.group);

    // --- Model 108 ---
    // Fetch dimension lines in 3D object
    const linjal108 = gltf.scene.getObjectByName("08_Linjal_ES108");

    // Create 3 dimension plates & append to scene
    const plateDepth108 = createDimension("72");
    const plateWidth108 = createDimension("69");
    const plateHeight108 = createDimension("88");

    plateDepth108.attachTo(linjal108, offsetDepth108);
    plateWidth108.attachTo(linjal108, offsetWidth108);
    plateHeight108.attachTo(linjal108, offsetHeight108);

    scene.add(plateDepth108.group);
    scene.add(plateWidth108.group);
    scene.add(plateHeight108.group);

    // Hide all lines and measures (default behaviour)
    dimensionPlatesRef.current = {
      ES104: [plateDepth104, plateWidth104, plateHeight104],
      ES108: [plateDepth108, plateWidth108, plateHeight108],
    };

    rulerMeshesRef.current = {
      ES104: [linjal104].filter(Boolean),
      ES108: [linjal108].filter(Boolean),
    };

    Object.values(rulerMeshesRef.current)
      .flat()
      .forEach((mesh) => (mesh.visible = false));
    Object.values(dimensionPlatesRef.current)
      .flat()
      .forEach((plate) => (plate.group.visible = false));
  }, [scene, gltf]);
}
