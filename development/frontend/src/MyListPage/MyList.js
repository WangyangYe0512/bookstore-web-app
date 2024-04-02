import React, { useState, useEffect } from 'react';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBBtn, MDBCardText, MDBCardImage, MDBRow, MDBCol, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter, MDBInput } from 'mdb-react-ui-kit';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './MyList.css'

function Bookshelves() {
  const [bookshelves, setBookshelves] = useState([]);
  const [bookshelfVolumeInfo, setBookshelfVolumeInfo] = useState([]);
  const [selectedBookshelf, setSelectedBookshelf] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [accessStatus, setAccessStatus] = useState('PRIVATE'); // default access status
  const [newListData, setNewListData] = useState({ title: '', description: '', access: 'private' });
  const cookiesToken=Cookies.get("token"); // get user token from cookie
  const [isLoggedIn,setIsLoggedIn]=useState(cookiesToken!==undefined?true:false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const GET_BOOKSHELVES_URL = 'http://'+window.location.hostname+'/api/bookshelf';
  const GET_BOOKSHELF_BOOKLIST_URL = 'http://'+window.location.hostname+'/api/bookshelf/booklist?booklistId=';
  const DELETE_BOOKSHELF_URL = 'http://'+window.location.hostname+'/api/bookshelf/delete?bookshelfId=';
  const CREATE_BOOKSHELF_URL = 'http://'+window.location.hostname+'/api/bookshelf/create';
  const DELETE_BOOK_FROM_BOOKSHELF_URL = 'http://'+window.location.hostname+'/api/bookshelf/booklist/delete?booklistId=';
  const ADD_REVIEW_URL = 'http://'+window.location.hostname+'/api/review/add';
  const NO_IMAGE_URL = 'https://www.gmt-sales.com/wp-content/uploads/2015/10/no-image-found.jpg';
  
  
  console.log(cookiesToken)
  useEffect(() => {
    axios.get(`${GET_BOOKSHELVES_URL}`, {
    headers: {'Authorization': `Bearer ${cookiesToken}` }
  })
      .then(response => {
        const sortedBookshelves = response.data.items.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        setBookshelves(sortedBookshelves);
        return Promise.all(sortedBookshelves.map(shelf => 
          axios.get(`${GET_BOOKSHELF_BOOKLIST_URL}${shelf._id}`,
          {
            headers: {'Authorization': `Bearer ${cookiesToken}` }
          })
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
  console.log(bookshelves);

  const handleCreateListClick = async () => {
    try {
      if (bookshelves.length >= 20) {
        alert('Already reach the number limit');
      } else {
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePrivacyChange = (privacy) => {
    setAccessStatus(privacy.charAt(0).toUpperCase() + privacy.slice(1));
    setNewListData({ ...newListData, access: privacy });
  };

  const handleViewDetails = (shelfId) => {
    setSelectedBookshelf(shelfId);
    setModalShow(true);
  };

  const handleCloseModal = () => {
    setModalShow(false);
  };

  const deletebookshelf = async(shelfId) => {
    try {
      const response = await axios.delete(
        `${DELETE_BOOKSHELF_URL}${shelfId}`,
        { headers: { 'Authorization': `Bearer ${cookiesToken}`}}
      );
      // refetch the updated bookshelves
      fetchUpdatedBookshelves();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCreateNewList = async () => {
    try {
      const response = await axios.post(
        `${CREATE_BOOKSHELF_URL}`,
        newListData, { headers: { 'Authorization': `Bearer ${cookiesToken}` }}
      );
      // refetch the updated bookshelves
      fetchUpdatedBookshelves();
      setShowModal(false); // close modal
      setAccessStatus('PRIVATE'); // set private to default
    } catch (error) {
      console.error('Error:', error);
    }
  };

  
  const fetchUpdatedBookshelves = async () => {
    try {
      const response = await axios.get(`${GET_BOOKSHELVES_URL}`, {
        headers: { 'Authorization': `Bearer ${cookiesToken}` }
      });
      setBookshelves(response.data.items.sort((a, b) => new Date(b.updated) - new Date(a.updated)));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deletebookfromlist = async(bookid,shelfid) => {
    try {
      const response = await axios.delete(
        `${DELETE_BOOK_FROM_BOOKSHELF_URL}${shelfid}&bookId=${bookid}`,
        { headers: { 'Authorization': `Bearer ${cookiesToken}`}}
      );
      // refresh the page
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleCloseClick = () => {
    setShowModal(false);
    setAccessStatus('PRIVATE');
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
    } catch (error) {
      console.error('Error:', error);
      // handle error
    }
  };

  const renderBookshelf = (shelf) => (
    <MDBCard key={shelf.id} className="mb-3">
      <MDBCardBody>
        <MDBRow>
          <MDBCol md='4'>
            <MDBCardTitle>{shelf.title}</MDBCardTitle>
            <p>Created by: {/* the creator in backend */}</p>
            <p>Books: {shelf.volumeCount}</p>
            <p>Access status: </p>
          </MDBCol>
          <MDBCol md='4' className='text-center'>
            <p>Updated: {shelf.updated}</p>
            <p>Description: {shelf.description}</p>
          </MDBCol>
          <MDBCol md='2' className='d-block align-items-center justify-content-end'>
            <MDBBtn onClick={() => handleViewDetails(shelf._id)}>View Detail(edit)</MDBBtn>
            <br />
            <MDBBtn onClick={() => deletebookshelf(shelf._id)} style={{ marginTop: '10px' }} >Delete</MDBBtn>{/* delete bookshelf function */}
          </MDBCol>
        </MDBRow>
      </MDBCardBody>
    </MDBCard>
  );

  const renderModal = () => {
    if (!modalShow) return null;
    const shelfInfo = bookshelfVolumeInfo.find(info => info.shelfid === selectedBookshelf);
    if (!shelfInfo) return <div>Loading...</div>;
    console.log(shelfInfo);
    return (
      <div className="modal">
        <div className="modal-content">
        <MDBBtn className='btn-close' color='none' onClick={handleCloseModal}></MDBBtn>
          <h2>Bookshelf Details</h2>
          {shelfInfo.items.map(book => (
            <MDBCard key={book.id} className="mb-3">
            <MDBRow className='g-0' style={{ minHeight: '200px' }}> {/* the minimum height */}
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
              <MDBCol md='2' className='d-flex flex-column align-items-center justify-content-center'>
                <MDBBtn onClick={() => navigate(`/detail?id=${book.id}`)}>View Detail</MDBBtn>
                <br />
                <MDBBtn onClick={() => deletebookfromlist(book.id,shelfInfo.shelfid)} style={{ marginTop: '10px' }} >Delete</MDBBtn>{/* delete book function */}
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
            <MDBBtn onClick={() => handleSubmit(shelfInfo.booklistId)}>Submit</MDBBtn>{/* review function */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1 className='center-text'>My Booklist</h1>
      {bookshelves.map(shelf => renderBookshelf(shelf))}
      {renderModal()}
      
      <MDBBtn onClick={handleCreateListClick}>+ Create New List</MDBBtn>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <span className="close" onClick={() => handleCloseClick()}>&times;</span>
              <h2>Create New List</h2>
            </div>
            <div className="modal-body">
              <MDBInput label="Title (required)" required onChange={(e) => setNewListData({ ...newListData, title: e.target.value })} />
              <h4>Description(not required)</h4>
              <textarea label="Description" onChange={(e) => setNewListData({ ...newListData, description: e.target.value })} />
              <div>
                Access Status: {accessStatus}
                <div className="button-group">
                  <MDBBtn onClick={() => handlePrivacyChange('PUBLIC')}>Set As Public</MDBBtn>
                  <MDBBtn onClick={() => handlePrivacyChange('PRIVATE')}>Set As Private</MDBBtn>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <MDBBtn onClick={handleCreateNewList}>Create</MDBBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookshelves;