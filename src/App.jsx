import { useState } from "react";
import "./App.css";
import ModelBlock from "./sections/ModelBlock";
import ProductBlock from "./sections/ProductBlock";
import Navigator from "./components/Navigator";

function App() {
  const [showConfig, setShowConfig] = useState(true);
  const [ variant, setVariant ] = useState("ES104");
  const [ armrestOption, setArmrestOption ] = useState("standard");
  const [ material, setMaterial ] = useState("fabric");
  const [ color, setColor ] = useState("cream");

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
          />
          <img
            className={`environmentImage ${showConfig ? "img--collapsed" : "img--expanded"}`}
            src="./src/assets/test-img.webp"
          ></img>
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
        <Navigator />
      </main>
    </>
  );
}

export default App;
