import express from "express";
import dotenv from "dotenv";
import dbConnect from "./DB/dbConnect.js";
import authRouter from './Routes/authUser.js'
import messageRouter from './Routes/messageRoute.js'
import cookieParser from 'cookie-parser'
import userRouter from './Routes/userRoute.js'
import {app,server} from './Socket/socket.js'
import path from "path";

const __dirname = path.resolve();

dotenv.config();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRouter);
app.use('/api/message',messageRouter);
app.use('/api/user',userRouter);




app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"frontend","dist","index.html"))
})


const port=process.env.PORT || 3000;





server.listen(port,()=>{
dbConnect();
    console.log(`working at ${port}`);
});