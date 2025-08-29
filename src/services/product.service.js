import { json } from "express";
import products from "../products.json" assert { type: "json" };

class ProductService {
    constructor() {
        this.products = products;
    }

    getAllProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }
}

export const productService = new ProductService();
