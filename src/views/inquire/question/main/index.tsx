import { getAllQuestionRequest } from 'apis';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Question from 'types/interface/question.interface';
import "./style.css";

const QuestionList: React.FC = () => {
  const { questionId } = useParams();
  const navigator = useNavigate();
  const [posts, setPosts] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await getAllQuestionRequest();
        if (!result) return;
        const { code, questions } = result;
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
    navigator("/question/write ");
  }

  return (
    <div className="inquire-main">
      <div /*style={{justifyContent: "space-between"}}*/>
        <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "7px"}}>
          <h2 className="inquire-main-title">1 : 1 문의 내역</h2>
          <div className="inquire-button" onClick={writePathClickHandler}>1 : 1 문의하기</div>
        </div>
      </div>
      {posts.length === 0 ? (
        <div className="inquire-nothing">1 : 1 문의내역이 없습니다.</div>
      ) : (
        <div className="inquire-result">
          <div style={{marginLeft: "1%", marginRight: "1%"}}>
            {posts.map((post, index) => (
              <li className="inquire-result-main" key={post.questionId}>
                <div className='inquire-result-title' onClick={() => navigator(`/question/detail/${post.questionId}`)}>
                  {index + 1}. {post.title}
                  {post.answers && Array.isArray(post.answers) && post.answers.length > 0 && (
                    <span className="answer-count"> ({post.answers.length} 답변)</span>
                  )}
                </div>
                <div className="inquire-result-userId">{post.userId}</div>
              </li>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionList;
