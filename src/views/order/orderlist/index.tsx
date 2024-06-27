import { GetCartListRequest, GetProductListRequest, PostCartRequest, deleteOrderListRequest, getOrderListRequest } from 'apis';
import { SaveCartRequestDto } from 'apis/request';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { User } from 'types/interface';
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
}

const OrderPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [orderItems, setOrderItems] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [checkedProducts, setCheckedProducts] = useState<{ [key: number | string]: boolean; }>({});
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [loginUser, setLoginUser] = useState<User | null>(null);
  const [cookies, setCookies] = useCookies();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;
    const fetchOrderList = async () => {
      const response = await getOrderListRequest(userId);
      console.log(response);
      if (response) {
        const sortedOrderItems = response.orderItems
          .map((item: Product) => ({
            ...item,
            orderId: item.orderList.orderId, // orderList에서 orderId를 가져옴
            orderDatetime: item.orderList.orderDatetime,
          }))
          .sort((a: Product, b: Product) => {
            const dateA = new Date(
              a.orderDatetime.replace(/\./g, "/")
            ).getTime();
            const dateB = new Date(
              b.orderDatetime.replace(/\./g, "/")
            ).getTime();
            return dateB - dateA;
          });
        setOrderItems(sortedOrderItems);
      } else {
        setOrderItems([]);
      }
    };
    fetchOrderList();
  }, [userId, orderItems.length]);

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
      totalPrice:
        parseFloat(product.lowPrice) * (quantities[product.productId] || 1),
      category1: product.category1,
      category2: product.category2,
      category3: product.category3,
      count: quantities[product.productId] || 1,
    };
    try {
      const response = await PostCartRequest(formData, accessToken);
      if (response.code === "SU") {
        alert("상품이 저장되었습니다.");
        if (!loginUser) return;
        const productListResponse = await GetCartListRequest(
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

  const deleteButtonClickHandler = async (product: Product) => {
    if (!window.confirm("삭제하시겠습니까?")) {
      return;
    }
    if (userId && cookies.accessToken) {
      try {
        const response = await deleteOrderListRequest(
          product.orderId,
          cookies.accessToken
        );
        if (response?.code === "SU") {
          alert("삭제되었습니다.");
          const newOrderItems = orderItems.filter(
            (item) => item.productId !== product.productId
          );
          setOrderItems(newOrderItems);
          const event = new CustomEvent("cartUpdate", {
            detail: {
              cartCount: newOrderItems.length,
            },
          });
          window.dispatchEvent(event);
        } else {
          alert("삭제에 실패했습니다.");
        }
      } catch (error) {
        console.error("Failed to delete product", error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const calculateProductTotalPrice = (product: Product) => {
    const quantity = product.count;
    return quantity * parseFloat(product.lowPrice);
  };

  const checkArrivalStatus = (orderDate: string) => {
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    const orderDateObj = new Date(orderDate.replace(/\./g, "/"));
    const deliveryDateObj = new Date(orderDateObj);
    deliveryDateObj.setDate(orderDateObj.getDate() + 2);

    const currentDateTime = new Date();
    const currentDate = new Date(
      currentDateTime.getFullYear(),
      currentDateTime.getMonth(),
      currentDateTime.getDate()
    );

    if (deliveryDateObj.getTime() === currentDate.getTime()) {
      return `${deliveryDateObj.getMonth() + 1}/${deliveryDateObj.getDate()}(${daysOfWeek[deliveryDateObj.getDay()]
        }) 도착 완료`;
    } else {
      return `${deliveryDateObj.getMonth() + 1}/${deliveryDateObj.getDate()}(${daysOfWeek[deliveryDateObj.getDay()]
        }) 도착 예정`;
    }
  };

  const titleClickHandler = (productId: number) => {
    navigate(`/product/detail/${productId}`);
  };

  const handleOrderDetailClick = (product: Product) => {
    navigate(`/order/detail/${product.orderId}`, { state: { product } });
  };
  const onQuestionButtonClickHandler = () => {
    navigate("/question");
  };

  const formatPrice = (price: string) => {
    return parseFloat(price).toLocaleString();
  };

  const calculateDeliveryStatus = (orderDatetime: string) => {
    const currentDate = new Date();
    const orderDate = new Date(orderDatetime.replace(/\./g, "/"));
    const diffTime = Math.abs(currentDate.getTime() - orderDate.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

    if (diffHours < 8) return "결제완료";
    if (diffHours < 16) return "상품준비중";
    if (diffHours < 24) return "배송시작";
    if (diffHours < 32) return "배송중";
    if (diffHours < 40) return "배송완료";
    return "배송완료";
  };

  return (
    <div className="orderList-container">
      <div className="orderList-title">주문 목록</div>
      <div className="orderList-content">
        {orderItems.length > 0 ? (
          <div className="orderList-product-list">
            <div className="orderList-product-item">
              {orderItems.map((product, index) => (
                <ul className="orderList-product-info">
                  <div className="icon-button-orderList">
                    <div
                      className="icon-orderList close-icon"
                      onClick={() => deleteButtonClickHandler(product)}
                    ></div>
                  </div>
                  <li key={index}>
                    <div className="orderList-leftInfo">
                      <div className="orderList-leftsubTitle">
                        <div className="orderList-deliveryStatus">
                          {calculateDeliveryStatus(product.orderDatetime)}
                        </div>
                        {checkArrivalStatus(product.orderDatetime)}
                      </div>
                      <div className="orderList-leftContent">
                        <div className="orderList-leftThumbnail">
                          {product.productImageList &&
                            product.productImageList.map((image, imgIndex) => (
                              <img
                                key={`${product.productId}-${imgIndex}`}
                                className="orderList-product-main-image"
                                src={image}
                                alt="product"
                              />
                            ))}
                        </div>
                        <div className="orderList-left-product-info">
                          <div className="orderList-left-product-info-title">
                            <p
                              className="orderList-product-title"
                              onClick={() =>
                                titleClickHandler(product.productId)
                              }
                            >
                              {product.title}
                            </p>
                          </div>
                          <div className="orderList-left-product-content-info">
                            <p className="orderList-product-price">
                              {formatPrice(product.lowPrice)} 원
                            </p>
                            <p className="orderList-product-count">
                              {product.count} 개
                            </p>
                            <p className="orderList-product-totalPrice">
                              총 가격: {calculateProductTotalPrice(product)} 원
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="orderList-rightInfo">
                      <div className="orderList-button-container">
                        <button
                          className="orderList-detail-button"
                          onClick={() => handleOrderDetailClick(product)}
                        >
                          주문상세보기
                        </button>
                        <button
                          onClick={() => saveProductClickHandler(product)}
                        >
                          장바구니 담기
                        </button>
                        <button>리뷰 작성하기</button>
                        <button onClick={onQuestionButtonClickHandler}>
                          고객 문의
                        </button>
                      </div>
                    </div>
                  </li>
                </ul>
              ))}
            </div>
          </div>
        ) : (
          <div className="list-no-result">주문 내역이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
