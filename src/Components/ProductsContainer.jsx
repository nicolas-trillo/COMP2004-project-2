import ProductCard from "./ProductCard";
export default function ProductsContainer({ products, onAddToCart, onQuantityChange }) {
    return (<div className="products-container">
        {products.data.map((product, index) => (
            <ProductCard 
                key={index}
                item={product}
                amount={product.amount || 0}
                onAddToCart={onAddToCart}
                onQuantityChange={onQuantityChange}
            />
        ))}
    </div>);
}