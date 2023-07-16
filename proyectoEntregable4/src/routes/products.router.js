import { Router } from 'express'
import {uploader} from '../utils.js'
import ProductManager from "../productsManager.js";

const router = Router()

const Products1 = new ProductManager("products.json");

router.get("/", async (req, resp) => {
  try {
    const products = await Products1.getProducts();
    let limit = parseInt(req.query.limit);
    if (limit && limit <= products.length) {
      products.length=limit
    }
      resp.status(200).send(products);
   
  } catch (error) {
     console.log("hubo un error: ", error);
  }
});
router.get("/:pid", async (req, resp) => {
  try {
    resp.status(200).send(await Products1.getProductById(parseInt(req.params.pid)));
  } catch (error) {
    console.log("hubo un error: ", error);
  }
});

router.post('/', uploader.single('file'), async (req, resp) => {
  if (!req.file) {
    return resp.status(400).send({ status: "error", error: "No se encontró el archivo" });
  }
try{
  let title= req.body.title;
  let description= req.body.description;
  let price= parseInt(req.body.price);
  let thumbnail= [req.file.path];
  let code= req.body.code;
  let stock= parseInt(req.body.stock);
  let category= req.body.category;
  resp.status(200).send( await Products1.addProduct(title, description, price, thumbnail, code, stock,category))
  console.log(req.file)
}   catch (error) {
    console.log("hubo un error: ", error);
  }
});

router.put("/:pid", async (req, resp) => {
  try {
    let entry= req.body.entry
    let value= req.body.value
    resp.status(200).send(await Products1.updateProduct(parseInt(req.params.pid), entry, value));
  } catch (error) {
    console.log("hubo un error: ", error);
  }
});
router.delete("/:pid", async (req, resp) => {
  try {
    resp.status(200).send(await Products1.deleteProduct(parseInt(req.params.pid)));
  } catch (error) {
    console.log("hubo un error: ", error);
  }
});
export default router