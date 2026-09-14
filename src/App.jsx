import "./App.css";
import ModelBlock from "./sections/ModelBlock";
import ProductBlock from "./sections/ProductBlock";
import Navigator from "./components/Navigator";
import { useState } from "react";

function App() {
  const [ variant, setVariant ] = useState("ES104");
  return (
    <>
      <main className="divider">
        <ModelBlock variant={variant} />
        <ProductBlock />
        <Navigator />
      </main>
    </>
  );
}

export default App;
