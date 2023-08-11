import { Router } from 'express'
import { CartModel } from "../dao/models/cart.model.js";

const router = Router()

//Crear un carrito
router.post("/create_cart", async(req, res)=>{
  try {
const result= await CartModel.create({products:[]})
res.send({ status: "sucess", payload: result });
} catch (error) {
  console.log("cannot create  cart with mongoose", error);
}
})

//agregar producto a un carrito
router.post("/carts/:idc/:idp", async (req, res)=>{
  let cartID= req.params.idc;
  let prodID= req.params.idp;
  let quantity= req.query.quantity||1
  let existingProduct=null
  try{
    const cart= await CartModel.findById(cartID)
    
    if(cart.products.length>0){
      existingProduct= cart.products.filter(item =>item.product._id==prodID)
     }
     if(!existingProduct){
      cart.products.push(
        {product:prodID,
        quantity})
       }
   else{
    console.log("el producto existe", existingProduct)
       cart.products.forEach(item=>{
       if(item.product._id==prodID){  
           item.quantity+=1
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
// Accion eliminar un carrito existente
router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
  const result= await CartModel.deleteOne({ _id: id});
  res.send({ status: "sucess", payload: result});
  }
  catch(error){
    console.log("cannot delete cart", error);
  }
});
// Accion eliminar todos los productos de un carrito existente
router.post("/deleteProducts_cart/:idCart", async (req, res) => {
  const id = req.params.idCart;
  const products=[];
  try {
  const result= await CartModel.updateOne({ _id: id}, {products: products});
  res.send({ status: "sucess", payload: result});
  }
  catch(error){
    console.log("cannot delete cart", error);
  }
});
export default router