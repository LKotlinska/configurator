import { useState } from "react";
import "./App.css";
import ModelBlock from "./sections/ModelBlock";
import ProductBlock from "./sections/ProductBlock";
import Slideshow from "./sections/Slideshow";

function App() {
  const [showConfig, setShowConfig] = useState(true);
  const [variant, setVariant] = useState("ES104");

  return (
    <>
      <main className="divider">
        <div className={`content ${showConfig ? "" : "content--expanded"}`}>
          <ModelBlock
            variant={variant}
            showConfig={showConfig}
            onToggle={() => setShowConfig(!showConfig)}
          />
          <Slideshow showConfig={showConfig} />
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
