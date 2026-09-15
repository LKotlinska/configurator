import styles from "./Navigator.module.css";

export default function Navigator({ total, activeIndex, onSelect }) {
  return (
    <nav className={styles.navigator}>
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          className={`${styles.dot} ${
            index === activeIndex ? styles.active : ""
          }`}
          onClick={() => onSelect(index)}
          aria-label={`Go to slide ${index + 1}`}
          aria-current={index === activeIndex}
        />
      ))}
    </nav>
  );
}
