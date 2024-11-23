// simplifies UI for CRUD components
// by using a pop-up interface
import Popup from "reactjs-popup";
// CSS provided by library
import "reactjs-popup/dist/index.css";
import { accounting } from "accounting";

export default function ProductForm({
    formData,
    handleOnChange,
    handleOnSubmit,
    isEditing,
    isPopupOpen,
    setIsPopupOpen,
    handleSubmit,
}) {
    return (
        // "open" controls state of pop-up,
        // and onClose executes a lambda
        // when pop-up is closed.
        <Popup
            open={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            modal
            nested
        >
            <div className="modal vstack">
                <div className="content">
                    <form
                        className="vstack"
                        onSubmit={handleSubmit(handleOnSubmit)}
                    >
                        <label htmlFor="productName">
                            Product Name: <br />
                            <input
                                type="text"
                                name="productName"
                                value={formData.productName || ""}
                                onChange={handleOnChange}
                                id="productName"
                                required
                            />
                        </label>
                        <label htmlFor="brand">
                            Product Brand: <br />
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand || ""}
                                onChange={handleOnChange}
                                id="brand"
                                required
                            />
                        </label>
                        <label htmlFor="image">
                            Image URL: <br />
                            <input
                                type="text"
                                name="image"
                                value={formData.image || ""}
                                onChange={handleOnChange}
                                id="image"
                                required
                            />
                        </label>
                        <label htmlFor="price">
                            Price: $
                            <input
                                type="number"
                                name="price"
                                value={accounting.unformat(
                                    formData.price || "",
                                )}
                                onChange={handleOnChange}
                                id="price"
                                required
                            />
                        </label>
                        <button type="submit">
                            {isEditing ? "Save" : "Add"}
                        </button>
                    </form>
                </div>
                <div>
                    <button
                        className="bad-btn"
                        onClick={() => setIsPopupOpen(false)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Popup>
    );
}
