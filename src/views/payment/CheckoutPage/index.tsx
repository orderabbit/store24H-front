import React, { useEffect, useRef, useState } from "react";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import { useLoginUserStore } from "stores";
import { useCookies } from "react-cookie";
import { GetProductListRequest, postPaymentRequest } from "apis";

const selector = "#payment-widget";
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = nanoid();

export function CheckoutPage(): JSX.Element {
  const [paymentWidget, setPaymentWidget] = useState<any>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [cookies, setCookies] = useCookies();
  const paymentMethodsWidgetRef = useRef<any>(null);
  const { loginUser } = useLoginUserStore();

  useEffect(() => {
    const userId = loginUser?.userId;
    if (!userId) return;
    setUserId(userId);
    setIsLoggedIn(true);
  }, [loginUser]);

  useEffect(() => {
    if (loginUser) {
      GetProductListRequest(loginUser.userId, cookies.accessToken)
        .then((response) => {
          const productList = response.data.items;
          const total = productList.reduce((sum: number, product: { lowPrice: string; }) => sum + parseFloat(product.lowPrice), 0);
          setTotalAmount(total);
        })
        .catch((error) => {
          console.error("Error fetching product list:", error);
        });
    }
  }, [loginUser?.userId]);

  useEffect(() => {
    const fetchPaymentWidget = async (): Promise<void> => {
      try {
        if (loginUser == null) return;
        const loadedWidget = await loadPaymentWidget(clientKey, customerKey);
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
        alert("로그인이 필요합니다.");
        return;
      }
      // const paymentData = {
      await paymentWidget?.requestPayment({
        orderId: nanoid(),
        orderName: "토스 티셔츠 외 2건",
        customerId: loginUser.userId,
        customerName: loginUser.nickname,
        customerEmail: loginUser.email,
        customerPhone: "01012341234",
        amount: totalAmount,
        successUrl: `${window.location.origin}/success?orderId=${loginUser.userId}_${nanoid()}
        &customerId=${loginUser.userId}
        &customerName=${loginUser.nickname}
        &customerEmail=${loginUser.email}
        &customerPhone=01012341234
        &amount=${totalAmount}
        &paymentKey=${clientKey}`,
        failUrl: `${window.location.origin}/fail`,
      });
    } catch (error) {
      console.error("Error requesting payment:", error);
    }
  };

  return (
    <div className="wrapper">
      <div className="box_section">
        <div id="payment-widget" />
        <div id="agreement" />
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
