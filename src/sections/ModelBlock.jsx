import styles from "./ModelBlock.module.css";
import Chair from "../3D-components/Object";

export default function ModelBlock() {
  return (
    <section className={styles.modelBlock}>
      <Chair />
    </section>
  );
}
