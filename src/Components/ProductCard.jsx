import QuantityCounter from "./QuantityCounter"
export default function ProductCard({item, amount, onAddToCart, onQuantityChange}) {
    return <div className="product-card">
        <h3>{item.productName}</h3>
        <img src={item.image} alt={item.name} />
        <b>{item.price}</b>
        <div className="item-controls vstack">
            <QuantityCounter qty={amount} setQty={(qty) => onQuantityChange(item.id, qty)} />
            <button onClick={() => onAddToCart(item, amount)}>Add to Cart</button>
        </div>
    </div>
}