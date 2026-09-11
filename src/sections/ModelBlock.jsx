import styles from "./ModelBlock.module.css";
import Preview from "../3D-components/preview";
import Chair from "../3D-components/Object";

export default function ModelBlock() {
  return (
    <section className={styles.modelBlock}>
      <h2>3d model will be displayed here</h2>
      {/* <Preview /> */}
      <Chair />
    </section>
  );
}
