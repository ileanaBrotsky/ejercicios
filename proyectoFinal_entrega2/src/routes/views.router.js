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
//CARRITO 
// Ver todos los carritos
router.get("/carts", async (req, res) => {
  try {
 const carts= await CartModel.find().populate("products.product").lean().exec()
    res.render('carts',{carts, style:'index.css'})
  } catch (error) {
    console.log("cannot get carts with mongoose", error);
  }
});

//Ver un carrito
router.get("/carts/:idc", async (req, res)=>{
let cartID= req.params.idc;
let totalAmount=0
console.log("el cartId",cartID)
try{
 const cart= await CartModel.findById(cartID).populate('products.product').lean().exec()
 cart.products.forEach(item=>{ 
  totalAmount= totalAmount + item.quantity * item.product.price  
 })
      res.render('my_cart',{cart, totalAmount})
}catch (error) {
  console.log("cannot get carts with mongoose", error);
}
})
//====================================================================//
//  PRODUCTS 
// Ver todos los productos con accion agregar al carrito
router.get("/products", async (req, res) => {
   let query_filter =req.query.query_filter||null
   let query_value =parseInt(req.query.query_value)||null
   let limit =parseInt(req.query.limit)||10
   let page=parseInt(req.query.page) || 0
   let sort=parseInt(req.query.sort)||null
  //  console.log("query_filter",query_filter)
  //  console.log("query_value",query_value)
  
  try {
      // const products = await ProductModel.paginate({},{
      //   page: parseInt(req.query.page)||1,
      //   limit: parseInt(req.query.limit)||10,
      //   lean: true
      // })

    //   const products = await ProductModel.find().lean().exec();
    
let products= await ProductModel.aggregate([
  //1-buscar con un filtro o todos
  // {$match: {query_filter: query_value}},NO ANDA
  {$match: {}},
  //2-buscar con limite o 10
  {$limit: limit},
   //3- ordenar asc o desc segun corresponda o nada
  {$sort: {price: sort}}

])
res.render("products", { products, style: "index.css" });


  } catch (error) {
    console.log("cannot get products with mongoose", error);
  }
});

// Ver todos los productos con PAGINACION
router.get("/products_paginated", async (req, res) => {
  
  let limit =parseInt(req.query.limit)||10
  let page=parseInt(req.query.page) || 0
  let sort=parseInt(req.query.sort)||null
 //  console.log("query_filter",query_filter)
 //  console.log("query_value",query_value)
 
 try {
     const result = await ProductModel.paginate({},{
       page: parseInt(req.query.page)||1,
       limit: parseInt(req.query.limit)||10,
       lean: true
     })
res.render("products_paginated", result);
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

// Vista para modificar producto existente
router.get("/update/:code", async (req, res) => {
  const code = req.params.code;
  try {
    const productSelected = await ProductModel.findOne({ code: code });
    res.render("update", productSelected);
  }
  catch (error) 
  {
    console.log("cannot update products", error);
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
