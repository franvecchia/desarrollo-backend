import {express} from "express";
import realTimeProducts from "./routes/realTimeProducts.routes";

const app = express();
const http = require('http').Server(app);
const hbs = require('express-handlebars');

app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');

app.use('/realtimeproducts', realTimeProducts) 

app.get('/', (req, res) => {
  res.render('home');
});

http.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});