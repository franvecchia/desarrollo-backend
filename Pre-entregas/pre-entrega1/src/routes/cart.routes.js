import { Router } from "express";
import {Cart} from '../../cart.json';

const cartsRouter = Router();
let carts = Cart;

cartsRouter.post('/', (req, res) => {
  const newCart = {
    id: req.params.id,
    products: carts
  };

  carts.push(newCart);

  res.status(201).json(newCart);
});

cartsRouter.get('/:cid', (req, res) => {
  const cart = carts.find(c => c.id === parseInt(req.params.cid));
  if (!cart) return res.status(404).json({ message: 'Productos del carrito no encontrados.'});

  res.json(cart.products);
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
  const cart = carts.find(c => c.id === parseInt(req.params.cid));
  if (!cart) return res.status(404).json({ message: 'Productos del carrito no encontrados.'});

  const productId = parseInt(req.params.pid);
  const existingProduct = cart.products.find(p => p.product === productId);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.products.push({ product: productId, quantity: 1 });
  }

  res.status(201).json(cart.products);
});

export default cartsRouter; 