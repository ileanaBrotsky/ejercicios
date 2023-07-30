import { Router } from "express";
import { productModel } from "../dao/models/product.model.js";
import { cartModel } from "../dao/models/cart.model.js";
import { messageModel } from "../dao/models/message.model.js";

const router = Router();

//============ CRUD ================================//
//  Ver todos los productos
router.get("/", async (req, res) => {
  try {
    const products = await productModel.find().lean().exec();
    res.render("index", { products, style: "index.css" });
  } catch (error) {
    console.log("cannot get products with mongoose", error);
  }
});

// Vista para agregar nuevo producto
router.get("/create", async (req, res) => {
  res.render('create', {})
});
//Accion de agregar producto nuevo
router.post('/create', async (req, res) => {
  const productNew = req.body
  console.log({ productNew })
  const productGenerated = new productModel(productNew)
  await productGenerated.save()
  console.log({ productGenerated });
  res.redirect('/')
})
// Vista para modificar producto existente
router.get("/update/:code", async (req, res) => {
  console.log("el req es", req.params);
  const code = req.params.code
  try {
    const productSelected = await productModel
      .findOne({ code: code })
      .lean().exec();
    console.log("obtenido con exito", productSelected);
    res.render("update", productSelected);
  } catch (error) {
    console.log("cannot get products with mongoose", error);
  }
});

//Modificar un producto existente
router.put("/update/:code", async (req, res) => {
  console.log("el body que llega es", req.body);
  //ME FALTA TERMINAR
});
// Eliminar un producto existente
router.get('/delete/:code', async (req, res) => {
  const code = req.params.code

  await productModel.deleteOne({ code: code })
  res.redirect('/')
})

//=============================================================//
//chat con websockets
router.get("/chat", (req, res) => {
  res.render("chat", { style: "index.css" });
});


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
