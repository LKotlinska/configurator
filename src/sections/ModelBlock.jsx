import styles from "./ModelBlock.module.css";
import Preview from "../3D-components/preview";

export default function ModelBlock() {
  return (
    <section className={styles.modelBlock}>
      <Preview />
    </section>
  );
}
