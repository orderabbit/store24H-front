
import { deleteAnswerRequest, getAllAnswerRequest } from 'apis';
import { DeleteAnswerResponseDto } from 'apis/response/answer';
import ResponseDto from 'apis/response/response.dto';
import { WRITE_PATH } from 'constant';
import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Answer from 'types/interface/answer.interface';

export default function Home() {

  const {AnswerNumber} = useParams();
  const navigator = useNavigate();
  const [posts, setPosts] = useState<Answer[]>([]);
  const [deletingAnswerNumber, setDeletingAnswerNumber] = useState<number | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await getAllAnswerRequest();
        console.log(result);
        if (!result) return;
        const { code, Answer } = result.data;
        if (code === 'DBE') {
          alert('데이터베이스 오류입니다.');
          return;
        }
        if (code !== 'SU') return;
        setPosts(Answer);
      } catch (error) {
        console.error('답변을 가져오는중 오류가 발생했습니다:', error);
      }
    };

    fetchPosts();
  }, []);

  const writePathClickHandler = () => {
    navigator(WRITE_PATH());
  }

  const deletePostClickHandler = (answerId: number | string) => {
    if(!answerId) {
      alert('문의질문에 대한 답변이 없습니다.');
      return;
    };
    setDeletingAnswerNumber(answerId as number);
    deleteAnswerRequest(answerId).then(deleteAnswerResponse);
  }

  const deleteAnswerResponse = (responseBody: DeleteAnswerResponseDto | ResponseDto | null) => {
    if (responseBody && responseBody.data.code === 'SU') {
      alert('댓글이 삭제되었습니다.');
      setPosts(posts.filter(post => post.answerId !== deletingAnswerNumber));
    } else {
      alert('삭제 실패');
    }
    setDeletingAnswerId(null);
  }

  const updatePostClickHandler = (answerId: number | string) => {
    navigator(UPDATE_PATH(answerId));
  }

  return (
    <div className='main-contents-box'>
      <h2>관리자 답변</h2>
      <button onClick={writePathClickHandler}>관리자 답변 작성</button>
      <div className='main-current-contents'>
        {posts.map(post => (
          <li key={post.answerId}>
            <div onClick={() => navigator(`/answer/${post.answerId}`)}>{post.content}</div>
            <div>{post.content}</div>
            <button onClick={() => deletePostClickHandler(post.answerId)}>삭제</button>
            <button onClick={() => updatePostClickHandler(post.answerId)}>수정</button>
          </li>
        ))}
      </div>
    </div>
  )
}
function setDeletingAnswerId(arg0: null) {
  throw new Error('Function not implemented.');
}

function UPDATE_PATH(answerId: string | number): import("react-router-dom").To {
  throw new Error('Function not implemented.');
}

