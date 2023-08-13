import express, { urlencoded } from "express";
import { engine } from 'express-handlebars';
import __dirname from './utils.js'

//Sessions
import session from "express-session";

//Mongoose
import mongoose from "mongoose";
import MongoStore from 'connect-mongo'

//Socket IO
import { createServer } from "http";
import { Server } from "socket.io";

//Routes
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import views from './routes/views.js'

const app = express();
const puerto = 8080;

//Servidor
const url = "mongodb+srv://mauricio:achtung75G@cluster0.vil2pfb.mongodb.net/?retryWrites=true&w=majority"

app.use(session({
    store: MongoStore.create({
        mongoUrl: url,
        dbName: 'ecommerce',
        mongoOptions:{
            useNewUrlParser: true,
        }
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

//Archivos Estaticos
app.use('/static', express.static(__dirname + '/public'))

//Configuraciones
app.use(express.json());
app.use(urlencoded({ extended: true }))

//Motor de Plantillas
app.engine('handlebars', engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

//Rutas
app.use('/api/auth/', authRoutes)
app.use('/api/products/', productRoutes)
app.use('/api/cart/', cartRoutes)
//app.use('/api/chat/', chatRoutes)*/
app.use(views)

//Inicia el servidor
mongoose.connect(url, {
    dbName: 'ecommerce'
}).then(() => {
    const httpServer = app.listen(puerto, () => {
        console.log("Servidor Corriendo en el puerto 8080")
    })

    //Configuracion IO
    const io = new Server(httpServer)

    io.on('connection', (socket) => {

        //Escucha el mensaje mandado desde el cliente
        socket.on("new", data => {
            console.log("Cliente Conectado")
        })

        socket.on("messages", message => {
            //console.log(message)
            io.emit("message_response", message.payload)
        })

        socket.on("products", products => {
            io.emit("response_products", products)
        })

        /*socket.on("message", data => {
            console.log(data)
            io.emit("response_message", data)
        })*/
    })
}).catch((error) => {
    console.log("Error de Conexion: " + error)
})