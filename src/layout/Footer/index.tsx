// Footer.tsx
import React from 'react';
import { SIGNIN_PATH, SIGNUP_PATH } from 'constant';
import './style.css';
import logoIcon from '../../images/free-icon-convenience-store-11790581.png';
import { useNavigate } from 'react-router-dom';
import { MAIN_PATH } from 'constant';


const Footer: React.FC = () => {
  const navigate = useNavigate();

  const onLogoClickHandler = () => {
    navigate(MAIN_PATH());
  }

  return (
    <footer className="footer">
      <div className="footer-contentbox">
        <div className="footer-title">
          <div className="footer-left-title">
            <div>점포 소개</div>
            <div>이용약관 및 규칙</div>
            <div>개인정보 처리방침 및 청소년 보호 정책</div>
          </div>
          <div className="footer-right-title">
            <div>제휴 업체</div>
            <div>© 2024 Your Shopping Mall. All Rights Reserved.</div>
          </div>
        </div>
        <div className="footer-content">
          <div className="footer-navigate" onClick={onLogoClickHandler}><img className="footer-logo" src={logoIcon} alt="logo" /></div>
          <div>(주)코리아IT편의점 주식회사 대표이사 장민규 부대표 최판규 / 주소: 서울특별시 강남구 논현로 508 (역삼동, IT타워)
            사업자 등록번호 : 11-5652-123066
          </div>
          <div>전자상거래등에서의 소비자보호에 관한 법률에 따라 기업은행과 채무지급보증 계약을 체결하여 고객님의 결제금액에 대해 안전거래를 보장하고 있습니다.</div>
        </div>
      </div>
    </footer>
    /* <p>© 2024 Your Shopping Mall. All Rights Reserved.</p>
    <p>
      <p>개인정보처리방침</p>
    </p> */
  );
}

export default Footer;
