import { Router } from 'express'

import { CartModel } from "../dao/models/cart.model.js";
const router = Router()

//Crear un carrito
router.post("/api/carts/create_cart", async(req, res)=>{
  try {
await CartModel.create({products:[]})
res.send({ status: "sucess", payload: result });
} catch (error) {
  console.log("cannot create  cart with mongoose", error);
}
})

//agregar producto a un carrito
router.post("/api/carts/carts/:idc/:idp", async (req, res)=>{
  let cartID= req.params.idc;
  let prodID= req.params.idp;
  let quantity= req.query.quantity||1
  let existingProduct=null
  try{
    const cart= await CartModel.findById(cartID)
    console.log("el carrito es", cart.products)
    
    if(cart.products.length>0){
      console.log('hay productos')
      existingProduct= cart.products.find(p=>p.id==prodID)
    }
       if(!existingProduct){
      console.log("el producto no existe")
      cart.products.push(
        {product:prodID,
        quantity})
      }
  else{
      cart.products.forEach(p=>{
        if(p.id===prodID){  
          console.log("el producto existe")
          p.quantity=p.quantity+quantity
          }
        })
      }
  cart.save()
  res.redirect("/carts");
}    
   catch (error) {
      console.log("cannot get carts with mongoose", error);
    }   
})


export default router