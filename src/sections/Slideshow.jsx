import { useState } from "react";
import styles from "./Slideshow.module.css";
import Navigator from "../components/Navigator";

const images = [
  "./environment/01_chair.png",
  "./environment/02_chair.png",
  "./environment/03_chair.png",
  "./environment/04_chair.png",
  "./environment/05_chair.png",
  "./environment/06_chair.png",
  "./environment/07_chair.png",
  "./environment/08_chair.png",
  "./environment/09_chair.png",
  "./environment/010_chair.png",
];

function Slideshow({ showConfig }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className={styles.slideshowContainer}>
      <img
        className={`${styles.environmentImage} ${showConfig ? styles["img--collapsed"] : styles["img--expanded"]}`}
        src={images[activeIndex]}
        alt=""
      />

      <img
        src="/icons/LeftArrow.png"
        className={`${styles.arrows} ${styles.leftArrow}`}
        onClick={goToPrevious}
        aria-label="Previous image"
      />
      <img
        src="/icons/RightArrow.png"
        className={`${styles.arrows} ${styles.rightArrow}`}
        onClick={goToNext}
        aria-label="Next image"
      />
      <article className={styles.navPosition}>
        <Navigator
          total={images.length}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />
      </article>
    </section>
  );
}

export default Slideshow;
