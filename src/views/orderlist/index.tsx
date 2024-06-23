import { GetProductListRequest, PostCartRequest, deleteOrderListRequest, getOrderListRequest } from 'apis';
import { SaveCartRequestDto } from 'apis/request';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { User } from 'types/interface';

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

const OrderDetailPage: React.FC = () => {
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
        const sortedOrderItems = response.orderItems.map((item: Product) => ({
          ...item,
          orderId: item.orderList.orderId, // orderList에서 orderId를 가져옴
          orderDatetime: item.orderList.orderDatetime,
        })).sort(
          (a: Product, b: Product) => {
            const dateA = new Date(a.orderDatetime.replace(/\./g, '/')).getTime();
            const dateB = new Date(b.orderDatetime.replace(/\./g, '/')).getTime();
            return dateB - dateA;
          }
        );
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
      totalPrice: parseFloat(product.lowPrice) * (quantities[product.productId] || 1),
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

  const handleCheckboxChange = (productId: number) => {
    setCheckedProducts((prevCheckedProducts) => ({
      ...prevCheckedProducts,
      [productId]: !prevCheckedProducts[productId],
    }));
    const isChecked = !checkedProducts[productId];
    const product = orderItems.find((product) => product.productId === productId);
    if (isChecked && product) {
      setSelectedProducts((prevSelectedProducts) => [
        ...prevSelectedProducts,
        product,
      ]);
    } else {
      setSelectedProducts((prevSelectedProducts) =>
        prevSelectedProducts.filter((p) => p.productId !== productId)
      );
    }
  };

  const decrementQuantity = (productId: number) => {
    const currentQuantity = parseInt(quantities[productId].toString(), 10); // 정수로 변환
    if (currentQuantity > 1) {
      const updatedQuantities = {
        ...quantities,
        [productId]: currentQuantity - 1,
      };
      setQuantities(updatedQuantities);
    }
  };

  const incrementQuantity = (productId: number) => {
    const currentQuantity = parseInt(quantities[productId]?.toString() || "0", 10); // 정수로 변환
    const updatedQuantities = {
      ...quantities,
      [productId]: currentQuantity + 1,
    };
    setQuantities(updatedQuantities);
  };

  const deleteButtonClickHandler = async (product: Product) => {
    if (!window.confirm("삭제하시겠습니까?")) {
      return;
    }
    if (userId && cookies.accessToken) {
      try {
        const response = await deleteOrderListRequest(product.orderId, cookies.accessToken);
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

  const formatOrderDate = (orderDatetime: string) => {
    const date = new Date(orderDatetime.replace(/\./g, '/'));
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}. ${month}. ${day} 주문`;
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

  const handleOrderDetailClick = (product: Product) => {
    navigate(`/order/detail/${product.orderId}`, { state: { product } });
  };

  return (
    <div>
      {orderItems.length > 0 ? (
        <ul>
          {orderItems.map((product, index) => (
            <li key={index}>
              <div>
                <p>{checkArrivalStatus(product.orderDatetime)}</p>
                {product.productImageList && product.productImageList.map((image, imgIndex) => (
                  <img key={`${product.productId}-${imgIndex}`} className="product-detail-main-image" src={image} alt="product" />
                ))}
              </div>
              <div>
                <p>구매 날짜: {formatOrderDate(product.orderList.orderDatetime)}</p>
                <p>상품명: {product.title}</p>
                {/* <p>카테고리: {product.category1} / {product.category2} / {product.category3} </p> */}
                <p>가격: ${product.lowPrice}</p>
                <p>상품개수: {product.count}</p>
                <p>총 가격: {calculateProductTotalPrice(product)} 원</p>
                <button onClick={() => handleOrderDetailClick(product)}>주문상세보기</button>
              </div>
              <div>
                {/* <div className="cart-quantity-wrapper">
                  <div className="quantity-selector">
                    <div className="icon-button" onClick={() => decrementQuantity(product.productId)}>
                      <div className="icon quantity-minus-icon"></div>
                    </div>
                    <span>{quantities[product.productId] || product.count}</span>
                    <div className="icon-button" onClick={() => incrementQuantity(product.productId)}>
                      <div className="icon quantity-plus-icon"></div>
                    </div>
                  </div>
                </div> */}
                <button onClick={() => saveProductClickHandler(product)}>장바구니 담기</button>
                <div className="icon-button">
                  <div className="icon close-icon" onClick={() => deleteButtonClickHandler(product)}></div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="list-no-result" style={{ height: "76px", textAlign: "center", fontSize: "24px", color: "rgba(0, 0, 0, 0.4)", fontWeight: "500", }}>
          주문 내역이 없습니다.
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
