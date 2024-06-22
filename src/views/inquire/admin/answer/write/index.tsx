import { postAnswerRequest } from 'apis';
import React, { ChangeEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


export default function Write() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [content, setContent] = useState('');
    const questionId = useParams();
    const [errorMessage, setErrorMessage] = useState('');

    const handleContentChange = (event: ChangeEvent<HTMLInputElement>) => {
        setContent(event.target.value);
    };

  
    const uploadPostClickHandler = async () => {
        try {
            const result = await postAnswerRequest({userId, content});
            if (result && result.data.code === 'SU') {
                alert('댓글이 업로드되었습니다.');
                navigate('/');
            } else {
                setErrorMessage('댓글 업로드 실패');
            }
        } catch (error) {
            console.error('댓글 업로드 중 오류가 발생했습니다:', error);
            setErrorMessage('댓글 업로드 중 오류가 발생했습니다');
        }
    };

    return (
        <div>
            <h2>댓글 작성하기</h2>
            <input
                type="text"
                placeholder="댓글을 입력하세요"
                value={content}
                onChange={handleContentChange}
            />
            
            <br />
            <button onClick={uploadPostClickHandler}>댓글 업로드</button>
        </div>
    );
};
