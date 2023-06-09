import express from "express";
import ProductManager from "../productManager.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const Products1 = new ProductManager("productsApi.json");

app.get("/products/", async (req, resp) => {
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

app.get("/products/:pid", async (req, resp) => {
  try {
    resp.status(200).send(await Products1.getProductById(parseInt(req.params.pid)));
  } catch (error) {
    console.log("hubo un error: ", error);
  }
});
app.listen(8080, () => console.log("Running..."));
