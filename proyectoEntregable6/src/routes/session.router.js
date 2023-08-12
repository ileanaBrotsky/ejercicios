import { Router } from "express";
import { UserModel } from "../dao/models/user.model.js";
const router = Router();

router.post("/login",  async(req, res)=>{
    const {email, password}= req.body
    try{
        const user= await UserModel.findOne({email, password})
        if(!user)  return  res.redirect('/login')
        else  req.session.user= user
        return  res.render('products', user)
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