import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EXRLoader } from "three/examples/jsm/Addons.js";

export function useSceneSetup(containerRef, photoStudio) {
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [scene, setScene] = useState(null);
  const controlsRef = useRef(null); // For useRaycastInteraction hook!
  const dirRef = useRef(null); // For useCameraControl hook

  const initialized = useRef(false);

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
    camera.position.set(0, 1, 1.5); // COULD NEED ADJUSTMENT WHEN PERMANENT OBJECT IS UP
    setCamera(camera);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    // Without tone mapping so IBL reflections don't clip straight to white
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.7;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    setRenderer(renderer);

    // Environment map so metallic/chrome parts have something to reflect -
    // without it PBR metals render near-black under direct lights alone.
    // A higher blur (sigma) keeps reflections soft instead of mirror-sharp hotspots.
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    // Fallback env map so metals aren't black while the HDRI streams in
    scene.environment = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04,
    ).texture;

    // Lightning
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dir = new THREE.DirectionalLight(0xffffff, 0);
    scene.add(dir);
    scene.add(dir.target);
    dirRef.current = dir; // For useCameraControl hook

    new EXRLoader().load(
      photoStudio,
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        scene.environment = envMap;
        texture.dispose();
        pmremGenerator.dispose();
      },
      undefined,
      (error) => console.error("Failed to load HDRI environment:", error),
    );

    setScene(scene);
  }, []);

  return {
    scene,
    camera,
    renderer,
    controlsRef,
    dirRef,
  };
}
