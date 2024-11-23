import CartCard from "./CartCard";
export default function CartContainer({cartItems, onQuantityChange, onCartItemRemove, onCartEmpty, itemsTotal}) {
    // returns visual cart list with empty cart message if cart list is empty.
    if (cartItems.length !== 0) return <div className="cart-bg">
        <div className="cart-container">
            <div className="cart-item">
                <h3>Cart</h3>
            </div>
            {cartItems.map((cartItem, index) => (
                <CartCard item={cartItem}
                    key={index}
                    onQuantityChange={onQuantityChange}
                    onCartItemRemove={onCartItemRemove}
                />
            ))}
            <div className="cart-item vstack">
                <button className="good-btn vstack">
                    <p>Checkout:</p>
                    <p>${itemsTotal}</p>
                </button>
                <button className="bad-btn" onClick={onCartEmpty}>Empty cart</button>
            </div>
        </div>
    </div>;
    else return <div className="cart-bg">
        <div className="cart-container">
            <div className="cart-item">
                <h3>Cart</h3>
            </div>
            <div className="cart-item">
                <p>The cart is empty</p>
            </div>
        </div>
    </div>
}