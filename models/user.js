import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config()
const userSchema=mongoose.Schema({
    user_name:{type:String,required:true,trim:true},
    email:{type:String,lowercase:true,required:true,validate(value){if(!validator.isEmail(value)){throw new Error('Email is not valid');}}},
    password:{
        type:String,required:true},
tokens:[{token:{type:String,required:true}}],
profilePic:{type:Buffer}
    
},{timestamps:true,toJSON: {virtuals: true}})

userSchema.virtual('tasks',{
ref:'task',
localField:'_id',
foreignField:'author'

})
userSchema.methods.generateUserToken=async function(){
    
    const token= await jwt.sign({email:this.email,id:this._id.toString()},process.env.jwt_secrect_key,{expiresIn:'1h'})
    this.tokens=this.tokens.concat({token})
    await this.save()
    
    return token;
}
userSchema.methods.toJSON=function(){
const user=this
const userObject=user.toObject()
delete userObject.password;
delete userObject.tokens;
delete userObject.profilePic;
return userObject
}
export default mongoose.model('User',userSchema)