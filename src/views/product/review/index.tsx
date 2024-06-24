import "./style.css";
import "./style.list.component.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { GetReviewRequestDto } from "apis/request/product";
import { PostReviewResponseDto } from "apis/response/product";

const Review:React.FC<GetReviewRequestDto> = (props) => {
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

  const [content, setContent] = useState(props.review);
  const [likeActive, setLikeActive] = useState(false);
  const [dislikeActive, setDislikeActive] = useState(false);

  const likeButtonEvent = async (isLike: String) => {
    try {
      const reviewNumber = props.reviewNumber;
      const isActive = () => { 
        if( isLike =="true") return likeActive; return dislikeActive; }
      const response = await axios.patch(`http://3.35.30.191:4040/${reviewNumber}/feels`, 
        {isLike, isActive});

      if (isLike === "true") {
        setLikeActive(!likeActive);
      } else {
        setDislikeActive(!dislikeActive);
      }
    } catch (error) {
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div className="el-review-star-container">
        {trueStars.map((trueStar, index) => (
          <div className="star-full-image star-setting" />
        ))}
        {falseStars.map((falseStar, index) => (
          <div className="star-blank-image star-setting" />
        ))}

        <div className="el-review-account-container">
          <div>- {props.userId}</div>
        </div>

        <div className="like-container">
          <button
            className={`like-button-setting ${likeActive ? "like-active" : ""}`}
            onClick={() => likeButtonEvent("true")}
          >
            <div
              className={`like-image like-image-setting ${
                likeActive ? "like-animation" : ""
              }`}
            ></div>
          </button>
          <button
            className={`like-button-setting ${
              dislikeActive ? "dislike-active" : ""
            }`}
            onClick={() => likeButtonEvent("false")}
          >
            <div
              className={`dislike-image like-image-setting ${
                dislikeActive ? "dislike-animation" : ""
              }`}
            ></div>
          </button>
        </div>
      </div>

      <div>{content}</div>
    </div>
  );
};


export default function ReviewList(productId: number) {
  const [starSelectIndex, setStarSelectIndex] = useState(1);
  const [review_content, setReview_content] = useState("");

  const formData ={
    review: review_content,
    rates: starSelectIndex,
    userId: 1
};
  
  const [rate, setRate] = useState(
    Array.from({ length: 5 }, (_, index) => index + 1)
  );
  const [review_list, setReview_list] = useState<GetReviewRequestDto[]>([]);
  const sliceReviewList = () => { 
    if(review_list.length < 1) 
        return [];
    return review_list.slice(0, review_list.length -1)
  };

  const starClickEvent = (index: number) => {
    setStarSelectIndex(index + 1);
  };
  const submitClickEvent = async () => {
   try {
        const response = await axios.post(`http://3.35.30.191:4040/api/v1/product/${productId}/review`, {formData, productId});
        console.log(response.data);
    } catch (err) {}
  };
  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview_content(e.target.value);
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://3.35.30.191:4040/api/v1/product/${productId}/review-list`);
        setReview_list(response.data);
      } catch (err) {}
    };
    fetchData(); // 비동기 함수 호출
  }, []);

  return (
    <div className="review-list-container">
      <div className="stars-container">
        <div className="stars-box">
          {rate.map((star, index) => (
            <button
              className={`' ${
                index < starSelectIndex
                  ? "full-star-button"
                  : "blank-star-button"
              }`}
              onClick={() => starClickEvent(index)}
            />
          ))}
        </div>
        <textarea
          value={review_content}
          onChange={handleReviewChange}
        />
        <button onClick={() => submitClickEvent()}>입력하기</button>
      </div>

      <div className="review-list-box">
        {review_list.length > 0 && review_list
          .slice(0, review_list.length -1) .map((el_review, index) => ( 
            <div className="review-container">
              <Review  
              reviewNumber={el_review.reviewNumber}
              userId={el_review.userId}
              productId={el_review.productId}
              rates={el_review.rates}
              review={el_review.review}
              writeDatetime={el_review.writeDatetime} 
              />
            </div>
          ))}
        <div className="review-last-container">
          {review_list.length > 0 && (
          <Review 
              reviewNumber={review_list[review_list.length - 1].reviewNumber}
              userId={review_list[review_list.length - 1].userId}
              productId={review_list[review_list.length - 1].productId}
              rates={review_list[review_list.length - 1].rates}
              review={review_list[review_list.length - 1].review}
              writeDatetime={review_list[review_list.length - 1].writeDatetime} />
          )}
        </div>
      </div>
    </div>
  );
}
