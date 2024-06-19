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
  patchPasswordRequest,
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
  const [isMyPage, setMyPage] = useState<boolean>(false);
  const [cookies] = useCookies(["accessToken"]);
  const { userId } = useParams();
  const navigator = useNavigate();

  const { loginUser } = useLoginUserStore();
  const [isSocialUser, setIsSocialUser] = useState<boolean>(false);
  const [isNicknameChange, setNicknameChange] = useState<boolean>(false);

  const [nickname, setNickname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [changeNickname, setChangeNickname] = useState<string>("");
  const [emptyNicknameError, setEmptyNicknameError] = useState<boolean>(false);
  const [duplicateNicknameError, setDuplicateNicknameError] =
    useState<boolean>(false);
  const [isPasswordChange, setPasswordChange] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [matchCurrentPasswordError, setMatchCurrentPasswordError] =
    useState<boolean>(false);
  const [passwordMatchError, setPasswordMatchError] = useState<boolean>(false);
  const [emptyPasswordError, setEmptyPasswordError] = useState<boolean>(false);
  const [duplicatePasswordError, setDuplicatePasswordError] =
    useState<boolean>(false);

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isNicknameModalOpen, setNicknameModalOpen] = useState<boolean>(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState<boolean>(false);

  const getUserResponse = (
    responseBody: GetUserResponseDto | ResponseDto | null
  ) => {
    if (!responseBody) return;
    const { code } = responseBody.data;
    if (code === "NU") alert("존재하지 않는 유저입니다.");
    if (code === "DBE") alert("데이터베이스 오류입니다.");
    if (code !== "SU") {
      navigator(MAIN_PATH());
      return;
    }
    const { userId, nickname, email, profileImage, socialUser } =
      responseBody as GetUserResponseDto;
      console.log(responseBody)
    setNickname(nickname);
    setEmail(email);
    setProfileImage(profileImage);
    setIsSocialUser(socialUser);
    const isMyPage = userId === loginUser?.userId;
    setMyPage(isMyPage);
  };

  const patchNicknameResponse = (
    responseBody: PatchNicknameResponseDto | ResponseDto | null
  ) => {
    if (!cookies.accessToken) return;

    setDuplicateNicknameError(false);
    setEmptyNicknameError(false);

    if (!responseBody) return;
    const { code } = responseBody.data;
    if (code === "VF") setEmptyNicknameError(true);
    if (code === "AF") alert("인증에 실패했습니다.");
    if (code === "DN") setDuplicateNicknameError(true);
    if (code === "NU") alert("존재하지 않는 유저입니다.");
    if (code === "DBE") alert("데이터베이스 오류입니다.");
    if (code !== "SU") return;

    if (!userId) return;
    getUserRequest(userId, cookies.accessToken).then((response) => {
      getUserResponse(response);
      setNicknameChange(false); // 닉네임 변경 상태를 false로 설정
      setNicknameModalOpen(false);
    });
  };

  const onNicknameEditButtonClickHandler = () => {
    setChangeNickname(nickname);
    setNicknameModalOpen(true);
  };

  const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setChangeNickname(value);
  };

  const handelNicknameSubmit = () => {
    if (changeNickname === "") {
      setEmptyNicknameError(true);
      setDuplicateNicknameError(false);
      return;
    }
    const requestBody: PatchNicknameRequestDto = { nickname: changeNickname };
    patchNicknameRequest(requestBody, cookies.accessToken).then(
      patchNicknameResponse
    );
  };

  const closeNicknameModal = () => {
    setNicknameModalOpen(false);
    setChangeNickname("");
    setEmptyNicknameError(false);
    setDuplicateNicknameError(false);
  };

  const patchPasswordResponse = (
    responseBody: PatchPasswordResponseDto | ResponseDto | null
  ) => {
    if (!cookies.accessToken || !userId) return;
    setPasswordMatchError(false);
    setEmptyPasswordError(false);
    setDuplicatePasswordError(false);
    setMatchCurrentPasswordError(false);
    if (!responseBody) return;
    const { code } = responseBody.data;
    if (code === "VF") setEmptyPasswordError(true);
    if (code === "AF") alert("인증에 실패했습니다.");
    if (code === "DP") setDuplicatePasswordError(true);
    if (code === "WP") setMatchCurrentPasswordError(true);
    if (code === "NU") alert("존재하지 않는 유저입니다.");
    if (code === "DBE") alert("데이터베이스 오류입니다.");
    if (code !== "SU") return;
    setPasswordChange(false);
    closePasswordModal();
    alert("비밀번호가 변경되었습니다.");
    navigator(USER_PATH(userId));
  };

  const onPasswordEditButtonClickHandler = () => {
    setPasswordModalOpen(true);
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

  const onConfirmPasswordChangeHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setConfirmPassword(value);
  };

  const handlePasswordSubmit = () => {
    setPasswordMatchError(false);
    setMatchCurrentPasswordError(false);
    setPasswordMatchError(false);
    setEmptyPasswordError(false);
    setDuplicatePasswordError(false);
    if (
      currentPassword === "" ||
      newPassword === "" ||
      confirmPassword === ""
    ) {
      setEmptyPasswordError(true);
      return;
    }
    if (currentPassword === newPassword) {
      setDuplicatePasswordError(true);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMatchError(true);
      return;
    }
    const requestBody: PatchPasswordRequestDto = {
      currentPassword,
      newPassword,
    };
    patchPasswordRequest(userId!, requestBody, cookies.accessToken).then(
      patchPasswordResponse
    );
  };

  const closePasswordModal = () => {
    setPasswordModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMatchCurrentPasswordError(false);
    setPasswordMatchError(false);
    setEmptyPasswordError(false);
    setDuplicatePasswordError(false);
  };

  useEffect(() => {
    if (!userId) return;
    getUserRequest(userId, cookies.accessToken).then(getUserResponse);
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
                    <div className="user-top-info-nickname">{nickname}</div>
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
            
              <div className="sign-info">
                <div className="sign-info-title">비밀번호</div>
                <div className="sign-info-content">
                  <div className="sign-in-content-input">••••••••</div>
                  {!isSocialUser && (
                  <div
                    className="icon-box"
                    onClick={onPasswordEditButtonClickHandler}
                  >
                    
                    <div className="icon-edit-icon">변경</div>
                  
                  </div>
                  )}
                </div>
              </div>
          </div>
        </div>
      </div>
      {isNicknameModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeNicknameModal}>
              &times;
            </span>
            <div className="modal-body">
              <h2 className="modal-title"> 닉네임 변경</h2>
              <div className="modal-title-body">
                <div className="modal-title-cnt">현재 닉네임 :</div>
                <div className="modal-content-cnt"> {nickname}</div>
              </div>
              <div className="modal-title-body">
                <label style={{ display: "flex", alignItems: "center" }}>
                  <div className="modal-title-cnt">변경 닉네임 :</div>
                  <div className="modal-content-cnt">
                    <input
                      type="text"
                      value={changeNickname}
                      onChange={onNicknameChangeHandler}
                      style={{ width: "70%", height: 22.5 }}
                    />
                  </div>
                </label>
              </div>
              {emptyNicknameError && (
                <div className="error-message">
                  변경할 닉네임을 입력해주세요.
                </div>
              )}
              {duplicateNicknameError && (
                <div className="duplicate-error-message">
                  중복되는 닉네임입니다.
                </div>
              )}
              <div
                className="modal-button-store"
                onClick={handelNicknameSubmit}
              >
                저장
              </div>
            </div>
          </div>
        </div>
      )}
      {isPasswordModalOpen && (
        <div className="modal">
          <div className="modal-content-password">
            <span className="close" onClick={closePasswordModal}>
              &times;
            </span>
            <div className="modal-body-password">
              <h2 className="modal-title-password"> 비밀번호 변경</h2>
              <div className="modal-title-body-password">
                <label style={{ display: "flex", alignItems: "center" }}>
                  <div className="modal-title-cnt-password">
                    현재 비밀번호 :
                  </div>
                  <div className="modal-content-cnt-password">
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={onCurrentPasswordChangeHandler}
                      style={{ width: "70%", height: 22.5 }}
                    />
                  </div>
                </label>
              </div>
              <div className="modal-title-body-password">
                <label style={{ display: "flex", alignItems: "center" }}>
                  <div className="modal-title-cnt-password">
                    변경 비밀번호 :
                  </div>
                  <div className="modal-content-cnt-password">
                    <input
                      type="password"
                      value={newPassword}
                      onChange={onNewPasswordChangeHandler}
                      style={{ width: "70%", height: 22.5 }}
                    />
                  </div>
                </label>
              </div>
              <div className="modal-title-body-password">
                <label style={{ display: "flex", alignItems: "center" }}>
                  <div className="modal-title-cnt-password">
                    비밀번호 확인 :
                  </div>
                  <div className="modal-content-cnt-password">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={onConfirmPasswordChangeHandler}
                      style={{ width: "70%", height: 22.5 }}
                    />
                  </div>
                </label>
              </div>
              {matchCurrentPasswordError && (
                <div className="matchCurrent-error-message">
                  현재 비밀번호가 일치하지 않습니다.
                </div>
              )}
              {duplicatePasswordError && (
                <div className="duplicate-error-message">
                  이전 비밀번호와 일치합니다.
                </div>
              )}
              {emptyPasswordError && (
                <div className="empty-error-message">
                  변경할 비밀번호를 입력해주세요.
                </div>
              )}
              {passwordMatchError && (
                <div className="match-error-message">
                  비밀번호가 일치하지 않습니다.
                </div>
              )}
              <div
                className="modal-button-store-password"
                onClick={handlePasswordSubmit}
              >
                저장
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function setShowMessage(arg0: boolean) {
  throw new Error("Function not implemented.");
}
