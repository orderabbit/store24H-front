import { postPaymentRequest } from "apis";
import React from "react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const requestData = {
      orderId: searchParams.get("orderId"),
      customerId: searchParams.get("customerId"),
      customerName: searchParams.get("customerName"),
      customerEmail: searchParams.get("customerEmail"),
      customerPhone: searchParams.get("customerPhone"),
      customerAddress: searchParams.get("customerAddress"),
      productIds: searchParams.get("productIds"),
      amount: searchParams.get("amount"),
      paymentKey: searchParams.get("paymentKey"),
      paymentDatetime: searchParams.get("paymentDatetime"),
    };

    async function confirm() {
      const response = await postPaymentRequest(requestData);
      if (!response) return;
      if (response.code === "DBE") alert("데이터베이스 오류가 발생했습니다. 다시 시도해주세요.");
      if (response.code === "VF") alert("결제 금액이 일치하지 않습니다.");
      if (response.code === "DO") alert("이미 결제가 완료된 주문입니다.");

      if (response.code !== "SU") {
        navigate(`/fail?message=${response.message}&code=${response.code}`);
        return;
      }
    }
    confirm();
  }, []);

  return (
    <div className="result wrapper">
      <div className="box_section">
        <h2 style={{ padding: "20px 0px 10px 0px" }}>
          <img
            width="35px"
            src="https://static.toss.im/3d-emojis/u1F389_apng.png"
          />
          결제 성공
        </h2>
        <p>{`주문번호: ${searchParams.get("orderId")}`}</p>
        <p>{`결제 금액: ${Number(
          searchParams.get("amount")
        ).toLocaleString()}원`}</p>
        <p>{`paymentKey: ${searchParams.get("paymentKey")}`}</p>
        <button className="mt-[5px] btn btn-warning" onClick={() => navigate("/")}>메인페이지</button>
      </div>
    </div>
  );
}
