import "./App.css";
import ModelBlock from "./sections/ModelBlock";
import ProductBlock from "./sections/ProductBlock";
import Navigator from "./components/Navigator";

function App() {
  return (
    <>
      <main className="divider">
        <ModelBlock />
        <ProductBlock />
        <Navigator />
      </main>
    </>
  );
}

export default App;
