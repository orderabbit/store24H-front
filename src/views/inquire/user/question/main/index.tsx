import { deleteQuestionRequest, getAllQuestionRequest } from 'apis';
import { DeleteQuestionResponseDto } from 'apis/response/question';

import ResponseDto from 'apis/response/response.dto';
import { UPDATE_PATH, WRITE_PATH } from 'constant';

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
        console.error('질문 목록을 가져오는 중 오류가 발생했습니다:', error);
      }
    };

    fetchPosts();
  }, []);

  const writePathClickHandler = () => {
    navigator(WRITE_PATH());
  }

  const deletePostClickHandler = (questionId: number | string) => {
    if (!questionId) {
      alert('질문 번호가 없습니다.');
      return;
    };
    deleteQuestionRequest(questionId).then(deleteQuestionResponse);
  }

  const deleteQuestionResponse = (responseBody: DeleteQuestionResponseDto | ResponseDto | null) => {
    if (responseBody && responseBody.data.code === 'SU') {
      alert('삭제되었습니다.');
      setPosts(posts.filter(post => post.questionId !== deletingQuestionId));
    } else {
      alert('삭제 실패');
    }
    setDeletingQuestionId(null);
  }

  const updatePostClickHandler = (questionId: number | string) => {
    navigator(UPDATE_PATH(questionId));
  }

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className='main-contents-box'>
      <h2>질문</h2>
      <button onClick={writePathClickHandler}>작성</button>
      {posts.length === 0 ? (
        <div>문의내역이 없습니다.</div>
      ) : (
        <div className='main-current-contents'>
          {posts.map(post => (
            <li key={post.questionId}>
              <div onClick={() => navigator(`/question/${post.questionId}`)}>{post.title}</div>
              <div>{post.userId}</div>
              <button onClick={() => deletePostClickHandler(post.questionId)}>삭제</button>
              <button onClick={() => updatePostClickHandler(post.questionId)}>수정</button>
            </li>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuestionList;
