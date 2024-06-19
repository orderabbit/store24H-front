import React, { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PostAnswerRequestDto } from 'apis/request/answer';
import { getAnswerRequest, patchAnswerRequest } from 'apis';

export default function Update() {
    const params = useParams();
    const answerId = Number(params["Number"]);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [postRequest, setPostRequest] = useState<PostAnswerRequestDto>({
        content: '',
        userId: '',
        questionId :''
    });

    useEffect(() => {
        const fetchAnswerDetails = async () => {
            try {
                const response = await getAnswerRequest(answerId);
                if ('content' in response && 'userId' in response && 'questionId' in response) {
                    const { content,userId, questionId } = response;
                    setPostRequest({ content, userId, questionId });
                } else {
                    alert('답변 정보를 불러오는 데 실패했습니다.');
                }
            } catch (error) {
                console.error('답변 정보를 불러오는 중 오류가 발생했습니다:', error);
                alert('답변 정보를 불러오는 중 오류가 발생했습니다.');
            }
        };
        fetchAnswerDetails();
    }, [answerId]);
    
    const updatePost = async () => {
        try {
            const result = await patchAnswerRequest(answerId, postRequest);
            if (result && result.data.code === 'SU') {
                alert('답변 수정 완료');
                navigate('/');
            } else {
                setErrorMessage('답변 수정 실패');
            }
        } catch (error) {
            console.error('답변 수정 중 오류가 발생했습니다:', error);
            setErrorMessage('답변 수정 중 오류가 발생했습니다');
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
    );
};
