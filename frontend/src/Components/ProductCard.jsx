import QuantityCounter from "./QuantityCounter";
import ProductForm from "./ProductForm";
import accounting from "accounting";
export default function ProductCard({
    item,
    onAddToCart,
    onQuantityChange,
    handleDelete,
    handleEdit,
}) {
    return (
        <div className="product-card">
            <h3>{item.productName}</h3>
            <img src={item.image} alt={item.name} />
            <b>${accounting.unformat(item.price)}</b>
            <div className="item-controls vstack">
                <QuantityCounter
                    qty={item.amount}
                    setQty={(qty) => onQuantityChange(item.id, qty)}
                />
                <button onClick={() => onAddToCart(item, item.amount)}>
                    Add to Cart
                </button>
            </div>
            <div className="item-controls vstack">
                <button onClick={() => handleEdit(item)}>
                    Edit
                </button>
                <button
                    onClick={() => handleDelete(item._id)}
                    className="bad-btn"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
