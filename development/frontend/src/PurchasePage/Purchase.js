import React, { useState } from 'react';
import { MDBContainer, MDBCard, MDBCardBody, MDBCardHeader, MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom'; 

const PurchasePage = () => {
    const [formData, setFormData] = useState({
        address: '',
        postalCode: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate(); 

    const validateAddress = (address) => address.trim() !== '';

    // validatePostalCode: the postal code must be 6 characters long and consist of letters and/or numbers
    const validatePostalCode = (postalCode) => /^[A-Za-z0-9]{6}$/.test(postalCode);

    // validateCardNumber: the card number must be 12 to 19 digits long
    const validateCardNumber = (number) => /^[0-9]{12,19}$/.test(number);

    // validateExpiryDate: the expiry date must be in the format MM/YY and must not be in the past
    const validateExpiryDate = (date) => {
        if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(date)) return false;
        const today = new Date();
        const monthYear = date.split('/');
        const expiry = new Date(`20${monthYear[1]}`, monthYear[0] - 1);
        return expiry > today;
    };

    // validateCVV: the CVV must be 3 or 4 digits long
    const validateCVV = (cvv) => /^[0-9]{3,4}$/.test(cvv);

    const allFieldsFilled = () => {
        return formData.address && formData.postalCode && formData.cardNumber && formData.expiryDate && formData.cvv;
    };
    
    // handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        // add errors to newErrors object if the fields are invalid
        if (!validateAddress(formData.address)) {
            newErrors.address = 'Please fill in the address';
        }
        if (!validatePostalCode(formData.postalCode)) {
            newErrors.postalCode = 'Postal code must be 6 characters long and consist of letters and/or numbers';
        }
        if (!validateCardNumber(formData.cardNumber)) {
            newErrors.cardNumber = 'Invalid card number';
        }
        if (!validateExpiryDate(formData.expiryDate)) {
            newErrors.expiryDate = 'Invalid or expired date';
        }
        if (!validateCVV(formData.cvv)) {
            newErrors.cvv = 'Invalid CVV';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0 && allFieldsFilled()) {
            navigate('/payment-success');
        }
    };

    // refresh the state when the user types in the input field
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <MDBContainer>
            <MDBCard style = {{marginBottom: '20px',marginTop: '20px'}}>
                <MDBCardHeader style = {{marginBottom: '20px'}} color="primary-color" tag="h2">
                    Checkout
                </MDBCardHeader>
                <MDBCardBody>
                    <form onSubmit={handleSubmit}>
                        <MDBInput
                            label="Address"
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            style = {{marginBottom: '20px'}}
                        />
                        {errors.address && <div className="text-danger">{errors.address}</div>}
                        <MDBInput
                            label="Postal Code"
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            style = {{marginBottom: '20px'}}
                        />
                        {errors.postalCode && <div className="text-danger">{errors.postalCode}</div>}
                        <MDBInput
                            label="Card Number"
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            error={errors.cardNumber}
                            style = {{marginBottom: '20px'}}
                        />
                        {errors.cardNumber && <div className="text-danger">{errors.cardNumber}</div>}
                        <MDBInput
                            label="Expiry Date (MM/YY)"
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            error={errors.expiryDate}
                            style = {{marginBottom: '20px'}}
                        />
                        {errors.expiryDate && <div className="text-danger">{errors.expiryDate}</div>}
                        <MDBInput
                            label="CVV"
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleChange}
                            error={errors.cvv}
                            style = {{marginBottom: '20px'}}
                        />
                        {errors.cvv && <div className="text-danger">{errors.cvv}</div>}
                        
                        <MDBBtn color="primary" type="submit" style = {{float:'right'}}>
                            Pay Now
                        </MDBBtn>
                        
                    </form>
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>
    );
};

export default PurchasePage;
