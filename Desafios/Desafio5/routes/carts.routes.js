import { Router } from "express";
import CartManager from "../CartManager.js";
import { CartService } from "../services/CartService.js"

// const cartManager = new CartManager("carrito.json");
const cartService = new CartService();
const cartRouter = Router();

cartRouter.post('/', async(req, res) => {
    const result = await cartService.createEmptyCart();
    // const result = await cartManager.createEmptyCart();
    res.status(result.code).send(result);
});

cartRouter.get('/:cid', async(req, res) => {
    const cid = req.params.cid;

    const result = await cartService.getCartByIdPopulate(cid);
    // const result = await cartManager.getCartById(cid);

    res.status(result.code).send(result);
});

cartRouter.post('/:cid/products/:pid', async(req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const result = await cartService.addProductToCart(cid, pid);
    // const result = await cartManager.addProductToCart(cid, pid);

    res.status(result.code).send(result);
});

cartRouter.delete('/:cid/products/:pid', async(req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const result = await cartService.deleteProductToCart(cid, pid);

    res.status(result.code).send(result)
});

cartRouter.put('/:cid', async(req, res) => {
    const cid = req.params.cid;
    const {products} = req.body;

    const result = await cartService.updateCartByProductList(cid, products);

    res.status(result.code).send(result)
});

cartRouter.put('/:cid/products/:pid', async(req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const {cant} = req.body;

    const result = await cartService.updateCartProductQuantity(cid, pid, cant);

    res.status(result.code).send(result)
});

cartRouter.delete('/:cid', async(req, res) => {
    const cid = req.params.cid;

    const result = await cartService.deleteProductsToCart(cid);

    res.status(result.code).send(result)
});

export default cartRouter;