import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { CHAIR_URL } from "../config/models";

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

function Chair({ variant, armrestOption = "standard" }) {
  const containerRef = useRef(null);
  const initialized = useRef(false);

  // Populated on load as { ES104: { root, base, standardArmrest, ... }, ES108: {...} }
  const partsRef = useRef({});

  const [loaded, setLoaded] = useState(false);

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
    camera.position.set(0, 1, 3);

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
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lightning
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dir = new THREE.DirectionalLight(0xffffff, 1);
    dir.position.set(5, 10, 5);
    scene.add(dir);

    // Loader

    const loader = new GLTFLoader();
    loader.load(
      CHAIR_URL, // Link to file on vercel blob
      (gltf) => {
        const model = gltf.scene;

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
      renderer.render(scene, camera);
    }
    animate();

    // Keeps size in sync with the container, including layout-only
    // changes (e.g. flex resizing) that don't fire a window resize event
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

      // Cushion height depends on the armrest variant (see model.md):
      // the single cushion pairs with both the single-armrest and no-armrest looks.
      parts.standardCushion.visible = armrestOption === "standard";
      parts.singleCushion.visible = armrestOption !== "standard";
    }
  }, [variant, armrestOption, loaded]);


  return (
    <article ref={containerRef} style={{ width: "100%", height: "100%" }} />
  );
}

export default Chair;
