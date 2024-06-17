import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.css";
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
  const location = useLocation();
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [postcode, setPostcode] = useState<string>("");
  const [detailAddress, setDetailAddress] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const navigate = useNavigate();
  const selectedProducts: Product[] = location.state.selectedProducts || [];
  const selectedProductIds: Product[] = location.state.selectedProductIds || [];

  const handlePostcodeSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data: any) {
        setPostcode(data.zonecode);
        setAddress(data.roadAddress);
      },
    }).open();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log("selectedProductIds", selectedProducts);
    event.preventDefault();
    navigate(`/checkout`, {
      state: {
        selectedProductIds,
        selectedProducts,
        name,
        address,
        postcode,
        detailAddress,
        phoneNumber,
      },
    });
  };

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //     event.preventDefault();
  //     navigate(`/checkout?address=${encodeURIComponent(address)}&postcode=${encodeURIComponent(postcode)}&detailAddress=${encodeURIComponent(detailAddress)}&phoneNumber=${encodeURIComponent(phoneNumber)}`);
  // };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "name") setName(value);
    if (name === "detailAddress") setDetailAddress(value);
    if (name === "phoneNumber") setPhoneNumber(value);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}> 
      <div className="address-home">
        <div className="address-whole-title">배송지</div>
        <div className="address-whole">
          <div className="address-title">받는 사람 :</div>
          <div className="address-content">
            <input type="text" name="name" onChange={handleInputChange}  />
          </div>
          <br />
          <div className="address-title">우편번호 :</div>
          <div className="address-content">
            <input type="text" value={postcode} readOnly />
            <button
              className="Find-postal-code"
              type="button"
              onClick={handlePostcodeSearch}
            >
              우편번호 찾기
            </button>
          </div>
          <br />
          <div className="address-title">주소 :</div>
          <div className="address-content">
            <input type="text" value={address} readOnly />
          </div>

          <br />
          <div className="address-title"> 상세주소 :</div>
          <div className="address-content">
            <input
              type="text"
              name="detailAddress"
              value={detailAddress}
              onChange={handleInputChange}
            />
          </div>

          <br />
          <div className="address-title">휴대폰 번호:</div>
          <div className="address-content">
            <input
              type="text"
              name="phoneNumber"
              value={phoneNumber}
              onChange={handleInputChange}
            />
          </div>

          <br />
          <div className="address-store">
            <button type="submit">배송지 저장</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddressPage;
