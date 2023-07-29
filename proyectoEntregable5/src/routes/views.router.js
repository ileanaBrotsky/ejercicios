import { Router } from "express";
import { productModel } from "../dao/models/product.model.js";
import { cartModel } from "../dao/models/cart.model.js";
import { messageModel } from "../dao/models/message.model.js";
// import ProductManager from "../productsManager.js";

const router = Router();
//  const Products1 = new ProductManager("products.json");
router.get("/", async (req, res) => {
  try {
    const products = await productModel.find().lean();
    res.render("index", { products, style: "index.css" });
    console.log("obtenido con exito")
  } catch (error) {
    console.log("cannot get products with mongoose", error);
  }
  //     let testUser={ name:'Hilda', lastname: "Lizarasu"}

  //     res.render('index',{user:testUser, style:'index.css'})
});

router.get("/chat", (req, res) => {
  res.render("chat", { style: "index.css" });
});
// //to get all the products
// router.get('/home',async(req, res)=>{
//     try {
//         const products = await Products1.getProducts();
//         let limit = parseInt(req.query.limit);
//         if (limit && limit <= products.length) {
//           products.length=limit
//         }
//           res.status(200).render('home',{products:products, style:'index.css'});

//       } catch (error) {
//          console.log("hubo un error: ", error);
//       }
// })

// router.get('/realtimeproducts',async (req, res)=>{
//     try {
//         const products = await Products1.getProducts();
//         let limit = parseInt(req.query.limit);
//         if (limit && limit <= products.length) {
//           products.length=limit
//         }
//           res.status(200).render('realTimeProducts',{products:products, style:'index.css'});

//       } catch (error) {
//          console.log("hubo un error: ", error);
//       }
// })

export default router;
