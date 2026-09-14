import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createDimension } from "./createDimension";

const Object = forwardRef(function Object(props, ref) {
  const containerRef = useRef(null);
  const initialized = useRef(false);
  const dimensionPlatesRef = useRef({});

  // Model parts, exposed outside the effect via refs
  const modelRef = useRef(null);
  const armFrameRef = useRef(null);
  const armCushionRef = useRef(null);
  const chairBodyRef = useRef(null);
  const legsRef = useRef([]);

  // Enables user interaction to trigger the preset angles
  const goToPresetRef = useRef(null);

  // Exposes 'goToPreset' to whichever parent holds a ref to this component
  useImperativeHandle(ref, () => ({
    goToPreset: (key) => goToPresetRef.current?.(key),
  }));

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
    controls.maxDistance = 3; // zoom limit
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
        isDragging = true;
        renderer.domElement.style.cursor = "grabbing";
      }
    }

    function onPointerUp() {
      controls.enableRotate = false; // turned off until next click on the object
      isDragging = false;
      renderer.domElement.style.cursor = isHovering ? "pointer" : "default";
    }

    // Hover cursor
    let isHovering = false;
    let isDragging = false;

    function onPointerMove(event) {
      if (!modelRef.current) return; // model not loaded yet
      if (isDragging) return; // Grabbing prior to hover

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

    // capture: true makes sure our raycast decision runs before OrbitControls' own pointerdown handler decides whether to start rotating
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

    // Expose so an outer menu component can call
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
      "/chair.glb", // <--- <--- <--- PUT PERMANENT FILE HERE!!!!
      (gltf) => {
        const model = gltf.scene;

        modelRef.current = model;
        armFrameRef.current = model.getObjectByName("arm_frame");
        armCushionRef.current = model.getObjectByName("arm_cushion");
        chairBodyRef.current = model.getObjectByName("body");
        console.log(chairBodyRef);
        const legsGroup = model.getObjectByName("bottom_leg_1");
        legsRef.current = legsGroup ? legsGroup.children : [];

        scene.add(model);

        // --- Dimensions ---
        // Fetch dimension lines in 3D object
        const linjal104 = gltf.scene.getObjectByName("08_Linjal_ES104");
        // const linjal108 = gltf.scene.getObjectByName("08_Linjal_ES108");

        console.log(gltf);

        // Define positions in lines
        const offsetWidth104 = new THREE.Vector3(0, 0.0, 0.0);
        const offsetDepth104 = new THREE.Vector3(-0.5, -0.9, 0.4);
        const offsetHeight104 = new THREE.Vector3(-0.45, -0.45, 0);

        // Create 3 dimension plates & append to scene
        const plateDepth104 = createDimension("DEPTH104");
        const plateWidth104 = createDimension("WIDTH104");
        const plateHeight104 = createDimension("HEIGHT104");

        plateDepth104.attachTo(linjal104, offsetDepth104);
        plateWidth104.attachTo(linjal104, offsetWidth104);
        plateHeight104.attachTo(linjal104, offsetHeight104);

        scene.add(plateDepth104.group);
        scene.add(plateWidth104.group);
        scene.add(plateHeight104.group);

        dimensionPlatesRef.current = {
          plateDepth104,
          plateWidth104,
          plateHeight104,
        };

        // --------------- TEST END!!! DIMENSIONS ---------------

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

      // Append dimension plates
      const { plateDepth104, plateWidth104, plateHeight104 } =
        dimensionPlatesRef.current;
      plateDepth104?.update(camera);
      plateWidth104?.update(camera);
      plateHeight104?.update(camera);

      renderer.render(scene, camera);
    }
    animate();

    // Keeps size in sync with the container, including layout-only changes
    function handleResize() {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (!newWidth || !newHeight) return;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      // Repaint immediately since setSize() clears the canvas's drawing buffer
      // causing 'blinking' on canvas when toggling visibility of configurator section
      renderer.render(scene, camera);
    }
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
  }, []);

  return (
    <article ref={containerRef} style={{ width: "100%", height: "100%" }} />
  );
});

export default Object;
