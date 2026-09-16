import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { CHAIR_URL } from "../config/models";
import GLTFMaterialsVariantsExtension from "three-gltf-extensions/loaders/KHR_materials_variants/KHR_materials_variants.js";
import styles from "./Object.module.css";
import loadingIcon from "../assets/loading-icon.gif";
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
import { useResizeObserver } from "./hooks/useResizeObserver";

// Helper
import { UPHOLSTERY_PARTS, CHAIR_PARTS } from "./helpers/chair-config";

const ChairModel = forwardRef(function ChairModel(
  { variant, armrestOption = "standard", material = "fabric", color = "cream" },
  ref,
) {
  const containerRef = useRef(null);
  const dimensionPlatesRef = useRef({});
  const rulerMeshesRef = useRef({});
  const cameraRef = useRef(null);
  const boundingBoxRef = useRef(null);
  const [showRuler, setShowRuler] = useState(false);
  const [containerEl, setContainerEl] = useState(null);
  const gltfRef = useRef(null); // For useDimensions hook

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

  // Hook: useResizeObserver
  useResizeObserver(containerRef, scene, camera, renderer);

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

  // Hook: useBoundingBox + updated useVariantVisibility
  useVariantVisibility(partsRef, variant, armrestOption, loaded);
  useBoundingBox(partsRef, variant, loaded, boundingBoxRef);

  // Switches every upholstery mesh, across both variants, to the GLB's
  // baked-in material variant for the selected material/color (e.g.
  // "fabric_cream" — see model.md section 6) so the choice survives
  // switching variant/armrest afterwards.
  // Hook: useMaterialVariant
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

  // PresetAngles hook
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
