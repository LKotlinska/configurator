import { useState } from "react";
import "./App.css";
import ModelBlock from "./sections/ModelBlock";
import ProductBlock from "./sections/ProductBlock";
import Navigator from "./components/Navigator";

function App() {
  const [showConfig, setShowConfig] = useState(true);
  const [ variant, setVariant ] = useState("ES104");

  return (
    <>
      <main className="divider">
        <div className={`content ${showConfig ? "" : "content--expanded"}`}>
          <ModelBlock variant={variant} />
          <img 
            className={showConfig ? 'img--collapsed' : 'img--expanded'} 
            src="./src/assets/test-img.webp"
          />
        </div>
        <ProductBlock 
          variant={variant} 
          onVariantChange={setVariant} 
          showConfig={showConfig} 
          onToggle={() => setShowConfig(!showConfig)}/>
        <Navigator />
      </main>
    </>
  );
}

export default App;
