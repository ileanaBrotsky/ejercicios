import express from "express";
import __dirname from './utils.js'
import handlebars from "express-handlebars"
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js"
import mongoose from "mongoose"
import { messageModel } from "./dao/models/message.model.js";
import { productModel } from "./dao/models/product.model.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.use('/',viewsRouter);

// Motores de plantilla
app.engine('handlebars',handlebars.engine());
app.set('views',__dirname + '/views');
app.set('view engine','handlebars');

let messages= [];

mongoose.set('strictQuery', false);
const url="mongodb+srv://ileanabrotsky:siv6iKzPaIw9nxR8@cluster0.kfytoyf.mongodb.net/"
mongoose.connect(url,{dbName:"ecommerce"}) 
    .then(async ()=>{

          //Server
          const httpServer= app.listen(8080, () => console.log("Running..."));
          const io= new Server(httpServer);
          io.on('connection', socket=>{
              console.log("Nuevo cliente socket conectando")
              socket.on('new',async(user)=>{
                  console.log(`${user} se acaba de conectar`);
                  try {
                      messages = await messageModel.find().lean().exec();
                      console.log("los mensajes de la base son",messages)
                      io.emit('messagesLogs', messages)
                    } catch (error) {
                      console.log("cannot get chats with mongoose", error);
                    }
          })
            socket.on('message', async(data)=>{
                const messageNew = data;
                const messageGenerated = new messageModel(messageNew);
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
              const productGenerated = new productModel(productNew);
              try {
                let result= await productGenerated.save();
                console.log({ productGenerated });
                const listUploaded= await  productModel.find().lean().exec();
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
      })