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
        const NewProducts=[];
      for (let i = 0; i < limit; i++) {
        NewProducts.push(products[i]);
      }
      resp.status(200).send( NewProducts);
    }
    else{
        resp.status(200).send(products);
    }
  } catch (error) {
 //   console.log("hubo un error: ", error);
  }
});

app.get("/products/:pid", async (req, resp) => {
  try {
//      let id=parseInt(req.params.pid)
//     const prod = await Products1.getProductById(id);
//    console.log("el prod es", prod)
    resp.status(200).send(await Products1.getProductById(parseInt(req.params.pid)));
  } 
  catch (error) {
    console.log("hubo un error: ", error);
  }
});
app.listen(8080,()=>console.log("Running..."));

async function run() {
  //   console.log(
  //     "-----------------------------------------------------------------------------------"
  //   );
  //
  //   console.log(await Products1.getProducts());
  await Products1.addProduct(
    "producto prueba",
    "Este es un producto prueba ",
    200,
    "Sin imagen",
    "abc123",
    25
  );
  //   console.log(await Products1.getProducts());
  await Products1.addProduct(
    "producto prueba 2",
    "Este es un segundo producto 2",
    200,
    "Sin imagen",
    "455df",
    25
  );
  await Products1.addProduct(
    "producto prueba 3",
    "Este es un tercer producto 3",
    300,
    "Sin imagen",
    "eec123",
    25
  );
  //console.log(c);
  //    await Products1.updateProduct(2, "code", "452a");
  // //   await Products1.deleteProduct(2);
  // //   await Products1.deleteProduct(2);
}

 //run();
