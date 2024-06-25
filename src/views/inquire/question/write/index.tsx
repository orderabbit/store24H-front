import { postQuestionRequest } from "apis";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginUserStore } from "stores";
import "./style.css";

export default function Write() {
  const navigate = useNavigate();
  const userIdRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [type, setType] = useState("");
  const [email, setEmail] = useState("");
  const { loginUser } = useLoginUserStore();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [typeError, setTypeError] = useState("");



  useEffect(() => {
    const userId = loginUser?.userId;
    if (!userId) return;
    setUserId(userId);
    setIsLoggedIn(true);
  }, [loginUser]);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    if (event.target.value) setTitleError("");
  };
  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
    if (event.target.value) setContentError("");
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const emailValue = event.target.value; 
    setEmail(emailValue);
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(emailValue)){setErrorMessage("이메일 형식을 지켜서 입력해주세요.");}
    else {setErrorMessage("")}

  };
  const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedType = event.target.value; // 숫자 형태의 값이 들어옴
    let typeString = ""; // 변환된 문자열을 저장할 변수

    switch (
      selectedType // 선택된 값에 따라 문자열로 변환
    ) {
      case "1":
        typeString = "문의 유형을 선택해주세요.";
        break;
      case "2":
        typeString = "배송 /수령예정일 안내";
        break;
      case "3":
        typeString = "주문 / 결제";
        break;
      case "4":
        typeString = "회원정보 안내";
        break;
      case "5":
        typeString = "반품 /교환/ 환불 안내";
        break;
      default:
        typeString = ""; // 기본값 처리
        break;
    }

    setType(selectedType); // 변환된 문자열을 state에 저장
    if(selectedType != "1") setTypeError("");
  };

  const uploadPostClickHandler = async () => {
      let hasError = false;

      if(!title){
        setTitleError("제목을 입력해주세요.");
        hasError = true;
      }
      if(!content){
        setContentError("내용을 입력해주세요.");
        hasError = true;
      }
      if(!email){
        setEmailError("이메일을 입력해주세요.");
        hasError = true;
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
          setEmailError("email 형식으로 입력해주세요.");
          hasError = true;
        }
      }
      if(!type || type === "1"){
        setTypeError("문의 유형을 입력해주세요.");
        hasError = true;
      }
      if(hasError) return;

      try{
      const requestBody = { title, content, userId, type, email };
      const result = await postQuestionRequest(requestBody);
  
      if (result && result.code === "SU") {
        alert("해당 문의가 업로드되었습니다.");
        navigate("/question");
      } else {
        setErrorMessage("해당 문의 업로드 실패");
      }
    } catch (error) {
      console.error("해당 문의 업로드 중 오류가 발생했습니다:", error);
      setErrorMessage("해당 문의 업로드 중 오류가 발생했습니다");
    }
  };
  
  const cancelClickHandler = () => {
    navigate("/question");
  };

  return (
    <table className="inquire-write">
  <thead>
    <tr>
      <th className="inquire-write-title">1대1 문의 접수</th>
    </tr>
  </thead>
  <tbody>
    <div className="inquire-write-tr">
      <th className="inquire-write-left">문의 ID</th>
      <td className="inquire-write-right">{userId}</td>
    </div>
    <div  className="inquire-write-tr">
      <th className="inquire-write-left">문의유형</th>
      <td className="inquire-write-right">
        <label htmlFor="inquire"></label>
        <select id="inquire" value={type} onChange={handleTypeChange} style={{ width: "300px", height: 40, borderRadius: 5, textIndent: "10px"  }}>
          <option value="1">문의 유형을 선택해주세요.</option>
          <option value="2">배송 /수령예정일 안내</option>
          <option value="3">주문 / 결제</option>
          <option value="4">회원정보 안내</option>
          <option value="5">반품 /교환/ 환불 안내</option>
        </select>
        {typeError && <div style={{ color : 'red'}}>{typeError}</div>}
      </td>
    </div>
    <div  className="inquire-write-tr">
      <th className="inquire-write-left">제목</th>
      <td className="inquire-write-right">
        <input
          type="text"
          placeholder="제목을 입력해 주세요."
          value={title}
          onChange={handleTitleChange}
          style={{ width: "700px", height: 40, borderRadius: 5, textIndent: "10px" }}
        />
        {titleError && <div style={{ color : 'red'}}>{titleError}</div>}
      </td>
    </div>
    <div  className="inquire-write-tr-content">
      <th className="inquire-write-left-content">내용</th>
      <td className="inquire-write-right-content">
        <textarea
          placeholder="문의 유형을 먼저 선택 후 내용을 입력해주세요."
          value={content}
          onChange={handleContentChange}
          style={{ width: "700px", height: 400 , borderRadius: 5, textIndent: "10px" }}
        />
        {contentError && <div style={{ color : 'red'}}>{contentError}</div>}
      </td>
    </div>
    <div className="inquire-write-tr">
      <th className="inquire-write-left">이메일</th>
      <td className="inquire-write-right">
        <input
          type="text"
          placeholder="연락 받으실 이메일을 입력해주세요."
          value={email}
          onChange={handleEmailChange}
          style={{ width: "700px", height: 40, borderRadius: 5, textIndent: "10px"  }}
        />
        {emailError && <div style={{ color : 'red'}}>{emailError}</div>}
      </td>
    </div>
  </tbody>
  <tfoot>
    <div>
      <td className="inquire-write-cancel" onClick={cancelClickHandler}>취소
      </td>
      <td className="inquire-write-upload" onClick={uploadPostClickHandler}>문의 접수
      </td>
    </div>
    
  </tfoot>
</table>

  );
}
