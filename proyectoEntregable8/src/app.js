import express from "express";
import __dirname from './utils.js'
import handlebars from "express-handlebars"
import { Server } from "socket.io";
 import session from 'express-session'
// import MongoStore from "connect-mongo"
import mongoose from "mongoose"
import { MessageModel } from "./dao/models/message.model.js";
import { ProductModel } from "./dao/models/product.model.js";

import viewsRouter from "./routes/views.router.js"
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import sessionRouter from "./routes/session.router.js"
import cookieParser from 'cookie-parser'
import passport from 'passport'
import initializePassport from "./config/passport.config.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Motores de plantilla
app.engine('handlebars',handlebars.engine());
app.set('views',__dirname + '/views');
app.set('view engine','handlebars');

//cookie
app.use(cookieParser())

let messages= [];
//url DB
const url="mongodb+srv://ileanabrotsky:siv6iKzPaIw9nxR8@cluster0.kfytoyf.mongodb.net/"
//SESSION
 app.use(session({
      secret: 'secret',
      resave: false,
      saveUninitialized:false
 }))
 app.use(passport.session())
// Passport
initializePassport()
app.use(passport.initialize())
// app.use(passport.session())

//routers
app.use('/',viewsRouter);
app.use('/api/carts',cartsRouter);
app.use('/api/products',productsRouter);
app.use('/api/session', sessionRouter)

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