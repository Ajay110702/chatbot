/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
const Register = () => {
    const navigate=useNavigate();
    const {setAuthUser}=useAuth();
    const [loading,setLoading]=useState(false);
    const [inputData,setinputData]=useState({});
    const handleSubmit=async(e)=>{
        e.preventDefault();
    setLoading(true)
    if(inputData.password !== inputData.confpassword){
        setLoading(false)
        return toast.error("Password Doesn't Match")
    }
    try{
        const register=await axios.post('/api/auth/register',inputData);
        const data=register.data;
        if(data.success === false){
            setLoading(false);
            toast.error(data.message);
            console.log(data.message);
        }

        toast.success(data?.message)
        localStorage.setItem('chatapp',JSON.stringify(data));
       setAuthUser(data);
        setLoading(false);
       navigate('/login');
    }
   catch (error) {
    setLoading(false);
            console.log(error);
            toast.error(error?.response?.data?.message);
       
   }
    }
    const handleInput=(e)=>{
    setinputData({
        ...inputData,[e.target.id]:e.target.value
    })
    }
    console.log(inputData);
    const selectGender=(selectGender)=>{
    setinputData((prev)=>({
        ...prev,gender:selectGender === inputData.gender ? '' : selectGender
    }))
    }
  return (
    <div className='flex flex-col items-center justify-center mix-w-full mx-auto'>
<div className="w-full p-6 rounded-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">

<h1 className='text-3xl font-bold text-center text-gray-300'>Register <span className='text-yellow-300'>ChitChat</span></h1>
<form onSubmit={handleSubmit} className='flex flex-col text-black'>
<div>
  <label className='label p-2' >
    <span className='font-bold text-yellow-300 text-xl label-text'>fullname :</span>
    </label>
       <input className='w-full input input-bordered h-10' id='fullname' type="text" onChange={handleInput} placeholder='Enter your full Name' required />
        </div>
        <div>
  <label className='label p-2' >
    <span className='font-bold text-yellow-300 text-xl label-text'>username :</span>
    </label>
       <input className='w-full input input-bordered h-10' id='username' type="text" onChange={handleInput} placeholder='Enter your User Name' required />
        </div>
        <div>
  <label className='label p-2' >
    <span className='font-bold text-yellow-300 text-xl label-text'>Email :</span>
    </label>
       <input className='w-full input input-bordered h-10' id='email' type="email" onChange={handleInput} placeholder='Enter  email' required />
        </div>
        <div>
        <label className='label p-2' >
    <span className='font-bold text-yellow-300 text-xl label-text'>Password :</span>
    </label>
    <input className='w-full input input-bordered h-10' onChange={handleInput} id='password' type="password" placeholder='Enter your password' required />
    </div>
        <div>
        <label className='label p-2' >
    <span className='font-bold text-yellow-300 text-xl label-text'>Conf.Password :</span>
    </label>
    <input className='w-full input input-bordered h-10' onChange={handleInput} id='confpassword' type="password" placeholder='Enter confirm password' required />
    </div>
    <div id='gender'  className='flex gap-2'>
        <label className='cursor-pointer label flex-gap-2'>
            <span className='label-text font-semibold text-yellow-300'>male </span>
            <input 
            onChange={()=>selectGender('male')}
            checked={inputData.gender === 'male'}
            type='checkbox' className='checkbox checkbox-info'/>
        </label>
        <label className='cursor-pointer label flex-gap-2'>
            <span className='label-text font-semibold text-yellow-300'>female </span>
            <input 
             onChange={()=>selectGender('female')}
             checked={inputData.gender === 'female'}
             type='checkbox' className='checkbox checkbox-info'/>
        </label>
    </div>
        <button type='submit' className='mt-4 self-center w-auto px-2 py-1 bg-yellow-400 text-lg  text-black rounded-lg hover:scale-105' >
            {loading ? "loading.." : "Register"}</button>
       </form>
       <div className='pt-2'>
                        <p className='text-sm font-semibold
                         text-yellow-300'>
                               Do you have an Acount ? <Link to={'/login'}>
                                <span
                                    className='text-yellow-300
                            font-bold underline cursor-pointer
                             hover:text-gray-950'>
                                    Login Now!!
                                </span>
                            </Link>
                        </p>
                    </div>
    </div>
</div>
  )
}

export default Register