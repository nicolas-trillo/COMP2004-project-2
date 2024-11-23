// simplifies UI for CRUD components
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { accounting } from "accounting";

export default function ProductForm({
    isEditing,
    formData,
    handleOnChange,
    handleOnSubmit,
    register,
    handleSubmit,
    errors,
}) {
    return (
        <Popup trigger={<button>{isEditing? "Edit" : "Add product"}</button>} modal nested>
        {close => (
            <div className='modal vstack'>
                <div className='content'>
                    <form className="vstack" onSubmit={handleSubmit(handleOnSubmit)}>
                        <label htmlFor="productName">Product Name: <br/>
                            <input 
                                type="text"
                                name="productName"
                                {
                                ...(isEditing? {} : register("productName", {
                                    required: "Product name is required",
                                }))}
                                value={formData.productName}
                                onChange={handleOnChange}
                                id="productName"
                            />
                        </label>
                        {errors.productName && (<span style={{ color: "red" }}>{errors.productName.message}</span>)}
                        <label htmlFor="brand">Product Brand: <br/>
                            <input type="text" 
                                name="brand"
                                {
                                ...(isEditing? {} : register("brand", {
                                    required: "Brand is required",
                                }))}
                                value={formData.brand}
                                onChange={handleOnChange}
                                id="brand"
                            />
                        </label>
                        {errors.brand && (<span style={{ color: "red" }}>{errors.brand.message}</span>)}
                        <label htmlFor="image">Image URL: <br/>
                            <input 
                                type="text" 
                                name="image" 
                                {...(isEditing ? {} : register("image", {
                                        required: "Image URL is required",
                                        pattern: {
                                            value: /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/,
                                            message: "Invalid URL",
                                },}))}
                                value={formData.image}
                                onChange={handleOnChange}
                                id="image" 
                            />
                        </label>
                        {errors.image && (<span style={{ color: "red" }}>{errors.image.message}</span>)}
                        <label htmlFor="price">Price: $
                            <input 
                                type="number" 
                                name="price"
                                {...(isEditing ? {} : register("price", {
                                    required: "Price is required",
                                    pattern: {
                                        value: /^\d*\.?\d{0,2}$/,
                                        message: "Invalid price",
                                },}))}
                                value={accounting.unformat(formData.price) || ""}
                                onChange={handleOnChange}
                                id="price" 
                            />
                        </label>
                        {errors.price && (<span style={{ color: "red" }}>{errors.price.message}</span>)}
                        <button type="submit" onClick={(errors) => !errors? close() : {}}>{isEditing? "Save" : "Add"}</button>
                    </form>
                </div>
                <div>
                    <button className="bad-btn" onClick=
                        {() => close()}>
                            Cancel
                    </button>
                </div>
            </div>
        )}
        </Popup>
    );
}