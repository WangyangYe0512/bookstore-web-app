import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
  MDBIcon,
  MDBFooter
} from 'mdb-react-ui-kit';

import Cookies from 'js-cookie';

// Page Component
import HomePage from './index.js';
import CartPage from './CartPage/cart.js'; 
import Login from './LoginPage/Login.js';
import Signup from './SignupPage/Signup.js';
import AdminPage from './AdminPage/Admin.js';
import SearchPage from './SearchPage/search.js';
import BookDetail from './DetailPage/BookDetail.js';
import PublicBookList from './PublicBookListPage/PublicBookList.js';
import MyList from './MyListPage/MyList.js';
import Purchase from './PurchasePage/Purchase.js';
import PaymentSuccess from './PaymentSuccessPage/PaymentSuccess.js';

export default function App() {
  const nav = [ // menu and route list
    { path:     "/login",             name: "Login",            element: <Login />,          isLogin: false,    isAdmin: false  },
    { path:     "/signup",            name: "Signup",           element: <Signup />,         isLogin: false,    isAdmin: false  },
    { path:     "/admin",             name: "Admin",            element: <AdminPage />,      isLogin: true,     isAdmin: true   },
    { path:     "/mylist",            name: "Mylist",           element: <MyList />,         isLogin: true,     isAdmin: false  },
    { path:     "/cart",              name: "Cart",             element: <CartPage />,       isLogin: true,     isAdmin: false  },
    { path:     "/verify",            name: "Verify",           element: <Login />,          isLogin: false,    isAdmin: false  },
    { path:     "/purchase",          name: "Purchase",         element: <Purchase />,       isLogin: true,     isAdmin: false  },
    { path:     "/payment-success",   name: "PaymentSuccess",   element: <PaymentSuccess />, isLogin: true,     isAdmin: false  },
  ]

  const navigate = useNavigate();
  
  const cookiesToken=Cookies.get("token"); // get user token from cookie
  const cookiesUserRole=Cookies.get("userRole"); // get user role from cookie
  const [isLoggedIn,setIsLoggedIn]=useState(cookiesToken!==undefined?true:false); // useState to store user login information
  const [isAdmin,setIsAdmin]=useState(cookiesUserRole=="admin"?true:false); // useState to store user role information
  const [openBasic, setOpenBasic] = useState(false);

  useEffect(() => { // listen to the changes on cookiesToken to update isLoggedIn
    setIsLoggedIn(cookiesToken!==undefined?true:false);
    setIsAdmin(cookiesUserRole=="admin"?true:false);
  }, [cookiesToken]);

  function UnknownPage(){ // When user put unknown url, remain in the current position/page
    useEffect(() => {
      navigate('/', { replace: true });
    }, [navigate]); // Include navigate in the dependency array
    return null;
  }

  const logout = () => { // remove cookie when log out
    navigate('/', { replace: true });
    Cookies.remove("token");
    Cookies.remove("userRole");
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <>
      <MDBNavbar expand='lg' light bgColor='white'>
        <MDBContainer fluid>
          <MDBNavbarBrand href="/">Phase</MDBNavbarBrand>
          <MDBNavbarToggler
            aria-controls='navbarSupportedContent'
            aria-expanded='false'
            aria-label='Toggle navigation'
            onClick={() => setOpenBasic(!openBasic)}>
            <MDBIcon icon='bars' fas />
          </MDBNavbarToggler>
          <MDBCollapse navbar open={openBasic}>
            <MDBNavbarNav right>
              <MDBNavbarItem>
                <Link to="/" className="nav-link">Home</Link>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <Link to="/search" className="nav-link">Search</Link>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <Link to="/publicbooklist" className="nav-link">Public Book List</Link>
              </MDBNavbarItem>
              {/*<MDBNavbarItem>
                <MDBNavbarLink as={Link} to="/user">User Profile</MDBNavbarLink>
              </MDBNavbarItem>*/}

              { nav.map((r, i) => { //only create menu items dynamically when user is authenticated 
                if (((r.isLogin && isAdmin)||(r.isLogin && !r.isAdmin&&isLoggedIn&&!isAdmin)||(!r.isLogin && !isLoggedIn))
                &&(r.name!=="Verify")&&(r.name!=="Purchase")&&(r.name!=="PaymentSuccess")) {
                  return (
                      <MDBNavbarItem key={i}><Link to={r.path} className="nav-link">{r.name}</Link></MDBNavbarItem>
                    )
                }else return null
              })}
              {isLoggedIn && <MDBNavbarItem><Link onClickCapture={logout} className="nav-link">Log out</Link></MDBNavbarItem>}
              
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>

      {/* Router configuration */}
      <div style={{ minHeight: 'calc(100vh - [Footer Height])' }}>

      </div>
      <div className="d-flex flex-column min-vh-100">
      <Routes>
        <Route path="/" element={<HomePage />} />
        {<Route path='*' element={<UnknownPage/>} /> }{/*unknown url*/}
        <Route path="/search" element={<SearchPage />} />
        <Route path="/detail" element={<BookDetail />} />
        <Route path="/publicbooklist" element={<PublicBookList />} />
        

        {nav.map((r, i) => { //protected route, only create route dynamically when user is authenticated       
          if ((r.isLogin && isAdmin)||(r.isLogin && !r.isAdmin&&isLoggedIn&&!isAdmin)||(!r.isLogin && !isLoggedIn)) {
            return <Route key={i} path={r.path} element={r.element}/>
          } else return null
        })}
      </Routes>
      

      {/* Footer */}
      <MDBFooter bgColor='light' className='text-center text-lg-left mt-auto'>
        <MDBContainer className='p-4 text-center'>
          <div className='row'>
            <div>
              <h5 className='text-uppercase'>Contact us</h5>
              <p>
                This is your favourite book store.
              </p>
              <p>
                E-mail: phasebook@outlook.com
              </p>
                Telephone: 123456789
            </div>
          </div>
        </MDBContainer>
      </MDBFooter>
      </div>
    </>
  );
}