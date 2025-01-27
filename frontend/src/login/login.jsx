/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React, { useId, useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext.jsx';
const login = () => {
    const {setAuthUser}=useAuth();
    const navigate=useNavigate();
    const [userInput,setUserInput]=useState({});
    const [loading,setLoading]=useState(false);
    const handleSubmit=async(e)=>{
        e.preventDefault();
        setLoading(true)
        try {
            const login=await axios.post(`/api/auth/login`,userInput);
        const data=login.data;
        if(data.success===false){
            setLoading(false);
         console.log(data.message);
        }
        toast.success(data.message)
        localStorage.setItem('chatapp',JSON.stringify(data));
       setAuthUser(data); 
        setLoading(false);
        navigate('/');

        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    }
    const handleInput=(e)=>{
        setUserInput({
            ...userInput,[e.target.id]:e.target.value
           })
            }
    
    console.log(userInput);

  return (
    <div className='flex flex-col items-center justify-center mix-w-full mx-auto'>
        <div className="w-full p-6 rounded-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
            <h1 className='text-3xl font-bold text-center text-gray-300'>Login <span className='text-yellow-300'>ChitChat</span></h1>
       <form onSubmit={handleSubmit} className='flex flex-col text-black'>
        <div>
  <label className='label p-2' >
    <span className='font-bold text-yellow-300 text-xl label-text'>Email :</span>
    </label>
       <input className='w-full input input-bordered h-10' id='email' type="email" onChange={handleInput} placeholder='Enter your email' required />
        </div>
        <div>
        <label className='label p-2' >
    <span className='font-bold text-yellow-300 text-xl label-text'>Password :</span>
    </label>
    <input className='w-full input input-bordered h-10' onChange={handleInput} id='password' type="password" placeholder='Enter your password' required />
    </div>
        <button type='submit' className='mt-4 self-center w-auto px-2 py-1 bg-yellow-400 text-lg  text-black rounded-lg hover:scale-105' >
            {loading ? "loading.." : "Login"}</button>
       </form>
       <div className='pt-2'>
                        <p className='text-sm font-semibold
                         text-yellow-300'>
                               Don&apos;t have an Acount ? <Link to={'/register'}>
                                <span
                                    className='text-yellow-300
                            font-bold underline cursor-pointer
                             hover:text-gray-950'>
                                    Register Now!!
                                </span>
                            </Link>
                        </p>
                    </div>
        </div>
    </div>
  )
}

export default login;