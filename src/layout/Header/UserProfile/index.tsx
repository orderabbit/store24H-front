import React, { useState, useRef, useEffect } from 'react';
import { MAIN_PATH, USER_PATH } from 'constant';
import { useNavigate } from 'react-router-dom';
import useLoginUserStore from 'stores/login-user.store';
import { useCookies } from 'react-cookie';
import defaultProfileImage from '../../../images/free-icon-profile-3106921.png';
import myPageImage from '../../../images/pencil.png';
import logoutImage from '../../../images/logout.png';

import './style.css';


export default function UserProfile({ isProfileOpen, setIsProfileOpen }: { isProfileOpen: boolean; setIsProfileOpen: (isProfileOpen: boolean) => void }) {
  const outside = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { loginUser, resetLoginUser } = useLoginUserStore(); // 사용자 정보
  const [cookies, setCookie] = useCookies();

  const handlerOutside = (e: MouseEvent) => {
    if (outside.current && !outside.current.contains(e.target as Node)) {
      setIsProfileOpen(false);
    }
  };

  const onSignOutButtonClickHandler = () => {
    resetLoginUser();
    setCookie('accessToken', '', { path: MAIN_PATH(), expires: new Date() })
    setIsProfileOpen(false);
    navigate(MAIN_PATH());
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const onMyPageButtonClickHandler = () => {
    if (!loginUser) return; 
      const { userId } = loginUser;
      navigate(USER_PATH(userId));
      setIsProfileOpen(false);
  };

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
        <div className="profile-content">
        <div className="profile-header">
          <div className="profile-email">{loginUser?.email}</div>
        </div>
          <div className="profile-image-container">
            <img
              src={loginUser?.profileImage || defaultProfileImage}
              alt="프로필 사진"
              className="profile-image"
            />
          </div>
          <div className="profile-info">
            <p>안녕하세요, <span className="nickname">{loginUser?.nickname}</span> 님</p>
            <div className="profile-actions">
              <button className="profile-action-mypage" onClick={onMyPageButtonClickHandler}>
                <img src={myPageImage} alt="myPageImage" className="action-icon" />
                개인정보 수정
              </button>
              <button className="profile-action-logout" onClick={onSignOutButtonClickHandler}>
                <img src={logoutImage} alt="logoutImage" className="action-icon" />
                로그아웃
              </button>
            </div>
          </div>
      </div>
    </div>
    );
}
