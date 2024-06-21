import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQuestionRequest, patchQuestionRequest, postQuestionRequest } from "apis";
import Question from "types/interface/question.interface";
import { useLoginUserStore } from "stores";
import { PatchQuestionRequestDto, PostQuestionRequestDto } from "apis/request/question";

export default function Update() {
  const params = useParams();
  const {questionId} = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [type, setType] = useState("");
  const [email, setEmail] = useState("");
  const { loginUser } = useLoginUserStore();
  const [errorMessage, setErrorMessage] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  const [question, setQuestion] = useState<Question | null>(null);
  const [postRequest, setPostRequest] = useState<PostQuestionRequestDto>({
    title: "",
    content: "",
    userId: "",
    type: "",
    email: "",
  });

  // useEffect(() => {
  //     const fetchQuestionDetails = async () => {
  //         try {
  //             const response = await getQuestionRequest(questionId);
  //             if ('title' in response && 'content' in response&& 'userId' in response&& 'type' in response&& 'email' in response) {
  //                 const { title, content,userId,type,email } = response;
  //                 setPostRequest({ title, content,userId,type,email });
  //             } else {
  //                 alert('질문 정보를 불러오는 데 실패했습니다.');
  //             }
  //         } catch (error) {
  //             console.error('질문 정보를 불러오는 중 오류가 발생했습니다:', error);
  //             alert('질문 정보를 불러오는 중 오류가 발생했습니다.');
  //         }
  //     };
  //     fetchQuestionDetails();
  // }, []);
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
        // console.log(response)
        const { title, content, userId, type, email } = response as Question;
        if (!title || !content || !userId || !type || !email) {
          throw new Error("Invalid response structure");
        }
        setQuestion(response as Question | null);
        setPostRequest({title, content, userId ,type ,email});
      } catch (error) {
        console.error("질문 정보를 불러오는 중 오류가 발생했습니다:", error);
        alert("질문 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchQuestion();
  }, [questionId]);
  
  // const handleInputChange = (
  //   event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  // ) => {
  //   const { name, value } = event.target;
  //   setPostRequest((prevState) => ({
  //     ...prevState,
  //     [name]: value,
  //   }));
  // };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setPostRequest((prevState) => ({
      ...prevState,
      title: event.target.value,
    }));
  };
  
  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
    setPostRequest((prevState) => ({
      ...prevState,
      content: event.target.value,
    }));
  };
  
  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
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
    setPostRequest((prevState) => ({
      ...prevState,
      type: selectedType, // 실제 선택된 값으로 업데이트
    }));
  };
  // const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
  //   setType(event.target.value);
  //   setPostRequest((prevState) => ({
  //     ...prevState,
  //     type: event.target.value,
  //   }));
  // };
  
  // const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
  //   const selectedType = event.target.value; // 숫자 형태의 값이 들어옴
  //   let typeString = ""; // 변환된 문자열을 저장할 변수

  //   switch (
  //     selectedType // 선택된 값에 따라 문자열로 변환
  //   ) {
  //     case "1":
  //       typeString = "문의 유형을 선택해주세요.";
  //       break;
  //     case "2":
  //       typeString = "배송 /수령예정일 안내";
  //       break;
  //     case "3":
  //       typeString = "주문 / 결제";
  //       break;
  //     case "4":
  //       typeString = "회원정보 안내";
  //       break;
  //     case "5":
  //       typeString = "반품 /교환/ 환불 안내";
  //       break;
  //     default:
  //       typeString = ""; // 기본값 처리
  //       break;
  //   }

  //   setType(selectedType); // 변환된 문자열을 state에 저장
  // };
  const cancelClickHandler = () => {
    navigate("/question");
  };
  const uploadPostClickHandler = async () => {
    
    try {
        const result = await patchQuestionRequest(questionId, postRequest);
        if (result && result.code === "SU") { 
          alert("질문 수정 완료");
          navigate("/question");
        } else {
          setErrorMessage("질문 수정 실패");
        }
      } catch (error) {
        console.error("질문 수정 중 오류가 발생했습니다:", error);
        setErrorMessage("질문 수정 중 오류가 발생했습니다");
      }
  };
  if (!question) {
    return <div>해당 문의를 불러오는 데 실패했습니다.</div>;
  }
//   const updatePost = async () => {
//     try {
//       const result = await patchQuestionRequest(questionId, postRequest);
//       if (result && result.data.code === "SU") {
//         alert("질문 수정 완료");
//         navigate("/");
//       } else {
//         setErrorMessage("질문 수정 실패");
//       }
//     } catch (error) {
//       console.error("질문 수정 중 오류가 발생했습니다:", error);
//       setErrorMessage("질문 수정 중 오류가 발생했습니다");
//     }
//   };

  return (
    <tr className="inquire">
    <h2 className="inquire-title">1대1 문의 접수</h2>
    <tr>
      <tr>
      <th>문의 ID</th>
      <td>{question.userId}</td>
      </tr>
      <tr>
      <th>문의유형</th>
      <td>{question.type}</td>
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
      <td>{question.title}</td>
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
        <td>{question.content}</td>
        <td>
        <textarea
          placeholder="내용을 입력해주세요."
          value={content}
          onChange={handleContentChange}
        />
      </td>
        </tr>
      <tr>
    <th>이메일</th>
    <td>{question.email}</td>
    <td>
      <input
        type="text"
        placeholder="이메일을 입력해주세요."
        value={email}
        onChange={handleEmailChange}
      />
    </td>
    </tr>
    </tr>
    <button onClick={cancelClickHandler}>취소</button>
    <button onClick={uploadPostClickHandler}>문의 접수</button>
    </tr>
  );
}
