import fs from "fs";
export default class ProductManager {
  constructor(file) {
    this.file = file;
    this.path = "./dataBase-docs";
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

  addProduct = async (title, description, price, thumbnail=[], code, stock,category) => {
    //New product to add
    const newProduct = {
      id: await this.getNextID(),
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
      status: true
    };
    //flags to code new and no empty values
    let isFull = true;
    let isNew = true;
    //message to return
    let message=""
    //check no empty values
    if (
      Object.values(newProduct).includes(undefined) ||
      Object.values(newProduct).includes(null)
    ) { console.log("hay un problema con los valores",Object.entries(newProduct))
      isFull = false;
    }
    try{
     const allProducts = await this.getProducts();
    //check new code
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
      message="se agregaron los datos"
      console.log("se agregaron los datos");
    }
  }
  catch (error) {
    console.log("hubo un error: ", error);
    message="hubo un error"+ error
  }
  return message;
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
      try{
      const allProducts = await this.getProducts();
      const product = allProducts.find((prod) => parseInt(prod.id) === idProd);
      if (product) {
        allProducts.forEach((prod) => {
          if (prod.id === idProd) {
            prod[entry] = value;
          }
        });
        const productsInfile = JSON.stringify(allProducts, "\t");
        await fs.promises.writeFile(this.path + "/" + this.file, productsInfile);
        console.log("se modificaron los datos");
      } else {
        console.log("No se encontró el producto a modificar");
    }
  } catch (error) {
    console.log("hubo un error: ", error);
  }

    } else {
      console.log("EL campo que intenta actualizar es un campo protegido");
    }
  };
  deleteProduct = async (idProd) => {
    try{
    const products = await this.getProducts();
    const product = products.find((prod) => prod.id === idProd);
    if (product) {
      const result = products.filter((prod) => prod.id != idProd);
      const productsInfile = JSON.stringify(result, "\t");
      await fs.promises.writeFile(this.path + "/" + this.file, productsInfile);
      console.log("se ha eliminado el producto", idProd)
    } else {
      console.log("No se encontró el producto a eliminar");
    }
  }
  catch (error) {
    console.log("hubo un error: ", error);
  }
  };
}
