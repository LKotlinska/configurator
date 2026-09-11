import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function Chair() {
  const containerRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const container = containerRef.current;
    if (!container) return;

    // Set sizes
    const width = container.clientWidth || window.innerWidth / 2;
    const height = container.clientHeight || window.innerHeight;

    // Create scene
    const scene = new THREE.Scene();

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
    let model;
    const loader = new GLTFLoader();
    loader.load(
      "/chairTest2.glb",
      //   "/chair-v3.glb",
      (gltf) => {
        // console.log(gltf);
        model = gltf.scene;
        scene.add(model);

        // TEST!!! Toggle material to "Blue"
        gltf.parser.getDependency("material", 0).then((blueMaterial) => {
          model.traverse((obj) => {
            if (obj.isMesh) {
              obj.material = blueMaterial;
            }
          });
        });
        // TEST END!!!

        const textures = [];

        // --- TRAVERSE ---
        model.traverse((obj) => {
          // Unpack textures
          if (!obj.isMesh && !obj.material) return;

          const mat = obj.material;

          ["map", "normalMap", "roughnessMap", "metalnessMap"].forEach(
            (key) => {
              const tex = mat[key];
              if (tex && tex.isTexture) {
                textures.push({
                  mesh: obj.name,
                  material: mat.name,
                  type: key,
                  textureName: tex.name,
                  uuid: tex.uuid,
                });
              }
            },
          );
        });

        // Traverse to see all materials
        const allMaterials = new Set();
        model.traverse((obj) => {
          if (obj.isMesh && obj.material) {
            allMaterials.add(obj.material);
          }
        });
        console.log(
          "RAW MATERIALS IN FILE:",
          JSON.stringify(gltf.parser.json.materials, null, 2),
        );
        console.log("EXTENSIONS USED:", gltf.parser.json.extensionsUsed);
        console.log(
          "MESHES:",
          JSON.stringify(gltf.parser.json.meshes, null, 2),
        );

        console.log("Extensions used:", gltf.parser.json.extensionsUsed);
        console.log(
          "Variants ext:",
          gltf.userData.gltfExtensions?.["KHR_materials_variants"],
        );
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
  }, []);

  return (
    <article ref={containerRef} style={{ width: "50vw", height: "100vh" }} />
  );
}

export default Chair;
