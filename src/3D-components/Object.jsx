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
import { CHAIR_URL } from "../config/models";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { createDimension } from "./createDimension";
import GLTFMaterialsVariantsExtension from "three-gltf-extensions/loaders/KHR_materials_variants/KHR_materials_variants.js";
import styles from "./Object.module.css";
import loadingIcon from "../assets/loading-icon.gif";

// Meshes that carry the upholstery material, keyed the same as CHAIR_PARTS.
const UPHOLSTERY_PARTS = ["body", "standardCushion", "singleCushion"];

// Object names as they exist in chair.glb, keyed by variant (see model description).
const CHAIR_PARTS = {
  ES104: {
    root: "Chair_ES104_Root",
    base: "01_Base_metal_W_wheels_ES104",
    standardArmrest: "02_Armrest_Metal_ES104",
    singleArmrest: "03_Singel_Armrest_ES104",
    noArmrest: "04_Singel_NOarmrest_ES104",
    body: "05_Body_ES104",
    standardCushion: "06_Metal_Cushion_ES104",
    singleCushion: "07_Singel_Cushion_ES104",
  },
  ES108: {
    root: "Chair_ES108_Root",
    base: "01_Base_metal_ES108",
    standardArmrest: "02_Armrest_Metal_ES108",
    singleArmrest: "03_Singel_Armrest_ES108",
    noArmrest: "04_Singel_NOarmrest_ES108",
    body: "05_Body_ES108",
    standardCushion: "06_Metal_Cushion_ES108",
    singleCushion: "07_Singel_Cushion_ES108",
  },
};

