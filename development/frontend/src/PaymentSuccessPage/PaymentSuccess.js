import React from 'react';
import { MDBContainer, MDBCard, MDBCardBody, MDBCardHeader, MDBBtn } from 'mdb-react-ui-kit';

const PaymentSuccessPage = () => {
    return (
        <MDBContainer className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
            <MDBCard className="text-center" style={{ width: "auto", marginTop: "-100px" }}>
                <MDBCardHeader color="success-color" tag="h2" style={{ fontSize: '24px' }}>
                    Payment Succeeded
                </MDBCardHeader>
                <MDBCardBody>
                    <p style={{ fontSize: '20px', margin: '20px 0' }}>
                        Your payment has been processed successfully.
                    </p>
                    <i className="fa fa-check-circle" aria-hidden="true" style={{ fontSize: '50px', color: 'green', margin: '20px 0' }}></i>
                    <br />
                    <MDBBtn color="success" onClick={() => window.location.href = '/'} style={{ fontSize: '18px' }}>
                        Go to Home
                    </MDBBtn>
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>
    );
};

export default PaymentSuccessPage;