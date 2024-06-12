import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

declare global {
    interface Window {
        daum: any;
    }
}

const AddressPage = () => {
    const [address, setAddress] = useState<string>('');
    const [postcode, setPostcode] = useState<string>('');
    const [detailAddress, setDetailAddress] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const navigate = useNavigate();

    const handlePostcodeSearch = () => {
        new window.daum.Postcode({
            oncomplete: function (data: any) {
                setPostcode(data.zonecode);
                setAddress(data.roadAddress);
            }
        }).open();
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        navigate(`/checkout?address=${encodeURIComponent(address)}&postcode=${encodeURIComponent(postcode)}&detailAddress=${encodeURIComponent(detailAddress)}&phoneNumber=${encodeURIComponent(phoneNumber)}`);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === 'detailAddress') setDetailAddress(value);
        if (name === 'phoneNumber') setPhoneNumber(value);
    };

    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
    };

    const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(event.target.value);
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
