import jwt,{decode} from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import User from '../models/user.js'
dotenv.config();
const auth = async(req,res,next)=>{
    try {
        
        var token=req.header('Authorization').replace('Bearer ',"")
        
        const decoded_token=jwt.verify(token,process.env.jwt_secrect_key)
        
        const user=await User.findOne({_id:decoded_token.id,'tokens.token':token})
        
        if(!user)throw new Error();
        
        req.token=token
        req.user=user
        next();
    }
    catch (error) {
     
        res.status(400).send(error.message)
    }

}
export default auth;