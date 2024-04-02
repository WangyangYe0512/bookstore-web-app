import React, {useState,useEffect } from 'react';
import {Link} from 'react-router-dom';
import Validation from './SignupValidation';
import axios from 'axios';

function Signup(){
    const REGISTER_URL='http://'+window.location.hostname+':3001/api/secure/register/';
    const [messages,setMessages]=useState();
    const [values,setValues]=useState({
        userName:'',
        email:'',
        password:'',
        confirmPassword:''
    })
    
    const[errors,setErrors]=useState({
        userName:'',
        email:'',
        password:'',
        confirmPassword:''
    })
    const handleInput=(event)=>{
        setValues(prev=>({...prev,[event.target.name]:event.target.value}))
    }

    const handleSubmit=(event)=>{ // when click sign up button
        setMessages();
        event.preventDefault();
        setErrors(Validation(values));
        
    }

    useEffect(() => { // listen to the changes on errors to send signup information
        if(errors.userName===""&&errors.email===""&&errors.password===""&&errors.confirmPassword===""&&values.userName!==""&&values.email!==""&&values.password!==""){
            
            axios.post(REGISTER_URL,{
                username:values.userName,
                email:values.email,
                password:values.password,
            })
            .then(res=>{
                console.log(res);
                setMessages(res.data);
                
            })
            .catch(err=>{
                console.log(err);
                setMessages(err.response.data.message);
            });
        }
      }, [errors]);

    return(
        <div className='d-flex justify-content-center aligh-items-center bg-primary vh-100'>
            <div className='bg-white p-3 rounded w-50'>
                <h2>Sign-Up</h2>
                <form action="" onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="userName"><strong>User Name</strong></label>
                        <input type="text" placeholder="Enter User Name" name='userName'
                        onChange={handleInput} className='form-control rounded-0'/>
                        {errors.userName&&<span className='text-danger'>{errors.userName}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input type="email" placeholder="youremail@gmail.com" name="email"
                        onChange={handleInput} className='form-control rounded-0'/>
                        {errors.email&&<span className='text-danger'>{errors.email}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input type="password" placeholder="**" 
                        onChange={handleInput} name="password" 
                        className='form-control rounded-0'/>
                        {errors.password&&<span className='text-danger'>{errors.password}</span>}
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="confirmPassword"><strong>Confirm Password</strong></label>
                        <input type="password" placeholder="**" 
                        onChange={handleInput} name="confirmPassword" 
                        className='form-control rounded-0'/>
                        {errors.confirmPassword&&<span className='text-danger'>{errors.confirmPassword}</span>}
                    </div>
                    
                    {messages&&<span className='text-primary'>{messages}</span>}
                    <button type="submit" className='btn btn-success w-100 rounded-0'>Sign up</button>
                    <p>You agree to our terms and policies</p>
                    <Link to="/login" className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>Login</Link>
                </form>
            </div>
        </div>
    )
}

export default Signup