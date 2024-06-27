import "./style.css";
import "./style.list.component.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { GetReviewRequestDto } from "apis/request/product";
import { useLoginUserStore } from "stores";
import { deleteReviewRequest, postReviewRequest } from "apis";
import { useCookies } from "react-cookie";

const Review: React.FC<GetReviewRequestDto & { onDelete: () => void }> = (props) => {
  const trueStars = Array.from({ length: props.rates }, (_, index) => ({
    key: `${props.reviewNumber}-${index + 1}`,
    image: "/star_review.png",
  }));
  const falseStars = Array.from(
    { length: Math.max(0, 5 - props.rates) },
    (_, index) => ({
      key: `${props.reviewNumber}-${index + props.rates + 1}`,
      image: "/star_blank.png",
    })
  );

  const handleDelete = () => {
    props.onDelete(); // 부모 컴포넌트에서 전달한 onDelete 함수 호출
  };

  const [content, setContent] = useState(props.review);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className="el-review-star-container">
        {trueStars.map((trueStar, index) => (
          <div key={trueStar.key} className="star-full-image star-setting" />
        ))}
        {falseStars.map((falseStar, index) => (
          <div key={falseStar.key} className="star-blank-image star-setting" />
        ))}
        <div className="el-review-account-container">
          <div>- {props.userId}</div>
          <div className="icon-button">
            <div
              className="icon close-icon"
              onClick={() => handleDelete()}
            ></div>
          </div>
        </div>
      </div>
      <div>{content}</div>
    </div>
  );
};

interface ReviewListProps {
  productId: number;
  onReviewChange: () => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ productId, onReviewChange }) => {
  const [starSelectIndex, setStarSelectIndex] = useState(1);
  const [review_content, setReview_content] = useState("");
  const { loginUser } = useLoginUserStore();
  const [cookie, setCookie] = useCookies()

  const [rate, setRate] = useState(
    Array.from({ length: 5 }, (_, index) => index + 1)
  );
  const [reviewList, setReviewList] = useState<GetReviewRequestDto[]>([]);

  const starClickEvent = (index: number) => {
    setStarSelectIndex(index + 1);
  };

  const submitClickEvent = async () => {
    if (!loginUser) return alert("로그인이 필요합니다.");
    try {
      const responseBody = {
        userId: loginUser?.userId,
        review: review_content,
        rates: starSelectIndex,
        productId: productId,
      };
      const response = await postReviewRequest(responseBody, cookie.accessToken);
      if (response.code !== "SU") alert("리뷰 등록에 실패했습니다.");
      if (response.code === "SU") {
        alert("리뷰가 등록되었습니다.");
        setReview_content("");
      }

      onReviewChange();
    } catch (error) {
      console.error(error);
      alert("리뷰 등록 중 오류가 발생했습니다.");
    }
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview_content(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:4040/api/v1/product/${productId}/review-list`);
        setReviewList(response.data.reviewList);
      } catch (err) { }
    };
    fetchData();
  }, [reviewList.length]);

  const deleteReviewButtonClickHandler = async (reviewId: number) => {
    try {
      const response = await deleteReviewRequest(reviewId, cookie.accessToken);
      if (response.code === "SU") {
        alert("리뷰가 삭제되었습니다.");
        onReviewChange();
      }
    } catch (error) {
      console.error("리뷰 삭제 중 오류:", error);
      alert("리뷰 삭제 중 오류가 발생했습니다.");
    }
  }

  return (
    <div className="review-list-container">
      <div className="stars-container">
        <div className="stars-box">
          {rate.map((star, index) => (
            <button
              key={index}
              className={index < starSelectIndex ? "full-star-button" : "blank-star-button"}
              onClick={() => starClickEvent(index)}
            />
          ))}
        </div>
        <textarea
          key={loginUser?.userId}
          value={review_content}
          onChange={handleReviewChange}
        />
        <button onClick={submitClickEvent}>입력하기</button>
      </div>
      <div className="review-list-box">
        {reviewList.map((el_review, index) => (
          <div key={el_review.reviewNumber} className="review-container">
            <Review
              key={el_review.reviewNumber}
              reviewNumber={el_review.reviewNumber}
              userId={el_review.userId}
              productId={el_review.productId}
              rates={el_review.rates}
              review={el_review.review}
              writeDatetime={el_review.writeDatetime}
              onDelete={() => deleteReviewButtonClickHandler(el_review.reviewNumber)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
export default ReviewList;
