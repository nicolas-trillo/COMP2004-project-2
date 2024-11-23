import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import ProductsContainer from "./ProductsContainer";
import CartContainer from "./CartContainer";
import ProductForm from "./ProductForm";
import axios from "axios";
import { useForm } from "react-hook-form";

// provides methods to work with formatted
// currency strings, suck as unformat, and
// toFixed.
import { accounting } from "accounting";

// GroceriesAppContainer takes in data
// from javascript file. uses two state
// objects to control entire app's
// changes.
export default function GroceriesAppContainer() {
    // controls all items (left panel)
    const [allItems, setItems] = useState([]);
    // controls only cart items.
    const [cartItems, setCartItems] = useState([]);
    // controls CRUD form data.
    const [formData, setFormData] = useState({
        productName: "",
        brand: "",
        image: "",
        price: "",
        _id: "",
        id: "",
    });
    // controls backend response
    const [postResponse, setPostResponse] = useState("");
    // controls edit state
    const [isEditing, setIsEditing] = useState(false);
    // controls popup visibility
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        handleProductsFromDB();
    }, []);

    // React hooks forms implementation
    // apparently reduces code size.
    // Questionable.
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // Retrieves products from DB and
    // updates the list in the user
    // interface.
    const handleProductsFromDB = async () => {
        try {
            await axios.get("http://localhost:3000/products").then((result) => {
                setItems(
                    result.data.map((product) => ({ ...product, amount: 0 })),
                );
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    // Modifies respective formData member
    // with data provided by event triggered
    // from within ProductForm.
    const handleOnChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handles edit mode states used by other
    // methods and the ProductForm component.
    const handleEdit = (product) => {
        setFormData(product);
        setIsEditing(true);
        setIsPopupOpen(true);
    };

    // Triggered when user clicks on add
    // product button, ensures formData
    // variable is clear, sets edit mode
    // to false, and opens pop-up.
    const handleAddProduct = () => {
        setFormData({
            productName: "",
            brand: "",
            image: "",
            price: "",
            _id: "",
            id: "",
        });
        setIsEditing(false);
        setIsPopupOpen(true);
    };

    // handles all submissions of ProductForm form.
    const handleOnSubmit = async () => {
        // it works without using prevent default, for some reason.
        //e.preventDefault();
        try {
            // Editing mode case, sends patch request to DB with
            // information from formData, then refreshes products
            // list with handleProductsFromDB, and sets state
            // variables to appropriate states.
            if (isEditing) {
                await axios
                    .patch(
                        `http://localhost:3000/products/${formData._id}`,
                        formData,
                    )
                    .then((response) => {
                        setPostResponse(response.data.message);
                        handleProductsFromDB(); // refreshes list
                        setIsEditing(false);
                        setFormData({
                            productName: "",
                            brand: "",
                            image: "",
                            price: "",
                            _id: "",
                            id: "",
                        });
                    });
            } 
            // New mode case, sends patch request to DB with new product
            // information from formData, then refreshes products
            // list with handleProductsFromDB, and sets state
            // variables to appropriate states.
            else {
                await axios
                    .post("http://localhost:3000/add-product", formData)
                    .then((response) => {
                        setPostResponse(response.data.message);
                        handleProductsFromDB();
                        setFormData({
                            productName: "",
                            brand: "",
                            image: "",
                            price: "",
                            _id: "",
                            id: "",
                        });
                    });
            }
        } catch (error) {
            console.log(error.message);
        }
        // closes form pop-up
        setIsPopupOpen(false);
    };

    // handles deletion of a product.
    // First asks user to confirm, then
    // sends delete request to database.
    const handleDelete = async (id) => {
        if (
            confirm("Please confirm you want to permanently delete this item.")
        ) {
            try {
                await axios
                    .delete(`http://localhost:3000/products/${id}`)
                    .then((response) => {
                        setPostResponse(response.data.message);
                        handleProductsFromDB();
                    });
            } catch (error) {
                console.log(error.message);
            }
        }
    };

    // determines whether desired item quantity
    // is valid, selects target item using its
    // id. If item already exists in list, adds
    // quantity to cart, if not, adds item
    // object to cart array.
    const handleAddToCart = (item, qty) => {
        if (qty > 0) {
            const updatedCartItems = cartItems.some(
                (cartItem) => cartItem.id === item.id,
            )
                ? cartItems.map((cartItem) =>
                      cartItem.id === item.id
                          ? { ...cartItem, amount: cartItem.amount + qty }
                          : cartItem,
                  )
                : [...cartItems, { ...item, amount: qty }];
            setCartItems(updatedCartItems);
        } else {
            alert("Please select item quantity.");
        }
    };

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
            const updateAllItems = allItems.map((product) =>
                product.id === itemId ? { ...product, amount: qty } : product,
            );
            setItems(updateAllItems);
        } else {
            if (qty <= 0) {
                handleRemoveCartItem(itemId);
            } else {
                const updatedCartItems = cartItems.map((product) =>
                    product.id === itemId
                        ? { ...product, amount: qty }
                        : product,
                );
                setCartItems(updatedCartItems);
            }
        }
    };

    // asks the user to confirm remove action,
    // if yes, selects the item in the cart
    // array with its index, and uses splice
    // to remove it. Then updates cart list.
    const handleRemoveCartItem = (itemId) => {
        if (confirm("Please confirm you want to remove item from your cart.")) {
            const idx = cartItems.findIndex((item) => item.id === itemId);
            if (idx > -1) {
                const updatedCartItems = [...cartItems];
                updatedCartItems.splice(idx, 1);
                setCartItems(updatedCartItems);
            }
        }
    };

    // asks the user to confirm empty cart
    // action, if yes, sets cart item array
    // to empty array.
    const handleEmptyCart = () => {
        if (confirm("Please confirm you wish to empty the cart.")) {
            setCartItems([]);
        }
    };
    return (
        <>
            {/* sets correct cart icon using boolean value that tracks wether
            there are more than zero items in cart list.
        */}
            <NavBar isFull={cartItems.length > 0} />
            <div className="hstack">
                <button onClick={handleAddProduct}>Add Product</button>
                <ProductForm
                    formData={formData}
                    handleOnChange={handleOnChange}
                    handleOnSubmit={handleOnSubmit}
                    isEditing={isEditing}
                    isPopupOpen={isPopupOpen}
                    setIsPopupOpen={setIsPopupOpen}
                    handleSubmit={handleSubmit}
                />
            </div>
            <div className="hstack">
                <ProductsContainer
                    products={allItems}
                    onAddToCart={handleAddToCart}
                    onQuantityChange={handleQuantityChange}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit} // Pass handleEdit to ProductsContainer
                />
                <CartContainer
                    cartItems={cartItems}
                    onCartItemRemove={handleRemoveCartItem}
                    onQuantityChange={handleQuantityChange}
                    onCartEmpty={handleEmptyCart}
                    // Retrieves individual item prices, multiplies by item
                    // amount, and accumulates before passing value to prop.
                    itemsTotal={accounting.toFixed(
                        cartItems.reduce(
                            (sum, item) =>
                                sum +
                                accounting.unformat(item.price) * item.amount,
                            0,
                        ),
                        2,
                    )}
                />
            </div>
        </>
    );
}
