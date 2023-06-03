class ProductManager {
  constructor() {
    this.products = []
  }
 
  getNextID = (elements) => {
    const count = elements.length;

    if (count > 0) {
      return elements[count - 1].id + 1;
    } else {
      return 1;
    }
  };
  getProducts(){
    return this.products
  }
  addProduct = (title, description, price, thumbnail, code, stock) => {
    const newProduct = {
      id: this.getNextID(this.products),
      title: title,
      description: description,
      price: price,
      thumbnail: thumbnail,
      code: code,
      stock: stock,
    };
   
    let arrayValues= this.products.map((prod)=>{Object.values(prod)})
   
    if(!arrayValues.includes(newProduct.code)){
        this.products.push(newProduct)
        console.log("estos son los valores",arrayValues)
        console.log("este es el code del nuevo producto",newProduct.code)
        arrayValues= this.products.map((prod)=>{Object.values(prod)})
    }
    
    else{
      console.log("prod repetido");
    }
  
  };
  
  //  getProductById=(idProd)=>{
  //   if(this.products.includes())
  //  }
}
const Products1= new ProductManager;
Products1.addProduct('manzanas', 'frutaroja',30, 'naurl', 1111,2)
console.log('estos son los prod finales',Products1.getProducts)
console.log('---------------------------------------------------')
Products1.addProduct('peras', 'frutaverde',50, 'naurl', 2222,28)

console.log('estos son los prod finales',Products1.getProducts)
console.log('---------------------------------------------------')
console.log('---------------------------------------------------')
Products1.addProduct('manzanas', 'frutaroja',30, 'naurl', 1111,2)
console.log('estos son los prod finales',Products1.getProducts)