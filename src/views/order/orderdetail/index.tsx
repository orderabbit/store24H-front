import { GetProductListRequest, PostCartRequest, getOrderListRequest, getPaymentRequest } from 'apis';
import { SaveCartRequestDto } from 'apis/request';
import { GetPaymentResponseDto } from 'apis/response';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useLoginUserStore } from 'stores';
import orderDetailImage from 'images/order-detail.png';
import './style.css';

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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderList = async () => {
            if (!orderId) return;
            const response = await getPaymentRequest(orderId);
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

    const onQuestionButtonClickHandler = () => {
        navigate('/question');
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

    const formatPrice = (price: string) => {
        return parseFloat(price).toLocaleString();
    };

    const formatTotalPrice = (price: string, additionalAmount: number) => {
        const finalPrice = parseFloat(price) + additionalAmount;
        return finalPrice.toLocaleString();
    };

    const titleClickHandler = (productId: number) => {
        navigate(`/product/detail/${productId}`);
    }

    const calculateDeliveryStatus = (orderDatetime: string) => {
        const currentDate = new Date();
        const orderDate = new Date(orderDatetime.replace(/\./g, '/'));
        const diffTime = Math.abs(currentDate.getTime() - orderDate.getTime());
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

        if (diffHours < 8) return "결제완료";
        if (diffHours < 16) return "상품준비중";
        if (diffHours < 24) return "배송시작";
        if (diffHours < 32) return "배송중";
        if (diffHours < 40) return "배송완료";
        return "배송완료";
    };

    const checkArrivalStatus = (orderDate: string) => {
        const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
        const orderDateObj = new Date(orderDate.replace(/\./g, '/'));
        const deliveryDateObj = new Date(orderDateObj);
        deliveryDateObj.setDate(orderDateObj.getDate() + 2);

        const currentDateTime = new Date();
        const currentDate = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate());

        if (deliveryDateObj.getTime() === currentDate.getTime()) {
            return `${deliveryDateObj.getMonth() + 1}/${deliveryDateObj.getDate()}(${daysOfWeek[deliveryDateObj.getDay()]}) 도착 완료`;
        } else {
            return `${deliveryDateObj.getMonth() + 1}/${deliveryDateObj.getDate()}(${daysOfWeek[deliveryDateObj.getDay()]}) 도착 예정`;
        }
    };

    if (!paymentInfo) return <></>;
    return (
        <div className="orderList-container">
            <div className="orderList-title">주문 상세</div>
            <div className="orderList-leftTitle">
                {formatOrderDate(product.orderDatetime)} <div className="orderdetail-orderId">주문번호 {product.orderId}</div>
            </div>
            <div className="orderList-content">
                <div className="orderList-product-list">
                    <div className="orderList-product-item">
                        <ul className="orderList-product-info">
                            <li>
                                <div className="orderList-leftInfo">
                                    <div className="orderList-leftsubTitle">
                                        <div className="orderList-deliveryStatus">{calculateDeliveryStatus(product.orderDatetime)}</div>
                                        {checkArrivalStatus(product.orderDatetime)}
                                    </div>
                                    <div className="orderList-leftContent">
                                        <div className="orderList-leftThumbnail">
                                            {product.productImageList && product.productImageList.map((image, imgIndex) => (
                                                <img key={`${product.productId}-${imgIndex}`} className="product-detail-main-image" src={image} alt="product" />
                                            ))}
                                        </div>
                                        <div className="orderList-left-product-info">
                                            <div className="orderList-left-product-info-title">
                                                <p className="orderList-product-title" onClick={() => titleClickHandler(product.productId)}>{product.title}</p>
                                            </div>
                                            <div className="orderList-left-product-info-content">
                                                <p>{formatPrice(product.lowPrice)} 원</p>
                                                <p>{product.count} 개</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="orderList-rightInfo">
                                    <div className="orderList-button-container">
                                        <button onClick={() => saveProductClickHandler(product)}>장바구니 담기</button>
                                        <button>리뷰 작성하기</button>
                                        <button onClick={onQuestionButtonClickHandler}>고객 문의</button>
                                    </div>
                                </div>
                            </li>
                            <div className="orderdetail-container">
                                <div className="orderdetail-paymentTitle">배송 정보</div>
                                <div className="divider"></div>
                                <div className="orderdetail-info-container">
                                    <div className="orderdetail-leftInfo">
                                        <p>받는 사람</p>
                                        <p>연락처</p>
                                        <p>이메일</p>
                                        <p>받는 주소</p>
                                    </div>
                                    <div className="orderdetail-rightInfo">
                                        <p>{paymentInfo.customerName}</p>
                                        <p>{paymentInfo.customerPhone}</p>
                                        <p>{paymentInfo.customerEmail}</p>
                                        <p>{paymentInfo.customerPostcode} {paymentInfo.customerAddress}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="orderdetail-container">
                                <div className="orderdetail-paymentTitle">결제 정보</div>
                                <div className="divider"></div>
                                <div className="orderdetail-info-container">
                                    <div className="orderdetail-leftInfo">
                                        <p>총 상품가격</p>
                                        <p>배송비</p>
                                        <p>총 결제 금액</p>
                                        <p>결제 일시</p>
                                    </div>
                                    <div className="orderdetail-rightInfo">
                                        <p>{formatPrice(paymentInfo.amount)} 원</p>
                                        <p>2500 원</p>
                                        <p>{formatTotalPrice(paymentInfo.amount, 2500)} 원</p>
                                        <p>{product.orderDatetime}</p>
                                    </div>
                                </div>
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="image-container">
                <img src={orderDetailImage} className="resizable-image" />
            </div>
        </div>
    )
}
