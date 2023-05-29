import { Router } from "express";
import { ProductService } from '../services/product-service.js'

const productService = new ProductService();
const productRouter = Router();

productRouter.get('/realTimeProducts', async(req, res) => {
    const result = await productService.getProducts();
    const products = result.payload.map(p => ({id: p._id, title: p.title, description: p.description, price: p.price, code: p.code, stock: p.stock, category: p.category, status: p.status}));

    res.render("realtimeproducts", { titulo: "Products Socket", products: products })
});

productRouter.get('/home', async(req, res) => {
    const result = await productService.getProducts();
    const products = result.payload.map(p => ({id: p._id, title: p.title, description: p.description, price: p.price, code: p.code, stock: p.stock, category: p.category, status: p.status}));

    res.render("home", { titulo: "Products", products: products });
});

productRouter.get('/', async(req, res) => {
    const limit = parseInt(req.query.limit ?? 10);
    const page = parseInt(req.query.page ?? 1);
    const sort = (['asc','desc'].includes(req.query.sort))? req.query.sort: null;
    const query = req.query.query;
    const url = req.protocol + '://' + req.get('host') + req.originalUrl;

    const result = await productService.getProducts(limit,page,query,sort,url);

    res.status(result.code).send(result);
});

productRouter.get('/:pid', async(req, res) => {
    const pid = req.params.pid;

    const result = await productService.getProductById(pid);

    res.status(result.code).send(result)
});

productRouter.post('/', async(req, res) => {
    let {title, description, price, thumbnail, code, stock, category} = req.body;
    const status = true;
    thumbnail = thumbnail ?? "sin imagen";
    
    const result = await productService.addProduct({title, description, price, thumbnail, code, stock, category, status});

    req.io.emit("updateProduct", result);
    res.status(result.code).send(result);
});

productRouter.put('/:pid', async(req, res) => {
    const pid = req.params.pid;
    const {title, description, price, thumbnail, code, stock, category, status} = req.body;

    const result = await productService.updateProduct(pid, {title, description, price, thumbnail, code, stock, category, status});

    res.status(result.code).send(result);
});

productRouter.delete('/:pid', async(req, res) => {
    const pid = req.params.pid;

    const result = await productService.deleteProduct(pid);

    req.io.emit("updateProduct", {...result, id: pid});
    res.status(result.code).send(result);
});

export default productRouter;