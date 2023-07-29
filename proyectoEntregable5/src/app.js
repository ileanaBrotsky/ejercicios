import express from "express";
import __dirname from './utils.js'
import handlebars from "express-handlebars"
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js"
import mongoose from "mongoose"

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use('/',viewsRouter);

app.engine('handlebars',handlebars.engine());
app.set('views',__dirname + '/views');
app.set('view engine','handlebars');
const messages= [];
const uri="mongodb+srv://ileanabrotsky:siv6iKzPaIw9nxR8@cluster0.kfytoyf.mongodb.net/"
mongoose.connect(uri,{dbName:"ecommerce"}) .then(async ()=>{
    
const httpServer= app.listen(8080, () => console.log("Running..."));
const io= new Server(httpServer);
io.on('connection', socket=>{
    console.log("Nuevo cliente conectando")
    // queda a la escucha de: primero va el nombre de la funcion y despues los datos
    socket.on('message', data =>{
        //procesa los datos como quiera
        messages.push(data)
        io.emit('messagesLogs',messages)
    })
})
    console.log("db conected")

})