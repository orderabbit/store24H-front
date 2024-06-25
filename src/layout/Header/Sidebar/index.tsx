import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

import foodIcon from '../../../images/free-icon-font-utensils.png';
import juiceIcon from '../../../images/free-icon-font-mug-hot-alt-6349378.png';
import snackIcon from '../../../images/free-icon-font-candy-alt-6349013.png';
import lifestyleIcon from '../../../images/free-icon-relax-157830.png';
import brushIcon from '../../../images/free-icon-font-broom-3917049.png';
import showerIcon from '../../../images/free-icon-font-shower-11740046.png';
import penIcon from '../../../images/free-icon-font-pencil-3917636.png';


const categoryIcons: { [key: string]: string } = {
  '음식': foodIcon,
  '음료': juiceIcon,
  '과자': snackIcon,
  '생활용품': lifestyleIcon,
  '욕실용품': brushIcon,
  '청소용품': showerIcon,
  '문구': penIcon
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
    if (isOpen) {
      document.addEventListener('mousedown', handlerOutside);
    } else {
      document.removeEventListener('mousedown', handlerOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handlerOutside);
    };
  }, [isOpen]);


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
