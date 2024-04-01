import React from 'react';
import { MDBBtn, MDBContainer, MDBTypography } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Link } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
const BGIMAGE_URL = 'https://www.roadlessread.com/wp-content/uploads/2023/05/Image-Of-An-Ornate-Library-Study-Room.webp';
root.render(
  
  <Router><App /></Router>

);

export default function HomePage() {
  return (
    <div className="bg-image" style={{ backgroundImage: `url(${BGIMAGE_URL})`, height: '100vh' }}>
      <MDBContainer className="d-flex justify-content-center align-items-center h-100">
        <div className="text-center text-white">
          <MDBTypography tag='h1' className='mb-3'>Welcome to Our Online Bookstore</MDBTypography>
          <MDBTypography tag='h3' className='mb-4'>Find your next great read with us</MDBTypography>
          <MDBTypography tag='h1' className='text-center' style={{ fontWeight: 'bold', fontSize: '4rem', marginTop: '2rem' }}>
              The PhaseBook
          </MDBTypography>
          <Link to="/search">
            <MDBBtn color='light'>Shop Now</MDBBtn>
          </Link>
        </div>
      </MDBContainer>
    </div>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
