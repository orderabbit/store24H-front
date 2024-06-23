import { GetProductListRequest, PostCartRequest, getOrderListRequest, getPaymentRequest } from 'apis';
import { SaveCartRequestDto } from 'apis/request';
import { GetPaymentResponseDto } from 'apis/response';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useLocation, useParams } from 'react-router-dom';
import { useLoginUserStore } from 'stores';

interface Product {
    orderList: any;
    productId: number;
    title: string;
    productImageList: string[];
    lowPrice: string;
    category1: string;
    category2: string;
    category3: string;
    count: number;
    purchaseDate?: string;
    orderId: string;
    orderDatetime: string;
    product: any;
}

export default function OrderDetail() {

    const [orderItems, setOrderItems] = useState<Product>();
    const [paymentInfo, setPaymentInfo] = useState<GetPaymentResponseDto | null>(null);
    const [cookies, setCookies] = useCookies();
    const { loginUser } = useLoginUserStore();
    const { orderId } = useParams<{ orderId: string }>();
    const location = useLocation();
    const product = location.state.product as Product;
    const quantities = product.count;

    useEffect(() => {
        const fetchOrderList = async () => {
            if (!orderId) return;
            const response = await getPaymentRequest(orderId);
            console.log(response);
            setPaymentInfo(response);
            
        };
        fetchOrderList();
    }, [loginUser, orderItems]);

    if (!product) {
        console.error("상품 정보가 전달되지 않았습니다.");
        return null;
    }

    const calculateDeliveryDate = (orderDate: string) => {
        const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
        const orderDateObj = new Date(orderDate.replace(/\./g, '/'));
        const deliveryDateObj = new Date(orderDateObj);
        deliveryDateObj.setDate(orderDateObj.getDate() + 2);
        const month = deliveryDateObj.getMonth() + 1;
        const day = deliveryDateObj.getDate();
        const dayOfWeek = daysOfWeek[deliveryDateObj.getDay()];
        return `${month}/${day}(${dayOfWeek}) 도착예정`;
    };

    const formatOrderDate = (orderDatetime: string) => {
        const date = new Date(orderDatetime.replace(/\./g, '/'));
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}. ${month}. ${day} 주문`;
    };

    const triggerCartUpdateEvent = (cartCount: number) => {
        window.dispatchEvent(
            new CustomEvent("cartUpdate", {
                detail: { cartCount },
            })
        );
    };

    const saveProductClickHandler = async (product: Product) => {
        const accessToken = cookies.accessToken;
        const formData: SaveCartRequestDto = {
            productId: product.productId,
            title: product.title,
            productImageList: product.productImageList,
            lowPrice: product.lowPrice,
            totalPrice: parseFloat(product.lowPrice) * quantities,
            category1: product.category1,
            category2: product.category2,
            category3: product.category3,
            count: quantities,
        };
        try {
            const response = await PostCartRequest(formData, accessToken);
            if (response.code === "SU") {
                alert("상품이 저장되었습니다.");
                if (!loginUser) return;
                const productListResponse = await GetProductListRequest(
                    loginUser?.userId,
                    accessToken
                );
                const updatedCartCount = productListResponse.data.items.length;
                triggerCartUpdateEvent(updatedCartCount);
            }
            if (response.code === "DP") alert("이미 저장된 상품입니다.");
            if (response.code === "DBE") alert("상품 저장에 실패했습니다.");
            if (response.code === "AF") alert("로그인이 필요합니다.");
        } catch (error) {
            console.error("Error saving product", error);
        }
    };

    if(!paymentInfo) return <></>;
    return (
        <div>
            <h1>주문 상세</h1>
            <div>
                <div>
                    <p>{calculateDeliveryDate(product.orderDatetime)}</p>
                    {product.productImageList && product.productImageList.map((image, imgIndex) => (
                        <img key={`${product.productId}-${imgIndex}`} className="product-detail-main-image" src={image} alt="product" />
                    ))}
                </div>
                <p>구매 날짜: {formatOrderDate(product.orderDatetime)}</p>
                <p>주문 번호: {product.orderId}</p>
                <p>상품명: {product.title}</p>
                {/* <p>카테고리: {product.category1} / {product.category2} / {product.category3} </p> */}
                <p>가격: ${product.lowPrice}</p>
                <p>상품개수: {product.count}개</p>
            </div>
            <button onClick={() => saveProductClickHandler(product)}>장바구니 담기</button>
            <div>
                <div>
                    <h2>Payment Information</h2>
                    <p>받는 사람: {paymentInfo.customerName}</p>
                    <p>연락처: {paymentInfo.customerPhone}</p>
                    <p>이메일: {paymentInfo.customerEmail}</p>
                    <p>받는주소: {paymentInfo.customerPostcode} {paymentInfo.customerAddress}</p>
                    <p>Amount: {paymentInfo.amount}원</p>
                    {/* 기타 필요한 정보 출력 */}
                </div>
            </div>
        </div>
    )
}
