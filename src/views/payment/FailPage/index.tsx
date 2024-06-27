import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from 'react-router-dom';

export function FailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return (
    <div className="result wrapper">
    <div className="box_section">
      <h2 style={{padding: "20px 0px 10px 0px"}}>
          <img
            width="30px"
            src="https://static.toss.im/3d-emojis/u1F6A8-apng.png"
          />
          결제 실패
      </h2>
      <p>{`에러 코드: ${searchParams.get("code")}`}</p>
      <p>{`실패 사유: ${searchParams.get("message")}`}</p>
      <button className="mt-[5px] btn btn-warning" onClick={() => navigate("/")}>메인페이지</button>
  </div>
</div>

  );
}
