import User from "../models/user.js";
import bcrypt from 'bcrypt'
import config from 'config'
import * as dotenv from 'dotenv'
dotenv.config()

import jwt from 'jsonwebtoken'
export const signIn=async(req,res)=>{
    const {email,password}=req.body;
    try {
        
        const userInfo=await User.findOne({email});
        if(!userInfo) return res.status(404).json({message:'user doesn`t exist'})
        
        const isPasswordCorrect = await bcrypt.compare(password,userInfo.password);
        if(!isPasswordCorrect){return res.status(400).json({message:'invalid credentials'+password+"//"+userInfo.password})}
        const token = await userInfo.generateUserToken()
        return res.status(200).json({userInfo,token});
    
    } catch (error) {
        res.status(500).json(error.message)
    }
    
    
    
    
    }


    export const signUp=async(req,res)=>{
        
        const {user_name,email,password}=req.body;
        
    try {
        
        const userInfo=await User.findOne({email});
        if(userInfo) return res.status(400).json({message:"the email is used by another account"});
        
        const hashedPassword=await bcrypt.hash(password,10);
        const result=await User.create({email,password:hashedPassword,user_name});
        const token = await result.generateUserToken();
      
        
        
        return res.status(200).json({result,token});
    } catch (error) {
        res.status(500).json({message:error.message})
    }
    
    
    }


    export const  update_user=async(req,res)=>{
        const updates =Object.keys(req.body)
        const fields=['user_name','password','email']
        var update=true;
        updates.every((update)=>{if(!updates.includes(update)){update=false}} )
       if(!update) res.status(400).send('one of the fields is incorrect')
       
        try {
            if(req.body.password){req.body.password = await bcrypt.hash(req.body.password,10)}
            
            updates.forEach((update)=>req.user[update]=req.body[update] )
            
            
            await req.user.save()
            return res.status(200).send(req.user)
        
        
        } catch (error) {
            res.status(400).send(error.message)
        }
        
        
        }
        export const logout=async(req,res)=>{
            try {
                const token=req.token;
                
                req.user.tokens=req.user.tokens.filter((token)=>{
                    return token.token !== req.token
    
    
                })
                await req.user.save()
                res.send()
            }
            catch (error) {
                res.status(500).send(error.message)
            }

        }

        export const logoutAll=async(req,res)=>{
            try {
                req.user.tokens=[];
                await req.user.save()
                res.status(200).send()
            } catch (error) {
                res.status(400).send(error.message)
                
            }



        }
        export const add_profilePic=async(req,res)=>{
        try {
            req.user.profilePic=req.file.buffer;
            await req.user.save()
            res.status(200).send('done')
            
        } catch (error) {
            res.status(400).send(error.message)
        }
            
        
        
        }
        export const delete_profilePic=async(req,res)=>{
           try {
            
           
            req.user.profilePic=undefined
            await req.user.save()
            res.status(200).send('successfully deleted')
           }
            catch (error) {
                res.status(400).send('erro')


            }

        }

        export const get_profilePic=async(req,res)=>{
            try {
                const user=await User.findById(req.params.id);
                if(!user||!user.profilePic){
                    throw new Error()
                }
                res.set('Content-Type','image/jpg')
                res.send(user.profilePic)
            } catch (error) {
                console.log(error.message)
                res.status(400).send(error.message)
            }


        }
        