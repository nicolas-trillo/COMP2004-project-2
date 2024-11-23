import ProductCard from "./ProductCard";
export default function ProductsContainer({ 
    products, 
    onAddToCart, 
    onQuantityChange, 
    handleDelete, 
    setIsEditing,

    isEditing,
    formData,
    handleOnChange,
    handleOnSubmit,
    register,
    handleSubmit,
    errors,
}) {
    return (<div className="products-container">
        {products.map((product, index) => (
            <ProductCard 
                key={index}
                item={product}
                onAddToCart={onAddToCart}
                setIsEditing={setIsEditing}
                onQuantityChange={onQuantityChange}
                handleDelete={handleDelete}

                formData={formData}
                handleOnChange={handleOnChange}
                handleOnSubmit={handleOnSubmit}
                isEditing={isEditing}
                register={register}
                handleSubmit={handleSubmit}
                errors={errors}
            />
        ))}
    </div>);
}