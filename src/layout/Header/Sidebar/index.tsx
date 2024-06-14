import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';


export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) {
  const outside = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handlerOutside = (e: MouseEvent) => {
    if (outside.current && !outside.current.contains(e.target as Node) && isOpen == true) {
      toggleSide();
    }
  };

  const toggleSide = () => {
    setIsOpen(false);
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/search?keyword=${encodeURIComponent(category)}`);
    toggleSide();  // 사이드바 닫기
  };

  useEffect(() => {
    document.addEventListener('mousedown', handlerOutside);

    return () => {
      document.removeEventListener('mousedown', handlerOutside);
    };

  },[]);

  return (
    <div id="sidebar" ref={outside} className={isOpen ? 'open' : ''}>
      {/* 닫기 토글버튼 혹시나 이미지 이용시 해당코드사용 */}
      {/* <img
        src="img/close.png"
        alt="Close"
        className="close"
        onClick={toggleSide}
      /> */}
      <button
        className="close"
        onClick={toggleSide}
      >
        Close
      </button>
      <ul>
        {/* 나중에 폰트어썸 사용해서 아이콘추가? 하면될듯 */}
        <li onClick={() => handleCategoryClick('식품')}>식품</li>
        <li onClick={() => handleCategoryClick('스포츠')}>스포츠</li>
        <li onClick={() => handleCategoryClick('화장품')}>화장품</li>
        <li onClick={() => handleCategoryClick('패션')}>패션</li>
        <li onClick={() => handleCategoryClick('생활')}>생활</li>
        <li onClick={() => handleCategoryClick('가전')}>가전</li>
        <li onClick={() => handleCategoryClick('가구')}>가구</li>
      </ul>
      {/* <span className="exit-menu">Exit</span> */}
    </div>
  );
}
