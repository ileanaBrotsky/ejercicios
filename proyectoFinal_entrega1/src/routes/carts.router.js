import { Router } from 'express'
import CartManager from "../../cartsManager.js";
import ProductManager from "../../productsManager.js";
const router = Router()

const Carts1 = new CartManager("carts.json");
const Products1 = new ProductManager("products.json");

router.post('/', async (req, resp) => {
    try{
      resp.status(200).send( await Carts1.addCart())
    }   catch (error) {
        console.log("hubo un error: ", error);
      }
    });

router.get("/:cid", async (req, resp) => {
  try {
    resp.status(200).send(await Carts1.getCartById(parseInt(req.params.cid)));
  } catch (error) {
    console.log("hubo un error: ", error);
  }
});

router.post('/:cid/product/:pid', async (req, resp) => {
    try{
       resp.status(200).send(await Carts1.updateCart(parseInt(req.params.pid),parseInt(req.params.cid)))
    }   catch (error) {
        console.log("hubo un error: ", error);
      }
    });
    


router.get("/", async (req, resp) => {
  try {
    const carts = await Carts1.getCarts();
    let limit = parseInt(req.query.limit);
    if (limit && limit <= carts.length) {
      carts.length=limit
    }
      resp.status(200).send(carts);
  } catch (error) {
     console.log("hubo un error: ", error);
  }
});

export default router