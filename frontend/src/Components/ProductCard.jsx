import QuantityCounter from "./QuantityCounter"
import ProductForm from "./ProductForm"
import accounting from "accounting"
export default function ProductCard({
    item, 
    onAddToCart, 
    onQuantityChange, 
    isEditing,
    formData,
    handleOnChange,
    handleOnSubmit,
    register,
    handleSubmit,
    errors,
    handleDelete
}) {
    return <div className="product-card">
        <h3>{item.productName}</h3>
        <img src={item.image} alt={item.name} />
        <b>${accounting.unformat(item.price)}</b>
        <div className="item-controls vstack">
            <QuantityCounter qty={item.amount} setQty={(qty) => onQuantityChange(item.id, qty)} />
            <button onClick={() => onAddToCart(item, item.amount)}>Add to Cart</button>
        </div>
        <div className="item-controls vstack">
            <ProductForm 
                formData={formData}
                handleOnChange={handleOnChange}
                handleOnSubmit={handleOnSubmit}
                isEditing={isEditing}
                register={register}
                handleSubmit={handleSubmit}
                errors={errors}
            />
            <button onClick={() => handleDelete(item._id)} className="bad-btn">Delete</button>
            {/* <button onClick={() => handleEdit(item._id)}>Edit</button> */}
        </div>
    </div>
}