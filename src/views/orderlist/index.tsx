import { GetProductListRequest, PostCartRequest, getOrderListRequest } from 'apis';
import { SaveCartRequestDto } from 'apis/request';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import { Product, User } from 'types/interface';


const OrderDetailPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [orderItems, setOrderItems] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [loginUser, setLoginUser] = useState<User | null>(null);
  const [cookies, setCookies] = useCookies();
  


  useEffect(() => {
    if (!userId) return;
    const fetchOrderList = async () => {
      const response = await getOrderListRequest(userId);
      console.log(response);
      if (response) {
        setOrderItems(response.orderItems);
      } else {
        setOrderItems([]);
      }
    };
    fetchOrderList();
  }, [userId]);

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
        totalPrice: parseFloat(product.lowPrice) * product.count,
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

  return (
    <div>
      {orderItems.length > 0 ? (
        <ul>
          {orderItems.map((product) => (
            <li key={product.productId}>
              <div>
                {product.productImageList && product.productImageList.map((image) => (
                  <img key={image} className="product-detail-main-image" src={image} />
                ))}
              </div>
              <div>
                <h2>{product.title}</h2>
                <p>Category: {product.category1} / {product.category2} / {product.category3} </p>
                <p>Price: ${product.lowPrice}</p>
                <p>Quantity: {product.count}</p>
              </div>
              <button onClick={() => saveProductClickHandler(product)}>{'재구매'}</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default OrderDetailPage;
