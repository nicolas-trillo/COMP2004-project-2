import "./App.css";
import products from "./data/products";
import GroceriesAppContainer from "./Components/GroceriesAppContainer";

function App() {
    return <>
        <GroceriesAppContainer data={products}/>
    </>;
}

export default App;
