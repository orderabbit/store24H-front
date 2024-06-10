import Map from 'components/map';
import Test from 'components/map/test';
import { MAIN_PATH, PRODUCT_PATH, SEARCH_LIST_PATH, TEST_PATH } from 'constant';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Search from 'views/product/main';
import SearchList from 'views/product/searchList';
import CartList from 'views/product/cart-list';
import Container from 'layout/Container';
import SignIn from 'views/Authentication/SignIn';
import SignUp from 'views/Authentication/SignUp';
import { useLoginUserStore } from 'stores';
import { useCookies } from 'react-cookie';
import { ResponseDto } from 'apis/response';
import { User } from 'types/interface';
import { useEffect } from 'react';
import { GetSignInUserResponseDto } from 'apis/response/user';
import { getSignInUserRequest } from 'apis';
import OAuth from 'views/Authentication/OAuth';



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
        <Route path="/signin" element={<SignIn />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
      </Route>
    </Routes>

  );
}

export default App;
