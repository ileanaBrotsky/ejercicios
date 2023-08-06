import fs from "fs";
export default class CartManager {
  constructor(file) {
    this.file = file;
    this.path = "./dataBase-docs";
  }
  getNextID = async () => {
    const carts = await this.getCarts();
    const count = carts.length;
    if (count > 0) {
      let cart = carts[count - 1];
      let idNew = cart.id;
      return parseInt(idNew + 1);
    } else {
      return 1;
    }
  };

  addCart = async () => {
    //New Cart to add
    const newCart = {
      id: await this.getNextID(),
      products: [],
    };
    try {
      const allCarts = await this.getCarts();
      allCarts.push(newCart);
      const cartsInfile = JSON.stringify(allCarts, "\t");

      await fs.promises.writeFile(this.path + "/" + this.file, cartsInfile);
      console.log("se agregaron los datos,");
    } catch (error) {
      console.log("hubo un error: ", error);
    }
  };

  getCarts = async () => {
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

  getCartById = async (idCart) => {
    try {
      const carts = await this.getCarts();
      let cart = carts.find((element) => element.id === idCart);
      return cart ? cart : `No se encontro el producto por el id ${idCart}`;
    } catch (error) {
      console.log("hubo un error: ", error);
    }
  };
   updateCart = async (idProd, idCart) => {
      try {
        const allCarts = await this.getCarts();
        const cart = allCarts.find(
          (cart) => cart.id === idCart
        );
        if (cart) {
          allCarts.forEach((cart) => {
            if (cart.id === idCart) {
          let existProduct= cart.products.findIndex(prod=>prod.id=== idProd)
          console.log("el producto es",existProduct)
          if(existProduct!=-1){
          cart.products[existProduct].quantity= cart.products[existProduct].quantity +1
          }
          else{
            let newProduct= {id:idProd,quantity:1}
            cart.products.push(newProduct)
          }
          console.log("los productos en el carrito son",cart.products)
            }
          });
           const cartsInfile = JSON.stringify(allCarts, "\t");
          await fs.promises.writeFile(
            this.path + "/" + this.file,
            cartsInfile
          );
          console.log("se modificaron los datos");
        } else {
          console.log("No se encontró el carrito a modificar");
        }
      } catch (error) {
        console.log("hubo un error: ", error);
      }
  };


//   deleteProduct = async (idProd) => {
//     try {
//       const products = await this.getProducts();
//       const product = products.find((prod) => prod.id === idProd);
//       if (product) {
//         const result = products.filter((prod) => prod.id != idProd);
//         const productsInfile = JSON.stringify(result, "\t");
//         await fs.promises.writeFile(
//           this.path + "/" + this.file,
//           productsInfile
//         );
//         console.log("se ha eliminado el producto", idProd);
//       } else {
//         console.log("No se encontró el producto a eliminar");
//       }
//     } catch (error) {
//       console.log("hubo un error: ", error);
//     }
//   };
}
