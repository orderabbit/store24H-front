import { ResponseDto } from "apis/response";
import { MAIN_PATH, USER_PATH } from "constant";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { useLoginUserStore } from "stores";
import "./style.css";
import { getUserRequest, patchNicknameRequest, patchPasswordRequest, withdrawUserRequest } from "apis";
import { PatchNicknameRequestDto, PatchPasswordRequestDto, WithdrawalUserRequestDto } from "apis/request/user";
import { GetUserResponseDto, PatchNicknameResponseDto, PatchPasswordResponseDto, WithdrawalUserResponseDto } from "apis/response/user";

export default function MyPage() {
  const [isMyPage, setMyPage] = useState<boolean>(false);
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const { userId } = useParams();
  const navigator = useNavigate();

  const { loginUser, resetLoginUser } = useLoginUserStore();
  const [isSocialUser, setIsSocialUser] = useState<boolean>(false);
  const [isNicknameChange, setNicknameChange] = useState<boolean>(false);

  const [nickname, setNickname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [changeNickname, setChangeNickname] = useState<string>("");
  const [emptyNicknameError, setEmptyNicknameError] = useState<boolean>(false);
  const [duplicateNicknameError, setDuplicateNicknameError] = useState<boolean>(false);
  const [isPasswordChange, setPasswordChange] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [matchCurrentPasswordError, setMatchCurrentPasswordError] = useState<boolean>(false);
  const [passwordMatchError, setPasswordMatchError] = useState<boolean>(false);
  const [emptyPasswordError, setEmptyPasswordError] = useState<boolean>(false);
  const [duplicatePasswordError, setDuplicatePasswordError] = useState<boolean>(false);

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isNicknameModalOpen, setNicknameModalOpen] = useState<boolean>(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState<boolean>(false);
  const [isWithdrawalModalOpen, setWithdrawalModalOpen] = useState<boolean>(false);
  const [withdrawalPassword, setWithdrawalPassword] = useState<string>("");
  const [emptyWithdrawalPasswordError, setEmptyWithdrawalPasswordError] = useState<boolean>(false);
  const [withdrawalPasswordMatchError, setWithdrawalPasswordMatchError] = useState<boolean>(false);

  const getUserResponse = (
    responseBody: GetUserResponseDto | ResponseDto | null
  ) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === "NU") alert("존재하지 않는 유저입니다.");
    if (code === "DBE") alert("데이터베이스 오류입니다.");
    if (code !== "SU") {
      navigator(MAIN_PATH());
      return;
    }
    const { userId, nickname, email, profileImage, socialUser } =
      responseBody as GetUserResponseDto;
    setNickname(nickname);
    setEmail(email);
    setProfileImage(profileImage);
    setIsSocialUser(socialUser);
    const isMyPage = userId === loginUser?.userId;
    setMyPage(isMyPage);
  };

  const WithdrawalUserResponse = (
    responseBody: WithdrawalUserResponseDto | ResponseDto | null
  ) => {
    if (!cookies.accessToken) return;
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === "NU") alert("존재하지 않는 유저입니다.");
    if (code === "AF") alert("인증에 실패했습니다.");
    if (code === "DBE") alert("데이터베이스 오류입니다.");
    if (code !== "SU") return;
    alert("회원탈퇴 되었습니다.");
    logout();
    navigator(MAIN_PATH());
  };

  const patchNicknameResponse = (
    responseBody: PatchNicknameResponseDto | ResponseDto | null
  ) => {
    if (!cookies.accessToken) return;

    setDuplicateNicknameError(false);
    setEmptyNicknameError(false);

    if (!responseBody) return;
    const { code } = responseBody;
    if (code === "VF") setEmptyNicknameError(true);
    if (code === "AF") alert("인증에 실패했습니다.");
    if (code === "DN") setDuplicateNicknameError(true);
    if (code === "NU") alert("존재하지 않는 유저입니다.");
    if (code === "DBE") alert("데이터베이스 오류입니다.");
    if (code !== "SU") return;

    if (!userId) return;
    getUserRequest(userId, cookies.accessToken).then((response) => {
      getUserResponse(response);
      setNicknameChange(false);
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

  const handleNicknameSubmit = () => {
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
    const { code } = responseBody;
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

  const onWithdrawalButtonClickHandler = () => {
    setWithdrawalModalOpen(true);
  };

  const handleWithdrawalSubmit = () => {
    setEmptyWithdrawalPasswordError(false);
    setWithdrawalPasswordMatchError(false);

    if (withdrawalPassword === "") {
      setEmptyWithdrawalPasswordError(true);
      return;
    }
    if (withdrawalPassword !== currentPassword) {
      setWithdrawalPasswordMatchError(true);
      return;
    }
    if (!userId || !withdrawalPassword) return;
    const requestBody: WithdrawalUserRequestDto = { userId: userId, password: withdrawalPassword };
    withdrawUserRequest(userId!, requestBody,).then(WithdrawalUserResponse);
  };

  const closeWithdrawalModal = () => {
    setWithdrawalModalOpen(false);
    setWithdrawalPassword("");
    setEmptyWithdrawalPasswordError(false);
    setWithdrawalPasswordMatchError(false);
  };

  const logout = () => {
    removeCookie("accessToken", { path: "/" });
    resetLoginUser();
  };

  useEffect(() => {
    if (!userId) return;
    getUserRequest(userId, cookies.accessToken).then(getUserResponse);
  }, [userId, isNicknameChange, cookies.accessToken]);

  if (!userId) return <></>;
  return (
    <div className="setprofile-in-container">
      <div className="setprofile-in-box">
        <div className="setprofile-in-title">회원정보 수정</div>
        <div className="setprofile-in-content-box">
          <div className="setprofile-info">
            <div className="setprofile-info-title">
              <div>아이디</div>
            </div>
            <div className="setprofile-info-content">{userId}</div>
          </div>
          <div className="setprofile-info">
            <div className="setprofile-info-title">닉네임</div>
            <div className="setprofile-info-content">
              {isMyPage ? (
                <>
                  <div className="user-top-info-nickname">{nickname}</div>
                  <div className="icon-box" onClick={onNicknameEditButtonClickHandler}>
                    <div className="icon-edit-icon">닉네임 변경</div>
                  </div>
                </>
              ) : (
                <div className="user-top-info-nickname">{nickname}</div>
              )}
            </div>
          </div>
          <div className="setprofile-info">
            <div className="setprofile-info-title">
              <div>이메일 주소</div>
            </div>
            <div className="setprofile-info-content">{email}</div>
          </div>
          <div className="setprofile-info">
            <div className="setprofile-info-title">
              <div>비밀번호</div>
            </div>
            <div className="setprofile-info-content">
              <div className="user-top-info-nickname">{"********"}</div>
              {isMyPage && !isSocialUser && (
                <div className="icon-box" onClick={onPasswordEditButtonClickHandler}>
                  <div className="icon-edit-icon">비밀번호 변경</div>
                </div>
              )}
            </div>
          </div>
          {isMyPage && (
            <div className="setprofile-withdrawal-box">
              <div className="setprofile-withdrawal-button" onClick={onWithdrawalButtonClickHandler}>
                회원 탈퇴
              </div>
            </div>
          )}
        </div>
      </div>
      {isNicknameModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-title">닉네임 변경</div>
            <div className="modal-content-box">
              <input
                type="text"
                className="setprofile-in-input"
                placeholder="변경할 닉네임"
                value={changeNickname}
                onChange={onNicknameChangeHandler}
              />
              {emptyNicknameError && (
                <div className="setprofile-in-error-message">
                  변경할 닉네임을 입력해 주세요.
                </div>
              )}
              {duplicateNicknameError && (
                <div className="setprofile-in-error-message">
                  이미 사용 중인 닉네임입니다.
                </div>
              )}
              <button className="setprofile-in-button" onClick={handleNicknameSubmit}>
                닉네임 변경
              </button>
              <button className="setprofile-in-button" onClick={closeNicknameModal}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
      {isPasswordModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-title">비밀번호 변경</div>
            <div className="modal-content-box">
              <input
                type="password"
                className="setprofile-in-input"
                placeholder="현재 비밀번호"
                value={currentPassword}
                onChange={onCurrentPasswordChangeHandler}
              />
              <input
                type="password"
                className="setprofile-in-input"
                placeholder="새 비밀번호"
                value={newPassword}
                onChange={onNewPasswordChangeHandler}
              />
              <input
                type="password"
                className="setprofile-in-input"
                placeholder="새 비밀번호 확인"
                value={confirmPassword}
                onChange={onConfirmPasswordChangeHandler}
              />
              {matchCurrentPasswordError && (
                <div className="setprofile-in-error-message">
                  현재 비밀번호가 일치하지 않습니다.
                </div>
              )}
              {passwordMatchError && (
                <div className="setprofile-in-error-message">
                  새 비밀번호가 일치하지 않습니다.
                </div>
              )}
              {emptyPasswordError && (
                <div className="setprofile-in-error-message">
                  모든 필드를 입력해 주세요.
                </div>
              )}
              {duplicatePasswordError && (
                <div className="setprofile-in-error-message">
                  새 비밀번호가 현재 비밀번호와 동일합니다.
                </div>
              )}
              <button className="setprofile-in-button" onClick={handlePasswordSubmit}>
                비밀번호 변경
              </button>
              <button className="setprofile-in-button" onClick={closePasswordModal}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
      {isWithdrawalModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-title">회원 탈퇴</div>
            <div className="modal-content-box">
              <input
                type="password"
                className="setprofile-in-input"
                placeholder="비밀번호를 입력하세요."
                value={withdrawalPassword}
                onChange={(e) => setWithdrawalPassword(e.target.value)}
              />
              {emptyWithdrawalPasswordError && (
                <div className="setprofile-in-error-message">
                  비밀번호를 입력해 주세요.
                </div>
              )}
              {withdrawalPasswordMatchError && (
                <div className="setprofile-in-error-message">
                  비밀번호가 일치하지 않습니다.
                </div>
              )}
              <button className="setprofile-in-button" onClick={closeWithdrawalModal}>
                취소
              </button>
              <button className="withdrawal-button" onClick={handleWithdrawalSubmit}>
                탈퇴
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
