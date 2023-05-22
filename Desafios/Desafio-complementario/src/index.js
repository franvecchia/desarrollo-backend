import express from "express";
import mongoose from "mongoose";
import 'dotenv/config';
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";
import messageRouter from "./routes/messages.routes.js";
import { __dirname } from "./path.js";
import multer from "multer";
import { engine } from "express-handlebars";
import * as path from 'path';
import { Server } from "socket.io";

const app = express();
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, __dirname + '/public/img');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
const server = app.listen(process.env.PORT, () => {
    console.log(`Server on port ${process.env.PORT}`);
});
const io = new Server(server);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));
app.set('io', io);

app.use(express.urlencoded({ extended: true }));  
app.use(express.json());
mongoose.connect(process.env.URL_MONGODB_ATLAS)
.then(() => console.log("DB is connected"))
.catch((error) => console.log(`Error en MongoDB Atlas: ${error}`));

const upload = (multer({storage: storage}));
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/api/carts', cartRouter);
app.use('/api/products', productRouter);
app.use('/api/messages', messageRouter)
app.use('/', express.static(__dirname + '/public'));
app.post('/upload', upload.single('product'), (req, res) => {
    console.log(req.body);
    console.log(req.file);
    res.send("Imagen subida");
});

app.get('/', (req, res) => {
    res.render('index');
});

const mensajes = [];

io.on('connection', (socket) => {
    console.log("Cliente conectado");
    app.set('io', socket);
    socket.on("mensaje", info => {
        console.log(info);
        mensajes.push(info);
        io.emit("mensajes", mensajes);
    });
})