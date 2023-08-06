import { Router } from "express";
import { ProductModel } from "../dao/models/product.model.js";
import { CartModel } from "../dao/models/cart.model.js";
import { MessageModel } from "../dao/models/message.model.js";

const router = Router();
//HOME- SALUDO BIENVENIDA Y DATOS DEL USUARIO
router.get("/", async (req, res) => {
  let  user={ name:'Hilda'}
    res.render('index',{user:user, style:'index.css'})
});
//====================================================================//
//CARRITO - Ver todos los carritos
router.get("/carts", async (req, res) => {
  try {
 const carts= await CartModel.find().lean().exec()
    res.render('carts',{carts, style:'index.css'})
  } catch (error) {
    console.log("cannot get carts with mongoose", error);
  }
});
//Crear un carrito
router.post("/", async()=>{
  try {
const newCart= await CartModel.create({products:[]})
res.send(newCart)
} catch (error) {
  console.log("cannot create  cart with mongoose", error);
}
})
//Ver un carrito
router.get("/carts/:cid", async (req, res)=>{
let cid= parseInt(req.params.cid);
try{
  const cart= await CartModel.findById(cid)

}catch (error) {
    console.log("cannot get carts with mongoose", error);
  }
})

//agregar producto a un carrito
router.get("/carts/:idc/:idp", async (req, res)=>{
  let cartID= req.params.idc;
  let prodID= req.params.idp;
  const quantity= req.query.quantity||1
  let existingProduct= false
  try{
    const cart= await CartModel.findById(cartID)
    console.log("el carrito es", cart.products)
  cart.products.forEach(p=>{
    console.log("el id es", p.id)
    console.log("el prodID", prodID)
    if(p.id===prodID){  
      existingProduct=true
      p.quantity=p.quantity+quantity
      console.log("el producto existe")
    }
    else{console.log("el producto es nuevo")}
  })
  if(!existingProduct){
    cart.products.push(
      {id:prodID,
      quantity})
  }
  const result= cart.save()
  res.send(result)

}    
   catch (error) {
      console.log("cannot get carts with mongoose", error);
    }

})
//====================================================================//
//  PRODUCTS - Ver todos los productos con accion agregar al carrito
router.get("/products", async (req, res) => {
  let limit = parseInt(req.query.limit)||10;
   let page= parseInt(req.query.page||1)
   let query=req.query.query||null
   let sort=req.query.sort||null
  try {
    if(query){
      const products = await ProductModel.find(query).lean().exec();
    }
    else{
      const products = await ProductModel.find().lean().exec();
    }
    
    if (limit && limit <= products.length) {
      products.length=limit
    }
    res.render("products", { products, style: "index.css" });
  } catch (error) {
    console.log("cannot get products with mongoose", error);
  }
});
// vista productos con disparadores de acciones
router.get("/edit_products", async (req, res) => {
  try {
    const products = await ProductModel.find().lean().exec();
    res.render('edit_products',{products, style:'index.css'})
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
  const productGenerated = new ProductModel(productNew);
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
    const productSelected = await ProductModel.findOne({ code: code });
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
  let result = await ProductModel.updateOne({ code: code }, productToUpdate);
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
  await ProductModel.deleteOne({ code: code });
  res.redirect("/products");
  }
  catch(error){
    console.log("cannot delete product", error);
  }
});

//====================================================================//
//CHAT- con websockets
router.get("/chat", async(req, res) => {
  try {
    const messages = await MessageModel.find().lean().exec();
  res.render("chat", { messages, style: "index.css" });
  }
  catch (error) {
    console.log("cannot get messages with mongoose", error);
  }
});
//=============CRUD CON SOCKETS=====================//
router.get('/realtimeproducts',async (req, res)=>{
  try {
    const products = await ProductModel.find().lean().exec();
      let limit = parseInt(req.query.limit);
      if (limit && limit <= products.length) {
        products.length=limit
      }
        res.status(200).render('realTimeProducts',{products:products, style:'index.css'});
     
    } catch (error) {
       console.log("hubo un error: ", error);
    }
})

//=============================================================//

export default router;
