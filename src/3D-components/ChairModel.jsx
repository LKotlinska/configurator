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
import { createDimension } from "./helpers/createDimension";
import GLTFMaterialsVariantsExtension from "three-gltf-extensions/loaders/KHR_materials_variants/KHR_materials_variants.js";
import styles from "./Object.module.css";
import loadingIcon from "../assets/loading-icon.gif";
import { EXRLoader } from "three/examples/jsm/Addons.js";
import photoStudio from "../assets/3d_assets/brown_photostudio_02_2k.exr";

// IMPORT HOOKS
import { useScreenSpaceTag } from "./hooks/useScreenSpaceTag";
import { useVariantVisibility } from "./hooks/useVariantVisibility";
import { useMaterialVariant } from "./hooks/useMaterialVariant";
import { useBoundingBox } from "./hooks/useBoundingBox";
import { useRaycastInteraction } from "./hooks/useRaycastInteraction";
import { usePresetAngles } from "./hooks/usePresetAngles";
import { useCameraControls } from "./hooks/useCameraControls";
import { useSceneSetup } from "./hooks/useSceneSetup";
import { useDimensions } from "./hooks/useDimensions";
import { useAnimationLoop } from "./hooks/useAnimationLoop";

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
  //   const initialized = useRef(false);
  const dimensionPlatesRef = useRef({});
  const rulerMeshesRef = useRef({});
  const cameraRef = useRef(null);
  const boundingBoxRef = useRef(null);
  const [showRuler, setShowRuler] = useState(false);
  //   const [camera, setCamera] = useState(null);
  const [containerEl, setContainerEl] = useState(null);
  const gltfRef = useRef(null); // For useDimensions hook
  //   const controlsRef = useRef(null); // For useRaycastInteraction hook!
  //   const [renderer, setRenderer] = useState(null); // For useRaycastInteraction hook!
  //   const dirRef = useRef(null); // For useCameraControl hook

  // Scene setup hook
  const { scene, camera, renderer, controlsRef, dirRef } = useSceneSetup(
    containerRef,
    photoStudio,
  );

  // Hook: useDimensions
  useDimensions(scene, gltfRef.current, dimensionPlatesRef, rulerMeshesRef);

  // cameraRef must be updated so other hooks works
  cameraRef.current = camera;

  // Camera control hook
  const updateLightRef = useCameraControls(
    camera,
    renderer,
    controlsRef,
    dirRef.current,
  );

  // Hook: useAnimationLoop
  useAnimationLoop(
    scene,
    camera,
    renderer,
    controlsRef,
    updateLightRef,
    dimensionPlatesRef,
  );

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
    setRulerVisible: (visible, variantKey) => {
      (setShowRuler(visible), applyRulerVisibility(visible, variantKey));
    },
  }));

  // Model Loader
  useEffect(() => {
    if (!scene || !camera || !renderer) return;

    const container = containerRef.current;
    if (!container) return;
    setContainerEl(container);

    // Loader
    const loader = new GLTFLoader();
    loader.register((parser) => new GLTFMaterialsVariantsExtension(parser));
    loader.load(
      CHAIR_URL, // Link to file on vercel blob
      (gltf) => {
        gltfRef.current = gltf; // For useDimensions hook
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
        camera.position.y += center.y - controlsRef.current.target.y;
        controlsRef.current.target.y = center.y;
        controlsRef.current.update();
      },
      undefined,
      (error) => {
        console.error("COULD NOT LOAD GLB:", error);
      },
    );

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

    return () => {
      //   cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, [scene, camera, renderer]);

  useEffect(() => {
    // Guard
    if (
      !dimensionPlatesRef.current?.ES104 ||
      !dimensionPlatesRef.current?.ES108
    ) {
      return;
    }

    // If ruler is activated - show dimensions for current variant
    applyRulerVisibility(showRuler, variant);
  }, [variant, showRuler, loaded]);

  // Unit scrren tag - append to the object's screen-bounding-box, allows tag to always follow upper right corner
  const tagRef = useScreenSpaceTag(camera, containerEl, boundingBoxRef, {
    x: 12,
    y: -12,
  });

  // -------------------- Hook: useBoundingBox + updated useVariantVisibility - check!
  useVariantVisibility(partsRef, variant, armrestOption, loaded);
  useBoundingBox(partsRef, variant, loaded, boundingBoxRef);

  // -------------------- Hook: useMaterialVariant - check!
  // Switches every upholstery mesh, across both variants, to the GLB's
  // baked-in material variant for the selected material/color (e.g.
  // "fabric_cream" — see model.md section 6) so the choice survives
  // switching variant/armrest afterwards.
  useMaterialVariant(
    partsRef,
    selectVariantRef,
    material,
    color,
    loaded,
    UPHOLSTERY_PARTS,
  );

  // RaycastInteraction hook - "user must click the object to rotate"
  useRaycastInteraction(camera && renderer, camera, modelRef, controlsRef);

  //   PresetAngles hook
  usePresetAngles(camera, controlsRef.current, goToPresetRef);

  return (
    <div className={styles.wrapper}>
      <article ref={containerRef} className={styles.container}>
        {showRuler && (
          <div ref={tagRef} className={styles.unitTag}>
            [cm]
          </div>
        )}
      </article>
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
