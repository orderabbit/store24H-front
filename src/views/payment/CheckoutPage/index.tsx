import React, { useEffect, useRef, useState } from "react";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import { useLoginUserStore } from "stores";
import axios from "axios";
import { useCookies } from "react-cookie";

const selector = "#payment-widget";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = nanoid();

/**
 * CheckoutPage 컴포넌트는 결제 페이지를 렌더링합니다.
 */
export function CheckoutPage(): JSX.Element {
  const [paymentWidget, setPaymentWidget] = useState<any>(null);
  const paymentMethodsWidgetRef = useRef<any>(null);
  const [price, setPrice] = useState<number>(50000);
  const { loginUser } = useLoginUserStore();
  const [cookies, setCookie] = useCookies();

  useEffect(() => {
    const fetchPaymentWidget = async (): Promise<void> => {
      try {
        if(loginUser == null) return;
        const loadedWidget = await loadPaymentWidget(cookies.accessToken, loginUser?.userId);
        setPaymentWidget(loadedWidget);
      } catch (error) {
        console.error("Error fetching payment widget:", error);
      }
    };

    fetchPaymentWidget();
  }, [loginUser?.userId]);

  useEffect(() => {
    if (paymentWidget == null) {
      return;
    }

    const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
      selector,
      { value: price },
      { variantKey: "DEFAULT" }
    );

    paymentWidget.renderAgreement("#agreement", { variantKey: "AGREEMENT" });

    paymentMethodsWidgetRef.current = paymentMethodsWidget;
  }, [paymentWidget, price]);

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;

    if (paymentMethodsWidget == null) {
      return;
    }

    paymentMethodsWidget.updateAmount(price);
  }, [price]);

  /**
   * 결제를 요청하는 핸들러 함수입니다.
   */
  const handlePaymentRequest = async () => {
    try {
      if (loginUser == null) {
        throw new Error("로그인이 필요합니다.");
      }
      const paymentData = {
        orderId: `${loginUser.userId}_${nanoid()}`, // orderId 생성
        orderName: "토스 티셔츠 외 2건",
        customerName: loginUser.nickname,
        customerEmail: loginUser.email,
        customerMobilePhone: "01012341234",
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
      };

      const response = await axios.post("/api/v1/payment/confirm", paymentData);

      console.log("Payment response:", response.data);
      
    } catch (error) {
      console.error("Error requesting payment:", error);
    }
  };

  return (
    <div className="wrapper">
      <div className="box_section">
        <div id="payment-widget" />
        <div id="agreement" />
        <div style={{ paddingLeft: "24px" }}>
          <div className="checkable typography--p">
            <label
              htmlFor="coupon-box"
              className="checkable__label typography--regular"
            >
              <input
                id="coupon-box"
                className="checkable__input"
                type="checkbox"
                aria-checked="true"
                onChange={(event) => {
                  setPrice(
                    event.target.checked ? price - 5000 : price + 5000
                  );
                }}
              />
              <span className="checkable__label-text">5,000원 쿠폰 적용</span>
            </label>
          </div>
        </div>
        <div className="result wrapper">
          <button
            className="button"
            style={{ marginTop: "30px" }}
            onClick={handlePaymentRequest}
          >
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
}
