import { Router } from "express";
import { ProductModel } from "../dao/models/product.model.js";
import { CartModel } from "../dao/models/cart.model.js";
import { MessageModel } from "../dao/models/message.model.js";
import passport from "passport";

const router = Router();
//MIDLEWARES
function auth(req, res, next){
  return req.session?.user ? next() : res.status(401).redirect('/')
  }
  
  // function authAdmin(req, res, next){
  //   return req.session?.user && req.session.admin ? next() : res.status(401).send('Auth error')
  //   } 
//LOGIN
//home entry, if there are user goes to products if not, goes to login
router.get("/",  (req, res)=>{
  res.redirect('/login')
      })
//login
router.get("/login",  (req, res)=>{
        if(req.session?.user){
            res.redirect('/products')
        }
      res.render('login',{layout:'inauthLayout'})
          })
//register view
 router.get("/register",  (req, res)=>{   
  if(req.session?.user){
    res.redirect('/products')
}
      res.render('register',{layout:'inauthLayout'})
   })

//logout
router.get("/logout",(req, res)=>{   
  req.session.destroy(err=>{
    if(!err)  res.redirect('/')
    else return res.json({status:"Logout ERROR", body:err})
  })
})

//github login
router.get(
  "/login-github", 
  passport.authenticate('github', {scope: ['user:email']}),
  async (req, res)=>{}
  )

router.get(
  "/githubcallback", 
  passport.authenticate('github', { failureRedirect:'/login'}),
  async (req, res)=>{
console.log("callback: ", req.user)
req.session.user= req.user
console.log(" la sesion tiene", req.session)
res.redirect("/products")
  }
)
//====================================================================//
//CARRITO 
// Ver todos los carritos
router.get("/carts", auth, async (req, res) => {
  try {
 const carts= await CartModel.find().populate("products.product").lean().exec()
    res.render('carts',{carts, style:'index.css'})
  } catch (error) {
    console.log("cannot get carts with mongoose", error);
  }
});

//Ver un carrito
router.get("/carts/:idc", auth, async (req, res)=>{
let cartID= req.params.idc;
let totalAmount=0
console.log("el cartId",cartID)
try{
 const cart= await CartModel.findById(cartID).populate('products.product').lean().exec()
 cart.products.forEach(item=>{ 
  totalAmount= totalAmount + item.quantity * item.product.price  
 })
      res.render('my_cart',{cart, totalAmount})
}catch (error) {
  console.log("cannot get carts with mongoose", error);
}
})
//====================================================================//
//  PRODUCTS 
// Ver todos los productos con accion agregar al carrito, con aggregate y pagination
router.get("/products", auth, async (req, res) => {
   let limit =parseInt(req.query?.limit)||10
   let page=parseInt(req.query?.page) || 0
   let sort=parseInt(req.query?.sort)||1
   //example price,500
   const queryParams= req.query?.query||''
  //  console.log("la queryParams", queryParams)
  let queryMongo={};
   if(queryParams){
    let field= queryParams.split(",")[0]
    let value= queryParams.split(",")[1]
     
    if(!isNaN(parseInt(value)))  {
      value= parseInt(value)
    }
    queryMongo[field]=value
  console.log("la query de mongo es", queryMongo)
   }
  try {
let products= await ProductModel.aggregate([
  //1-buscar con un filtro o todos
  // {$match: {queryMongo}},//NO ANDA
  //2-buscar con limite o 10
   {$limit: limit},
   //3- ordenar asc o desc segun corresponda o nada
   {$sort: {price: sort}}

])
let user = req.session.user
res.render("products", { products, user, style: "index.css" });
  } catch (error) {
    console.log("cannot get products with mongoose", error);
  }
});

// Ver todos los productos con PAGINACION
router.get("/products_paginated", auth, async (req, res) => {
  let limit =parseInt(req.query?.limit)||10
   let page=parseInt(req.query?.page) || 1
   let sort=parseInt(req.query?.sort)||1
   //example price,500
   const queryParams= req.query?.query||''
  //  console.log("la queryParams", queryParams)
  let queryMongo={};
   if(queryParams){
    let field= queryParams.split(",")[0]
    let value= queryParams.split(",")[1]
     
    if(!isNaN(parseInt(value)))  {
      value= parseInt(value)
    }
    queryMongo[field]=value
  //console.log("la query de mongo es", queryMongo)
   }
 try {
     const result = await ProductModel.paginate(queryMongo,{
       page,
       limit,
       lean: true
     })
res.render("products_paginated", result);
 } catch (error) {
   console.log("cannot get products with mongoose", error);
 }
});


// vista para editar productos con disparadores de acciones
router.get("/edit_products", auth, async (req, res) => {
  try {
    const products = await ProductModel.find().lean().exec();
    res.render('edit_products',{products, style:'index.css'})
  } catch (error) {
    console.log("cannot get products with mongoose", error);
  }
});
// Vista para agregar nuevo producto
router.get("/create", async (req, res) => {
  res.render("create", {});
});

// Vista para modificar producto existente
router.get("/update/:code", async (req, res) => {
  const code = req.params.code;
  try {
    const productSelected = await ProductModel.findOne({ code: code });
    res.render("update", productSelected);
  }
  catch (error) 
  {
    console.log("cannot update products", error);
  }
});
//Vista para ver un producto
router.get("/product/:code",auth, async (req, res) => {
  const code = req.params.code;
  try {
    const productSelected = await ProductModel.findOne({ code: code });
    res.render("product_view", productSelected);
  }
  catch (error) 
  {
    console.log("cannot see product", error);
  }
});


//====================================================================//
//CHAT- con websockets
router.get("/chat",auth, async(req, res) => {
  try {
    const messages = await MessageModel.find().lean().exec();
  res.render("chat", { messages, style: "index.css" });
  }
  catch (error) {
    console.log("cannot get messages with mongoose", error);
  }
});
//=============CRUD CON SOCKETS=====================//
router.get('/realtimeproducts', auth, async (req, res)=>{
  try {
    const products = await ProductModel.find().lean().exec();
      let limit = parseInt(req.query.limit);
      if (limit && limit <= products.length) {
        products.length=limit
      }
        res.status(200).render('realTimeProducts',{products:products, style:'index.css'});
     
    } catch (error) {
       console.log("hubo un error: ", error);
    }
})

//=============================================================//

export default router;
