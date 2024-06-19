import { deleteQuestionRequest, getAllQuestionRequest } from 'apis';
import { DeleteQuestionResponseDto } from 'apis/response/question';

import ResponseDto from 'apis/response/response.dto';


import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Question from 'types/interface/question.interface';

const QuestionList: React.FC = () => {
  const { questionId } = useParams();
  const navigator = useNavigate();
  const [posts, setPosts] = useState<Question[]>([]);
  const [deletingQuestionId, setDeletingQuestionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await getAllQuestionRequest();
        if (!result) return;
        const { code, questions } = result.data;
        if (code === 'DBE') {
          alert('데이터베이스 오류입니다.');
          return;
        }
        if (code !== 'SU') return;
        setPosts(questions);
        setLoading(false);
      } catch (error) {
        console.error('문의 목록을 가져오는 중 오류가 발생했습니다:', error);
      }
    };

    fetchPosts();
  }, []);

  const writePathClickHandler = () => {
    navigator("/contact/write ");
  }
  

  const deletePostClickHandler = (questionId: number | string) => {
    if (!questionId) {
      alert('해당 문의가 없습니다.');
      return;
    };
    deleteQuestionRequest(questionId).then(deleteQuestionResponse);
  }

  const deleteQuestionResponse = (responseBody: DeleteQuestionResponseDto | ResponseDto | null) => {
    if (responseBody && responseBody.data.code === 'SU') {
      alert('해당 문의가 삭제되었습니다.');
      setPosts(posts.filter(post => post.questionId !== deletingQuestionId));
    } else {
      alert('삭제 실패');
    }
    setDeletingQuestionId(null);
  }

  const updatePostClickHandler = (questionId: number | string) => {
    navigator("/contact/update/${questionId}");
  }

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="inquire-main">
      <h2 className="inquire-main-title">1대1 문의 내역</h2>
      <div className="inquire-button"><button onClick={writePathClickHandler}>1대1 문의하기</button></div>
      {posts.length === 0 ? (
        <div className="inquire-nothing">1대1 문의내역이 없습니다.</div>
      ) : (
        <div className='inquire-result-title'>
          {posts.map(post => (
            <li key={post.questionId}>
              <div onClick={() => navigator(`/question/${post.questionId}`)}>{post.title}</div>
              <div className="inquire-result-userId">{post.userId}</div>
              {/* <div className="inquire-delete"><button onClick={() => deletePostClickHandler(post.questionId)}>삭제</button></div> */}
              {/* <div className="inquire-update"><button onClick={() => updatePostClickHandler(post.questionId)}>수정</button></div> */}
            </li>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuestionList;
