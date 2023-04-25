import {express} from "express";
import {productsRouter} from './routes/product.routes.js';
import {cartsRouter} from './routes/cart.routes.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use('/api/products', productsRouter);
app.use('api/carts', cartsRouter);

app.get('/', (req, res) => {
  res.send('Bienvenido al servidor de productos');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});