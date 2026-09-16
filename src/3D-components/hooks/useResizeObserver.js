import { useEffect } from "react";

// Keeps size in sync with the container, including layout-only changes
export function useResizeObserver(containerRef, scene, camera, renderer) {
  useEffect(() => {
    const container = containerRef.current;

    // Guard: wait until everything exists
    if (!container || !scene || !camera || !renderer) return;

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

    return () => resizeObserver.disconnect();
  }, [containerRef, scene, camera, renderer]);
}
