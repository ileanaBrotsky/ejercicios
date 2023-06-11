class ProductManager {
  constructor() {
    this.products = [];
  }

  getNextID = () => {
    const count = this.products.length;

    if (count > 0) {
      return this.products[count - 1].id + 1;
    } else {
      return 1;
    }
  };
  getProducts=() =>  this.products

  getProductById=(idProd)=>{
  let prod= this.products.find((element) => element.id === idProd);
  return prod ? prod : "Not found"
  }
 
  addProduct = (title, description, price, thumbnail, code, stock) => {
    const newProduct = {
      id: this.getNextID(),
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    let isFull = true;
    let isNew = true;
   if(Object.values(newProduct).includes(undefined)||Object.values(newProduct).includes(null)){
    isFull = false
  }
   this.products.forEach(prod => {
    if(prod.code === newProduct.code){
    isNew = false;
   }})
  
  if(isFull &&isNew){
    this.products.push(newProduct)
  }
  else{
    console.log("El Producto no ha podido agregarse")
  }
   };
}
const Products1 = new ProductManager();
console.log(Products1.getProducts());
Products1.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
console.log( Products1.getProducts());
Products1.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);


 console.log("este es el prod por id: ",Products1.getProductById(3));

