import { useState } from "react";
import "./App.css";
import ModelBlock from "./sections/ModelBlock";
import ProductBlock from "./sections/ProductBlock";

function App() {
  const [showConfig, setShowConfig] = useState(true);

  return (
    <>
      <main className="divider">
        <div className={`content ${showConfig ? "" : "content--expanded"}`}>
          <ModelBlock/>
        </div>
        <ProductBlock showConfig={showConfig} onToggle={() => setShowConfig(!showConfig)}/>
      </main>
    </>
  );
}

export default App;