const ChairModel = forwardRef(function ChairModel(
  { variant, armrestOption = "standard", material = "fabric", color = "cream" },
  ref,
) {
  const containerRef = useRef(null);
  const initialized = useRef(false);
  const dimensionPlatesRef = useRef({});
  const rulerMeshesRef = useRef({});

  // Populated on load as { ES104: { root, base, standardArmrest, ... }, ES108: {...} }
  const partsRef = useRef({});
  const modelRef = useRef(null);
  // gltf.functions.selectVariant, exposed by the KHR_materials_variants
  // loader plugin, used to switch a mesh to one of the GLB's baked-in
  // material variants (fabric_cream, leather_earth, ...).
  const selectVariantRef = useRef(null);

  const [loaded, setLoaded] = useState(false);
  // Enables user interaction to trigger the preset angles
  const goToPresetRef = useRef(null);

  function applyRulerVisibility(visible, currentVariant) {
    const plates = dimensionPlatesRef.current;
    const rulers = rulerMeshesRef.current;

    if (!plates?.[currentVariant] || !rulers?.[currentVariant]) return;

    // Hide all measures (default)
    Object.values(rulers)
      .flat()
      .forEach((mesh) => (mesh.visible = false));
    Object.values(plates)
      .flat()
      .forEach((plate) => (plate.group.visible = false));

    // Show measures of current variants only
    rulers[currentVariant].forEach((mesh) => (mesh.visible = visible));
    plates[currentVariant].forEach((plate) => (plate.group.visible = visible));
  }

  // Exposes 'goToPreset' to whichever parent holds a ref to this component
  useImperativeHandle(ref, () => ({
    goToPreset: (key) => goToPresetRef.current?.(key),
    setRulerVisible: (visible, variantKey) =>
      applyRulerVisibility(visible, variantKey),
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
    // Without tone mapping so IBL reflections don't clip straight to white
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.7;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Environment map so metallic/chrome parts have something to reflect -
    // without it PBR metals render near-black under direct lights alone.
    // A higher blur (sigma) keeps reflections soft instead of mirror-sharp hotspots.
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04,
    ).texture;
    pmremGenerator.dispose();

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
    controls.minDistance = 0.8; // zoom limit
    controls.maxDistance = 2; // zoom limit
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
      renderer.domElement.style.cursor = isHovering ? "grab" : "default";
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
        renderer.domElement.style.cursor = isHovering ? "grab" : "default";
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
    loader.register((parser) => new GLTFMaterialsVariantsExtension(parser));
    loader.load(
      CHAIR_URL, // Link to file on vercel blob
      (gltf) => {
        const model = gltf.scene;
        modelRef.current = model;
        selectVariantRef.current = gltf.functions?.selectVariant ?? null;
        // Resolve every named part for every variant from CHAIR_PARTS.
        for (const [variantKey, partNames] of Object.entries(CHAIR_PARTS)) {
          const parts = {};
          for (const [partKey, objectName] of Object.entries(partNames)) {
            parts[partKey] = model.getObjectByName(objectName);
          }
          partsRef.current[variantKey] = parts;
        }

        scene.add(model);
        setLoaded(true);

        // Re-center vertically
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        camera.position.y += center.y - controls.target.y;
        controls.target.y = center.y;
        controls.update();

        // --- Dimensions ---
        // Define positions in lines
        const offsetWidth104 = new THREE.Vector3(0, 0.0, 0.0);
        const offsetDepth104 = new THREE.Vector3(-0.5, -0.9, 0.4);
        const offsetHeight104 = new THREE.Vector3(-0.45, -0.45, 0);
        const offsetWidth108 = new THREE.Vector3(0.4, 0.9, -0.1);
        const offsetDepth108 = new THREE.Vector3(-0.1, 0, 0.4);
        const offsetHeight108 = new THREE.Vector3(0, 0.45, 0);

        // --- Model 104 ---
        // Fetch dimension lines in 3D object
        const linjal104 = gltf.scene.getObjectByName("08_Linjal_ES104");

        // Create 3 dimension plates & append to scene
        const plateDepth104 = createDimension("69,5");
        const plateWidth104 = createDimension("68,3");
        const plateHeight104 = createDimension("83,7");

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
        const plateDepth108 = createDimension("69,1");
        const plateWidth108 = createDimension("68,3");
        const plateHeight108 = createDimension("83,7");

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

        console.log("108 plate pos:", plateDepth108.group.position);
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
      const plates = dimensionPlatesRef.current;
      if (plates?.ES104 && plates?.ES108) {
        Object.values(plates)
          .flat()
          .forEach((plate) => plate.update(camera));
      }

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

  // Applies variant/armrest selection to the loaded model. Runs for every variant in CHAIR_PARTS
  useEffect(() => {
    if (!loaded) return;

    for (const [variantKey, parts] of Object.entries(partsRef.current)) {
      const isActiveVariant = variantKey === variant;
      parts.root.visible = isActiveVariant;
      if (!isActiveVariant) continue;

      parts.standardArmrest.visible = armrestOption === "standard";
      parts.singleArmrest.visible = armrestOption === "single";
      parts.noArmrest.visible = armrestOption === "none";

      // Cushion height depends on the armrest variant (see model.md).
      // No armrest means no armrest cushion either.
      parts.standardCushion.visible = armrestOption === "standard";
      parts.singleCushion.visible = armrestOption === "single";
    }
  }, [variant, armrestOption, loaded]);

  // Switches every upholstery mesh, across both variants, to the GLB's
  // baked-in material variant for the selected material/color (e.g.
  // "fabric_cream" — see model.md section 6) so the choice survives
  // switching variant/armrest afterwards.
  useEffect(() => {
    if (!loaded || !selectVariantRef.current) return;

    const variantName = `${material}_${color}`;
    for (const [, parts] of Object.entries(partsRef.current)) {
      for (const partKey of UPHOLSTERY_PARTS) {
        const mesh = parts[partKey];
        if (mesh) {
          selectVariantRef.current(mesh, variantName, false);
        }
      }
    }
  }, [material, color, loaded]);

  useEffect(() => {
    // Guard
    if (
      !dimensionPlatesRef.current?.ES104 ||
      !dimensionPlatesRef.current?.ES108
    ) {
      return;
    }

    // If ruler is activated - show dimensions for current variant
    const anyVisible = Object.values(dimensionPlatesRef.current)
      .flat()
      .some((plate) => plate.group.visible);
    applyRulerVisibility(anyVisible, variant);
  }, [variant]);

  return (
    <div className={styles.wrapper}>
      <article ref={containerRef} className={styles.container} />
      {!loaded && (
        <div className={styles.loadingOverlay}>
          <img
            src={loadingIcon}
            alt="Loading model"
            className={styles.loadingIcon}
          />
        </div>
      )}
    </div>
  );
});

export default ChairModel;
