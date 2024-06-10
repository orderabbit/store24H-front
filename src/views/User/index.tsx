// MyPage.tsx

import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { getUserRequest } from 'apis';
import { ResponseDto } from 'apis/response';
import { GetUserResponseDto } from 'apis/response/user';
import { useNavigate, useParams } from 'react-router-dom';
import './style.css';
import { useLoginUserStore } from 'stores';
import { MAIN_PATH, USER_PATH } from 'constant';


export default function MyPage() {
    const [userData, setUserData] = useState<GetUserResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMyPage, setMyPage] = useState<boolean>(false);
    const [cookies] = useCookies(['accessToken']); // accessToken을 쿠키에서 가져옵니다.
    const { userId } = useParams();
    const navigator = useNavigate();

    const UserTop = () => {
    const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();
    // const imageInputRef = useRef<HTMLInputElement | null>(null);

    const [isNicknameChange, setNicknameChange] = useState<boolean>(false);
    const [nickname, setNickname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [changeNickname, setChangeNickname] = useState<string>('');
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const getUserResponse = (responseBody: GetUserResponseDto | ResponseDto | null) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === 'NU') alert('존재하지 않는 유저입니다.');
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') {
        navigator(MAIN_PATH());
        return;
      }
      const { userId, nickname, email, profileImage } = responseBody as GetUserResponseDto;

      setNickname(nickname);
      setEmail(email);
      setName(name);
      setGender(gender);
      setProfileImage(profileImage);
      const isMyPage = userId === loginUser?.userId;
      setMyPage(isMyPage);
    }
    useEffect(() => {
        if (!userId) return;
        getUserRequest(userId, cookies.accessToken).then(getUserResponse);
      }, [userId]);

      if (!userId) return (<></>);
    return (
        <div className='user-top-container'>
          <div className='user-info'>
            <div className='profileImage'>{profileImage}</div>
            <div className='userId'>
                {userId}
            </div>
            <div className='nickname'>
              {/* {isNicknameChange ?
                <input type='text' value={changeNickname} onChange={(e) => setChangeNickname(e.target.value)} />
                : <div>{nickname}</div>
              } */}
                {nickname}
            </div>
            <div className='email'>
              {email}
            </div>
            <div className='user-button'>
            {/* {isMyPage && <div className='white-button' onClick={() => setNicknameChange(!isNicknameChange)}>{isNicknameChange ? '변경완료' : '닉네임 변경'}</div>} */}
            </div>
          </div>
        </div>
    );


    }

    return (
        <>
          <UserTop />
        </>
      )
}
