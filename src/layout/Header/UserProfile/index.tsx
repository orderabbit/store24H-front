import React, { useState, useRef, useEffect } from 'react';
import { SIGNIN_PATH, USER_PATH } from 'constant';
import { useNavigate } from 'react-router-dom';
import useLoginUserStore from 'stores/login-user.store';
import { useCookies } from 'react-cookie';


import './style.css';


export default function UserProfile({ isProfileOpen, setIsProfileOpen }: { isProfileOpen: boolean; setIsProfileOpen: (isProfileOpen: boolean) => void }) {
  const outside = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { loginUser, resetLoginUser, setLoginUser } = useLoginUserStore(); // 사용자 정보
  const [cookies, setCookie] = useCookies();
  // const [isHovering, setIsHovering] = useState<boolean>(false); // 프로필 버튼 위에 마우스 호버링

  // const handleMouseEnter = () => {
  //   setIsHovering(true);
  //   setIsProfileOpen(true);
  // };

  // const handleMouseLeave = () => {
  //   setIsHovering(false);
  //   if(!isProfileOpen) {
  //     setIsProfileOpen(false);
  //   }
  // };
  const handleProfileButtonClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const navigateToOrderList = () => {
    if(!loginUser){
      navigate(SIGNIN_PATH());
    }else {
      navigate(`/order/list/${loginUser.userId}`);
    }
  };

  const onCartListIconClickHandler = () => {
    if(!loginUser){
      navigate(SIGNIN_PATH());
    }else {
      navigate('/cart');
    }
  };

  const onProfileButtonClickHandler = () => {
    if(!loginUser){
      navigate(SIGNIN_PATH());
    }else {
      navigate(USER_PATH(loginUser.userId));
    }
  };

  useEffect(() => {
    const handlerOutside = (e: MouseEvent) => {
      if (outside.current && !outside.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handlerOutside);

    return () => {
      document.removeEventListener('mousedown', handlerOutside);
    };

  },[isProfileOpen, setIsProfileOpen]);

  return (
    <div id="profilebar" ref={outside} className={`profilebar ${isProfileOpen ? 'open' : ''}`}>
      <div className="profile">
        <div className="profile-info">
          <ul>
            <>
            <li onClick={navigateToOrderList}>
              주문 목록
            </li>
            <li onClick={onProfileButtonClickHandler}>
              내 정보 변경
            </li>
            <li onClick={onCartListIconClickHandler}>
              장바구니
            </li>
            </>
          </ul>       
        </div>
      </div>
    </div>
    );
}
