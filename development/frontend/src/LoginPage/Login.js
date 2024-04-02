import React, { useState,useEffect } from 'react'
import {Link, useNavigate, useSearchParams} from 'react-router-dom'
import Validation from './LoginValidation';
import axios from 'axios';
import Cookies from 'js-cookie';
//import { useGoogleLogin } from '@react-oauth/google';


function Login(){
    const LOGIN_URL='http://'+window.location.hostname+':3001/api/secure/login/';
    const VERIFY_URL='http://'+window.location.hostname+':3001/api/secure/verify-email';
    const navigate=useNavigate();
    const [messages,setMessages]=useState(
        {
            text:"",
            tag:""
        }
    );
    const [values,setValues]=useState({
        email:"",
        password:""   
    })
    
    const[errors,setErrors]=useState({})
    const handleInput=(event)=>{
        setValues(prev=>({...prev,[event.target.name]:event.target.value}))
    }
    
    const handleSubmit=(event)=>{
        event.preventDefault();
        setMessages();
        setErrors(Validation(values));
    }

    useEffect(() => { // listen to the changes on errors to send request
        if(errors.email===""&&errors.password===""){
            axios.post(LOGIN_URL,values)
            .then(res=>{
                
                
                if(res.status==200){
                    Cookies.set("token", res.data.token, { expires:1 });
                    Cookies.set("userRole", res.data.userRole, { expires:1 });
                    navigate('/');
                }else{
                    alert("No record existed");
                }
            })
            .catch(err=>{
                //console.log(err.response.data.message)
                setMessages({
                    text: err.response.data.message+" Please try again",
                    tag:  "danger"
                })});
        }
    }, [errors]);

    /*const login = useGoogleLogin({
        onSuccess:  codeResponse => console.log(codeResponse),
        flow: 'auth-code',
    });*/

    const [searchParams, setSearchParams]=useSearchParams(); // query string to verify email address
  
    useEffect(() => { // listen to the changes on searchParams.get('token') to show verification message
        console.log(searchParams);
        if(searchParams.size>0){
        //console.log(searchParams.get('token'));
        axios.get(VERIFY_URL,{
            params:{token: searchParams.get('token')}
        })
        .then(res=>{
            
            if(res.status==200){
                setMessages({
                    text: res.data+" Please log in",
                    tag:  "primary"
                })
            }
        })
        .catch(err=>{
            
            setMessages({
                text: err.response.data+", Please try again",
                tag:  "danger"
            })});
        }
        
    }, [searchParams.get('token')]);

    return(
        <div className='d-flex justify-content-center aligh-items-center bg-primary vh-100'>
            <div className='bg-white p-3 rounded w-50'>
                <h2>Log-in</h2>
                <form action="" onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input type="email" placeholder="email@gmail.com" name='email' 
                        onChange={handleInput} className='form-control rounded-0'/>
                        {errors.email&&<span className='text-danger'>{errors.email}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input type="password" placeholder="Enter Password" 
                        onChange={handleInput} name="password" className='form-control rounded-0'/>
                        {errors.password&&<span className='text-danger'>{errors.password}</span>}
                    </div>
                    {messages&&<span className={'text-'+messages.tag}>{messages.text}</span>}
                    <button type='submit' className='btn btn-success w-100 rounded-0'>Log In</button>
                    <p>You agree to our terms and policies</p>
                    <Link to="/signup" className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>Create Account</Link>
                </form>
                    {/*<div className=' mt-4'>
                        <GoogleLogin 
                            onSuccess={credentialResponse => {
                                console.log(credentialResponse);
                            }}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                            
                        />
                        </div>*/}
                {/*<button className='btn mt-4 border w-100 rounded-0 btn-default' onClick={() => login()}>Sign in with Google 🚀</button>*/}
            </div>

            
        </div>
        
    )
}

export default Login