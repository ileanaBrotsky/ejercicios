const fs = require("fs");

class ProductManager {
  constructor(file) {
    this.file = file;
    this.path = "./files-fs-docs";
  }
  getNextID = async () => {
    const products = await this.getProducts();
    const count = products.length;
    if (count > 0) {
      let product = products[count - 1];
      let idNew = product.id;
      return parseInt(idNew + 1);
    } else {
      return 1;
    }
  };

  addProduct = async (title, description, price, thumbnail, code, stock) => {
    //New product to add
    const newProduct = {
      id: await this.getNextID(),
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    //flags to code new and no empty values
    let isFull = true;
    let isNew = true;
    //check no empty values
    if (
      Object.values(newProduct).includes(undefined) ||
      Object.values(newProduct).includes(null)
    ) {
      isFull = false;
    }
    //check new code
    const allProducts = await this.getProducts();

    if (allProducts.length > 0) {
      allProducts.forEach((prod) => {
        if (prod.code === newProduct.code) {
          isNew = false;
        }
      });
    }
    if (isFull && isNew) {
      allProducts.push(newProduct);
      const productsInfile = JSON.stringify(allProducts, "\t");

      await fs.promises.writeFile(this.path + "/" + this.file, productsInfile);
      console.log("se agregaron los datos,");
    }
  };
  getProducts = async () => {
    try {
      const content = await fs.promises.readFile(
        this.path + "/" + this.file,
        "utf-8"
      );
      const contentObj = JSON.parse(content);
      return contentObj;
    } catch (error) {
      return [];
    }
  };
  getProductById = async (idProd) => {
    const products = await this.getProducts();
    let prod = products.find((element) => element.id === idProd);
    return prod ? prod : "No se encontro el producto por ese id";
  };
  updateProduct = async (idProd, entry, value) => {
    const products = await this.getProducts();
    const product = products.find((prod) => parseInt(prod.id)=== idProd);
    if (product) {
    products.forEach((prod) => {
      if (prod.id === idProd) {
        prod[entry] = value;
      }
    });
    const productsInfile = JSON.stringify(products, "\t");
    await fs.promises.writeFile(this.path + "/" + this.file, productsInfile);
    console.log("se modificaron los datos,");
  } else {
    console.log("No se encontró el producto a modificar");
  }
  };
  deleteProduct = async (idProd) => {
    const products = await this.getProducts();
    const product = products.find((prod) => prod.id === idProd);
    if (product) {
      const result = products.filter((prod) => prod.id != idProd);
      const productsInfile = JSON.stringify(result, "\t");
      await fs.promises.writeFile(this.path + "/" + this.file, productsInfile);
    } else {
      console.log("No se encontró el producto a eliminar");
    }
  };
}
async function run() {
  console.log(
    "-----------------------------------------------------------------------------------"
  );
  const Products1 = new ProductManager("products.json");
  console.log(await Products1.getProducts());
  await Products1.addProduct(
    "producto prueba",
    "Este es un producto prueba ",
    200,
    "Sin imagen",
    "abc123",
    25
  );
  console.log(await Products1.getProducts());
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
  console.log(await Products1.getProductById(8));
   await Products1.updateProduct(2, "code", "hhhhh");
//   await Products1.deleteProduct(2);
//   await Products1.deleteProduct(2);
}

run();
