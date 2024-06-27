import React, { useEffect, useRef, useState } from "react";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import { useLoginUserStore } from "stores";
import { useLocation } from "react-router-dom";
import { Product } from "types/interface";

const selector = "#payment-widget";
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = nanoid();

export function CheckoutPage(): JSX.Element {
  const [paymentWidget, setPaymentWidget] = useState<any>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString());
  const { loginUser } = useLoginUserStore();
  const location = useLocation();
  const { selectedProducts, name, address, postcode, detailAddress, phoneNumber, totalPrice } = location.state || {};
  const paymentMethodsWidgetRef = useRef<any>(null);

  useEffect(() => {
    if (selectedProducts && selectedProducts.length > 0) {
      const total = selectedProducts.reduce((sum: number, product: { lowPrice: string; count: number; }) => sum + parseFloat(product.lowPrice) * product.count, 0);
      setTotalAmount(total);
    }
  }, [selectedProducts]);

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
  }, [loginUser]);

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
      const orderItems = selectedProducts.map((product: Product) => ({
        productId: product.productId,
        title: product.title,
        productImageList: product.productImageList,
        amount: totalAmount,
        lowPrice: product.lowPrice,
        category1: product.category1,
        category2: product.category2,
        category3: product.category3,
        count: product.count,
      }));
      const orderData = {
        orderId: nanoid().trim(),
        userId: loginUser.userId,
        items: orderItems,
        orderDatetime: new Date().toISOString(),
      };

      const selectedProductsString = JSON.stringify(selectedProducts);
      const encodedSelectedProducts = encodeURIComponent(selectedProductsString);

      const selectedProductIds = selectedProducts.map((product: { productId: number }) => product.productId);
      await paymentWidget?.requestPayment({
        orderId: nanoid().trim(),
        orderName: "주문",
        customerId: loginUser.userId,
        customerName: loginUser.nickname,
        customerEmail: loginUser.email,
        customerPhone: phoneNumber,
        customerAddress: `${postcode.trim()} ${address.trim()} ${detailAddress.trim()}`,
        amount: totalAmount,
        paymentKey: clientKey,
        paymentDatetime: new Date().toISOString(),
        successUrl: `${window.location.origin}/success?
                      orderId=${orderData.orderId}
                      &customerId=${loginUser.userId.trim()}
                      &customerEmail=${loginUser.email}
                      &customerName=${name.trim()}
                      &customerPostcode=${postcode.trim()}
                      &customerAddress= ${address.trim()} ${detailAddress.trim()}
                      &customerPhone=${phoneNumber.trim()}
                      &productIds=${encodeURIComponent(JSON.stringify(selectedProductIds))}
                      &amount=${parseFloat(totalAmount.toString().trim())}
                      &paymentKey=${clientKey}
                      &selectedProducts=${encodedSelectedProducts}
                      &items=${orderData.items}
                      &orderDatetime=${orderData.orderDatetime}`,
        failUrl: `${window.location.origin}/fail`,
      });
    } catch (error) {
      alert(error);
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
          <div>
            <p>결제 날짜: {new Date(paymentDate).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
