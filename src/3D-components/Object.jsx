import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { CHAIR_URL } from "../config/models";

function Chair({ variant } ) {
  const containerRef = useRef(null);
  const initialized = useRef(false);

  // Model parts, exposed outside the effect via refs
  const model_104 = useRef(null);
  const model_108 = useRef(null);
  const armFrameRef = useRef(null);
  const armCushionRef = useRef(null);
  const chairBodyRef = useRef(null);
  const legsRef = useRef([]);

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
    container.appendChild(renderer.domElement);

    // Lightning
    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const dir = new THREE.DirectionalLight(0xffffff, 2);
    dir.position.set(5, 10, 5);
    scene.add(dir);

    // Loader

    const loader = new GLTFLoader();
    loader.load(
      CHAIR_URL, // Link to file on vercel blob
      (gltf) => {
        const model = gltf.scene;
        // Main models
        model_104.current = model.getObjectByName("Chair_ES104_Root");
        model_108.current = model.getObjectByName("Chair_ES108_Root");

        armFrameRef.current = model.getObjectByName("arm_frame");
        armCushionRef.current = model.getObjectByName("arm_cushion");
        chairBodyRef.current = model.getObjectByName("body");

        const legsGroup = model.getObjectByName("bottom_leg_1");
        legsRef.current = legsGroup ? legsGroup.children : [];

        scene.add(model);
        setLoaded(true);

        // --------------- TEST!!! Toggle material to "Blue" ---------------
        gltf.parser.getDependency("material", 0).then((blueMaterial) => {
          model.traverse((obj) => {
            if (obj.isMesh) {
              obj.material = blueMaterial;
            }
          });
        });
        // ---------------  TEST END!!! ---------------
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

  // Listens to viariant prop for changes, and re-applies once the model finishes loading
  useEffect(() => {
    if (!model_104.current || !model_108.current) return;
    model_104.current.visible = variant === "ES104";
    model_108.current.visible = variant === "ES108";
  }, [variant, loaded]);


  return (
    <article ref={containerRef} style={{ width: "100%", height: "100%" }} />
  );
}

export default Chair;
