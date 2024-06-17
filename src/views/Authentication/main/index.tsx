import signup_html from '../SignUp/index';
import signin_html from '../SignIn/index';
import './style.css';
import React, { useState } from 'react';
import billwallet from './images/billwallet.png';


export default function LogIN_OUT() {
    const [isActive, setIsActive] = useState(false);

    const logIOEffectEvent = () => {
        setIsActive(!isActive);
    };

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <div className={`log-io-container ${isActive ? 'right-panel-active' : ''}`}>
                    {signin_html()}
                    {signup_html()}
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-in">
                            <h1 style={{paddingBottom: "50px", alignItems: "center"}}>회원가입하기</h1>
                            <p>아이디가 없다면, 여기를 클릭하세요</p>
                            <button className="ghost" id="signIn" onClick={logIOEffectEvent}>Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-out">
                            <h1>!</h1>
                            <p>Enter your personal details and start journey with us</p>
                            <button className="ghost" id="signUp" onClick={logIOEffectEvent}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
