import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MDBContainer, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBBtn } from 'mdb-react-ui-kit';
import Cookies from 'js-cookie';
import axios from 'axios';
import './BookDetail.css';

function BookDetail() {
  let [searchParams] = useSearchParams();
  const bookId = searchParams.get('id'); // assume the bookId is passed as a query parameter
  const [bookDetail, setBookDetail] = useState(null);
  const cookiesToken=Cookies.get("token"); // get user token from cookie
  const [isLoggedIn,setIsLoggedIn]=useState(cookiesToken!==undefined?true:false);
  const [showModal, setShowModal] = useState(false);
  const [bookshelves, setBookshelves] = useState([]);
  const [selectedBookshelf, setSelectedBookshelf] = useState(null);
  const NO_IMAGE_URL = 'https://www.gmt-sales.com/wp-content/uploads/2015/10/no-image-found.jpg';
  const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes/';
  const ADD_TO_CART_URL = '/api/cart/add'
  const GET_BOOKSHELVES_URL = '/api/bookshelf';
  const GET_BOOKSHELF_BOOKLIST_URL = '/api/bookshelf/booklist?booklistId=';
  const ADD_TO_BOOKLIST_URL = '/api/bookshelf/booklist/add'

  
  console.log(isLoggedIn)

  useEffect(() => {
    async function fetchBookDetail() {
      const response = await fetch(`${GOOGLE_BOOKS_API_URL}${bookId}`);
      const data = await response.json();
      setBookDetail(data);
    }
    
    fetchBookDetail();
  }, [bookId]);

  if (!bookDetail) {
    return <div>Loading...</div>;
  }

  const { volumeInfo, saleInfo } = bookDetail;
  if (!volumeInfo || !saleInfo) {
    // if the book detail is not found, redirect to home page
    window.location.href = '/'; 
    return; // exit the function
  }
  const {
    title,
    authors,
    publisher,
    publishedDate,
    pageCount,
    printType,
    language,
    description,
    imageLinks
  } = volumeInfo;
  const stripHtml = html => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  const thumbnail = imageLinks?.thumbnail || `${NO_IMAGE_URL}`;

  const handleAddToCart = async () => {
    const bookData = {
      book: {
        bookId: bookId, 
        title: title, 
        thumbnail: thumbnail 
      },
      quantity: 1,
      price: saleInfo.listPrice.amount
    };
  
    try {
      const response = await axios.post(`${ADD_TO_CART_URL}`, bookData, {
        headers: { 'Authorization': `Bearer ${cookiesToken}` }
      });
      console.log(response.data);
      if (response.status === 200 || response.status === 201) {
        alert('Add to cart succeed!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong...');
    }
  };

  const handleOpenModal = async () => {
    try {
      const response = await axios.get(`${GET_BOOKSHELVES_URL}`, {
        headers: {'Authorization': `Bearer ${cookiesToken}` }
      });
      
      setBookshelves(response.data);
      setShowModal(true); // show modal
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddToBooklist = async () => {
    try {
      const listresponse =await axios.get(`${GET_BOOKSHELF_BOOKLIST_URL}${selectedBookshelf}`,
      {
        headers: {'Authorization': `Bearer ${cookiesToken}` }
      })
      console.log(selectedBookshelf)
      console.log(listresponse)

      let params={
        booklistId: selectedBookshelf,
        bookId: bookId
      }

      await axios.post(`${ADD_TO_BOOKLIST_URL}`, params,
      {
        headers: {'Authorization': `Bearer ${cookiesToken}` }
      });
      setShowModal(false); // close the modal
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCloseClick = () => {
    setShowModal(false);
  };

  return (
    <div>
    <MDBContainer className="my-5">
      <MDBCard className="mb-3">
        <div className="row g-0">
          <div className="col-md-3">
            <MDBCardImage
              src={thumbnail}
              alt={title || 'Unknown Book Title'}
              className='img-fluid rounded-start'
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
            />
          </div>
          <div className="col-md-9">
          <MDBCardBody>
            <div className="d-flex justify-content-between">
              <div style={{ marginLeft: '5%' }}> {/* move content to right */}
                <MDBCardTitle>{title || 'Unknown Book Title'}</MDBCardTitle>
                <MDBCardText><strong>Author(s):</strong> {authors ? authors.join(', ') : 'Unknown Author'}</MDBCardText>
                <MDBCardText><strong>Category:</strong> {volumeInfo.categories ? volumeInfo.categories.join(', ') : 'Unknown Categories'}</MDBCardText>
                <MDBCardText><strong>Content Version:</strong> {volumeInfo.contentVersion || 'Unknown Content Version'}</MDBCardText>
                <MDBCardText><strong>ISBN:</strong> {volumeInfo.industryIdentifiers ? volumeInfo.industryIdentifiers.map(identifier => `${identifier.type}: ${identifier.identifier}`).join(', ') : 'Unknown ISBN'}</MDBCardText>
                <MDBCardText><strong>Publisher:</strong> {publisher || 'Unknown Publisher'}</MDBCardText>
                <MDBCardText><strong>Published Date:</strong> {publishedDate || 'Unknown Published Date'}</MDBCardText>
                <MDBCardText><strong>Page Count:</strong> {pageCount || 'Unknown Page Count'}</MDBCardText>
                <MDBCardText><strong>Print Type:</strong> {printType || 'Unknown Print Type'}</MDBCardText>
                <MDBCardText><strong>Language:</strong> {language || 'Unknown Language'}</MDBCardText>
              </div>
              <div className="d-flex flex-column align-items-end">
                {saleInfo.saleability === 'NOT_FOR_SALE' && (
                  <MDBCardText className="text-end">This Book is not for sale.</MDBCardText>
                )}
                {saleInfo.saleability === 'FREE' && (
                  <MDBCardText className="text-end">This Book is free.</MDBCardText>
                )}
                {saleInfo.saleability === 'FOR_SALE' && (
                  <>
                    <MDBCardText className="text-end"><strong>Price:</strong> {saleInfo.listPrice.amount} {saleInfo.listPrice.currencyCode}</MDBCardText>
                    {isLoggedIn === true && (
                      <MDBBtn onClick={handleAddToCart} style={{ alignSelf: 'center' }}>Add to Cart</MDBBtn>
                    )}
                  </>
                )}
                <br />
                {isLoggedIn === true && (
                  <MDBBtn onClick={handleOpenModal} style={{ alignSelf: 'center' }}>Add to BookList</MDBBtn>
                )}
              </div>
            </div>
          </MDBCardBody>
          </div>
        </div>
        <MDBCardBody>
          <MDBCardText><strong>Description:</strong> {description ? stripHtml(description) : 'No Description Available.'}</MDBCardText>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
    {console.log(bookshelves)}
    {showModal && (
      <div className="modal">
        <span className="close" onClick={() => handleCloseClick()}>&times;</span>
        <div className="modal-content">
          <h3>{bookshelves.items[0]?.userName}'s booklist</h3>
          <select value={selectedBookshelf} onChange={e => setSelectedBookshelf(e.target.value)}>
            <option value="">Select a booklist</option>
            {bookshelves.items.map(shelf => (
              <option key={shelf._id} value={shelf._id}>{shelf.title}</option>
            ))}
          </select>
          <button onClick={handleAddToBooklist}>Add to this booklist</button>
        </div>
      </div>
    )}
    </div>
  );
}

export default BookDetail;