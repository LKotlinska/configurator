import styles from "./ObjectMenu.module.css";
import { useState } from "react";

export default function ObjectMenu() {
  const [showAngles, setShowAngles] = useState(false);
  const [showRuler, setShowRuler] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  function toggleAngles() {
    setShowAngles((prev) => !prev);
  }

  return (
    <section className={styles.objectMenu}>
      {/* Angle menu */}
      <article className={styles.angleMenu}>
        <img
          src="/icons/angleMenu.png"
          className={styles.angleMenuIcon}
          onClick={toggleAngles}
        />

        {showAngles && (
          <>
            <img src="/icons/angle1.png" className={styles.angle1} />
            <img src="/icons/angle2.png" className={styles.angle2} />
            <img src="/icons/angle3.png" className={styles.angle3} />
          </>
        )}
      </article>

      {/* Ruler menu */}
      <article className={styles.rulerMenu}>
        {!showRuler && (
          <img
            src="/icons/showRuler.png"
            className={styles.showRuler}
            onClick={() => setShowRuler(true)}
          />
        )}

        {showRuler && (
          <img
            src="/icons/removeRuler.png"
            className={styles.removeRuler}
            onClick={() => setShowRuler(false)}
          />
        )}
      </article>

      {/* Fullscreen menu */}
      <article className={styles.screenMenu}>
        {!isFullscreen && (
          <img
            src="/icons/openFullscreen.png"
            className={styles.openFullscreen}
            onClick={() => setIsFullscreen(true)}
          />
        )}

        {isFullscreen && (
          <img
            src="/icons/closeFullscreen.png"
            className={styles.closeFullscreen}
            onClick={() => setIsFullscreen(false)}
          />
        )}
      </article>
    </section>
  );
}
