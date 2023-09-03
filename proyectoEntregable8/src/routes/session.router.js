import { Router } from "express";
import passport from "passport";
const router = Router();

//login
router.post('/login', passport.authenticate('login', '/login'), async (req, res) => {
  if (!req.user)  return res.status(401).send({ status: "error", error: "Valores incompletos" })
     
      // req.session.user= {
      //  first_name: req.user.first_name,
      //  last_name: req.user.last_name,
      //  age: req.user.age,
      //  rol: req.user.rol,
      //  email: req.user.email
      // }
      const access_token = generateToken(user)

      res.cookie('secretCookie', access_token, {
          maxAge: 60*60*1000,
          httpOnly: true
      }).redirect('/products')
      })
    
// Registro 
router.post('/register', passport.authenticate('register', { failureRedirect: '/register', }), async (req, res) => {

  const access_token = generateToken(user)

  res.cookie('secretCookie', access_token, {
      maxAge: 60*60*1000,
      httpOnly: true
  }).redirect('/login')
      }
  )

  router.get('/current', passport.authenticate('jwt',{session:false}), (req, res) => {
    console.log('Path /current')
    res.send({ status: 'success', payload: req.user })
})
export default router;