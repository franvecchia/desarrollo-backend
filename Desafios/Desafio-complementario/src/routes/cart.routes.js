import { Router } from "express";
import { CartService } from "../services/cart-service.js"

const cartService = new CartService();
const cartRouter = Router();

cartRouter.post('/', async(req, res) => {
    const result = await cartService.createEmptyCart();
    // const result = await cartManager.createEmptyCart();
    res.status(result.code).send(result);
});

cartRouter.get('/:cid', async(req, res) => {
    const cid = req.params.cid;

    const result = await cartService.getCartById(cid);
    // const result = await cartManager.getCartById(cid);

    res.status(result.code).send(result);
});

cartRouter.post('/:cid/product/:pid', async(req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const result = await cartService.addProductToCart(cid, pid);

    res.status(result.code).send(result);
});

export default cartRouter;