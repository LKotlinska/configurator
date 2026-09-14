import styles from "./ModelBlock.module.css";
import Chair from "../3D-components/Object";

export default function ModelBlock({ variant }) {
  return (
    <section className={styles.modelBlock}>
      <Chair variant={variant} />
      <img src="/rotationIcon.png" className={styles.rotationIcon} />
    </section>
  );
}
