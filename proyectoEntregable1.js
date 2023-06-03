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
      title: title,
      description: description,
      price: price,
      thumbnail: thumbnail,
      code: code,
      stock: stock,
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
   };
}
const Products1 = new ProductManager();

Products1.addProduct("manzanas", "frutaroja", 30, "naurl", 1111, 2);
Products1.addProduct("peras", "frutaverde", 50, "naurl", 2222, 28);
Products1.addProduct("bananas", "frutaroja", 30, "naurl", 1119); //CAMPO UNDEFINED
Products1.addProduct("duraznos", "frutaroja", 30, "naurl", 2222, 2); //no tiene que entrar codigo repetido
Products1.addProduct("naranjas", "frutaroja", 30, "naurl", 113, 4);
Products1.addProduct("uvas", "frutaroja", 30,null,  441, 2); //CAMPO UNDEFINED
Products1.addProduct("ciruelas", "frutaroja", 30, "naurl",null, 2); //CAMPO UNDEFINED
Products1.addProduct("sandias", "frutaroja", 30, "naurl", 1118, 2); 

 console.log("estos son los prod finales", Products1.getProducts());
 console.log("este es el prod por id: ",Products1.getProductById(3));

