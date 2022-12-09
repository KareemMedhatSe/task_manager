import mongoose from "mongoose";
import task_router from './routes/tasks.js'
import express from 'express';
import bodyParser from "body-parser";
import user_router from './routes/users.js'
const app=express();
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use('/task',task_router)
app.use('/auth',user_router)


const port=process.env.PORT||3000;

mongoose.connect('mongodb+srv://15975321:15975321@cluster0.uln7y.mongodb.net/?retryWrites=true&w=majority').then(()=>app.listen(port,()=>console.log(`workingg ${port}`))).catch((error)=>console.log(error.message))