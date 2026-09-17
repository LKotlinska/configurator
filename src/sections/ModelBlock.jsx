import { useRef } from "react";
import styles from "./ModelBlock.module.css";
import ChairModel from "../3D-components/ChairModel";
import ObjectMenu from "../components/ObjectMenu";

export default function ModelBlock({
  variant,
  armrestOption,
  material,
  color,
  showConfig,
  onToggle,
  onShow2D,
}) {
  const chairRef = useRef(null);

  function handleAngleSelect(key) {
    chairRef.current?.goToPreset(key);
  }

  function toggleRuler(visible) {
    chairRef.current?.setRulerVisible(visible, variant);
  }

  return (
    <section className={styles.modelBlock}>
      <ChairModel
        ref={chairRef}
        variant={variant}
        armrestOption={armrestOption}
        material={material}
        color={color}
      />
      <img src="/rotationIcon.png" className={styles.rotationIcon} />
      <ObjectMenu
        onAngleSelect={handleAngleSelect}
        onRulerToggle={toggleRuler}
        showConfig={showConfig}
        onToggle={onToggle}
        onShow2D={onShow2D}
      />
    </section>
  );
}
