import { getOrderListRequest } from 'apis';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


interface OrderItem {
  itemId: number;
  title: string;
  link: string;
  image: string;
  category1: string;
  category2: string;
  count: number;
  totalPrice: string;
}

const OrderDetailPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    if(!userId) return;
    const fetchOrderList = async () => {
      const response = await getOrderListRequest(userId);
      console.log(response);
      if (response) {
        console.log(response.orderItems);
        setOrderItems(response.orderItems);
      } else {
        // Handle error case (e.g., show error message)
      }
    };

    fetchOrderList();
  }, [userId]);

  return (
    <div>
      <h1>Order Detail</h1>
      {orderItems.length > 0 ? (
        <ul>
          {orderItems.map((item) => (
            <li key={item.itemId}>
              <div>
                <img src={item.image} alt={item.title} />
              </div>
              <div>
                <h2>{item.title}</h2>
                <p>Category: {item.category1} / {item.category2}</p>
                <p>Price: ${item.totalPrice}</p>
                <p>Quantity: {item.count}</p>
              </div>
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
