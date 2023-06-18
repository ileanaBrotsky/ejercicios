import fs from "fs";
export default class ProductManager {
  constructor(file) {
    this.file = file;
    this.path = "./files-docs";
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
    try {
      const products = await this.getProducts();
      let prod = products.find((element) => element.id === idProd);
      return prod ? prod : `No se encontro el producto por el id ${idProd}`;
    } catch (error) {
      console.log("hubo un error: ", error);
    }
  };
  updateProduct = async (idProd, entry, value) => {
    if (entry != "id") {
      const products = await this.getProducts();
      const product = products.find((prod) => parseInt(prod.id) === idProd);
      if (product) {
        products.forEach((prod) => {
          if (prod.id === idProd) {
            prod[entry] = value;
          }
        });
        const productsInfile = JSON.stringify(products, "\t");
        await fs.promises.writeFile(
          this.path + "/" + this.file,
          productsInfile
        );
        console.log("se modificaron los datos,");
      } else {
        console.log("No se encontró el producto a modificar");
      }
    } else {
      console.log("EL campo que intenta actualizar es un campo protegido");
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
