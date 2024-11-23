// Imports and initializers
const express = require("express");
const server = express();
const port = 3000;
const mongoose = require("mongoose");
const cors = require("cors");
const Product = require("./models/product");
require("dotenv").config();
const {DB_URI} = process.env;

// Middleware
server.use(express.json());
server.use(cors());
server.use(express.urlencoded({extended: true}));

// DB connect and server start
mongoose.connect(DB_URI).then((res) => {
    server.listen(port, () => {
        console.log(`Listening on port ${port}`);
    })
}).catch((error) => {
    console.log(error);
});

// Routing
server.get("/", (request, response) => {
    response.send("<pre>WILKOMMEN!!</pre>");
});

server.get("/products", async (request, response) => {
    try {
        await Product.find().then((result) => 
            response
        .status(200)
        .send(result)
    );
} catch (error) {
    response.status(404).json({message: error.message});
}
});

server.post("/add-product", async (request, response) => {
    const { productName, brand, image, price, id } = request.body;
    const newProduct = new Product({
        productName,
        brand,
        image,
        price,
        id
    });
    try {
        await newProduct.save();
        response.status(201).json({ message: "Product added successfully" });
    } catch (error) {
        response.status(400).json({ message: error.message });
    }
});

server.delete("/products/:id", async (request, response) => {
    const {id} = request.params;
    const objId = new mongoose.Types.ObjectId(id);
    try {
        await Product.findByIdAndDelete(objId);
        response.status(200).json({message: "Product deleted successfully."});
    } catch (error) {
        console.log("f");
        response.status(404).json({message: error.message});
    }
});

server.patch("/products/:pid", async (request, response) => {
    const { pid } = request.params;
    const { productName, brand, image, price, id } = request.body;
    const objectId = new mongoose.Types.ObjectId(pid); // Convert id to Mongoose ObjectId
    try {
        await Product.findByIdAndUpdate(pid, {
            productName,
            brand,
            image,
            price,
            id
        }).then((response) => {
            console.log(response);
        });
        
        await response
        .status(200)
        .json({ message: "Product updated successfully" });
    } catch (error) {
        response.status(404).json({ message: error.message });
    }
});