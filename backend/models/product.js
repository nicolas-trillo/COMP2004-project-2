const mongoose = require("mongoose");
const {Schema} = mongoose;

const productSchema = new Schema({
    id: String,
    productName: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    }
});

const Product = mongoose.model("Product", productSchema, "proj-2");
module.exports = Product;