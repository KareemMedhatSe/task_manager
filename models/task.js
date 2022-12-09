import mongoose from "mongoose";
import User from "./user.js";
const task=mongoose.Schema({
Title:{type:String,required:true},
body:{type:String,required:true},
finished:{type:Boolean,default:false},
author:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'User'}




},{timestamps:true})
export default mongoose.model('task',task)