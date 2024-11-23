import ProductCard from "./ProductCard";
export default function ProductsContainer({
    products,
    onAddToCart,
    onQuantityChange,
    handleDelete,
    handleEdit,
}) {
    return (
        <div className="products-container">
            {products.map((product, index) => (
                <ProductCard
                    key={index}
                    item={product}
                    onAddToCart={onAddToCart}
                    onQuantityChange={onQuantityChange}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                />
            ))}
        </div>
    );
}
