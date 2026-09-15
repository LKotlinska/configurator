import { useState } from "react";
import styles from "./Slideshow.module.css";

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
    <div className={styles.slideshowContainer}>
      <img
        className={`${styles.environmentImage} ${showConfig ? styles["img--collapsed"] : styles["img--expanded"]}`}
        src={images[activeIndex]}
        alt=""
      />
      {images.length > 1 && (
        <>
          <button
            className="environmentSlideshow__arrow environmentSlideshow__arrow--prev"
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            className="environmentSlideshow__arrow environmentSlideshow__arrow--next"
            onClick={goToNext}
            aria-label="Next image"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}

export default Slideshow;
