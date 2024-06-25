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
  productImageList: string[];
  lowPrice: string;
  category1: string;
  category2: string;
  category3: string;
  count: number;
}

const AddressPage = () => {
  const location = useLocation();
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [postcode, setPostcode] = useState<string>("");
  const [detailAddress, setDetailAddress] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [postcodeError, setPostcodeError] = useState<string>("");
  const [addressError, setAddressError] = useState<string>("");
  const [detailAddressError, setDetailAddressError] = useState<string>("");
  const [phoneNumberError, setPhoneNumberError] = useState<string>("");
  const navigate = useNavigate();
  const selectedProducts: Product[] = location.state.selectedProducts || [];
  const selectedProductIds: Product[] = location.state.selectedProductIds || [];
  const totalPrice: string = location.state.totalPrice || "0";

  const handlePostcodeSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data: any) {
        setPostcode(data.zonecode);
        setAddress(data.roadAddress);
      },
    }).open();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let isValid = true;

    if (name.trim() === "") {
      setNameError("받는 사람을 입력해주세요.");
      isValid = false;
    } else {
      setNameError("");
    }

    if (postcode.trim() === "") {
      setPostcodeError("우편번호를 입력해주세요.");
      isValid = false;
    } else {
      setPostcodeError("");
    }

    if (address.trim() === "") {
      setAddressError("주소를 입력해주세요.");
      isValid = false;
    } else {
      setAddressError("");
    }

    if (detailAddress.trim() === "") {
      setDetailAddressError("상세주소를 입력해주세요.");
      isValid = false;
    } else {
      setDetailAddressError("");
    }

    if (phoneNumber.trim() === "") {
      setPhoneNumberError("휴대폰 번호를 입력해주세요.");
      isValid = false;
    } else {

      const regex = /^\d{3}-\d{3,4}-\d{4}$/;
      if (!regex.test(phoneNumber)) {
        setPhoneNumberError("휴대폰 번호 형식을 확인해주세요. ex) 010-1234-5678");
        isValid = false;
      } else {
        setPhoneNumberError("");
      }
    }

    // Proceed with navigation if valid
    if (isValid) {
      navigate(`/checkout`, {
        state: {
          selectedProductIds,
          selectedProducts,
          name,
          address,
          postcode,
          detailAddress,
          phoneNumber,
          totalPrice,
        },
      });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "name") setName(value);
    if (name === "detailAddress") setDetailAddress(value);
    if (name === "phoneNumber") setPhoneNumber(value);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="address-home">
        <div className="address-whole-title">배송지</div>
        <div className="address-whole">

          <div className="address-title">받는 사람 :</div>
          <div className="address-content">
            <input type="text" name="name" value={name} onChange={handleInputChange}  style={{ width: "300px", height: 35, borderRadius: 5, textIndent: "10px"  }} />
            {nameError && <p className="error-message">{nameError}</p>}
          </div>
          <br />
          <div className="address-title">우편번호 :</div>
          <div className="address-content">
            <input type="text" value={postcode} readOnly style={{ width: "300px", height: 35, borderRadius: 5, textIndent: "10px"  }}/>
            <button
              className="Find-postal-code"
              type="button"
              onClick={handlePostcodeSearch} 
              >
              우편번호 찾기
            </button>
            {postcodeError && <p className="error-message">{postcodeError}</p>}
          </div>
          <br />
          <div className="address-title">주소 :</div>
          <div className="address-content">
            <input type="text" value={address} readOnly style={{ width: "300px", height: 35, borderRadius: 5, textIndent: "10px"  }}/>
            {addressError && <p className="error-message">{addressError}</p>}
          </div>

          <br />
          <div className="address-title"> 상세주소 :</div>
          <div className="address-content">
            <input
              type="text"
              name="detailAddress"
              value={detailAddress}
              onChange={handleInputChange}
              style={{ width: "300px", height: 35, borderRadius: 5, textIndent: "10px"  }}
            />
            {detailAddressError && <p className="error-message">{detailAddressError}</p>}
          </div>

          <br />
          <div className="address-title">휴대폰 번호:</div>
          <div className="address-content">
            <input
              type="text"
              name="phoneNumber"
              value={phoneNumber}
              onChange={handleInputChange}
              style={{ width: "300px", height: 35, borderRadius: 5, textIndent: "10px"  }}
            />
            {phoneNumberError && <p className="error-message">{phoneNumberError}</p>}
          </div>

          <br />
            <div className="address-store-mom">
            <button className="address-store" type="submit">배송지 저장</button>
            </div>
        </div>
      </div>
    </form>
  );
};

export default AddressPage;
