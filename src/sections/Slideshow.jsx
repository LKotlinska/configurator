import { useState, forwardRef } from "react";
import styles from "./Slideshow.module.css";
import Navigator from "../components/Navigator";

const images = [
  "./environment/01chair.png",
  "./environment/02chair.png",
  "./environment/03chair.png",
  "./environment/04chair.png",
  "./environment/05chair.png",
  "./environment/06chair.png",
  "./environment/07chair.png",
  "./environment/08chair.png",
  "./environment/09chair.png",
  "./environment/010chair.png",
];

const Slideshow = forwardRef(function Slideshow({ showConfig }, ref) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <section ref={ref} className={styles.slideshowContainer}>
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
});

export default Slideshow;
