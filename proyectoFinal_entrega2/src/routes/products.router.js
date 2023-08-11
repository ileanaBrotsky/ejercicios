import { Router } from 'express'
import { ProductModel } from "../dao/models/product.model.js";
const router = Router()

//Accion agregar producto nuevo
router.post("/api/products/create", async (req, res) => {
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

//Accion modificar un producto existente
router.post("/api/products/update/:code", async (req, res) => {
  const code = req.params.code;
  req.body.img= [req.body.img]
  let productToUpdate = req.body;
  console.log("el producto modificado", productToUpdate)
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
  await ProductModel.updateOne({ code: code }, productToUpdate);
  console.log(" modificado", productToUpdate)
  res.redirect("/edit_products");
  }
  catch(error){
    console.log("cannot update products", error);
  }
});


// Accion eliminar un producto existente
router.get("/api/products/delete/:code", async (req, res) => {
  const code = req.params.code;
  try {
  await ProductModel.deleteOne({ code: code });
  res.redirect("/products");
  }
  catch(error){
    console.log("cannot delete product", error);
  }
});

export default router