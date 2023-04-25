import { Router } from "express";
import {ProductList} from '../../products.json';

const productsRouter = Router();
const productList = ProductList;

productsRouter.get('/', (req, res) => {
  res.send(productList);
});
  
productsRouter.get('/:pid', (req, res) => {
    const product = productList.find(p => p.id === parseInt(req.params.pid));
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }
    res.send(product);
});
  
productsRouter.post('/', (req, res) => {
    const { title, description, code, price, status=true, stock, category, thumbnails=[] } = req.body;
    const newProduct = {
      id: productList.length + 1,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails
    };
    productList.push(newProduct);
    res.send(newProduct);
});
  
productsRouter.put('/:pid', (req, res) => {
    const productIndex = productList.findIndex(p => p.id === parseInt(req.params.pid));
    if (productIndex === -1) {
      return res.status(404).send('Producto no encontrado');
    }
    const product = productList[productIndex];
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    productList[productIndex] = {
      ...product,
      title: title || product.title,
      description: description || product.description,
      code: code || product.code,
      price: price || product.price,
      status: status || product.status,
      stock: stock || product.stock,
      category: category || product.category,
      thumbnails: thumbnails || product.thumbnails
    };
    res.send(productList[productIndex]);
});
  
productsRouter.delete('/:pid', (req, res) => {
    const productIndex = productList.findIndex(p => p.id === parseInt(req.params.pid));
    if (productIndex === -1) {
      return res.status(404).send('Producto no encontrado');
    }
    productList.splice(productIndex, 1);
    res.send('Producto eliminado exitosamente');
});
  
export default productsRouter;