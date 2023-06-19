import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import session from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import 'dotenv/config';
import './utils/bcrypt.js';
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";
import messageRouter from "./routes/messages.routes.js";
import sessionRouter from "./routes/session.routes.js";
import userRouter from "./routes/users.routes.js";
import { __dirname } from "./path.js";
import multer from "multer";
import { engine } from "express-handlebars";
import * as path from 'path';
import { Server } from "socket.io";
import initializePassport from "./config/passport.js";
import passport from "passport";

// Configuracion
const app = express();
const fileStore = FileStore(session);
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
// ServerIO
const io = new Server(server);

// Handlebars Configuracion
app.engine('handlebars', engine()); // Voy a trabajar con Handlebars
app.set('view engine', 'handlebars'); // Mis vistas son de hbs
app.set('views', path.resolve(__dirname, './views'));
app.set('io', io);

// Middleware
app.use(express.urlencoded({ extended: true })); // Permite poder realizar s    
app.use(express.json()); // Permite ejecutar JSON en mi app
app.use(cookieParser(process.env.SIGNED_COOKIE));
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.URL_MONGODB_ATLAS,
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
        ttl: 210
    }),
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
}));
//MongoDB
mongoose.connect(process.env.URL_MONGODB_ATLAS)
.then(() => console.log("DB is connected"))
.catch((error) => console.log(`Error en MongoDB Atlas: ${error}`));

const upload = (multer({storage: storage}));
app.use((req, res, next) => {
    req.io = io;
    next();
});

//Config passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());


//Routes
app.use('/api/carts', cartRouter);
app.use('/api/products', productRouter);
app.use('/api/messages', messageRouter);
app.use('/api/users', userRouter);
app.use('/session', sessionRouter);
app.use('/', express.static(__dirname + '/public'));
app.post('/upload', upload.single('product'), (req, res) => {
    console.log(req.body);
    console.log(req.file);
    res.send("Imagen subida");
});

//HBS
app.get('/', (req, res) => {
    res.render('index');
});

const mensajes = [];

io.on('connection', (socket) => { // Cuando se establesca la conexion, ejecuta
    console.log("Cliente conectado");
    app.set('io', socket);
    socket.on("mensaje", info => {
        console.log(info);
        mensajes.push(info);
        io.emit("mensajes", mensajes);
    });
})