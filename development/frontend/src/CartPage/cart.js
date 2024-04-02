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
import { BrowserRouter as Router, Link } from 'react-router-dom';

export default function QuantityEditCart() {
    const GET_BOOKS_URL='/api/cart/';
    const UPDATE_BOOK_URL='/api/cart/update';
    const REMOVE_BOOK_URL='/api/cart/remove';
    const cookiesToken=Cookies.get("token");
    const [items,setItems]=useState([]);
    
    useEffect(()=>{
        fetchData();
    },[]);

    const fetchData=()=>{axios.get(GET_BOOKS_URL,{ // get all the books
        headers: {
        Authorization: "Bearer "+cookiesToken // Set the authorization header
    }})
        .then(res=>{
            setItems(res.data.items);
        })
        .catch(err=>console.log(err));}
    
    const handleAdd=(event,method,passQuantity,bookId)=>{  // add or reduce books
        event.preventDefault();
        if((method=="minus")&&(passQuantity<=1)){
            
        }
        else if (passQuantity>0){
            let addData;
            if (method=="add"){ // add books
                addData={
                    bookId:bookId,
                    quantity:passQuantity+1
                };
            }
            else if((method=="minus")&&(passQuantity>1)){ // reduce books
                addData={
                    bookId:bookId,
                    quantity:passQuantity-1
                };
            };
            
            axios.put(UPDATE_BOOK_URL,addData,{ // call update URL
                headers: {
                Authorization: "Bearer "+cookiesToken // Set the authorization header
                }
            })
            .then(res=>{
                fetchData();
            })
            .catch(err=>console.log(err));
        } 
    }

    const handleDelete=(event,bookId)=>{ // when click delete button
        
        event.preventDefault();
        axios.delete(REMOVE_BOOK_URL,{
            headers: {
            Authorization: "Bearer "+cookiesToken // Set the authorization header
            },
            data:{
                bookId:bookId
            }
        })
        .then(res=>{
            fetchData();
        })
        .catch(err=>console.log(err));
    }

    const [deliverValue, setDeliverValue] = useState(5); // delivery fee, default to 5

    const handleDeliver = (event) => {
        setDeliverValue(parseInt(event.target.value,10));
    };
    
        return (
        
        <section className="h-100 h-custom" style={{ backgroundColor: "#eee" }}>
            
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
                            Book Cart
                            </MDBTypography>
                            <MDBTypography className="mb-0 text-muted">
                            {items.length} items
                            </MDBTypography>
                        </div>
                    
                        {items.map((r, i)=>{
                            return( //only create menu items dynamically when user is authenticated 
                                <div  key={i}>
                                    <hr className="my-4" />
                                    <MDBRow className="mb-4 d-flex justify-content-between align-items-center">
                                        <MDBCol md="2" lg="2" xl="2">
                                        <MDBCardImage
                                            src={r.book.thumbnail}
                                            fluid className="rounded-3" alt="Cotton T-shirt" />
                                        </MDBCol>
                                        <MDBCol md="3" lg="3" xl="3">
                                        <MDBTypography tag="h6" className="text-muted">
                                            Title:
                                        </MDBTypography>
                                        <MDBTypography tag="h6" className="text-black mb-0">
                                            {r.book.title}
                                        </MDBTypography>
                                        </MDBCol>
                                        <MDBCol md="3" lg="3" xl="3" className="d-flex align-items-center">
                                        <MDBBtn color="link" className="px-2">
                                            <MDBIcon fas icon="minus" onClick={(evt)=>handleAdd(evt,"minus",r.quantity,r.book.bookId)}/>
                                        </MDBBtn>

                                        <MDBInput type="number" min="0" value={r.quantity} size="sm" />

                                        <MDBBtn color="link" className="px-2">
                                            <MDBIcon fas icon="plus" onClick={(evt)=>handleAdd(evt,"add",r.quantity,r.book.bookId)}/>
                                        </MDBBtn>
                                        </MDBCol>
                                        <MDBCol md="3" lg="2" xl="2" className="text-end">
                                        <MDBTypography tag="h6" className="mb-0">
                                            $ {(r.price).toFixed(2)}
                                        </MDBTypography>
                                        </MDBCol>
                                        <MDBCol md="1" lg="1" xl="1" className="text-end">
                                        <a href="#!" className="text-muted">
                                            <MDBIcon fas icon="times" onClick={(evt)=>handleDelete(evt,r.book.bookId)}/>
                                        </a>
                                        </MDBCol>
                                    </MDBRow>
                                </div>
                            )
                        })}
                        

                        <hr className="my-4" />

                        <div className="pt-5">
                            <MDBTypography tag="h6" className="mb-0">
                            <MDBCardText tag="a" href="/publicbooklist" className="text-body">
                                <MDBIcon fas icon="long-arrow-alt-left me-2" /> Back
                                to shop
                            </MDBCardText>
                            </MDBTypography>
                        </div>
                        </div>
                    </MDBCol>
                    <MDBCol lg="4" className="bg-grey">
                        <div className="p-5">
                        <MDBTypography tag="h3" className="fw-bold mb-5 mt-2 pt-1">
                            Summary
                        </MDBTypography>

                        <hr className="my-4" />

                        <div className="d-flex justify-content-between mb-4">
                            <MDBTypography tag="h5" className="text-uppercase">
                            items {items.length}
                            </MDBTypography>
                            <MDBTypography tag="h5">$ {items.reduce((total, item) => {
                            
                            return (total + (item.price * item.quantity))}, 0).toFixed(2)}</MDBTypography>
                        </div>

                        <MDBTypography tag="h5" className="text-uppercase mb-3">
                            Shipping
                        </MDBTypography>

                        <div className="mb-4 pb-2">
                            <select className="select p-2 rounded bg-grey" style={{ width: "100%" }}   onChange={handleDeliver}>
                                <option value="5">Standard-Delivery- $5.00</option>
                                <option value="10">Fast-Delivery- $10.00</option>
                                <option value="2">Slow-Delivery- $2.00</option>
                            </select>
                        </div>

                        <MDBTypography tag="h5" className="text-uppercase mb-3">
                            Gift code
                        </MDBTypography>

                        <div className="mb-5">
                            <MDBInput size="lg" label="Enter your code" />
                        </div>

                        <hr className="my-4" />

                        <div className="d-flex justify-content-between mb-5">
                            <MDBTypography tag="h5" className="text-uppercase">
                            Total price
                            </MDBTypography>
                            <MDBTypography tag="h5">$ {(items.reduce((total, item) => {
                                return (total + item.price * item.quantity);}, 0)+deliverValue).toFixed(2)}
                            </MDBTypography>
                        </div>
                        {items.length<=0 ? null : <Link to="/purchase">    
                            <MDBBtn
                            color="dark" 
                            block size="lg">
                                Checkout
                            </MDBBtn>
                        </Link>  }
                         
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