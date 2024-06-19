import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getQuestionRequest } from 'apis';
import Question from 'types/interface/question.interface';
import { UPDATE_PATH } from 'constant';

const QuestionDetail: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
        try {
            const response = await getQuestionRequest(Number(questionId));
            if ('title' in response && 'content' in response && 'userId' in response) {
              setQuestion(response);
            } else {
              throw new Error('Invalid response structure');
            }
            setLoading(false);
          } catch (error) {
            console.error('질문 정보를 불러오는 중 오류가 발생했습니다:', error);
            alert('질문 정보를 불러오는 중 오류가 발생했습니다.');
            setLoading(false);
          }
        };

    fetchQuestion();
  }, [questionId]);

  const updatePostClickHandler = () => {
    navigate("contact/update/${questionId}");
  }

  if (loading) {
    return <div>로딩중 ....</div>;
  }

  if (!question) {
    return <div>질문을 불러오는 데 실패했습니다.</div>;
  }

  return (
    <div className="inquire">
      <h2 className="inquire-title">문의 상세보기</h2>
      <div>
        <tr>
          <th>문의 ID</th>
          <td>{question.userId}</td>
        </tr>
        <tr>
          <th>문의유형</th>
          <td>{question.type}</td>
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
      </div>
      <button onClick={() => navigate("/contact")}>취소</button>
      <button onClick={updatePostClickHandler}>문의 수정</button>
    </div>
  );
}

export default QuestionDetail;
