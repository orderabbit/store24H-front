import React, { useState, useEffect, ChangeEvent } from 'react';
import { useCookies } from 'react-cookie';
import { ResponseDto } from 'apis/response';
import { useNavigate, useParams } from 'react-router-dom';
import './style.css';
import { useLoginUserStore } from 'stores';
import { MAIN_PATH, USER_PATH, PASSWORD_PATH } from 'constant';

import { GetUserResponseDto, PatchNicknameResponseDto, PatchPasswordResponseDto } from 'apis/response/user';
import { PatchNicknameRequestDto, PatchPasswordRequestDto } from 'apis/request/user';
import { getUserRequest, patchNicknameRequest, patchPasswordRequest, withdrawUserRequest } from 'apis';

export default function MyPage() {
    const [userData, setUserData] = useState<GetUserResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMyPage, setMyPage] = useState<boolean>(false);
    const [cookies] = useCookies(['accessToken']); // accessToken을 쿠키에서 가져옴.
    const { userId } = useParams();
    const navigator = useNavigate();

    const UserTop = () => {
    const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();
    // const imageInputRef = useRef<HTMLInputElement | null>(null);

    const [isNicknameChange, setNicknameChange] = useState<boolean>(false);
  
    const [nickname, setNickname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [changeNickname, setChangeNickname] = useState<string>('');

    const [isPasswordChange, setPasswordChange] = useState<boolean>(false);
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');

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
      setProfileImage(profileImage);
      const isMyPage = userId === loginUser?.userId;
      setMyPage(isMyPage);
    }

    const patchNicknameResponse = (responseBody: PatchNicknameResponseDto | ResponseDto | null) => {
      if (!cookies.accessToken) return;

      if (!responseBody) return;
      const { code } = responseBody;
      if (code === 'VF') alert('닉네임은 필수입니다.');
      if (code === 'AF') alert('인증에 실패했습니다.');
      if (code === 'DN') alert('기존 닉네임과 중복되는 닉네임입니다.');
      if (code === 'NU') alert('존재하지 않는 유저입니다.');
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') return;

      if (!userId) return;
      getUserRequest(userId, cookies.accessToken).then((response) => {
        getUserResponse(response);
        setNicknameChange(false); // 닉네임 변경 상태를 false로 설정
      });
    };

    const onNicknameEditButtonClickHandler = () => {
      if (isNicknameChange && changeNickname !== '') {
        const requestBody: PatchNicknameRequestDto = { nickname: changeNickname };
        patchNicknameRequest(requestBody, cookies.accessToken).then(patchNicknameResponse);
      } else {
        setNicknameChange(!isNicknameChange);
      }
    };

    const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setChangeNickname(value);
    };

    const patchPasswordResponse = (responseBody: PatchPasswordResponseDto | ResponseDto | null) => {
      if (!cookies.accessToken || !userId) return;

      if (!responseBody) return;
      const { code } = responseBody;
      if (code === 'VF') alert('비밀번호는 필수입니다.');
      if (code === 'AF') alert('인증에 실패했습니다.');
      if (code === 'DP') alert('기존 비밀번호와 중복되는 비밀번호입니다.');
      if (code === 'NU') alert('존재하지 않는 유저입니다.');
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') return;

      setPasswordChange(false);
      alert('비밀번호가 변경되었습니다.');
      navigator(USER_PATH(userId));
    };

    const onPasswordEditButtonClickHandler = () => {
      if (isPasswordChange && currentPassword !== '' && newPassword !== '') {
          const requestBody: PatchPasswordRequestDto = { currentPassword, newPassword };
          patchPasswordRequest(userId!, requestBody, cookies.accessToken).then(patchPasswordResponse);
      } else {
          setPasswordChange(!isPasswordChange);
      }
    };

    const onCurrentPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setCurrentPassword(value);
    };

    const onNewPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setNewPassword(value);
    };
    // const withDrawUserResponse = (responseBody: ResponseDto | null) => {
    //   if (!responseBody) return;
    //   const { code } = responseBody;
    //   if (code === 'AF') alert('인증에 실패했습니다.');
    //   if (code === 'NU') alert('존재하지 않는 유저입니다.');
    //   if (code === 'DBE') alert('데이터베이스 오류입니다.');
    //   if (code !== 'SU') return;

    //   resetLoginUser();
    //   setCookie('accessToken', '', { path: '/', expires: new Date() })
    //   alert('회원탈퇴가 완료되었습니다.');
    //   navigator(MAIN_PATH());
    // }

    // const withDrawalUserButtonClickHandler = () => {
    //   alert('정말 탈퇴하시겠습니까?');
    //   navigator(MAIN_PATH());
    //   if (!cookies.accessToken) return;
    //   if (!loginUser) return;
    //   const { userId } = loginUser;

    //   withdrawUserRequest(userId, cookies.accessToken).then(withDrawUserResponse);
    // }
  

    useEffect(() => {
      if (!userId) return;
      getUserRequest(userId, cookies.accessToken).then(getUserResponse);
    }, [userId, isNicknameChange]); // 의존성 배열에 추가

    if (!userId) return (<></>);
    return (
      <div id='sign-in-wrapper'>
        <div className='sign-in-container'>
          <div className='sign-in-box'>
            <div className='user-profile'>
              <div className='sign-in-title'>My Profile</div>
              <div className='sign-in-content-box'>
                <div className='sign-in-content-input-box'>
                  <p>
                    <small>ID</small>
                    {userId}
                  </p>
                  <p>
                    <small>Nickname</small>
                    {isMyPage ?
                    <>
                      {isNicknameChange ?
                        <input className='user-top-info-nickname-input' type='text' size={nickname.length + 2} value={changeNickname} onChange={onNicknameChangeHandler} /> :
                        <div className='user-top-info-nickname'>{nickname}</div>
                      }
                      <div className='icon-box' onClick={onNicknameEditButtonClickHandler}>
                        <div className='icon-edit-icon'>변경</div>
                      </div></> :
                      <div className='user-top-info-nickname'>{nickname}</div>
                    }
                  </p>
                  <p>
                    <small>Email</small>
                    {email}
                  </p>
                  {isMyPage && (
                    <p>
                      <small>Password</small>
                      {isPasswordChange ?
                        <>
                          <input className='sign-in-content-input' type='password' placeholder='현재 비밀번호' value={currentPassword} onChange={onCurrentPasswordChangeHandler} />
                          <input className='sign-in-content-input' type='password' placeholder='새 비밀번호' value={newPassword} onChange={onNewPasswordChangeHandler} />
                        </> :
                        <div className='sign-in-content-input'>••••••••</div>
                      }
                      <div className='icon-box' onClick={onPasswordEditButtonClickHandler}>
                      <div className='icon-edit-icon'>변경</div>
                      </div>
                    </p>
                  )}
                  <div className='sign-in-content-button-box'>
                      {/* <div className='primary-button-lg full-width' onClick={onMyProfileEditButtonClickHandler}>{'수정'}</div> */}
                      <div className=''></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <UserTop />
    </>
  )
}
