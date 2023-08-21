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

export default router;