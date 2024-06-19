import { postQuestionRequest } from "apis";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginUserStore } from "stores";

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
  const [loggedInUserId, setLoggedInUserId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const userId = loginUser?.userId;
    if (!userId) return;
    setUserId(userId);
    setIsLoggedIn(true);
  }, [loginUser]);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };
  // const handleUserIdChange = (event: ChangeEvent<HTMLInputElement>) => {
  //     setUserId(event.target.value);
  // };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setType(event.target.value);
  };
  const uploadPostClickHandler = async () => {
    
    try {
      const result = await postQuestionRequest({ title, content, userId,type,email });
      
      if (result && result.code === "SU") {
        alert("해당 문의가 업로드되었습니다.");
        navigate("/contact");
      } else {
        setErrorMessage("해당 문의 업로드 실패");
      }
    } catch (error) {
      console.error("해당 문의 업로드 중 오류가 발생했습니다:", error);
      setErrorMessage("해당 문의 업로드 중 오류가 발생했습니다");
    }
  };
  const cancelClickHandler = () => {
    navigate("/contact");
  };

  return (
    <div className="inquire">
      <h2 className="inquire-title">1대1 문의 접수</h2>
      <div>
        <tr>
        <th>문의 ID</th>
        <td>{userId}</td>
        </tr>
        <tr>
        <th>문의유형</th>
        <td>
          <label htmlFor="inquire"></label>
          <select id="inquire" value={type} onChange={handleTypeChange}>
            <option value="1">문의 유형을 선택해주세요.</option>
            <option value="2">배송 /수령예정일 안내</option>
            <option value="3">주문 / 결제</option>
            <option value="4">회원정보 안내</option>
            <option value="5">반품 /교환/ 환불 안내</option>
          </select>
        </td>
        </tr>
        <tr>
        <th>제목</th>
        <td>
        <input
            type="text"
            placeholder="제목을 입력해주세요."
            value={title}
            onChange={handleTitleChange}
          />
          </td>
        </tr>
          <tr>
          <th>내용</th>
          <td>
          <textarea
            placeholder="내용을 입력해주세요."
            value={content}
            onChange={handleContentChange}
          />
        </td>
          </tr>
        <tr>
        <th>사진 첨부</th>
        <td> 첨부할 사진을 올려주세요.</td>
        </tr>
        <tr>
      <th>이메일</th>
      <td>
        <input
          type="text"
          placeholder="이메일을 입력해주세요."
          value={email}
          onChange={handleEmailChange}
        />
      </td>
      </tr>
      </div>
      <button onClick={cancelClickHandler}>취소</button>
      <button onClick={uploadPostClickHandler}>문의 접수</button>
    </div>
  );
}
