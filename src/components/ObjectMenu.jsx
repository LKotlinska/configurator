import styles from "./ObjectMenu.module.css";
import { useState } from "react";

export default function ObjectMenu({
  onAngleSelect,
  showConfig,
  onToggle,
  onRulerToggle,
  onShow2D,
}) {
  const [showAngles, setShowAngles] = useState(false);
  const [showRuler, setShowRuler] = useState(false);

  function toggleAngles() {
    setShowAngles((prev) => !prev);
  }

  function handleShowRuler() {
    setShowRuler(true);
    onRulerToggle?.(true);
  }

  function handleHideRuler() {
    setShowRuler(false);
    onRulerToggle?.(false);
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
            <img
              src="/icons/angle1.png"
              className={styles.angle1}
              onClick={() => onAngleSelect?.("angle1")}
            />
            <img
              src="/icons/angle2.png"
              className={styles.angle2}
              onClick={() => onAngleSelect?.("angle2")}
            />
            <img
              src="/icons/angle3.png"
              className={styles.angle3}
              onClick={() => onAngleSelect?.("angle3")}
            />
          </>
        )}
      </article>

      {/* Ruler menu */}
      <article className={styles.rulerMenu}>
        {!showRuler && (
          <img
            src="/icons/showRuler.png"
            className={styles.showRuler}
            onClick={handleShowRuler}
          />
        )}

        {showRuler && (
          <img
            src="/icons/removeRuler.png"
            className={styles.removeRuler}
            onClick={handleHideRuler}
          />
        )}
      </article>

      {/* Fullscreen menu */}
      <article className={styles.screenMenu}>
        {!showConfig ? (
          <img src="/icons/openFullscreen2.png" onClick={onToggle} />
        ) : (
          <img src="/icons/closeFullscreen2.png" onClick={onToggle} />
        )}
      </article>

      {/* Redirect to slideshow */}
      <article className={styles.imgMenu}>
        <img src="/icons/2D.png" onClick={() => onShow2D?.()} />
      </article>
    </section>
  );
}
