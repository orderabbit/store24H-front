import "./style.css";
import "./style.list.component.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { GetReviewRequestDto } from "apis/request/product";
//import { PostReviewResponseDTO } from "apis/response/product";

const Review:React.FC<GetReviewRequestDto> = (props) => {
  const trueStars = Array.from({ length: props.rates }, (_, index) => ({
    key: `${props.review_number}-${index + 1}`,
    image: "/star_review.png",
  }));
  const falseStars = Array.from(
    { length: Math.max(0, 5 - props.rates) },
    (_, index) => ({
      key: `${props.review_number}-${index + props.rates + 1}`,
      image: "/star_blank.png",
    })
  );

  const [content, setContent] = useState(props.review);
  const [likeActive, setLikeActive] = useState(false);
  const [dislikeActive, setDislikeActive] = useState(false);

  const likeButtonEvent = async (feels: boolean) => {
    try {
      const review_number = props.review_number;
      console.log(feels);
      const response = await axios.patch(`http://localhost:4040/api/v1/product/${review_number}/feels?feels=${feels}`);
      if (feels) {
        setLikeActive(!likeActive);
      } else {
        setDislikeActive(!dislikeActive);
      }
    } catch (error) {
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column"}}>
      <div className="el-review-star-container">
        {trueStars.map((trueStar, index) => (
          <div className="star-full-image star-setting" />
        ))}
        {falseStars.map((falseStar, index) => (
          <div className="star-blank-image star-setting" />
        ))}

        <div className="el-review-account-container">
          <div>- {props.user_id}</div>
        </div>

        <div className="like-container">
          <button
            className={`like-button-setting ${likeActive ? "like-active" : ""}`}
            onClick={() => likeButtonEvent(true)}
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
            onClick={() => likeButtonEvent(false)}
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
    const responseBody /*: PostReviewResponseDTO*/ = {
      review: review_content,
      rates: starSelectIndex
    };
    const response = await axios.post(`http://localhost:4040/api/v1/product/${productId}/review`, responseBody);
    } catch (err) {}
  };
  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview_content(e.target.value);
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:4040/api/v1/product/${productId}/review-list`);
        console.log(response.data);
        setReview_list(response.data.reviewList);
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
              review_number={el_review.review_number}
              user_id={el_review.user_id}
              product_id={el_review.product_id}
              rates={el_review.rates}
              review={el_review.review}
              writeDatetime={el_review.writeDatetime} 
              />
            </div>
          ))}
        <div className="review-last-container">
          {review_list.length > 0 && (
          <Review 
              review_number={review_list[review_list.length - 1].review_number}
              user_id={review_list[review_list.length - 1].user_id}
              product_id={review_list[review_list.length - 1].product_id}
              rates={review_list[review_list.length - 1].rates}
              review={review_list[review_list.length - 1].review}
              writeDatetime={review_list[review_list.length - 1].writeDatetime} />
          )}
        </div>
      </div>
    </div>
  );
}
