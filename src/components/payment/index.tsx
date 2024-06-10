import React, { useState } from 'react'; // PostPaymentRequest 함수 import
import axios from 'axios';
import { PostPaymentRequest } from 'apis';

const PaymentForm: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await PostPaymentRequest(amount, paymentMethod);
      console.log(response.data);
      alert('결제가 완료되었습니다.');
    } catch (error) {
      console.error('에러 발생:', error);
      alert('결제에 실패했습니다.');
    }
  };

  return (
    <div>
      <h1>결제 정보 입력</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="amount">결제 금액:</label>
        <input 
          type="text" 
          id="amount" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          required 
        /><br/><br/>
        <label htmlFor="paymentMethod">결제 수단:</label>
        <select 
          id="paymentMethod" 
          value={paymentMethod} 
          onChange={(e) => setPaymentMethod(e.target.value)} 
          required
        >
          <option value="">선택하세요</option>
          <option value="creditCard">신용 카드</option>
          <option value="debitCard">체크 카드</option>
          <option value="tossMoney">토스 머니</option>
        </select><br/><br/>
        <button type="submit">결제하기</button>
      </form>
    </div>
  );
};

export default PaymentForm;
