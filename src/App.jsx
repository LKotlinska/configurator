import { useState, useRef } from "react";
import "./App.css";
import ModelBlock from "./sections/ModelBlock";
import ProductBlock from "./sections/ProductBlock";
import Slideshow from "./sections/Slideshow";

function App() {
  const [showConfig, setShowConfig] = useState(true);
  const [variant, setVariant] = useState("ES104");
  const slideshowRef = useRef(null);

  function scrollToSlideshow() {
    slideshowRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <main className="divider">
        <div className={`content ${showConfig ? "" : "content--expanded"}`}>
          <ModelBlock
            variant={variant}
            showConfig={showConfig}
            onToggle={() => setShowConfig(!showConfig)}
            onShow2D={scrollToSlideshow}
          />
          <Slideshow showConfig={showConfig} ref={slideshowRef} />
        </div>
        <ProductBlock
          variant={variant}
          onVariantChange={setVariant}
          showConfig={showConfig}
          onToggle={() => setShowConfig(!showConfig)}
        />
      </main>
    </>
  );
}

export default App;
