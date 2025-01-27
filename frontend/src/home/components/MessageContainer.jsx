/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState,useRef } from 'react'
import userConversation from '../../Zustans/useConversation'
import { useAuth } from '../../context/AuthContext';
import {TiMessages} from 'react-icons/ti'
import { IoArrowBackSharp,IoSend } from 'react-icons/io5';
import axios from 'axios';
import {useSocketContext} from '../../context/SocketContext'
import notify from '../../assets/sound/notification.mp3'
// import { format } from 'date-fns';

const MessageContainer = ({onBackUser}) => {
  const { messages, setMessage, selectedConversation, setSelectedConversation } = userConversation();
 const {socket}=useSocketContext();
  const {authUser} =useAuth();
 const [Loading,setLoading]=useState(false);
 const lastMessageRef=useRef();
 const [sendData , setSendData] = useState("")
 const [sending , setSending] = useState(false);



 useEffect(()=>{
  socket?.on("newMessage",(newMessage)=>{
    const sound=new Audio(notify);
    sound.play();
    setMessage([...messages,newMessage]);
  })
  return ()=>socket?.off("newMessage");
 },[socket,setMessage,messages]);

  useEffect(()=>{
    setTimeout(()=>{
      lastMessageRef?.current?.scrollIntoView({behavior:'smooth'})
    },100)
   },[messages])

  

 useEffect(()=>{
  const getMessages=async ()=>{
    setLoading(true);
    try {
      const get=await axios.get(`/api/message/${selectedConversation?._id}`);
      const data=await get.data;
      if(data.success === false){
        setLoading(false);
        console.log(data.message);
      }
      setLoading(false);
      setMessage(data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  if(selectedConversation?._id) getMessages();
 },[selectedConversation?._id,setMessage])
 console.log(messages);

 const handleMessage=(e)=>{
  setSendData(e.target.value);
 }

 const handleSubmit=async(e)=>{
  e.preventDefault();
  setSending(true);
  try {
      const res =await axios.post(`/api/message/send/${selectedConversation?._id}`,{messages:sendData});
      const data = await res.data;
      if (data.success === false) {
          setSending(false);
          console.log(data.message);
      }
      setSending(false);
      setSendData('')
      setMessage([...messages,data])
  } catch (error) {
      setSending(false);
      console.log(error);
  }
 };
  return (
    <div className='md:min-w-[500px] h-[99%] flex flex-col  py-2 '>
     {selectedConversation === null ? (
      <div className='flex items-center justify-center w-full h-full'>
        <div className='px-4 text-center text-2xl text-yellow-300 font-semibold flex flex-col items-center gap-2'>
        <p className='text-2xl'>Welcome!!👋 {authUser.username}😏</p>
        <p className='text-lg'>Select a chat to start messaging</p>
        <TiMessages className='text-6xl text-center'/>
        </div>
        </div>
     ):(<>
      <div className="flex justify-between gap-1 bg-yellow-400 md:px-2 rounded-lg h-10 md:h-12">
        <div className="flex gap-2 md:justify-between items-center w-full">
          <div className="md:hidden ml-1 self-center">
            <button onClick={()=>onBackUser(true)} className='bg-white rounded-full px-2 py-1 self-center'>
              <IoArrowBackSharp size={25}/>
            </button>
          </div>
          <div className="flex justify-between mr-2 gap-2">
            <div className="self-center">
              <img className='rounded-full w-6 h-6 md:h-10 md:w-10 cursor-pointer' src={selectedConversation?.profilepic} alt="" />

            </div>
            <span className='text-gray-950 self-center text-sm md:text-xl font-bold'>
              {selectedConversation?.username}
            </span>
          </div>
        </div>
      </div>
       <div className="flex-1 overflow-auto">
        {Loading && (
          <div className="flex w-full flex-col h-full items-center justify-center gap-4 bg-transparent">
            <div className="loading loading-spinner"></div>
          </div>
        )}
        {!Loading && messages?.length === 0 && (
          <p className='text-center text-white items-center'>Send a message to start Conversation</p>

        )}
        {!Loading && messages.length > 0 && messages?.map((message) => (
 <div className="text-white" key={message?._id} ref={lastMessageRef}>
 <div  className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}>
    <div className="chat-image avatar">    </div>
    <div key={message?._id}   className={`chat-bubble ${message.senderId === authUser._id ? 'bg-yellow-500' : ''}`}>
 {message?.message}
  </div>
 
                  

  <div className="chat-footer text-[10px] opacity-80 text-white">
  {(() => {
    try {
      // Ensure createdAt is valid
      const createdAt = message?.createdAt || new Date().toISOString(); // Default to current date
      // Default to current date

      if (!createdAt) return "Date not available";

      const date = new Date(createdAt);
      if (isNaN(date)) return "Invalid Date";

      return `${date.toLocaleDateString('en-IN')} ${date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: 'numeric' })}`;
    } catch (error) {
      console.error("Date Parsing Error:", error);
      return "Date not available";
    } 
  })()}
</div>
  </div>
  </div>
))}
      </div>
    <form className='rounded-full text-black' onSubmit={handleSubmit}>
        <div className="w-full rounded-full flex items-center bg-white">
          <input type="text"  onChange={handleMessage} value={sendData} required id='message' className='w-full bg-transparent outline-none px-4 rounded-full' />
          <button type='submit'>
          {sending ? <div className='loading loading-spinner'></div>:
                <IoSend size={25}
                className='text-yellow-400 cursor-pointer rounded-full bg-black w-10 h-auto p-1'/>
                }
          </button>
        </div>
    </form>
     </>
    )}
    </div>
  )
}

export default MessageContainer