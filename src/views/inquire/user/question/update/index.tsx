import React, { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getQuestionRequest, patchQuestionRequest } from 'apis';
import { PostQuestionRequestDto } from 'apis/request/question';

export default function Update() {
    const params = useParams();
    const questionId = Number(params["Number"]);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [postRequest, setPostRequest] = useState<PostQuestionRequestDto>({
        title: '',
        content: '',
        userId: ''
    });

    useEffect(() => {
        const fetchQuestionDetails = async () => {
            try {
                const response = await getQuestionRequest(questionId);
                if ('title' in response && 'content' in response&& 'userId' in response) {
                    const { title, content,userId } = response;
                    setPostRequest({ title, content,userId });
                } else {
                    alert('질문 정보를 불러오는 데 실패했습니다.');
                }
            } catch (error) {
                console.error('질문 정보를 불러오는 중 오류가 발생했습니다:', error);
                alert('질문 정보를 불러오는 중 오류가 발생했습니다.');
            }
        };
        fetchQuestionDetails();
    }, []);
    
    const updatePost = async () => {
        try {
            const result = await patchQuestionRequest(questionId, postRequest);
            if (result && result.data.code === 'SU') {
                alert('질문 수정 완료');
                navigate('/');
            } else {
                setErrorMessage('질문 수정 실패');
            }
        } catch (error) {
            console.error('질문 수정 중 오류가 발생했습니다:', error);
            setErrorMessage('질문 수정 중 오류가 발생했습니다');
        }
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setPostRequest({
            ...postRequest,
            [name]: value
        });
    };

    return (
        <div>
            <h2>질문 수정하기</h2>
            <input
                type="text"
                name="title"
                placeholder="제목을 입력하세요"
                value={postRequest.title}
                onChange={handleInputChange}
            />
            <br />
            <textarea
                name="content"
                placeholder="내용을 입력하세요"
                value={postRequest.content}
                onChange={handleInputChange}
            />
            <br />
            <button onClick={updatePost}>질문 수정</button>
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        </div>
    );
};
