import mongoose from "mongoose";
import Task from "../models/task.js";



export const create_task=async(req,res)=>{
    const new_task=new Task({
        ...req.body,
        author:req.user.id 

    });
   
    try {
        
        await new_task.save();
        res.status(200).json(new_task)    
    } catch (error) {
        res.status(404).json({message:error.message})
    }
    



}


export const get_tasks=async(req,res)=>{
   const filters={}
   const sort ={}
     if(req.query.finished){
        
        filters.finished=req.query.finished==='true'
        
     }
     if(req.query.sortBy){
        const parts=req.query.sortBy.split(':')
        sort[parts[0]]=parts[1]==='desc'?-1:1

     }
try {
   await req.user.populate({path:'tasks',match:filters,
   options:{limit:parseInt(req.query.limit),skip:parseInt(req.query.skip),sort}})
   res.status(200).send(req.user.tasks)


} catch (error) {
    res.status(400).send(error.message);
    
}
}


export const delete_task=async(req,res)=>{
try {
    const task=await Task.findOne({_id:req.params.id,author:req.user._id});
    
    if(!task){res.status(400).send('no such id published by this user')}
    
   await Task.findByIdAndRemove(req.params.id)
    res.status(200).send('done')
    
   
} catch (error) {
    res.send(error.message)
}
    




}

export const  update_task=async(req,res)=>{
const updates=['Title','body','finished']
const requested_updates=Object.keys(req.body);
const verification_update=requested_updates.every((update)=>updates.includes(update))
if(!verification_update){return res.status(400).send('error')}
try {
    const task=await Task.findOne({_id:req.params.id,author:req.user._id});
    if(!task) return res.status(400).send('no such task with this id');
    requested_updates.forEach((update)=>{task[update]=req.body[update]})
    await task.save()
    return res.status(200).send(task)


} catch (error) {
    res.status(400).send(error.message)
}


}






