import React, { useState, useRef, useEffect } from 'react';
import { MAIN_PATH } from 'constant';
import { useNavigate } from 'react-router-dom';
import useLoginUserStore from 'stores/login-user.store';
import { useCookies } from 'react-cookie';
import './style.css';


export default function UserProfile({ isProfileOpen, setIsProfileOpen }: { isProfileOpen: boolean; setIsProfileOpen: (isProfileOpen: boolean) => void }) {
  const outside = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { resetLoginUser } = useLoginUserStore();
  const [cookies, setCookie] = useCookies();

  const handlerOutside = (e: MouseEvent) => {
    if (outside.current && !outside.current.contains(e.target as Node)) {
      setIsProfileOpen(false);
    }
  };

  const onSignOutButtonClickHandler = () => {
    resetLoginUser();
    setCookie('accessToken', '', { path: MAIN_PATH(), expires: new Date() })
    navigate(MAIN_PATH());
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // const handleCategoryClick = (category: string) => {
  //   navigate(`/search?keyword=${encodeURIComponent(category)}`);
  //   toggleProfile();  // 사이드바 닫기
  // };

  useEffect(() => {
    document.addEventListener('mousedown', handlerOutside);

    return () => {
      document.removeEventListener('mousedown', handlerOutside);
    };

  },[isProfileOpen]);

  return (
    <div id="profilebar" ref={outside} className={isProfileOpen ? 'open' : ''}>
      <button className="close" onClick={toggleProfile}>
        X
      </button>
      <ul>
        <li onClick={onSignOutButtonClickHandler}>로그아웃</li>
      </ul>
    </div>
  );
}
