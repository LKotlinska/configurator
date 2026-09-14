import { useState } from "react";
import "./App.css";
import ModelBlock from "./sections/ModelBlock";
import ProductBlock from "./sections/ProductBlock";
import Navigator from "./components/Navigator";

function App() {
  const [showConfig, setShowConfig] = useState(true);

  return (
    <>
      <main className="divider">
        <div className={`content ${showConfig ? "" : "content--expanded"}`}>
          <ModelBlock/>
          <img className={showConfig ? 'img--collapsed' : 'img--expanded'} src="./src/assets/test-img.webp"></img>
        </div>
        <ProductBlock showConfig={showConfig} onToggle={() => setShowConfig(!showConfig)}/>
        <Navigator />
      </main>
    </>
  );
}

export default App;
