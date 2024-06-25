import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQuestionRequest, patchQuestionRequest } from "apis";
import Question from "types/interface/question.interface";
import { useLoginUserStore } from "stores";
import { PostQuestionRequestDto } from "apis/request/question";
import "./style.css"

export default function Update() {
  const params = useParams();
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [type, setType] = useState("");
  const [email, setEmail] = useState("");
  const { loginUser } = useLoginUserStore();
  const [errorMessage, setErrorMessage] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [typeError, setTypeError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loggedInUserId, setLoggedInUserId] = useState("");
  const [question, setQuestion] = useState<Question | null>(null);
  const [postRequest, setPostRequest] = useState<PostQuestionRequestDto>({
    title: "",
    content: "",
    userId: "",
    type: "",
    email: "",
  });

  useEffect(() => {
    const userId = loginUser?.userId;
    if (!userId) return;
    setUserId(userId);
    setIsLoggedIn(true);
  }, [loginUser]);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await getQuestionRequest(questionId);
        const { title, content, userId, type, email } = response as Question;
        if (!title || !content || !userId || !type || !email) {
          throw new Error("Invalid response structure");
        }
        setQuestion(response as Question | null);
        setPostRequest({ title, content, userId, type, email });
      } catch (error) {
        console.error("질문 정보를 불러오는 중 오류가 발생했습니다:", error);
        alert("질문 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchQuestion();
  }, [questionId]);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    if (event.target.value) setTitleError("");
    setPostRequest((prevState) => ({
      ...prevState,
      title: event.target.value,
    }));
  };

  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
    if (event.target.value) setContentError("");
    setPostRequest((prevState) => ({
      ...prevState,
      content: event.target.value,
    }));
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(event.target.value)){
      setEmailError("email 형식으로 입력해주세요.");
    } else{
    setEmailError("");}
    setPostRequest((prevState) => ({
      ...prevState,
      email: event.target.value,
    }));
  };
  const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedType = event.target.value; // 선택된 값이 숫자 형태로 들어옴
    let typeString = ""; // 변환된 문자열을 저장할 변수

    switch (selectedType) {
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

    // state 업데이트
    setType(selectedType);
    if(selectedType != "1") setTypeError("");
    setPostRequest((prevState) => ({
      ...prevState,
      type: selectedType, // 실제 선택된 값으로 업데이트
    }));
  };
  const cancelClickHandler = (questionId : number | string | undefined) => {
    if(!questionId) return;
    navigate(`/question/detail/${questionId}`);
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
    } else{
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
    try {
      const result = await patchQuestionRequest(questionId, postRequest);
      if (result && result.code === "SU") {
        alert("질문 수정 완료");
        navigate(`/question/detail/${questionId}`);
      } else {
        setErrorMessage("질문 수정 실패");
      }
    } catch (error) {
      console.error("질문 수정 중 오류가 발생했습니다:", error);
      setErrorMessage("질문 수정 중 오류가 발생했습니다");
    }
  };


  const getTypeString = (type: string) => {
    switch (type) {
      case "1":
        return "문의 유형을 선택해주세요.";
      case "2":
        return "배송 /수령예정일 안내";
      case "3":
        return "주문 / 결제";
      case "4":
        return "회원정보 안내";
      case "5":
        return "반품 /교환/ 환불 안내";
      default:
        return "알 수 없는 유형";
    }
  };

  if (!question) {
    return <div>해당 문의를 불러오는 데 실패했습니다.</div>;
  }
  return (
    <div className="inquire-update-enter">
      <h2 className="inquire-update-enter-title">1대1 문의 접수</h2>
      <table className="inquire-update">
      <tbody>
        <tr className="inquire-update-combine">
          <th className="inquire-update-title">문의 ID</th>
          <td className="inquire-update-content">{question.userId}</td>
        </tr>
        <tr className="inquire-update-combine">
          <th className="inquire-update-title">문의유형</th>
          <td className="inquire-update-content">
            {getTypeString(question.type)}
          </td>
          <td className="inquire-update-update">
            <label htmlFor="inquire"></label>
            <select id="inquire" value={type} onChange={handleTypeChange} style={{ width: "550px", height: 40, borderRadius: 5, textIndent: "10px"  }}>
              <option value="1">문의 유형을 선택해주세요.</option>
              <option value="2">배송 /수령예정일 안내</option>
              <option value="3">주문 / 결제</option>
              <option value="4">회원정보 안내</option>
              <option value="5">반품 /교환/ 환불 안내</option>
            </select>
            {typeError && <div style={{ color: 'red' }}>{typeError}</div>}
          </td>
        </tr>
        <tr className="inquire-update-combine">
          <th className="inquire-update-title">제목</th>
          <td className="inquire-update-content">{question.title}</td>
          <td className="inquire-update-update">
            <input
              type="text"
              placeholder="제목을 입력해주세요."
              value={title}
              onChange={handleTitleChange}
              style={{ width: "700px", height: 40, borderRadius: 5, textIndent: "10px" }}
            />
              {titleError && <div style={{ color: 'red' }}>{titleError}</div>}
          </td>
        </tr>
        <tr className="inquire-update-combine-content">
          <th className="inquire-update-title-content">내용</th>
          <td className="inquire-update-content-content">{question.content}</td>
          <td className="inquire-update-update-content">
            <textarea
              placeholder="문의 유형을 먼저 선택 후 내용을 입력해주세요."
              value={content}
              onChange={handleContentChange}
              style={{ width: "700px", height: 350 , borderRadius: 5, textIndent: "10px", resize: "none"  }}
            />
            {contentError && <div style={{ color: 'red' }}>{contentError}</div>}
          </td>
        </tr>
        <tr className="inquire-update-combine">
          <th className="inquire-update-title">이메일</th>
          <td className="inquire-update-content">{question.email}</td>
          <td className="inquire-update-update">
            <input
              type="text"
              placeholder="연락 받으실 이메일을 입력해주세요."
              value={email}
              onChange={handleEmailChange}
              style={{ width: "700px", height: 40, borderRadius: 5, textIndent: "10px" }}
            />
            {emailError && <div style={{ color: 'red' }}>{emailError}</div>}
          </td>
        </tr>
        <tr>
          <div className="inquire-update-cancel" onClick={() => cancelClickHandler(questionId)}>
            취소
          </div>
          <div
            className="inquire-update-upload"
            onClick={uploadPostClickHandler}
          >
            문의 수정
          </div>
        </tr>
      </tbody>
    </table>
    {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
    </div>
  );
}
