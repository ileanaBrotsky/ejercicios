import { Router } from "express";
import { productModel } from "../dao/models/product.model.js";
import { cartModel } from "../dao/models/cart.model.js";
import { messageModel } from "../dao/models/message.model.js";

const router = Router();
//HOME- SALUDO BIENVENIDA Y DATOS DEL USUARIO
router.get("/", async (req, res) => {
  let  user={ name:'Hilda'}
    res.render('index',{user:user, style:'index.css'})
});
//CARRITO
router.get("/cart", async (req, res) => {
 
    res.render('cart',{style:'index.css'})
});
//copiado de la afterclass

//  PRODUCTS - Ver todos los productos
router.get("/products", async (req, res) => {
  try {
    const products = await productModel.find().lean().exec();
    res.render("products", { products, style: "index.css" });
  } catch (error) {
    console.log("cannot get products with mongoose", error);
  }
});
//CHAT- con websockets
router.get("/chat", async(req, res) => {
  try {
    const messages = await messageModel.find().lean().exec();
  res.render("chat", { messages, style: "index.css" });
  }
  catch (error) {
    console.log("cannot get messages with mongoose", error);
  }
});
//=============CRUD CON SOCKETS=====================//
router.get('/realtimeproducts',async (req, res)=>{
  try {
    const products = await productModel.find().lean().exec();
      let limit = parseInt(req.query.limit);
      if (limit && limit <= products.length) {
        products.length=limit
      }
        res.status(200).render('realTimeProducts',{products:products, style:'index.css'});
     
    } catch (error) {
       console.log("hubo un error: ", error);
    }
})
//============ CRUD ================================//
//CRUD vista productos
router.get("/edit_products", async (req, res) => {
  let testUser={ name:'Hilda', lastname: "Lizarasu"}
  try {
    const products = await productModel.find().lean().exec();
    res.render('edit_products',{user:testUser,products, style:'index.css'})
  } catch (error) {
    console.log("cannot get products with mongoose", error);
  }
});
// Vista para agregar nuevo producto
router.get("/create", async (req, res) => {
  res.render("create", {});
});

//Accion agregar producto nuevo
router.post("/create", async (req, res) => {
  const productNew = req.body;
  const productGenerated = new productModel(productNew);
  try {
    let result= await productGenerated.save();
    console.log({ productGenerated });
    res.send({ status: "sucess", payload: result }).redirect("/home");
  } catch (error) {
    console.log("cannot create products", error);
  }
});

// Vista para modificar producto existente
router.get("/update/:code", async (req, res) => {
  console.log("el req es", req.params);
  const code = req.params.code;
  try {
    const productSelected = await productModel.findOne({ code: code });
    console.log("obtenido con exito", productSelected);
    res.render("update", productSelected);
  } catch (error) {
    console.log("cannot update products", error);
  }
});

//Accion modificar un producto existente
router.put("/update/:code", async (req, res) => {
  let code = req.body.code;
  let productToUpdate = req.body;
  if (
    !productToUpdate.code ||
    !productToUpdate.description ||
    !productToUpdate.price ||
    !productToUpdate.category ||
    !productToUpdate.stock
  ) {
    return res.send({ status: "error", error: "Valores incompletos" });
  }
  try {
  let result = await productModel.updateOne({ code: code }, productToUpdate);
  res.send({ status: "sucess", payload: result }).redirect("/home");
  }
  catch(error){
    console.log("cannot update products", error);
  }
});

// Accion eliminar un producto existente
router.get("/delete/:code", async (req, res) => {
  const code = req.params.code;
  try {
  await productModel.deleteOne({ code: code });
  res.redirect("/home");
  }
  catch(error){
    console.log("cannot delete product", error);
  }
});

//=============================================================//

export default router;
