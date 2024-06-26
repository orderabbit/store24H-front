import { MAIN_PATH, PAYMENT_PATH, SEARCH_PATH, SIGNIN_PATH, SIGNUP_PATH, USER_PATH } from 'constant';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Sidebar from 'layout/Header/Sidebar';
import UserProfile from 'layout/Header/UserProfile';
import profileIcon from '../../images/free-icon-profile-3106921.png';
import cartListIcon from '../../images/free-icon-shopping-cart-3144456.png';
import logoIcon from '../../images/free-icon-convenience-store-11790581.png';
import { GetCartListRequest, GetProductListRequest } from 'apis';
import './style.css';
import useLoginUserStore from 'stores/login-user.store';
import React from 'react';
import { imageListClasses } from '@mui/material';


interface Product {
  productId: number;
  title: string;
  link: string;
  image: string;
  lowPrice: string;
  category1: string;
  category2: string;
}


export default function Header() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const toggleSide = () => {
    setIsOpen(!isOpen);
  };

  const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();
  const { pathname } = useLocation();
  const [cookies, setCookie] = useCookies();

  const [cartListCount, setCartListCount] = useState<number>(0);

  const [isLogin, setLogin] = useState<boolean>(false);
  const [role, setRole] = useState<string>('');
  const navigator = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (loginUser?.userId && cookies.accessToken) {
          const response = await GetCartListRequest(loginUser.userId, cookies.accessToken);
          setCartListCount(response.data.items.length); // 상품 리스트 길이로 업데이트
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };

    fetchProducts();
  }, [loginUser, cookies.accessToken]);

  useEffect(() => {
    const handleCartUpdate: EventListener = (event) => {
      const customEvent = event as CustomEvent<{ cartCount: number }>;
      setCartListCount(customEvent.detail.cartCount);
    };

    window.addEventListener('cartUpdate', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdate', handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    setLogin(loginUser !== null);
  }, [loginUser]);

  const onLogoClickHandler = () => {
    navigator(MAIN_PATH());
  }

  const onCartListIconClickHandler = () => {
    if (!loginUser) {
      navigator(SIGNIN_PATH());
    } else {
      navigator('/cart');
    }
  };

  const onProfileIconClickHandler = () => {
    setIsProfileOpen(!isProfileOpen); // 프로필 팝업 열기/닫기 토글
  };

  const onSignInButtonClickHandler = () => {
    navigator(SIGNIN_PATH());
  };

  const onSignUpButtonClickHandler = () => {
    navigator(SIGNUP_PATH());
  };

  const onSignOutButtonClickHandler = () => {
    resetLoginUser();
    setCookie('accessToken', '', { path: MAIN_PATH(), expires: new Date() })
    navigator(MAIN_PATH());
  };

  const onQuestionButtonClickHandler = () => {
    navigator('/question');
  };

  useEffect(() => {
    const role = loginUser?.role;
    if (!role) return;
    setRole(role);
  }, [loginUser]);

  const MyPageButton = () => {


    return (
      <>
        <div className='navbar-icon' onClick={onProfileIconClickHandler}>
          <img src={profileIcon} alt="Profile" />
          <span>프로필</span>
        </div>
        <div className='navbar-icon' onClick={onCartListIconClickHandler}>
          <img src={cartListIcon} alt="CartList" />
          <span>장바구니 {cartListCount > 0 && `(${cartListCount})`}</span>
        </div>
      </>
    );
  };

  return (
    <div id='header'>
      <div className="top-bar-container">
        <div className='top-bar'>
          {!isLogin && <div className='auth-button' onClick={onSignInButtonClickHandler}>로그인</div>}
          {!isLogin && <div className='auth-button' onClick={onSignUpButtonClickHandler}>회원가입</div>}
          {isLogin && (
            <>
              <div>
                {role === 'ROLE_ADMIN' && <span className='role'>(관리자) </span>}
                <span className='nickname'>{loginUser?.nickname}님</span>
              </div>
              <div className='auth-button auth-button-logout' onClick={onSignOutButtonClickHandler}>로그아웃</div>
            </>
          )}
          <div className='auth-button' onClick={onQuestionButtonClickHandler}>고객센터</div>
        </div>
      </div>
      <div className='header-container'>
        <div className='header-left-box'>
          <div className='category-logo'>
            <div className={`hamburger ${isOpen ? 'active' : ''}`} onClick={toggleSide}>
              <span></span>
            </div>
          </div>
        </div>
        {/* 사이드바 */}
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <UserProfile isProfileOpen={isProfileOpen} setIsProfileOpen={setIsProfileOpen} />
        <div className='header-container'>
          <div className='header-left-box' onClick={onLogoClickHandler}>
            <div className='icon-box'>
              <div className='icon logo-dark-icon'></div>
            </div>
            <div className='header-logo'><img src={logoIcon} alt="logo" /></div>
          </div>
          <div className='header-right-box'>
            {<MyPageButton />}
          </div>
        </div>
      </div>
    </div>
  );
}
