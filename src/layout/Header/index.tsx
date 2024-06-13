import { MAIN_PATH, PAYMENT_PATH, SEARCH_PATH, SIGNIN_PATH, USER_PATH } from 'constant';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Sidebar from 'layout/Header/Sidebar';

import './style.css';
import useLoginUserStore from 'stores/login-user.store';
import React from 'react';


export default function Header() {
  const[isOpen, setIsOpen] = useState<boolean>(false);
  const toggleSide = () => {  // 햄버거 버튼 클릭 토글 (미사용)
    setIsOpen(!isOpen);
  };
  const [isHovering, setIsHovering] = useState<boolean>(false); // 햄버거 버튼 위에 마우스를 올렸는지 여부
  const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();
  const { pathname } = useLocation();
  const [cookies, setCookie] = useCookies();

  const [isLogin, setLogin] = useState<boolean>(false);
  const [isMainPage, setMainPage] = useState<boolean>(false);
  const [isSearchPage, setSearchPage] = useState<boolean>(false);
  const [isUserPage, setUserPage] = useState<boolean>(false);
  const [isPaymentPage, setPaymentPage] = useState<boolean>(false);

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
  }, [loginUser])

  const navigator = useNavigate();

  const onLogoClickHandler = () => {
    navigator(MAIN_PATH());
  }
  
  const MyPageButton = () => {

    const onMyPageButtonClickHandler = () => {
      if (!loginUser) return;
      const { userId } = loginUser;
      navigator(USER_PATH(userId));
    };
    const onSignOutButtonClickHandler = () => {
      resetLoginUser();
      setCookie('accessToken', '', { path: MAIN_PATH(), expires: new Date() })
      navigator(MAIN_PATH());
    };
    const onSignInButtonClickHandler = () => {
      navigator(SIGNIN_PATH());
    };
    if (isLogin && isUserPage)
      return <div className='white-button' onClick={onSignOutButtonClickHandler}>{'로그아웃'}</div>
    if (isLogin && isMainPage)
      return <div className='white-button' onClick={onMyPageButtonClickHandler}>{'마이페이지'}</div>
    if (!isLogin)
      return <div className='black-button' onClick={onSignInButtonClickHandler}>{'로그인'}</div>;
    return null;
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // 마우스가 햄버거 버튼 위에 있지 않고, 사이드바가 열린 상태에서만 사이드바를 닫는다.
    if (!isHovering && isOpen) {
      setIsOpen(false);
    }
  };

  

  

  return (
    <div id='header'>
      <div className='header-container'>
        <div className='header-left-box' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}> {/* onClick={toggleSide} 시에는 클릭시 사이드바 나옴*/}
          {/* 카테고리 로고, 햄버거버튼*/}
          <div className='category-logo'>
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          </div>
        </div>
        {/* 사이드바 */}
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className='header-container'>
          <div className='header-left-box' onClick={onLogoClickHandler}>
            <div className='icon-box'>
              <div className='icon logo-dark-icon'></div>
            </div>
            <div className='header-logo'>{'NAVER'}</div>
          </div>
          <div className='header-right-box'>
          {<MyPageButton />}
        </div>
      </div>
    </div>
  );
}
