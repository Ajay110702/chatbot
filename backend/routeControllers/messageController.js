import Conversation from '../Models/conversationModels.js'
import Message from '../Models/messageModels.js'
import { getRecieverSocketId , io } from '../Socket/socket.js';
export const sendMessage=async(req,res)=>{
try {
    const {messages}=req.body;
    const {id:recieverId}=req.params;
    const senderId=req.user._conditions._id;

    let chats=await Conversation.findOne({
        participants:{$all:[senderId,recieverId]}
    })
    if(!chats){
        chats=await Conversation.create({
        participants:[senderId,recieverId],
        })
    }
    const newMessages=new Message({
        senderId,
        recieverId,
        message:messages,
        conversationId:chats._id
    })
    if(newMessages){
        chats.messages.push(newMessages._id);
    }

    await Promise.all([chats.save(),newMessages.save()]);

    //SOCKET.IO function
    const recieverSocketId = getRecieverSocketId(recieverId);
    if(recieverSocketId){
       io.to(recieverSocketId).emit("newMessage",newMessages)
    }

   res.status(201).send(newMessages)

} catch (error) {
   res.status(500).send({
       success: false,
       message: error
   })
   console.log(`error in sendMessage ${error}`);
}
}



export const getMessages=async(req,res)=>{
try {
    const {id:recieverId}=req.params;
    const senderId=req.user._conditions._id;
    
    const chats=await Conversation.findOne({
        participants:{$all:[senderId,recieverId]}
    }).populate("messages");
    if(!chats) return res.status(201).send([]);
    const message=chats.messages;
    res.status(200).send(message);
} catch (error) {
    res.status(500).send({
        success: false,
        message: error
    })
    console.log(error);
}
}