import { ResponseDto } from "apis/response";
import { MAIN_PATH, USER_PATH } from "constant";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { useLoginUserStore } from "stores";
import "./style.css";

import {
  getUserRequest,
  patchNicknameRequest,
  patchPasswordRequest
} from "apis";
import {
  PatchNicknameRequestDto,
  PatchPasswordRequestDto,
} from "apis/request/user";
import {
  GetUserResponseDto,
  PatchNicknameResponseDto,
  PatchPasswordResponseDto,
} from "apis/response/user";

export default function MyPage() {
  const [userData, setUserData] = useState<GetUserResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMyPage, setMyPage] = useState<boolean>(false);
  const [cookies] = useCookies(["accessToken"]); // accessToken을 쿠키에서 가져옴.
  const { userId } = useParams();
  const navigator = useNavigate();

  const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();
  // const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [isNicknameChange, setNicknameChange] = useState<boolean>(false);

  const [nickname, setNickname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [changeNickname, setChangeNickname] = useState<string>("");

  const [isPasswordChange, setPasswordChange] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  const [profileImage, setProfileImage] = useState<string | null>(null);

  const getUserResponse = (
    responseBody: GetUserResponseDto | ResponseDto | null
  ) => {
    console.log('sdfsdfsdfsd');
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === "NU") alert("존재하지 않는 유저입니다.");
    if (code === "DBE") alert("데이터베이스 오류입니다.");
    if (code !== "SU") {
      navigator(MAIN_PATH());
      return;
    }
    const { userId, nickname, email, profileImage } =
      responseBody as GetUserResponseDto;

    console.log(responseBody);

    setNickname(nickname);
    setEmail(email);
    setProfileImage(profileImage);
    const isMyPage = userId === loginUser?.userId;
    console.log("123123 => ", userId);
    console.log("45545 => ",loginUser);
    setMyPage(isMyPage);
  };

  const patchNicknameResponse = (
    responseBody: PatchNicknameResponseDto | ResponseDto | null
  ) => {
    if (!cookies.accessToken) return;

    if (!responseBody) return;
    const { code } = responseBody;
    if (code === "VF") alert("닉네임은 필수입니다.");
    if (code === "AF") alert("인증에 실패했습니다.");
    if (code === "DN") alert("기존 닉네임과 중복되는 닉네임입니다.");
    if (code === "NU") alert("존재하지 않는 유저입니다.");
    if (code === "DBE") alert("데이터베이스 오류입니다.");
    if (code !== "SU") return;

    if (!userId) return;
    getUserRequest(userId, cookies.accessToken).then((response) => {
      getUserResponse(response);
      setNicknameChange(false); // 닉네임 변경 상태를 false로 설정
    });
  };

  const onNicknameEditButtonClickHandler = () => {
    if (isNicknameChange && changeNickname !== "") {
      const requestBody: PatchNicknameRequestDto = { nickname: changeNickname };
      patchNicknameRequest(requestBody, cookies.accessToken).then(
        patchNicknameResponse
      );
    } else {
      setChangeNickname(nickname);
      setNicknameChange(!isNicknameChange);
    }
  };

  const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setChangeNickname(value);
  };

  const patchPasswordResponse = (
    responseBody: PatchPasswordResponseDto | ResponseDto | null
  ) => {
    if (!cookies.accessToken || !userId) return;

    if (!responseBody) return;
    const { code } = responseBody;
    if (code === "VF") alert("비밀번호는 필수입니다.");
    if (code === "AF") alert("인증에 실패했습니다.");
    if (code === "DP") alert("기존 비밀번호와 중복되는 비밀번호입니다.");
    if (code === "NU") alert("존재하지 않는 유저입니다.");
    if (code === "DBE") alert("데이터베이스 오류입니다.");
    if (code !== "SU") return;

    setPasswordChange(false);
    alert("비밀번호가 변경되었습니다.");
    navigator(USER_PATH(userId));
  };

  const onPasswordEditButtonClickHandler = () => {
    if (isPasswordChange && currentPassword !== "" && newPassword !== "") {
      const requestBody: PatchPasswordRequestDto = {
        currentPassword,
        newPassword,
      };
      patchPasswordRequest(userId!, requestBody, cookies.accessToken).then(
        patchPasswordResponse
      );
    } else {
      setPasswordChange(!isPasswordChange);
    }
  };

  const onCurrentPasswordChangeHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
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
    console.log('11')
    getUserRequest(userId, cookies.accessToken).then(getUserResponse);
    console.log('22')
  }, [userId, isNicknameChange]);

  if (!userId) return <></>;
  return (
    <div id="sign-in-wrapper">
      <div className="sign-in-container">
        <div className="sign-in-box">
          <div className="sign-in-title">회원정보 수정</div>
          <div className="sign-in-content-box">
            <div className="sign-info">
              <div className="sign-info-title">
                <div>아이디</div>
              </div>
              <div className="sign-info-content">{userId}</div>
            </div>
            <div className="sign-info">
              <div className="sign-info-title">닉네임</div>
              <div className="sign-info-content">
                {isMyPage ? (
                  <>
                    {isNicknameChange ? (
                      <input
                        className="user-top-info-nickname-input"
                        type="text"
                        size={nickname.length + 2}
                        value={changeNickname}
                        onChange={onNicknameChangeHandler}
                      />
                    ) : (
                      <div className="user-top-info-nickname">{nickname}</div>
                    )}
                    <div
                      className="icon-box"
                      onClick={onNicknameEditButtonClickHandler}
                    >
                      <div className="icon-edit-icon">변경</div>
                    </div>
                  </>
                ) : (
                  <div className="user-top-info-nickname">{nickname}</div>
                )}
              </div>
            </div>
            <div className="sign-info">
              <div className="sign-info-title">이메일</div>
              <div className="sign-info-content">{email}</div>
            </div>
            {isMyPage && (
              <div className="sign-info">
                <div className="sign-info-title">비밀번호</div>
                <div className="sign-info-content">
                  {isPasswordChange ? (
                    <>
                      <input
                        className="sign-in-content-input"
                        type="password"
                        placeholder="현재 비밀번호"
                        value={currentPassword}
                        onChange={onCurrentPasswordChangeHandler}
                      />
                      <input
                        className="sign-in-content-input"
                        type="password"
                        placeholder="새 비밀번호"
                        value={newPassword}
                        onChange={onNewPasswordChangeHandler}
                      />
                    </>
                  ) : (
                    <div className="sign-in-content-input">••••••••</div>
                  )}
                  <div
                    className="icon-box"
                    onClick={onPasswordEditButtonClickHandler}
                  >
                    <div className="icon-edit-icon">변경</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function setShowMessage(arg0: boolean) {
  throw new Error("Function not implemented.");
}
