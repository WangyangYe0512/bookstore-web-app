import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MDBContainer, MDBInputGroup, MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBRow, MDBCol} from 'mdb-react-ui-kit';

function SearchBooks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const query = searchParams.get('query') || '';
  const startIndex = parseInt(searchParams.get('startIndex'), 10) || 0;
  const maxResult = parseInt(searchParams.get('maxResult'), 10) || 20;
  const [filter, setFilter] = useState(searchParams.get("filter") || 'default');
  const [orderBy, setOrderBy] = useState(searchParams.get("orderBy") || 'default');
  const [printType, setPrintType] = useState(searchParams.get("printType") || 'default');
  const SEARCH_URL = 'https://www.googleapis.com/books/v1/volumes?q=';
  const NO_IMAGE_URL = 'https://www.gmt-sales.com/wp-content/uploads/2015/10/no-image-found.jpg';

  useEffect(() => {
    if (query) fetchBooks(query, startIndex, maxResult, filter, orderBy, printType);
  }, [query, startIndex, maxResult, filter, orderBy, printType]);

  const fetchBooks = async (searchQuery, searchStartIndex, searchMaxResult, searchFilter, searchOrderBy, searchPrintType) => {
    let apiUrl = `${SEARCH_URL}${searchQuery}&startIndex=${searchStartIndex}&maxResults=${searchMaxResult}`;

    // only add non-default parameters to the URL
    if (filter !== 'default') {
      apiUrl += `&filter=${searchFilter}`;
    }
    if (orderBy !== 'default') {
      apiUrl += `&orderBy=${searchOrderBy}`;
    }
    if (printType !== 'default') {
      apiUrl += `&printType=${searchPrintType}`;
    }
    const response = await fetch(apiUrl);
    const data = await response.json();
    setBooks(data.items);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formQuery = event.target.elements.query.value;
    const newSearchParams = new URLSearchParams();
  
    newSearchParams.set('query', formQuery);
    newSearchParams.set('startIndex', '0');
    newSearchParams.set('maxResult', '20');
  
    // ensure that the default values are not added to the URL
    if (filter !== 'default') newSearchParams.set('filter', filter);
    if (orderBy !== 'default') newSearchParams.set('orderBy', orderBy);
    if (printType !== 'default') newSearchParams.set('printType', printType);
  
    navigate(`/search?${newSearchParams.toString()}`);
  };

  const handleNavigation = (newStartIndex) => {
    const newSearchParams = new URLSearchParams();
  
    // only add non-default parameters to the URL
    newSearchParams.set('query', query);
    newSearchParams.set('startIndex', newStartIndex.toString());
    newSearchParams.set('maxResult', maxResult.toString());
  
    if (filter !== 'default') newSearchParams.set('filter', filter);
    if (orderBy !== 'default') newSearchParams.set('orderBy', orderBy);
    if (printType !== 'default') newSearchParams.set('printType', printType);
  
    navigate(`/search?${newSearchParams.toString()}`);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    updateSearchParams('filter', event.target.value);
  };

  const handleOrderByChange = (event) => {
    setOrderBy(event.target.value);
    updateSearchParams('orderBy', event.target.value);
  };

  const handlePrintTypeChange = (event) => {
    setPrintType(event.target.value);
    updateSearchParams('printType', event.target.value);
  };

  const updateSearchParams = (param, value) => {
    const newSearchParams = new URLSearchParams(searchParams);
  
    // check if the value is the default value
    if (value !== 'default') {
      newSearchParams.set(param, value);
    } else {
      newSearchParams.delete(param);
    }
  
    // avoid navigating to the same URL
    if (newSearchParams.toString() !== searchParams.toString()) {
      navigate(`/search?${newSearchParams.toString()}`);
    }
  };

  return (
    <MDBContainer style={{ paddingTop: '20px' }}>
      <form onSubmit={handleSubmit}>
        <MDBInputGroup className='mb-3'>
          <input className='form-control' name='query' defaultValue={query} placeholder='Enter book title' />
          <MDBBtn color='primary' type='submit'>Search</MDBBtn>
        </MDBInputGroup>
      </form>
      <select id="filter" value={filter} onChange={handleFilterChange}>
        <option value="default">default</option>
        <option value="full">full</option>
        <option value="ebooks">ebooks</option>
        <option value="free-ebooks">free-ebooks</option>
        <option value="paid-ebooks">paid-ebooks</option>
        <option value="partial">partial</option>
      </select>
      <select id="orderBy" value={orderBy} onChange={handleOrderByChange}>
        <option value="default">default</option>
        <option value="newest">newest</option>
        <option value="relevance">relevance</option>
      </select>
      <select id="printType" value={printType} onChange={handlePrintTypeChange}>
        <option value="default">default</option>
        <option value="all">all</option>
        <option value="books">books</option>
        <option value="magazines">magazines</option>
      </select>
      {books && books.map(book => (
          <MDBCard className="mb-3">
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
      <div className='d-flex justify-content-between mt-3'>
        {startIndex > 0 ? (
          <MDBBtn onClick={() => handleNavigation(startIndex - 20)}>Previous</MDBBtn>
        ) : (
          <div></div> // when there is no previous page, show an empty div
        )}
        {query && ( // based on the query, decide whether to show the Next button
          <MDBBtn onClick={() => handleNavigation(startIndex + 20)}>Next</MDBBtn>
        )}
      </div>
    </MDBContainer>
  );
}

export default SearchBooks;