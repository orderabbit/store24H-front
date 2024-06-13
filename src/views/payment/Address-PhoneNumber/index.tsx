import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

declare global {
    interface Window {
        daum: any;
    }
}

interface Product {
    productId: number;
    title: string;
    link: string;
    image: string;
    lowPrice: string;
    category1: string;
    category2: string;
}

const AddressPage = () => {
    const location = useLocation()
    const [address, setAddress] = useState<string>('');
    const [postcode, setPostcode] = useState<string>('');
    const [detailAddress, setDetailAddress] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const navigate = useNavigate();
    const selectedProducts: Product[] =  location.state.selectedProducts || [];
    const selectedProductIds: Product[] =  location.state.selectedProductIds || [];

    const handlePostcodeSearch = () => {
        new window.daum.Postcode({
            oncomplete: function (data: any) {
                setPostcode(data.zonecode);
                setAddress(data.roadAddress);
            }
        }).open();
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        console.log('selectedProductIds', selectedProducts);
        event.preventDefault();
        navigate(`/checkout`, {
            state: {
                selectedProductIds,
                selectedProducts,
                address,
                postcode,
                detailAddress,
                phoneNumber
            }
        });
    };

    // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();
    //     navigate(`/checkout?address=${encodeURIComponent(address)}&postcode=${encodeURIComponent(postcode)}&detailAddress=${encodeURIComponent(detailAddress)}&phoneNumber=${encodeURIComponent(phoneNumber)}`);
    // };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === 'detailAddress') setDetailAddress(value);
        if (name === 'phoneNumber') setPhoneNumber(value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Postcode:
                <input type="text" value={postcode} readOnly />
                <button type="button" onClick={handlePostcodeSearch}>Search Postcode</button>
            </label>
            <br />
            <label>
                Address:
                <input type="text" value={address} readOnly />
            </label>
            <br />
            <label>
                Detail Address:
                <input type="text" name="detailAddress" value={detailAddress} onChange={handleInputChange} />
            </label>
            <br />
            <label>
                Phone Number:
                <input type="text" name="phoneNumber" value={phoneNumber} onChange={handleInputChange} />
            </label>
            <br />
            <button type="submit">Proceed to Checkout</button>
        </form>
    );
};

export default AddressPage;
