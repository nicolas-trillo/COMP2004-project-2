import { useState } from "react";
import NavBar from "./NavBar";
import ProductsContainer from "./ProductsContainer";
import CartContainer from "./CartContainer";
import products from "../data/products";

// provides methods to work with formatted
// currency strings, suck as unformat, and
// toFixed.
import { accounting } from "accounting";

// GroceriesAppContainer takes in data
// from javascript file. uses two state
// objects to control entire app's
// changes.
export default function GroceriesAppContainer(data) {
    // controls all items (left panel)
    const [allItems, setItems] = useState(data);
    // controls only cart items.
    const [cartItems, setCartItems] = useState([]);

    // determines whether desired item quantity
    // is valid, selects target item using its
    // id. If item already exists in list, adds
    // quantity to cart, if not, adds item
    // object to cart array.
    const handleAddToCart = (item, qty) => {
        if (qty > 0) {
            const updatedCartItems = cartItems.some(cartItem => cartItem.id === item.id)
            ? cartItems.map(cartItem => cartItem.id === item.id
                ? {...cartItem, amount: cartItem.amount + qty}
                : cartItem
            ) : [...cartItems, {...item, amount: qty}];
            setCartItems(updatedCartItems);
        } else {
            alert("Please select item quantity.");
        }
    }

    // handles quantity change from QuantityCounter,
    // determines wether item is in cart or item,
    // and changes amount (quantity, # of items) 
    // member in item (product) object.
    // If item is in cart, and quantity (amount) is
    // being reduced to zero, or less, app will prompt
    // the user wether to remove item from cart. This
    // prevents an invalid item amount in cart.
    const handleQuantityChange = (itemId, qty, onCart = false) => {
        if (!onCart) {
            const updateAllItems = allItems.data.map(product => product.id === itemId ?
                { ...product, amount: qty } : product
            );
            setItems({...allItems, data: updateAllItems});
        } else {
            if (qty <= 0) {
                handleRemoveCartItem(itemId);
            } else {
                const updatedCartItems = cartItems.map(product => product.id === itemId ?
                    { ...product, amount: qty } : product
                );
                setCartItems(updatedCartItems);
            }
        }
    }

    // asks the user to confirm remove action,
    // if yes, selects the item in the cart
    // array with its index, and uses splice
    // to remove it. Then updates cart list.
    const handleRemoveCartItem = (itemId) => {
        if(confirm("Please confirm you want to remove item from your cart.")) {
            const idx = cartItems.findIndex(item => item.id === itemId);
            if (idx > -1) {
                const updatedCartItems = [...cartItems];
                updatedCartItems.splice(idx, 1);
                setCartItems(updatedCartItems);
            };
        }
    }

    // asks the user to confirm empty cart
    // action, if yes, sets cart item array
    // to empty array.
    const handleEmptyCart = () => {
        if (confirm("Please confirm you wish to empty the cart.")) {
            setCartItems([]);
        }
    }
    return <>
        {/* sets correct cart icn using boolean value that tracks wether
            there are more than zero items in cart list.
        */}
        <NavBar isFull={cartItems.length > 0 ? true : false}/>
        <div className="hstack">
            <ProductsContainer 
                products={allItems}
                cartItems={cartItems}
                onAddToCart={handleAddToCart}
                onQuantityChange={handleQuantityChange}
            />
            <CartContainer 
                cartItems={cartItems}
                onCartItemRemove={handleRemoveCartItem}
                onQuantityChange={handleQuantityChange}
                onCartEmpty={handleEmptyCart}
                // Retrieves individual item prices, multiplies by item
                // amount, and accumulates before passing value to prop.
                itemsTotal={
                    accounting.toFixed(
                        cartItems.reduce((sum, item) => 
                            sum + (accounting.unformat(item.price)*item.amount), 
                        0), 
                    2)
                }
            />
        </div>
    </>;
}