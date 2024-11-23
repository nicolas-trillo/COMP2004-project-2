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
    });
    const [postResponse, setPostResponse] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        handleProductsFromDB();
    }, [])

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm();
    
    const handleProductsFromDB = async () => {
        try {
          await axios
            .get("http://localhost:3000/products")
            .then((result) => {
                result.data = result.data.map((product) => ({...product, amount: 0}));
                setItems(result.data);
            });
        } catch (error) {
          console.log(error.message);
        }
    };

    const handleOnChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }
    
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                try {
                    await handleUpdate(formData._id);
                    await setIsEditing(false);
                    await setFormData({
                        productName: "",
                        brand: "",
                        id: "",
                        image: "",
                        price: "",
                    });
                } catch (error) {
                    console.log(error.message);
                }
            } else {
                await axios
                    .post("http://localhost:3000/add-product", formData)
                    .then((response) => {
                        setPostResponse(response.data.message);
                    });
                setFormData({
                    productName: "",
                    id: "",
                    brand: "",
                    image: "",
                    price: "",
                })
            }
        } catch (error) {
            console.log(error.message);
        }
        handleProductsFromDB();
    }

    const handleEdit = async (product) => {
        setIsEditing(true);
        setFormData({
            productName: product.productName,
            brand: product.brand,
            image: product.image,
            price: product.price,
            _id: product._id,
        });
    }

    const handleUpdate = async (id) => {
        try {
            await axios
                .patch(`http://localhost:3000/products/${id}`, formData)
                .then((response) => {
                    setPostResponse(response.data.message);
                    handleProductsFromDB();
                });
        } catch (error) {
            console.log(error.message);
        }
    }


    const handleDelete = async (id) => {
        if (confirm("Please confirm you want to permanently delete this item.")) {
            try {
                await axios
                    .delete(`http://localhost:3000/products/${id}`)
                    .then((response) => {
                        setPostResponse(response.data.message);
                        handleProductsFromDB();
                    })
            } catch (error) {
                console.log(error.message);
            }
        }
    }

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
            const updateAllItems = allItems.map(product => product.id === itemId ?
                { ...product, amount: qty } : product
            );
            setItems(updateAllItems);
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
        <ProductForm 
            formData={formData}
            handleOnChange={handleOnChange}
            handleOnSubmit={handleOnSubmit}
            isEditing={isEditing}
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
        />
        </div>
        <div className="hstack">
            <ProductsContainer 
                products={allItems}
                cartItems={cartItems}
                onAddToCart={handleAddToCart}
                onQuantityChange={handleQuantityChange}
                handleDelete={handleDelete}

                // Stuff for the form
                formData={formData}
                handleOnChange={handleOnChange}
                handleOnSubmit={handleOnSubmit}
                isEditing={isEditing}
                register={register}
                handleSubmit={handleSubmit}
                errors={errors}
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
                            sum + (accounting.unformat(item.price)*item.amount), 0), 2)
                }
            />
        </div>
    </>;
}