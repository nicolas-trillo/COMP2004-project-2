import { accounting } from "accounting"
import QuantityCounter from "./QuantityCounter"
export default function CartCard({item, onQuantityChange, onCartItemRemove}) {
    return <div className="cart-item">
        <div className="hstack">
            <div className="vstack item-details">
                <p>{item.productName}</p>
                <p>{item.price}</p>
                <img src={item.image} alt={item.productName} />
                <div className="item-controls">
                    <QuantityCounter qty={item.amount} setQty={(qty) => onQuantityChange(item.id, qty, true)} />
                </div>
            </div>
            <div className="vstack item-total">
                <h3>Total: ${accounting.toFixed(accounting.unformat(item.price)*item.amount, 2)}</h3>
                <button onClick={() => onCartItemRemove(item.id)} className="bad-btn">Remove</button>
            </div>
        </div>
    </div>
}