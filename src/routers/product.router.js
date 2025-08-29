import { Router } from 'express'

import { productService } from '../services/product.service.js'

export const productRouter = () => {
    const router = Router();

    router.get("/", (_, res) => {
        const products = productService.getAllProducts();
        res.json(products);
    });

    router.get("/:id", (req, res) => {
        const product = productService.getProductById(parseInt(req.params.id));

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    });

    return router;
};

export default productRouter;
