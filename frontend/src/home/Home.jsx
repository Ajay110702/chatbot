/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from './components/Sidebar.jsx'
import MessageContainer from './components/MessageContainer.jsx'
import { FaHandMiddleFinger } from 'react-icons/fa'
const Home = () => {

  const[selectedUser,setSelectedUser]=useState(null);
  const [isSidebarVisible,setIsSidebarVisible]=useState(true);
    const {authUser}=useAuth();
const handleUserSelect=(user)=>{
setSelectedUser(user);
setIsSidebarVisible(false);
}

const handleShowSidebar=()=>{
setIsSidebarVisible(true);
setSelectedUser(null);
}

  return (

    <div className='flex justify-between min-w-full
     md:min-w-[875px] md:max-w-[100%]
      px-2 h-[95%] md:h-full  
      rounded-xl shadow-lg
       bg-gray-400 bg-clip-padding
        backdrop-filter backdrop-blur-lg 
        bg-opacity-0'
        >
    {/* sidebar */}
     <div className={`w-full py-2 md:flexx ${isSidebarVisible ? '' : 'hidden'}`}>
   <Sidebar onSelectUser={handleUserSelect}/>
     </div>

     <div className={`divider divider-horizontal px-3 md:flex 
      ${isSidebarVisible ? '' : 'hidden'} ${selectedUser ? 'block' : 'hidden'}`}></div>
     {/* message container */}
     <div className={`flex-auto ${selectedUser ? '' : 'hidden md:flex'} bg-gray-200}`}>
  <MessageContainer onBackUser={handleShowSidebar}/>
     </div>
</div>
     )
}

export default Home