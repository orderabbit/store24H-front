import React, { useEffect, useRef, useState } from "react";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import { useLoginUserStore } from "stores";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useCartStore } from "stores/cart.store";
import { GetProductListRequest, postPaymentRequest } from "apis";

const selector = "#payment-widget";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = nanoid();

/**
 * CheckoutPage 컴포넌트는 결제 페이지를 렌더링합니다.
 */
export function CheckoutPage(): JSX.Element {
  const [paymentWidget, setPaymentWidget] = useState<any>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [cookies, setCookies] = useCookies();
  const paymentMethodsWidgetRef = useRef<any>(null);
  const { loginUser } = useLoginUserStore();
  const { products } = useCartStore();

  useEffect(() => {
    const userId = loginUser?.userId;
    if (!userId) return;
    setUserId(userId);
  }, []);

  useEffect(() => {
    if (userId) {
      GetProductListRequest(userId, cookies.accessToken)
        .then((response) => {
          const productList = response.data;
          console.log("Product list:", productList);
          const total = productList.reduce((sum: number, product: { lowPrice: string; }) => sum + parseFloat(product.lowPrice), 0);
          setTotalAmount(total);
        })
        .catch((error) => {
          console.error("Error fetching product list:", error);
        });
    }
  }, [userId]);
  
  useEffect(() => {
    const fetchPaymentWidget = async (): Promise<void> => {
      try {
        if (loginUser == null) return;
        const loadedWidget = await loadPaymentWidget(clientKey, loginUser?.userId);
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
      { value: totalAmount },
      { variantKey: "DEFAULT" }
    );

    paymentWidget.renderAgreement("#agreement", { variantKey: "AGREEMENT" });

    paymentMethodsWidgetRef.current = paymentMethodsWidget;
  }, [paymentWidget, totalAmount]);

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;

    if (paymentMethodsWidget == null) {
      return;
    }

    paymentMethodsWidget.updateAmount(totalAmount);
  }, [totalAmount]);

  const handlePaymentRequest = async () => {
    try {
      if (loginUser == null) {
        throw new Error("로그인이 필요합니다.");
      }
      const paymentData = {
        orderId: `${loginUser.userId}_${nanoid()}`, // orderId 생성
        orderName: "토스 티셔츠 외 2건",
        customerName: loginUser.nickname,
        customerEmail: "sdaf@naver.com",
        customerMobilePhone: "01012341234",
        amount: totalAmount,
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
        paymentKey: clientKey,
      };

      console.log("Payment data:", paymentData);
      const response = postPaymentRequest(paymentData);

      console.log("Payment response:", response);

    } catch (error) {
      console.error("Error requesting payment:", error);
    }
  };

  console.log(userId, totalAmount, products);

  return (
    <div className="wrapper">
      <div className="box_section">
        <div id="payment-widget" />
        <div id="agreement" />
        <div style={{ paddingLeft: "24px" }}>
          <div className="checkable typography--p">
            {/* <label
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
            </label> */}
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
