import { Router } from "express";
import passport from "passport";
const router = Router();

//login
router.post('/login', passport.authenticate('login', '/login'), async (req, res) => {
  if (!req.user)  return res.status(400).send({ status: "error", error: "Valores incompletos" })
     
      req.session.user= {
       first_name: req.user.first_name,
       last_name: req.user.last_name,
       age: req.user.age,
       rol: req.user.rol,
       email: req.user.email
      }
        return  res.redirect('/products')
      })
    
// Registro 
router.post('/register', passport.authenticate('register', { failureRedirect: '/register', }), async (req, res) => {
          res.redirect('/login')
      }
  )
//github
router.get(
  "/login-github", 
  passport.authenticate('github', {scope: ['user:email']}),
  async (req, res)=>{}
  )

router.get(
  "/githubcallback", 
  passport.authenticate('github', { failureRedirect}),
  async (req, res)=>{
console.log("callback: ", req.user)
req.session.user= req.user
console.log(req.session)
res.redirect("/products")
  }
)

export default router;