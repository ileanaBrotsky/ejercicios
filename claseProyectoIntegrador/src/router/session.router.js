import {Router} from 'express';
import passport from 'passport'

const router= Router()

 router.get('/', (req, res)=>{res.render('home',{}) })

 router.get('/login-github', 
 passport.authenticate('github', {scope:['user:email']}),
 (req, res)=>{ }
 )


 router.get('/githubcallback',passport.authenticate('github',{failureRedirect: '/fail-github'}),
  (req, res)=>{
    console.log('Callback: ', req.user)
res.cookie('keyCookieForJWT', req.user.token).redirect('/')

})



  router.get('/fail-github', (req, res)=>{
    res.render('fail_login',{})
  })

 router.get('/profile', 
  passport.authenticate('jwt',{session:false}),
  (req, res)=>{
    console.log(req.user)
    const {user}= req 
    res.render('profile',user) 
})



 export default router