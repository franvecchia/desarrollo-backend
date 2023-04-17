import { express } from "express";
import { ProductManager } from "./ProductManager";

const app = express();
const PORT = 4000;

const productManager = new ProductManager("../productos.json");

app.get('/products', async (req, res) => {
    const limit = req.query.limit;

    try {
        const products = await productManager.getProducts(limit);
        res.send(products);
    } catch (error) {
        console.log(error);
        res.send("Error al obtener los productos.");
    }
});

app.get('products/:pid', async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await productManager.getProductById(productId);
        if (product) {
            res.send(product);
        } else {
            res.send("Producto no encontrado.");
        }
    } catch (error) {
        console.log(error);
        res.send("Error al obtener el producto.");
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});