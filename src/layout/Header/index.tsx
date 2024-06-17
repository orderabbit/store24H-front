import { MAIN_PATH, PAYMENT_PATH, SEARCH_PATH, SIGNIN_PATH, USER_PATH } from 'constant';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Sidebar from 'layout/Header/Sidebar';
import UserProfile from 'layout/Header/UserProfile';
import profileIcon from '../../images/free-icon-profile-3106921.png';
import cartListIcon from '../../images/free-icon-shopping-cart-3144456.png';
import { GetProductListRequest } from 'apis';

import './style.css';
import useLoginUserStore from 'stores/login-user.store';
import React from 'react';

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
  const[isOpen, setIsOpen] = useState<boolean>(false);
  const[isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const toggleSide = () => {  // 햄버거 버튼 클릭 토글 (미사용)
    setIsOpen(!isOpen);
  };
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  }
  const [isHoveringProfile, setIsHoveringProfile] = useState<boolean>(false); // 햄버거 버튼 위에 마우스를 올렸는지 여부
  const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();
  const { pathname } = useLocation();
  const [cookies, setCookie] = useCookies();

  const [products, setProducts] = useState<Product[]>([]);
  const [ cartListCount, setCartListCount ] = useState<number>(0);

  const [isLogin, setLogin] = useState<boolean>(false);
  const [isMainPage, setMainPage] = useState<boolean>(false);
  const [isSearchPage, setSearchPage] = useState<boolean>(false);
  const [isUserPage, setUserPage] = useState<boolean>(false);
  const [isPaymentPage, setPaymentPage] = useState<boolean>(false);
  const navigator = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (loginUser?.userId && cookies.accessToken) {
          const response = await GetProductListRequest(loginUser.userId, cookies.accessToken);
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
    const isMainPage = pathname === MAIN_PATH();
    setMainPage(isMainPage);
    const isSearchPage = pathname.startsWith(SEARCH_PATH());
    setSearchPage(isSearchPage);
    const isPaymentPage = pathname.startsWith(PAYMENT_PATH());
    setPaymentPage(isPaymentPage);
    const isUserPage = pathname.startsWith(USER_PATH(''));
    setUserPage(isUserPage);
  }, [pathname]);

  useEffect(() => {
    setLogin(loginUser !== null);
  }, [loginUser]);

  const onLogoClickHandler = () => {
    navigator(MAIN_PATH());
  }

  const onCartListIconClickHandler = () => {
    if(!loginUser){
      navigator(SIGNIN_PATH());
    }else {
      navigator('/cart');
    }
  };

  const onProfileIconClickHandler = () => {
    setIsProfileOpen(!isProfileOpen); // 프로필 팝업 열기/닫기 토글
  };

  const onSignInButtonClickHandler = () => {
    navigator(SIGNIN_PATH());
  };
  
  const onSignOutButtonClickHandler = () => {
    resetLoginUser();
    setCookie('accessToken', '', { path: MAIN_PATH(), expires: new Date() })
    navigator(MAIN_PATH());
  };  
  
  const onContactButtonClickHandler = () => {
    navigator('/contact');
  };
  
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

  const handleMouseEnter = () => {
    // setIsHovering(true);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    // setIsHovering(false);
    // 마우스가 햄버거 버튼 위에 있지 않고, 사이드바가 열린 상태에서만 사이드바를 닫음, (토글클릭으로 수정예정)
    // if (!isHovering && isOpen) {
      setIsOpen(false);
    // }
  };

  const handleProfileMouseEnter = () => {
    setIsProfileOpen(true); // 프로필 아이콘에 마우스 호버 시 프로필 사이드바 열기
  };

  const handleProfileMouseLeave = () => {
    setIsProfileOpen(false); // 프로필 아이콘에서 마우스 떠나면 프로필 사이드바 닫기
  };

  return (
    <div id='header'>
      <div className='top-bar'>
        {!isLogin && <div className='auth-button' onClick={onSignInButtonClickHandler}>로그인</div>}
        {!isLogin && <div className='auth-button' onClick={onSignInButtonClickHandler}>회원가입</div>}
        {isLogin && (
          <>
            <div className='auth-button' onClick={onProfileIconClickHandler}>
              <span className='nickname'>{loginUser?.nickname}님</span>
            </div>
            <div className='auth-button auth-button-logout' onClick={onSignOutButtonClickHandler}>로그아웃</div>
          </>
        )}
        <div className='auth-button' onClick={onContactButtonClickHandler}>고객센터</div>
      </div>
      <div className='header-container'>
        <div className='header-left-box'> 
          {/* onClick={toggleSide} 시에는 클릭시 사이드바 나옴 , onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} => 마우스 호버링 */}
          {/* 카테고리 로고, 햄버거버튼*/}
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
            <div className='header-logo'>{'logo'}</div>
          </div>
          <div className='header-right-box'>
          {<MyPageButton />}
        </div>
      </div>
    </div>
    </div>
  );
}
