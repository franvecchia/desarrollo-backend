import { Router } from "express";
import {ProductManager} from "../ProductManager";

const realTimeProducts = Router();
const produ = new ProductManager('../../productos.json');

realTimeProducts.get('/realtimeproducts', async (req, res) => {
    try {
        const producto = await produ.getProducts();
        res.render('realTimeProducts', {producto: producto});
    } catch (error) {
        res.send(error);
    }
});

req.io.on('connection', async(socket) => {
    console.log('Usuario conectado');
    socket.emit('productos', productos);
  
    socket.on('nuevoProducto', (producto) => {
      producto.push(producto);
      io.emit('productos', producto);
    });
  
    socket.on('eliminarProducto', (id) => {
      productos = productos.filter((producto) => producto.id !== id);
      io.emit('productos', productos);
    });
  
    socket.on('disconnect', () => {
      console.log('Usuario desconectado');
    });
});

export default realTimeProducts;