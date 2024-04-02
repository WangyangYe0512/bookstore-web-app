import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from 'axios';
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardText,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBTypography,
  } from "mdb-react-ui-kit";
import React,{ useState,useEffect } from "react";
import Cookies from 'js-cookie';

function Admin(){
    const GET_USER_URL='http://'+window.location.hostname+':3001/api/admin/users';
    const GET_REVIEW_URL='http://'+window.location.hostname+':3001/api/admin/get-reviews';
    const UPDATE_USER_URL='http://'+window.location.hostname+':3001/api/admin/update-user';
    const UPDATE_REVIEW='http://'+window.location.hostname+':3001/api/admin/update-review';
    const cookiesToken=Cookies.get("token");
    const [users,setUsers]=useState([]);
    const [reviews,setReviews]=useState([]);
    useEffect(()=>{
        fetchUser();
        fetchReview();
    },[]);

    const fetchUser=()=>{axios.get(GET_USER_URL,{ // all users
        headers: {
        Authorization: "Bearer "+cookiesToken // Set the authorization header
    }})
        .then(res=>{
            //console.log(res)
            setUsers(res.data);
        })
        .catch(err=>console.log(err));}

    const fetchReview=()=>{axios.get(GET_REVIEW_URL,{ // all reviews
        headers: {
        Authorization: "Bearer "+cookiesToken // Set the authorization header
    }})
        .then(res=>{
            console.log(res)
            setReviews(res.data);
        })
        .catch(err=>console.log(err));}
    
    const handleAdd=(event,method,user)=>{
        event.preventDefault();
        let addData;
        //console.log(user.userId)
        if(method=="role"){
            addData={
                userId:user._id,
                userRole:user.userRole=="admin" ? "customer" : "admin",
                active:user.active
            }
        }else if(method=="status"){
            addData={
                userId:user._id,
                userRole:user.userRole,
                active:user.active==true?false:true
            }
        }
            
        axios.put(UPDATE_USER_URL,addData,{
            headers: {
            Authorization: "Bearer "+cookiesToken // Set the authorization header
            }
        })
        .then(res=>{
            //console.log(res)
            fetchUser();
            //console.log(res.data.items);
        })
        .catch(err=>console.log(err));
        
    }

    const handleHidden=(event,review)=>{
        event.preventDefault();
        let addData={
            booklistId:review.booklistId,
            reviewId:review._id,
            hidden:true
        };
        addData.hidden=review.hidden?false:true;
        //console.log(user.userId)
            
        axios.put(UPDATE_REVIEW,addData,{
            headers: {
            Authorization: "Bearer "+cookiesToken // Set the authorization header
            }
        })
        .then(res=>{
            //console.log(res)
            fetchReview();
            //console.log(res.data.items);
        })
        .catch(err=>console.log(err));
        
    }

    return(
        <section className="h-100" style={{ backgroundColor: "#eee" }}> 
            <MDBContainer className="py-5 h-100">
                <MDBRow className="justify-content-center align-items-center h-100">
                <MDBCol size="12">
                    <MDBCard className="card-registration card-registration-2" style={{ borderRadius: "15px" }}>
                    <MDBCardBody className="p-0">
                        <MDBRow className="g-0">
                            <MDBCol lg="8">
                                <div className="p-5">
                                    <div className="d-flex justify-content-between align-items-center mb-5">
                                        <MDBTypography tag="h1" className="fw-bold mb-0 text-black">
                                            Admin Panel
                                        </MDBTypography>
                                        <MDBTypography className="mb-0 text-muted">
                                            {users.length} users
                                        </MDBTypography>
                                        <MDBTypography className="mb-0 text-muted">
                                            {reviews.length} reviews
                                        </MDBTypography>
                                    </div>
                                    <MDBTypography tag="h2" className=" mb-0 text-black">
                                        Users
                                    </MDBTypography>
                                    {users.map((r, i)=>{
                                    return( //list all users
                                        <div  key={i}>
                                            <hr className="my-4" />
                                            <MDBRow className="mb-4 d-flex justify-content-between align-items-center">
                                                
                                                <MDBCol md="3" lg="3" xl="3">
                                                    <MDBTypography tag="h6" className="text-muted">
                                                        User Email: <p className="text-black mb-0">{r.email}</p>
                                                    </MDBTypography>
                                                    <MDBTypography tag="h6" className="text-muted">
                                                        User Name: <p className="text-black mb-0">{r.userName}</p>
                                                    </MDBTypography>
                                                    
                                                </MDBCol>

                                                <MDBCol md="3" lg="3" xl="3">
                                                    <MDBTypography tag="h6" className="text-muted">
                                                        User Role:
                                                    </MDBTypography>
                                                    <MDBTypography tag="h6" className="text-black mb-0">
                                                        {r.userRole}
                                                    </MDBTypography>
                                                    <MDBBtn className="px-2" onClick={(evt)=>handleAdd(evt,"role",r)}>
                                                        Change Role
                                                    </MDBBtn>
                                                </MDBCol>

                                                <MDBCol md="3" lg="3" xl="3">
                                                    <MDBTypography tag="h6" className="text-muted">
                                                        User Status:
                                                    </MDBTypography>
                                                    <MDBTypography tag="h6" className="text-black mb-0">
                                                        {r.active ? "active" : "deactivated"}
                                                    </MDBTypography>
                                                    <MDBBtn className="px-2 bg-warning" onClick={(evt)=>handleAdd(evt,"status",r)}>
                                                        Change Status
                                                    </MDBBtn>
                                                </MDBCol>
                                                
                                            </MDBRow>
                                        </div>
                                    )
                                    })}
                                    <hr className="my-4" />
                                    <MDBTypography tag="h2" className=" mb-0 text-black">
                                        Reviews
                                    </MDBTypography>
                                    {reviews.map((r, i)=>{
                                    return( //list all reviews
                                        <div  key={i}>
                                            <hr className="my-4" />
                                            <MDBRow className="mb-4 d-flex justify-content-between align-items-center">
                                                
                                                <MDBCol md="3" lg="3" xl="3">
                                                    <MDBTypography tag="h6" className="text-muted">
                                                        Book List id: <p className="text-black mb-0">{r.booklistId}</p>
                                                    </MDBTypography>
                                                    <MDBTypography tag="h6" className="text-muted">
                                                        User id: <p className="text-black mb-0">{r.userId}</p>
                                                    </MDBTypography>
                                                </MDBCol>
                                                
                                                <MDBCol md="3" lg="3" xl="3">
                                                    <MDBTypography tag="h6" className="text-muted">
                                                        Date: <p className="text-black mb-0">{r.date}</p>
                                                    </MDBTypography>
                                                    <MDBTypography tag="h6" className="text-muted">
                                                        Review id: <p className="text-black mb-0">{r._id}</p>
                                                    </MDBTypography>
                                                </MDBCol>

                                                <MDBCol md="3" lg="3" xl="3">
                                                    <MDBTypography tag="h6" className="text-muted">
                                                        User Name: <p className="text-black mb-0">{r.username}</p>
                                                    </MDBTypography>
                                                    <MDBTypography tag="h6" className="text-muted">
                                                        Comment: <p className="text-black mb-0">{r.comment}</p>
                                                    </MDBTypography>
                                                    
                                                    <MDBTypography tag="h6" className="text-muted">
                                                        Rating: <p className="text-black mb-0">{r.rating}</p>
                                                    </MDBTypography>
                                                    
                                                </MDBCol>

                                                <MDBCol md="3" lg="3" xl="3">
                                                    <MDBTypography tag="h6" className="text-muted">
                                                        Hidden Status:
                                                    </MDBTypography>
                                                    <MDBTypography tag="h6" className="text-black mb-0">
                                                        {r.hidden ? "hidden" : "not hidden"}
                                                    </MDBTypography>
                                                    <MDBBtn className="px-2 bg-danger" onClick={(evt)=>handleHidden(evt,r)}>
                                                        Hide or Show
                                                    </MDBBtn>
                                                </MDBCol>
                                                
                                            </MDBRow>
                                        </div>
                                    )
                                    })}
                                </div>
                            </MDBCol>
                        </MDBRow>
                    </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                </MDBRow>
            </MDBContainer>
        </section>
    )
}

export default Admin