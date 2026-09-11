import styles from "./ModelBlock.module.css";
import Chair from "../3D-components/Object";
import ObjectMenu from "../components/ObjectMenu";

export default function ModelBlock() {
  return (
    <section className={styles.modelBlock}>
      <h2>3d model will be displayed here</h2>
      <Chair />
      <img src="/rotationIcon.png" className={styles.rotationIcon} />
      <ObjectMenu />
    </section>
  );
}
