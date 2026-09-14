import { useRef } from "react";
import styles from "./ModelBlock.module.css";
import Chair from "../3D-components/Object";
import ObjectMenu from "../components/ObjectMenu";

export default function ModelBlock({ variant }) {
  const chairRef = useRef(null);

  function handleAngleSelect(key) {
    chairRef.current?.goToPreset(key);
  }

  return (
    <section className={styles.modelBlock}>
      <h2>3d model will be displayed here</h2>
      <Chair ref={chairRef} variant={variant}/>
      <img src="/rotationIcon.png" className={styles.rotationIcon} />
      <ObjectMenu onAngleSelect={handleAngleSelect} />
    </section>
  );
}
