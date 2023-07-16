import express from 'express';

import ProductManager from "../productsManager.js";

 const router= express.Router();
 const Products1 = new ProductManager("products.json");
 router.get('/',(req, res)=>{
    let testUser={ name:'Hilda', lastname: "Lizarasu"}
    
    res.render('index',{user:testUser, style:'index.css'})
})
//to get all the products
router.get('/home',async(req, res)=>{
    try {
        const products = await Products1.getProducts();
        let limit = parseInt(req.query.limit);
        if (limit && limit <= products.length) {
          products.length=limit
        }
          res.status(200).render('home',{products:products, style:'index.css'});
       
      } catch (error) {
         console.log("hubo un error: ", error);
      }
})

router.get('/realtimeproducts',async (req, res)=>{
    try {
        const products = await Products1.getProducts();
        let limit = parseInt(req.query.limit);
        if (limit && limit <= products.length) {
          products.length=limit
        }
          res.status(200).render('realTimeProducts',{products:products, style:'bootstrap.css'});
       
      } catch (error) {
         console.log("hubo un error: ", error);
      }
})


 export default router;