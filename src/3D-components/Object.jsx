import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

function Object() {
  const containerRef = useRef(null);
  const initialized = useRef(false);

  // Model parts, exposed outside the effect via refs
  const modelRef = useRef(null);
  const armFrameRef = useRef(null);
  const armCushionRef = useRef(null);
  const chairBodyRef = useRef(null);
  const legsRef = useRef([]);

  // Enables user interaction to trigger the preset angles
  const goToPresetRef = useRef(null);

  useEffect(() => {
    // Solved double rendering
    if (initialized.current) return;
    initialized.current = true;

    // Early break
    const container = containerRef.current;
    if (!container) return;

    // Set sizes
    const width = container.clientWidth || window.innerWidth / 2;
    const height = container.clientHeight || window.innerHeight;

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xd3d3d3);

    // Stage camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    // camera.position.set(0, 1, 3);
    camera.position.set(0, 1, 1.5); // COULD NEED ADJUSTMENT WHEN PERMANENT OBJECT IS UP

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Lightning
    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const dir = new THREE.DirectionalLight(0xffffff, 2);
    scene.add(dir);
    scene.add(dir.target);

    // --- OrbitControls setup (independent of the model, so set up immediately) ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableRotate = false; // user can't rotate object by clicking on canvas
    controls.enableZoom = true; // zoom handled by OrbitControls
    controls.enablePan = false; // don't let the user pan the object away
    controls.minDistance = 1.5; // zoom limit
    controls.maxDistance = 6; // zoom limit
    controls.target.set(0, 0, 0);
    controls.update();

    // --- Raycasting for "user must click the object to rotate" ---
    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2();

    function getPointerNDC(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNDC.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNDC.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function onPointerDown(event) {
      if (!modelRef.current) return; // model not loaded yet
      getPointerNDC(event);
      raycaster.setFromCamera(pointerNDC, camera);
      const intersects = raycaster.intersectObject(modelRef.current, true);

      if (intersects.length > 0) {
        controls.enableRotate = true;
      }
    }

    function onPointerUp() {
      controls.enableRotate = false; // turned off until next click on the object
    }

    // Hover cursor
    let isHovering = false;

    function onPointerMove(event) {
      if (!modelRef.current) return;
      getPointerNDC(event);
      raycaster.setFromCamera(pointerNDC, camera);
      const intersects = raycaster.intersectObject(modelRef.current, true);

      const nowHovering = intersects.length > 0;
      if (nowHovering !== isHovering) {
        isHovering = nowHovering;
        renderer.domElement.style.cursor = isHovering ? "pointer" : "default";
      }
    }

    function onPointerLeave() {
      isHovering = false;
      renderer.domElement.style.cursor = "default";
    }

    // capture: true makes sure our raycast decision runs before OrbitControls'
    // own pointerdown handler decides whether to start rotating
    renderer.domElement.addEventListener("pointerdown", onPointerDown, {
      capture: true,
    });
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointerleave", onPointerUp);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerleave", onPointerLeave);

    // --- Preset angles ---
    const presets = {
      angle1: new THREE.Vector3(0, 1, 3),
      angle2: new THREE.Vector3(3, 1, 0),
      angle3: new THREE.Vector3(-2, 2, 2),
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

    // Expose so an outer menu component can call e.g. goToPresetRef.current(presets.angle1)
    goToPresetRef.current = (key) => goToPreset(presets[key]);

    // --- Offset light: follows the camera but not coaxially, to avoid a flat look ---
    const lightOffset = new THREE.Vector3(1.5, 1, 0.5);

    function updateLight() {
      const rotatedOffset = lightOffset
        .clone()
        .applyQuaternion(camera.quaternion);
      dir.position.copy(camera.position).add(rotatedOffset);
      dir.target.position.copy(controls.target);
      dir.target.updateMatrixWorld();
    }

    // Loader
    const loader = new GLTFLoader();
    loader.load(
      "/chairTest2.glb", // <--- <--- <--- PUT PERMANENT FILE HERE!!!!
      //   "/chair-v3.glb",
      (gltf) => {
        // console.log(gltf);
        const model = gltf.scene;

        modelRef.current = model;
        armFrameRef.current = model.getObjectByName("arm_frame");
        armCushionRef.current = model.getObjectByName("arm_cushion");
        chairBodyRef.current = model.getObjectByName("body");
        console.log(chairBodyRef);
        const legsGroup = model.getObjectByName("bottom_leg_1");
        legsRef.current = legsGroup ? legsGroup.children : [];

        scene.add(model);

        // // --------------- TEST!!! OLD CODE  -  TRY ORBIT CONTROL INSTEAD ---------------
        // // --- Drag for rotation ---
        // // States
        // let isDragging = false;
        // let isHovering = false;

        // // Save new position between each movement
        // let previousPointer = { x: 0, y: 0 };

        // const raycaster = new THREE.Raycaster();
        // const pointerNDC = new THREE.Vector2();

        // // Convert coordinates
        // function getPointerNDC(event) {
        //   const rect = renderer.domElement.getBoundingClientRect();
        //   pointerNDC.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        //   pointerNDC.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        // }

        // // Initiate movement
        // function onPointerDown(event) {
        //   getPointerNDC(event);
        //   raycaster.setFromCamera(pointerNDC, camera);
        //   const intersects = raycaster.intersectObject(model, true);

        //   if (intersects.length > 0) {
        //     isDragging = true;
        //     previousPointer.x = event.clientX;
        //     previousPointer.y = event.clientY;
        //   }
        // }

        // // Rotation of object + cursor check
        // function onPointerMove(event) {
        //   if (isDragging) {
        //     // Calculate distance of user interaction
        //     const deltaX = event.clientX - previousPointer.x;
        //     const deltaY = event.clientY - previousPointer.y;

        //     model.rotation.y += deltaX * 0.01; // User movement in x-direction -> rotation on vertical direction
        //     model.rotation.x += deltaY * 0.01; // User movement in y-direction -> rotation in horizontal direction

        //     previousPointer.x = event.clientX;
        //     previousPointer.y = event.clientY;
        //     return; // Don't check for hover while already dragging
        //   }

        //   // Hover-check. Hovering -> cursor pointer
        //   getPointerNDC(event);
        //   raycaster.setFromCamera(pointerNDC, camera);
        //   const intersects = raycaster.intersectObject(model, true);

        //   const nowHovering = intersects.length > 0;
        //   if (nowHovering !== isHovering) {
        //     isHovering = nowHovering;
        //     renderer.domElement.style.cursor = isHovering
        //       ? "pointer"
        //       : "default";
        //   }
        // }

        // function onPointerUp() {
        //   // End movement
        //   isDragging = false;
        // }

        // // Apply functions for rotation of object
        // renderer.domElement.addEventListener("pointerdown", onPointerDown);
        // renderer.domElement.addEventListener("pointermove", onPointerMove);
        // renderer.domElement.addEventListener("pointerup", onPointerUp);
        // renderer.domElement.addEventListener("pointerleave", onPointerUp);
        // // --------------- TEST END!!! TEST END!!! ---------------

        // // --------------- TEST!!! Toggle material to "Blue" ---------------
        // gltf.parser.getDependency("material", 0).then((blueMaterial) => {
        //   model.traverse((obj) => {
        //     if (obj.isMesh) {
        //       obj.material = blueMaterial;
        //     }
        //   });
        // });
        // // ---------------  TEST END!!! ---------------
      },
      undefined,
      (error) => {
        console.error("COULD NOT LOAD GLB:", error);
      },
    );

    // Append animation
    let frameId;
    function animate() {
      frameId = requestAnimationFrame(animate);
      controls.update();
      updateLight();
      renderer.render(scene, camera);
    }
    animate();

    // Keeps size in sync with the container
    function handleResize() {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (!newWidth || !newHeight) return;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    }
    window.addEventListener("resize", handleResize);
  }, []);

  return (
    <article ref={containerRef} style={{ width: "100%", height: "100%" }} />
  );
}

export default Object;
