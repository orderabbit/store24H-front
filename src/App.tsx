import { getSignInUserRequest } from 'apis';
import { ResponseDto } from 'apis/response';
import { GetSignInUserResponseDto } from 'apis/response/user';
import Test from 'components/map/test';
import { TEST_PATH } from 'constant';
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
import SearchList from 'views/product/searchList';
import './App.css';


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
        {/* <Route path={MAIN_PATH()} element={<Map />}></Route> */}
        <Route path='auth/oauth-response/:token/:expirationTime' element={<OAuth/>}></Route>
        <Route path={TEST_PATH()} element={<Test />}></Route>
        <Route path="/" element={<Search />} />
        <Route path="/search" element={<SearchList />} />
        <Route path="/cart" element={<CartList />} />
        <Route path="/signin" element={<LogIN_OUT />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path='/checkout' element={<CheckoutPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/fail" element={<FailPage />} />
        <Route path="/user/:userId" element={<MyPage />} />
      </Route>
    </Routes>

  );
}

export default App;
