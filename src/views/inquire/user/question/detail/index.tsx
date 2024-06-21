import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteQuestionRequest, getQuestionRequest } from "apis";
import Question from "types/interface/question.interface";
import { useLoginUserStore } from "stores";
import { DeleteQuestionResponseDto } from "apis/response/question";
import { ResponseDto } from "apis/response";
import "./style.css";

const QuestionDetail: React.FC = () => {
  const { questionId } = useParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { loginUser } = useLoginUserStore(); // 로그인한 사용자 정보를 가져옴
  const [deletingQuestionId, setDeletingQuestionId] = useState<number | null>(null);

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

  const updatePostClickHandler = (questionId: number | string | undefined) => {
    if (!questionId) return;
    navigate(`/question/update/${questionId}`);
  };

  const getTypeString = (selectedType: string): string => {
    switch (selectedType) {
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
      navigate("/question");
    } else {
      alert("삭제 실패");
    }
    setDeletingQuestionId(null);
  };

  if (loading) {
    return <div>로딩중 ....</div>;
  }

  if (!question) {
    return <div>해당 문의를 불러오는 데 실패했습니다.</div>;
  }

  const isUserAuthorized = loginUser && loginUser.userId === question.userId;

  return (
    <div className="inquire">
      <h2 className="inquire-title">문의 내역 상세보기</h2>
      <table>
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
      </table>
      <button onClick={() => navigate("/question")}>취소</button>
      {isUserAuthorized && (
        <div>
          <button onClick={() => updatePostClickHandler(questionId)}>수정</button>
          <button onClick={() => deletePostClickHandler(questionId)}>삭제</button>
        </div>
      )}
    </div>
  );
};

export default QuestionDetail;
