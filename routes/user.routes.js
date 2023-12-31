import express from 'express';
import userValidation from '../middleware/validation.js'
import auth from '../middleware/auth.js'
import {signUpValidationSchema,signInValidationSchema} from '../validation/user.validation.js'
import {signup, login, updateuser, hdeleteuser, sdeleteuser, logout, loginGoogle, getAllUsers, getUser, getUserPPic, setUserPPic} from '../controllers/user.controller.js'



const userRoutes = express.Router()

userRoutes.get("/getAllUsers",getAllUsers)
userRoutes.get("/getUser",getUser)
userRoutes.get("/getUserPPic",getUserPPic)
userRoutes.post("/setUserPPic",setUserPPic)
userRoutes.post("/signup",userValidation(signUpValidationSchema,'body'),signup)
userRoutes.post("/login",userValidation(signInValidationSchema,'body'),login)
userRoutes.post("/loginGoogle",loginGoogle)
userRoutes.put("/updateuser",auth,updateuser)
userRoutes.delete("/hdeleteuser",auth,hdeleteuser)
userRoutes.put("/sdeleteuser",auth,sdeleteuser)
userRoutes.put("/logout",auth,logout)







export default userRoutes
