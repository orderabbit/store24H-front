import React, { ChangeEvent, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useLoginUserStore } from 'stores';
import { postReviewRequest } from 'apis';
import { PostReviewRequestDto } from 'apis/request/review';
import useReviewStore from './stores/useReviewStore'; // Zustand 스토어

interface ReviewWriteProps {
  productId: number; // 상품 ID
  onSuccess: () => void; // 리뷰 등록 성공 시 실행할 콜백 함수
}

const ReviewWrite: React.FC<ReviewWriteProps> = ({ productId, onSuccess }) => {
  const { loginUser } = useLoginUserStore();
  const [reviewContent, setReviewContent] = useState('');
  const [cookies] = useCookies();
  const { userId, setProductId, setContent, setUserId } = useReviewStore(); // Zustand 스토어 사용

  // 상태 관리 함수들
  const handleReviewContentChange = (event: ChangeEvent<HTMLInputElement>) => {
    setReviewContent(event.target.value);
  };

  // 리뷰 제출 함수
  const handleSubmitReview = async () => {
    if (!reviewContent.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    const requestBody: PostReviewRequestDto = {
      userId: loginUser?.userId || '',
      content: reviewContent,
      productId: String(productId),
    };

    try {
      const result = await postReviewRequest(requestBody, cookies.accessToken);
      if (result && result.code === 'SU') {
        alert('리뷰가 등록되었습니다.');
        setReviewContent(''); // 입력 필드 초기화
        onSuccess(); // 성공 콜백 실행 (부모 컴포넌트에서 전달받음)
      } else {
        alert('리뷰 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('리뷰 등록 중 오류:', error);
      alert('리뷰 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className= "review-write-container" >
    <h2>리뷰 작성 < /h2>
      < div className = "review-form" >
        <input
          type="text"
  value = { reviewContent }
  onChange = { handleReviewContentChange }
  placeholder = "리뷰를 작성해주세요..."
    />
    <button onClick={ handleSubmitReview }> 리뷰 작성 완료 < /button>
      < /div>
      < /div>
  );
};

export default ReviewWrite;
