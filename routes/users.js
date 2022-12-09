import { signUp,signIn ,update_user,logout, logoutAll, add_profilePic, delete_profilePic, get_profilePic} from "../controller/user.js";
import auth from "../middleware/user_auth.js";
import express from 'express'
import multer from 'multer'
const upload=multer({
    
    limits:{fileSize:1000000},
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){return cb(new Error('please upload an image of type png or jpg'))}
        cb(undefined ,true)
    }
    
})
const router=express.Router();
router.post('/signin',signIn)
router.post('/signup',signUp)
router.patch('/me',auth,update_user)
router.post('/logout',auth,logout)
router.post('/logoutAll',auth,logoutAll)
router.post('/profilePic',auth,upload.single('profilePic'),add_profilePic,(error,req,res,next)=>{res.status(400).send({error:error.message})})
router.delete('/profilePic',auth,delete_profilePic)
router.get('/profilePic/:id',get_profilePic)
export default router