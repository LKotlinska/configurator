import { useEffect, useRef } from "react";

export function useAnimationLoop(
  scene,
  camera,
  renderer,
  controlsRef,
  updateLightRef,
  dimensionPlatesRef,
) {
  const frameRef = useRef(null);

  useEffect(() => {
    if (!scene || !camera || !renderer) return;

    // Append animation
    function animate() {
      frameRef.current = requestAnimationFrame(animate);

      controlsRef.current?.update();
      updateLightRef.current?.();

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

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, [scene, camera, renderer]);
}
