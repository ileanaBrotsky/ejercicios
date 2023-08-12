import express from "express";
import __dirname from './utils.js'
import handlebars from "express-handlebars"
import { Server } from "socket.io";
import session from 'express-session'
import MongoStore from "connect-mongo"
import mongoose from "mongoose"
import { MessageModel } from "./dao/models/message.model.js";
import { ProductModel } from "./dao/models/product.model.js";

import viewsRouter from "./routes/views.router.js"
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import sessionRouter from "./routes/session.router.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

//routers
app.use('/',viewsRouter);
app.use('/api/carts',cartsRouter);
app.use('/api/products',productsRouter);
app.use('/api/session', sessionRouter)

// Motores de plantilla
app.engine('handlebars',handlebars.engine());
app.set('views',__dirname + '/views');
app.set('view engine','handlebars');

let messages= [];
const url="mongodb+srv://ileanabrotsky:siv6iKzPaIw9nxR8@cluster0.kfytoyf.mongodb.net/"
app.use(session({
  store: MongoStore.create({
    mongoUrl:url,
    dbName: 'sessions',
    mongoOptions: {
       useNewUrlParser: true,
       useUnifiedTopology: true
    },
    ttl:15
  }),
    secret: 'secret',
  resave: false,
  saveUninitialized:false

}))
// app.get("/login", (req, res)=>{
//   if(req.session.user) return  res.send('Already logged')  

//   const { username }= req.query

//    if(!username) return res.send('Need a username')

//     req.session.user= username
//     return res.send('Login sucess')
  
//    })
function auth(req, res, next){
return req.session?.user ? next() : res.status(401).send('Auth error')
}
   app.get("/private", auth, (req, res)=>{
     res.send(`Private page ${req.session.user}`)
    
     })

mongoose.set('strictQuery', false);
const enviroment= async()=>{
  await mongoose.connect(url,{dbName:"ecommerce"}) 
    .then(async ()=>{
          //Server
          const httpServer= app.listen(8080, () => console.log("Running..."));
          const io= new Server(httpServer);
          io.on('connection', socket=>{
              console.log("Nuevo cliente socket conectando")
              socket.on('new',async(user)=>{
                  console.log(`${user} se acaba de conectar`);
                  try {
                      messages = await MessageModel.find().lean().exec();
                     // console.log("los mensajes de la base son",messages)
                      io.emit('messagesLogs', messages)
                    } catch (error) {
                      console.log("cannot get chats with mongoose", error);
                    }
          })
            socket.on('message', async(data)=>{
                const messageNew = data;
                const messageGenerated = new MessageModel(messageNew);
                try {
                await messageGenerated.save();
                  console.log({ messageGenerated });
                //   res.send({ status: "sucess", payload: result }).redirect("/home");
                } catch (error) {
                  console.log("cannot create products", error);
                }
                messages.push(data)
          
                io.emit('messagesLogs',messages)
            })
            socket.on('addNewProduct', async data =>{
              console.log("el producto es",data);
              const productNew = data;
              const productGenerated = new ProductModel(productNew);
              try {
                let result= await productGenerated.save();
                console.log({ productGenerated });
                const listUploaded= await  ProductModel.find().lean().exec();
                socket.emit("uploadList",listUploaded)
              }
              catch (error) {
                  console.log("cannot create products", error);
                }
          })
      })
          console.log("db conected")
      })
      .catch(e=>{
          console.log("Can't connect to DB");
      })}
       enviroment();