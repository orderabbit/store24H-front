import { getSignInUserRequest } from 'apis';
import { ResponseDto } from 'apis/response';
import { GetSignInUserResponseDto } from 'apis/response/user';
import { DETAIL_PATH, MAIN_PATH, SIGNIN_PATH, SIGNUP_PATH, TEST_PATH, UPDATE_PATH, USER_PATH, WRITE_PATH } from 'constant';
import Container from 'layout/Container';
import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Route, Routes } from 'react-router-dom';
import { useLoginUserStore } from 'stores';
import { User } from 'types/interface';
import OAuth from 'views/Authentication/OAuth';
import SignIn from 'views/Authentication/SignIn';
import SignUp from 'views/Authentication/SignUp';
import LogIN_OUT from 'views/Authentication/main';
import MyPage from 'views/User';
import AddressPage from 'views/payment/Address-PhoneNumber';
import { CheckoutPage } from 'views/payment/CheckoutPage';
import { FailPage } from 'views/payment/FailPage';
import { SuccessPage } from 'views/payment/SuccessPage';
import CartList from 'views/product/cart-list';
import Search from 'views/product/main';
import './App.css';
import QuestionHome from 'views/inquire/question/main';
import QuestionWrite from 'views/inquire/question/write';
import QuestionUpdate from 'views/inquire/question/update';
import QuestionDetail from 'views/inquire/question/detail';
// import AnswerHome from 'views/inquire/admin/answer/main';
// import AnswerWrite from 'views/inquire/admin/answer/write';
// import AnswerUpdate from 'views/inquire/admin/answer/update';
// import { MAIN_PATH, WRITE_PATH, UPDATE_PATH } from './constants';
import Write from 'views/product/write';
import Update from 'views/product/update';
import Detail from 'views/product/detail';
import SearchList from 'views/product/searchList';
import ReviewWrite from 'views/review/write';
import OrderPage from 'views/order/orderlist';
import OrderDetail from 'views/order/orderdetail';


function App() {
  const { setLoginUser, resetLoginUser } = useLoginUserStore();
  const [cookies, setCookies] = useCookies();

  const getSignInUserResponse = (responseBody: GetSignInUserResponseDto | ResponseDto | null) => {

    if (!responseBody) return;
    const { code } = responseBody;

    if (code === 'AF' || code === 'NU' || code === 'DBE') {
      resetLoginUser();
      return;
    }
    const loginUser: User = { ...responseBody as GetSignInUserResponseDto };
    setLoginUser(loginUser);
  }

  useEffect(() => {

    if (!cookies.accessToken) {
      resetLoginUser();
      return;
    }
    getSignInUserRequest(cookies.accessToken).then(getSignInUserResponse)
  }, [cookies.accessToken]);
  return (
    
    <Routes>
      <Route element={<Container />}>
        <Route path='auth/oauth-response/:token/:expirationTime' element={<OAuth />}></Route>
        <Route path="/" element={<Search />} />
        <Route path="/search" element={<SearchList />} />
        <Route path="/question" element={<QuestionHome />} />
        <Route path="/question/write" element={<QuestionWrite />} />
        <Route path="/question/detail/:questionId" element={<QuestionDetail />} />
        <Route path="/question/update/:questionId" element={<QuestionUpdate />} />
        <Route path="/cart" element={<CartList />} />
        <Route path={SIGNIN_PATH()} element={<LogIN_OUT />} />
        <Route path={SIGNUP_PATH()} element={<SignUp />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path='/checkout' element={<CheckoutPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/fail" element={<FailPage />} />
        <Route path="/user/:userId" element={<MyPage />} />
        <Route path="/product/review" element={<ReviewWrite productId={0} onSuccess={function (): void {
          throw new Error('Function not implemented.');
        } } />} />
        {/* <Route path={MAIN_PATH()} element={<Home />} />
      <Route path={WRITE_PATH()} element={<Write />}/>
      <Route path={UPDATE_PATH(':Number')} element={<Update />} /> */}
        <Route path="/order/list/:userId" element={<OrderPage />} />
        <Route path="/order/detail/:orderId" element={<OrderDetail />} />
        <Route path={USER_PATH(':userId')} element={<MyPage />} />
        <Route path={DETAIL_PATH(':Number')} element={<Detail />} />
        <Route path={UPDATE_PATH(':Number')} element={<Update />} />
      </Route>
      
    </Routes>

  );
}

export default App;
