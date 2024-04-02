import React, { useState, useEffect } from 'react';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBBtn, MDBCardText, MDBCardImage, MDBRow, MDBCol, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter, MDBInput } from 'mdb-react-ui-kit';
import axios from 'axios';
import './PublicBookList.css'
import Cookies from 'js-cookie';
import { useSearchParams, useNavigate } from 'react-router-dom';

function Bookshelves() {
  const [bookshelves, setBookshelves] = useState([]);
  const [bookshelfVolumeInfo, setBookshelfVolumeInfo] = useState([]);
  const [selectedBookshelf, setSelectedBookshelf] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const navigate = useNavigate();
  const cookiesToken=Cookies.get("token"); // get user token from cookie
  const [isLoggedIn,setIsLoggedIn]=useState(cookiesToken!==undefined?true:false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const PUBLIC_BOOKSHELF_URL = 'http://'+window.location.hostname+'/api/open/bookshelf'
  const PUBLIC_BOOKSHELF_BOOKLIST_URL = 'http://'+window.location.hostname+'/api/open/booklist?booklistId='
  const ADD_REVIEW_URL = 'http://'+window.location.hostname+'/api/review/add';
  const NO_IMAGE_URL = 'https://www.gmt-sales.com/wp-content/uploads/2015/10/no-image-found.jpg';

  useEffect(() => {
    axios.get(`${PUBLIC_BOOKSHELF_URL}`)
      .then(response => {
        const sortedBookshelves = response.data.sort((a, b) => new Date(b.updated) - new Date(a.updated)).slice(0, 10);
        const sortedBookshelvesL = response.data.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        if (isLoggedIn) {
          setBookshelves(sortedBookshelvesL);
        }
        else {
          setBookshelves(sortedBookshelves);
        }
        console.log(sortedBookshelves)
        
        return Promise.all(sortedBookshelves.map(shelf => 
          axios.get(`${PUBLIC_BOOKSHELF_BOOKLIST_URL}${shelf._id}`)
            .then(response => ({ data: response.data, shelfid: shelf._id })),
        ));
      })
      .then(volumeResponses => {
        const updatedBookshelfVolumeInfo = volumeResponses.map(response => ({
          ...response.data, 
          shelfid: response.shelfid
        }));
        setBookshelfVolumeInfo(updatedBookshelfVolumeInfo);
      })
      .catch(error => console.error('Error fetching bookshelves:', error));
  }, []);

      console.log(bookshelfVolumeInfo);

  const handleViewDetails = (shelfid) => {
    setSelectedBookshelf(shelfid);
    setModalShow(true);
  };

  const handleCloseModal = () => {
    setModalShow(false);
  };

  const StarRating = ({ rating, setRating }) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star, index) => (
          <i
            key={index}
            className={`fa${rating >= star ? 's' : 'r'} fa-star`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
    );
  };

  const handleSubmit = async (theid) => {
    const payload = {
      booklistId: theid,
      rating: rating,
      comment: comment
    };
  
    try {
      const response = await axios.post(`${ADD_REVIEW_URL}`, payload, {
        headers: { 'Authorization': `Bearer ${cookiesToken}` }
      });
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchUpdatedBookshelves = async () => {
    try {
      const response = await axios.get(`${PUBLIC_BOOKSHELF_URL}`);
      const sortedBookshelves = response.data.sort((a, b) => new Date(b.updated) - new Date(a.updated)).slice(0, 10);
      const sortedBookshelvesL = response.data.sort((a, b) => new Date(b.updated) - new Date(a.updated));
      if (isLoggedIn) {
        setBookshelves(sortedBookshelvesL);
      }
      else {
        setBookshelves(sortedBookshelves);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const renderBookshelf = (shelf) => (
    <MDBCard key={shelf.id} className="mb-3">
      <MDBCardBody>
        <MDBRow>
          <MDBCol md='4'>
            <MDBCardTitle>{shelf.title}</MDBCardTitle>
            <p>Created by: {shelf.userName}</p>
            <p>Books: {shelf.volumeCount}</p>
          </MDBCol>
          <MDBCol md='4' className='text-center'>
            <p>Updated: {shelf.updated}</p>
            <p>Description: {shelf.description}</p>
          </MDBCol>
          <MDBCol md='2' className='d-flex align-items-center justify-content-end'>
            <MDBBtn onClick={() => handleViewDetails(shelf._id)}>View Detail</MDBBtn>
          </MDBCol>
        </MDBRow>
      </MDBCardBody>
    </MDBCard>
  );

  const renderModal = () => {
    if (!modalShow) return null;

    const shelfInfo = bookshelfVolumeInfo.find(info => info.booklistId === selectedBookshelf);
    console.log(shelfInfo);
    if (!shelfInfo) return <div>Loading...</div>;
    return (
      <div className="modal">
        <div className="modal-content">
        <MDBBtn className='btn-close' color='none' onClick={handleCloseModal}></MDBBtn>
          <h2>Bookshelf Details</h2>
          {shelfInfo.items.map(book => (
            <MDBCard key={book.id} className="mb-3">
            <MDBRow className='g-0' style={{ minHeight: '200px' }}> {/* set minimum height */}
              <MDBCol md='4'>
                <MDBCardImage 
                  src={book.volumeInfo.imageLinks?.thumbnail || `${NO_IMAGE_URL}`} 
                  alt={book.volumeInfo.title || 'Unknown Book Title'} 
                  className='img-fluid rounded-start' 
                />
              </MDBCol>
              <MDBCol md='6'>
                <MDBCardBody>
                  <MDBCardTitle>{book.volumeInfo.title || 'Unknown Book Title'}</MDBCardTitle>
                  <MDBCardText>Author: {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}</MDBCardText>
                  <MDBCardText>Published Date: {book.volumeInfo.publishedDate || 'Unknown Published Date'}</MDBCardText>
                </MDBCardBody>
              </MDBCol>
              <MDBCol md='2' className='d-flex align-items-center justify-content-center'>
                <MDBBtn onClick={() => navigate(`/detail?id=${book.id}`)}>View Detail</MDBBtn>
              </MDBCol>
            </MDBRow>
          </MDBCard>
          ))}
          {shelfInfo.reviews.map(review => (
            <MDBCard className="review-card">
              <div className="review-header">
                <div className="review-username">User: {review.username}</div>
                <div className="review-rating">Rating: {review.rating}</div>
              </div>
              <div className="review-comment">{review.comment}</div>
              <div className="review-date">Date: {review.date}</div>
            </MDBCard>
          ))}
          <div className="modal-footer">
          <div className="star-rating-wrapper">
            <StarRating rating={rating} setRating={setRating} />
          </div>
          <textarea 
            placeholder="Leave a review" 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
            <MDBBtn onClick={() => isLoggedIn ? handleSubmit(shelfInfo.booklistId) : navigate('/login')}>
              Submit
            </MDBBtn>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1 className='center-text'>The Public Booklist</h1>
      <h2 className='center-text'>Take a look!</h2>
      {bookshelves.map(shelf => renderBookshelf(shelf))}
      {renderModal()}
    </div>
  );
}

export default Bookshelves;