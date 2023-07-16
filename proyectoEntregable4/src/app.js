import express from "express";
import viewsRouter from "./routes/views.router.js"
import handlebars from "express-handlebars"
// import productsRouter from './routes/products.router.js'
// import cartsRouter from './routes/carts.router.js'
import __dirname from './utils.js'
import ProductManager from "./productsManager.js";
import { Server } from "socket.io";

const app = express();
const Products1 = new ProductManager("products.json");
const httpServer= app.listen(8080, () => console.log("Running..."));
const io= new Server(httpServer);
app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/',viewsRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.on('connection', socket=>{
    console.log("Nuevo cliente conectando")
    // queda a la escucha de: primero va el nombre de la funcion y despues los datos
    socket.on('message', data =>{
        //procesa los datos como quiera
        console.log(data);
    })
    
    socket.on('addNewProduct', async data =>{
        console.log("el producto es",data);
      const result= await Products1.addProduct(data.title, data.description, data.price, data.thumbnail=[], data.code, data.stock,data.category)
    console.log("el resultado", result)
    const listUploaded= await Products1.getProducts()
      socket.emit("uploadList",listUploaded)
    
    })
})
// app.use('/api/products/', productsRouter);
// app.use('/api/carts/', cartsRouter);


