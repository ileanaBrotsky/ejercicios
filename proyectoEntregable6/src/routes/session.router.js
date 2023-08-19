import { Router } from "express";
import { UserModel } from "../dao/models/user.model.js";
const router = Router();

router.post("/login",  async(req, res)=>{
    const {email, password}= req.body
    try{
        const user= await UserModel.findOne({email, password})
        console.log("el usuario es", user)
        if(!user)  return  res.redirect('/login')
        else{
          if(user.admin){
            console.log('el usuario es admin')
            req.session.admin=true
          }
      req.session.user= user
        return  res.redirect('/products')
      } 
    }
   catch (error) {
        console.log("cannot find user", error);
      }
     
 
    })

router.post("/register",  async (req, res)=>{
    const user= req.body 
    try{
    await UserModel.create(user)
        return  res.redirect('/login')
    }
    catch (error) {
         console.log("cannot find user", error);
       }
      
          })

export default router;