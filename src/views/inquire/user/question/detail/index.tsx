import React, { useEffect, useState,ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteQuestionRequest, getQuestionRequest, postAnswerRequest } from "apis";
import Question from "types/interface/question.interface";
import { useLoginUserStore } from "stores";
import { DeleteQuestionResponseDto } from "apis/response/question";
import { ResponseDto } from "apis/response";
import { PostAnswerRequestDto } from 'apis/request/answer';
import { getAnswerRequest, patchAnswerRequest } from 'apis';
import { getAllAnswerRequest } from 'apis';
import Answer from 'types/interface/answer.interface';
import "./style.css";

const QuestionDetail: React.FC = () => {
  const { questionId } = useParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<string[]>([]);
  const navigator = useNavigate();
  const { loginUser } = useLoginUserStore();
  const [deletingQuestionId, setDeletingQuestionId] = useState<number | null>(null);
  const {answer} = useParams();  
  const [userId, setUserId] = useState('');
  const [content, setContent] = useState('');
  const {AnswerNumber} = useParams();
  const [posts, setPosts] = useState<Answer[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [postRequest, setPostRequest] = useState<PostAnswerRequestDto>({
      content: '',
      userId: '',
  });

  // 답변 섹션 관련 상태
  const [answerVisible, setAnswerVisible] = useState(false);
  const [answerContent, setAnswerContent] = useState("");

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
        setLoading(false);
      } catch (error) {
        console.error("질문 정보를 불러오는 중 오류가 발생했습니다:", error);
        alert("질문 정보를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId]);

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const result = await getAnswerRequest(questionId);
  //       console.log(result);
  //       if (!result) return;
  //       const { code, Answer } = result.data;
  //       if (code === 'DBE') {
  //         alert('데이터베이스 오류입니다.');
  //         return;
  //       }
  //       if (code !== 'SU') return;
  //       setPosts(Answer);
  //     } catch (error) {
  //       console.error('답변을 가져오는중 오류가 발생했습니다:', error);
  //     }
  //   };

  //   fetchPosts();
  // }, []);

  useEffect(() => {
    const fetchAnswerDetails = async () => {
      if(!answer) return;
      const answerId = parseInt(answer);
        try {
          console.log(answerId)
            const response = await getAnswerRequest(answerId);
            if ('content' in response && 'userId' in response && 'questionId' in response) {
                const { content,userId } = response;
                setPostRequest({ content, userId });
            } else {
                alert('답변 정보를 불러오는 데 실패했습니다.');
            }
        } catch (error) {
            console.error('답변 정보를 불러오는 중 오류가 발생했습니다:', error);
            alert('답변 정보를 불러오는 중 오류가 발생했습니다.');
        }
    };
    fetchAnswerDetails();
}, [answer]);

// const updatePost = async () => {
//     try {
//         const result = await patchAnswerRequest(answerId, postRequest);
//         if (result && result.data.code === 'SU') {
//             alert('답변 수정 완료');
//             navigator('/');
//         } else {
//             setErrorMessage('답변 수정 실패');
//         }
//     } catch (error) {
//         console.error('답변 수정 중 오류가 발생했습니다:', error);
//         setErrorMessage('답변 수정 중 오류가 발생했습니다');
//     }
// };

const handleContentChange = (event: ChangeEvent<HTMLInputElement>) => {
  setContent(event.target.value);
};
const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setPostRequest({
        ...postRequest,
        [name]: value
    });
};

  const updatePostClickHandler = (questionId: number | string | undefined) => {
    if (!questionId) return;
    navigator(`/question/update/${questionId}`);
  };

  const getTypeString = (selectedType: string): string => {
    let typeString = "";

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

    return typeString;
  };

  const deletePostClickHandler = (questionId: number | string | undefined) => {
    if (!questionId) {
      alert("해당 문의가 없습니다.");
      return;
    }
    deleteQuestionRequest(questionId).then(deleteQuestionResponse);
  };

  const deleteQuestionResponse = (
    responseBody: DeleteQuestionResponseDto | ResponseDto | null
  ) => {
    if (responseBody && responseBody.code === "SU") {
      alert("해당 문의가 삭제되었습니다.");
      navigator("/question");
    } else {
      alert("삭제 실패");
    }
    setDeletingQuestionId(null);
  };

  // 답변 섹션 표시 및 숨기기 함수
  const toggleAnswerSection = () => {
    setAnswerVisible(!answerVisible);
  };

  // 답변 내용 변경 처리 함수
  const handleAnswerContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswerContent(event.target.value);
    setContent(event.target.value)
  };

  // 답변 업로드 처리 함수
  

  const uploadAnswerClickHandler = async () => {
    try {
        const result = await postAnswerRequest({userId, content});
        if (result && result.code === 'SU') {
            alert('댓글이 업로드되었습니다.');
            navigator('/question');
        } else {
            setErrorMessage('댓글 업로드 실패');
        }
    } catch (error) {
        console.error('댓글 업로드 중 오류가 발생했습니다:', error);
        setErrorMessage('댓글 업로드 중 오류가 발생했습니다');
    }
};
  if (loading) {
    return <div>로딩중 ....</div>;
  }

  if (!question) {
    return <div>해당 문의를 불러오는 데 실패했습니다.</div>;
  }

  const isUserAuthorized = loginUser && loginUser.userId === question.userId;

  return (
    <table className="inquire">
      <h2 className="inquire-title">문의 내역 상세보기</h2>
      <tbody>
        <tr>
          <th>문의 ID</th>
          <td>{question.userId}</td>
        </tr>
        <tr>
          <th>문의유형</th>
          <td>{getTypeString(question.type)}</td>
        </tr>

        <tr>
          <th>제목</th>
          <td>{question.title}</td>
        </tr>
        <tr>
          <th>내용</th>
          <td>{question.content}</td>
        </tr>
        <tr>
          <th>이메일</th>
          <td>{question.email}</td>
        </tr>
      </tbody>
      <button onClick={() => navigator("/question")}>취소</button>
      {isUserAuthorized && (
        <>
          <div className="inquire-update">
            <button onClick={() => updatePostClickHandler(questionId)}>수정</button>
          </div>
          <div className="inquire-delete">
            <button onClick={() => deletePostClickHandler(questionId)}>삭제</button>
          </div>
          </>
      )}
          <div className="inquire-answer-write">
            {answerVisible ? (
              <div>
                <h2>답변 작성</h2>
                <input
                  type="text"
                  placeholder="답변을 입력하세요"
                  value={answerContent}
                  onChange={handleAnswerContentChange}
                />
                <button onClick={uploadAnswerClickHandler}>업로드</button>
                <button onClick={toggleAnswerSection}>취소</button>
              </div>
            ) : (
              <button onClick={toggleAnswerSection}>답변 작성</button>
            )}
          </div>
          {/* <div>
            <h2>답변 수정</h2>
            <input
                type="text"
                name="content"
                placeholder="답변을 입력하세요"
                value={postRequest.content}
                onChange={handleInputChange}
            />
            <br />
            <button onClick={updatePost}>수정</button>
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        </div>
   */}
      <div className="replies-section">
        {answers.length > 0 ? (
          <div>
            <h3>답변</h3>
            <ul>
              {answers.map((answer, index) => (
                <li key={index}>{answer}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p>해당 문의에 대한 답변이 없습니다.</p>
        )}
      </div>
    </table>
  );
};

export default QuestionDetail;
