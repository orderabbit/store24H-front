import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

import foodIcon from '../../../images/free-icon-font-utensils-5069194.png';
import sportsIcon from '../../../images/free-icon-font-snowboarding-6628045.png';
import cosmeticsIcon from '../../../images/free-icon-font-lipstick-3914854.png';
import fashionIcon from '../../../images/free-icon-font-shirt-long-sleeve-12442253.png';
import lifestyleIcon from '../../../images/free-icon-relax-157830.png';
import electronicsIcon from '../../../images/free-icon-font-dryer-11739985.png';
import furnitureIcon from '../../../images/free-icon-font-bed-alt-7857147.png';


const categoryIcons: { [key: string]: string } = {
  '식품': foodIcon,
  '스포츠': sportsIcon,
  '화장품': cosmeticsIcon,
  '패션': fashionIcon,
  '생활': lifestyleIcon,
  '가전': electronicsIcon,
  '가구': furnitureIcon
}

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) {
  const outside = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handlerOutside = (e: MouseEvent) => {
    if (outside.current && !outside.current.contains(e.target as Node) && isOpen == true) {
      setIsOpen(false);
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
    <div className='sidebar-container'>
    <div id="sidebar" ref={outside} className={isOpen ? 'open' : ''}>
      <button
        className="close"
        onClick={toggleSide}
      >
        Close
      </button>
      <ul className='sidebar-list'>
      {Object.keys(categoryIcons).map((category, index) => (
          <li key={index} onClick={() => handleCategoryClick(category)}>
            <img src={categoryIcons[category]} alt={category} className="category-icon" />
            {category}
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
}
