import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLoginUserStore } from "stores";
import {
  deleteQuestionRequest,
  getAnswerRequest,
  getQuestionRequest,
  postAnswerRequest,
  deleteAnswerRequest,
  patchAnswerRequest,
} from "apis";
import { PostAnswerRequestDto } from "apis/request/answer";
import { ResponseDto } from "apis/response";
import { DeleteQuestionResponseDto } from "apis/response/question";
import Answer from "types/interface/answer.interface";
import Question from "types/interface/question.interface";
import "./style.css";

const QuestionDetail: React.FC = () => {
  const { questionId, answer: answerIdParam } = useParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const navigator = useNavigate();
  const { loginUser } = useLoginUserStore();
  const [deletingQuestionId, setDeletingQuestionId] = useState<number | null>(null);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<string>("");
  const [content, setContent] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [postRequest, setPostRequest] = useState<PostAnswerRequestDto>({
    content: "",
    userId: "",
    questionId,
  });

  const [answerVisible, setAnswerVisible] = useState(false);
  const [answerContent, setAnswerContent] = useState("");
  const [editingAnswerId, setEditingAnswerId] = useState<string | null | number>(null);

  useEffect(() => {
    const userId = loginUser?.userId;
    const role = loginUser?.role;
    console.log("userId", userId, "role", role);
    if (!userId || !role) return;
    setUserId(userId);
    setRole(role);
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
        setQuestion(response as Question);
        setLoading(false);
      } catch (error) {
        console.error("질문 정보를 불러오는 중 오류가 발생했습니다:", error);
        alert("질문 정보를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId]);

  useEffect(() => {
    const fetchAnswerDetails = async () => {
      if (!questionId) return;
      try {
        const response = await getAnswerRequest(questionId);
        if(response.code !== "SU") return;
        setAnswers(response.answer);
      } catch (error) {
        console.error("답변 정보를 불러오는 중 오류가 발생했습니다:", error);
        alert("답변 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };
    fetchAnswerDetails();
  }, [answerIdParam]);

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
    if (!window.confirm("삭제하시겠습니까?")) {
      return;
    }
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

  const toggleAnswerSection = () => {
    setAnswerVisible(!answerVisible);
  };

  const handleAnswerContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setAnswerContent(event.target.value);
    setContent(event.target.value);
  };

  const uploadAnswerClickHandler = async () => {
    try {
      const result = await postAnswerRequest({ userId, content, questionId });
      if (result && result.code === "SU") {
        alert("댓글이 업로드되었습니다.");
        setAnswers([
          ...answers,
          {
            content,
            userId,
            answerId: "",
            questionId: "",
          },
        ]); // 새로운 댓글 추가
        setContent("");
        setAnswerContent("");
        toggleAnswerSection(); // 모달 닫기
      } else {
        setErrorMessage("댓글 업로드 실패");
      }
    } catch (error) {
      console.error("댓글 업로드 중 오류가 발생했습니다:", error);
      setErrorMessage("댓글 업로드 중 오류가 발생했습니다");
    }
  };

  const deleteAnswerHandler = async (answerId: string | number) => {
    try {
      const response = await deleteAnswerRequest(answerId);
      if (response && response.code === "SU") {
        setAnswers(answers.filter(answer => answer.answerId !== answerId));
        alert("댓글이 삭제되었습니다.");
      } else {
        alert("댓글 삭제 실패");
      }
    } catch (error) {
      console.error("댓글 삭제 중 오류가 발생했습니다:", error);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  const startEditingAnswer = (answerId: string | number, currentContent: string) => {
    setEditingAnswerId(answerId);
    setAnswerContent(currentContent);
  };

  const updateAnswerHandler = async () => {
    if (!editingAnswerId) return;
    try {
      const response = await patchAnswerRequest(editingAnswerId, {
        content: answerContent,
        userId: "",
        questionId: ""
      });
      if (response && response.code === "SU") {
        setAnswers(answers.map(answer => 
          answer.answerId === editingAnswerId ? { ...answer, content: answerContent } : answer
        ));
        setEditingAnswerId(null);
        setAnswerContent("");
        alert("댓글이 수정되었습니다.");
      } else {
        alert("댓글 수정 실패");
      }
    } catch (error) {
      console.error("댓글 수정 중 오류가 발생했습니다:", error);
      alert("댓글 수정 중 오류가 발생했습니다.");
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
    <div id="question-detail-wrapper">
      <div className="question-detail-container">
        <div style={{ display: "flex", justifyContent: "space-between", marginRight: "10%" }}>
          <h2 className="inquire-title">문의 내역 상세보기</h2>
          <div style={{ display: "flex" }}>
            <div
              className="inquire-detail-cancel"
              onClick={() => navigator("/question")}
            > 뒤로가기
            </div>
            {isUserAuthorized && (
              <>
                <div
                  className="inquire-detail-update"
                  onClick={() => updatePostClickHandler(questionId)}
                > 수정
                </div>
                <div
                  className="inquire-detail-delete"
                  onClick={() => deletePostClickHandler(questionId)}
                > 삭제
                </div>
              </>
            )}
            <div>
              {role === "ROLE_ADMIN" && (
                <div>
                  <div className="inquire-answer-button" onClick={toggleAnswerSection}>
                    답변 작성
                  </div>
                  <div className="inquire-answer-upload">
                    <div onClick={uploadAnswerClickHandler}>업로드</div>
                  </div>
                  <div className="inquire-answer-cancel">
                    <div onClick={toggleAnswerSection}>취소</div>
                  </div>
                </div>
              )}
              {answerVisible && (
                <div className="modal-overlay-answer">
                  <div className="modal-content-answer" style={{ textAlign: "left" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div className="modal-title-answer">답변 작성
                      </div>
                      <div style={{ marginRight: "10px" }}>
                        <button className="modal-button" onClick={uploadAnswerClickHandler}>
                          업로드
                        </button>
                        <button className="modal-button" onClick={toggleAnswerSection}>
                          취소
                        </button>
                      </div>
                    </div>
                    <div className="modal-content-box-answer">
                      <textarea
                        placeholder="문의 내용에 대한 답변을 입력해주세요."
                        value={answerContent}
                        onChange={handleAnswerContentChange}
                        style={{
                          width: "450px",
                          height: 300,
                          borderRadius: 5,
                          padding: "15px",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <table className="inquire">
          <tbody>
            <tr className="inquire-detail-combine">
              <th className="inquire-detail-title">문의 ID</th>
              <td className="inquire-detail-content">{question.userId}</td>
            </tr>
            <tr className="inquire-detail-combine">
              <th className="inquire-detail-title">문의유형</th>
              <td className="inquire-detail-content">
                {getTypeString(question.type)}
              </td>
            </tr>
            <tr className="inquire-detail-combine">
              <th className="inquire-detail-title">제목</th>
              <td className="inquire-detail-content">{question.title}</td>
            </tr>
            <tr className="inquire-detail-combine-content">
              <th className="inquire-detail-title-content">내용</th>
              <td className="inquire-detail-content-content">
                {question.content}
              </td>
            </tr>
            <tr className="inquire-detail-combine">
              <th className="inquire-detail-title">이메일</th>
              <td className="inquire-detail-content">{question.email}</td>
            </tr>
          </tbody>
        </table>
        <div className="inquire-answer-write">
          <div className="replies-section">
            {answers.length > 0 ? (
              <div>
                <h3 className="replies-title">답변</h3>
                <ul>
                  {answers.map((answer, index) => (
                    <li key={index}>
                      <span className="answer-user-id">
                        관리자 ({answer.userId} )
                      </span>{" "}
                      : {answer.content}
                      {role === "ROLE_ADMIN" && (
                        <div className="inquire-answer-content-patch-delete">
                          <button onClick={() => startEditingAnswer(answer.answerId, answer.content)}>수정</button>
                          <button onClick={() => deleteAnswerHandler(answer.answerId)}>삭제</button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="inquire-answer-result">
                해당 문의에 대한 답변이 없습니다.
              </p>
            )}
          </div>
        </div>
        {editingAnswerId && (
          <div className="modal-overlay-answer">
            <div className="modal-content-answer" style={{ textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="modal-title-answer">답변 수정</div>
                <div style={{ marginRight: "10px" }}>
                  <button className="modal-button" onClick={updateAnswerHandler}>
                    수정
                  </button>
                  <button className="modal-button" onClick={() => setEditingAnswerId(null)}>
                    취소
                  </button>
                </div>
              </div>
              <div className="modal-content-box-answer">
                <textarea
                  placeholder="문의 내용에 대한 답변을 입력해주세요."
                  value={answerContent}
                  onChange={handleAnswerContentChange}
                  style={{
                    width: "450px",
                    height: 300,
                    borderRadius: 5,
                    padding: "15px",
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetail;
