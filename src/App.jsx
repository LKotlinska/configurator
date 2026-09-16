import { useState, useRef } from "react";
import "./App.css";
import ModelBlock from "./sections/ModelBlock";
import ProductBlock from "./sections/ProductBlock";
import Slideshow from "./sections/Slideshow";

function App() {
  const [showConfig, setShowConfig] = useState(true);
  const [ variant, setVariant ] = useState("ES104");
  const [ armrestOption, setArmrestOption ] = useState("standard");
  const [ material, setMaterial ] = useState("fabric");
  const [ color, setColor ] = useState("cream");
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
            armrestOption={armrestOption}
            material={material}
            color={color}
            showConfig={showConfig}
            onToggle={() => setShowConfig(!showConfig)}
            onShow2D={scrollToSlideshow}
          />
          <Slideshow showConfig={showConfig} ref={slideshowRef} />
        </div>
        <ProductBlock
          variant={variant}
          onVariantChange={setVariant}
          armrestOption={armrestOption}
          onArmrestChange={setArmrestOption}
          material={material}
          onMaterialChange={setMaterial}
          color={color}
          onColorChange={setColor}
          showConfig={showConfig}
          onToggle={() => setShowConfig(!showConfig)}
        />
      </main>
    </>
  );
}

export default App;
