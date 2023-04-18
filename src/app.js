import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import wiewRouter from "./routes/views.router.js";

const PORT = process.env.PORT || 8080; //si el el entorno donde se ejecuta el proceso del puerto existe traerlo, sino traer el 8080.

const app = express();

const server = app.listen(PORT, () => {
  console.log("servidor funcionando en el puerto: " + PORT);
});

//vistas
app.engine("handlebars", handlebars.engine());

app.set("views", __dirname + "/views");

app.set("view engine", "handlebars");

//servicio
app.use(express.json());

app.use(express.static(__dirname + "/public"));

//rutas 
//vistas
app.use("/", wiewRouter);

//chat socket.io
const io = new Server(server);

const messages = [];

io.on('connection', Socket=>{
    console.log('socket conected')

    Socket.on('message', data=>{
        messages.push(data);
        io.emit('messageLogs', messages)
    })

    Socket.on('authenticated', data=>{
        Socket.broadcast.emit('newUserConnected', data);
        
    })
})
