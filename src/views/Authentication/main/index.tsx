import signup_html from '../SignUp/index';
import signin_html from '../SignIn/index';
import './style.css';
import React, { useState } from 'react';
import airport from 'images/loginBG.jpg';


export default function LogIN_OUT() {
    const [isActive, setIsActive] = useState(false);

    const logIOEffectEvent = () => {
        setIsActive(!isActive);
    };

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <img style={{position: "absolute", objectFit: "cover",
                         width: "100%", height: "100%"}} src={airport}/>
            <div className={`log-io-container ${isActive ? 'right-panel-active' : ''}`}>
                {signin_html()}
                {signup_html()}
                <div className="overlay-container">
                    <div className="overlay-box">
                        <div className="overlay">
                            <div className="overlay-panel overlay-in">
                                <h1>안녕하세요</h1>
                                <p style={{ paddingTop: "15%" }}>회원가입 하시나요?</p>
                            </div>
                            <div className="overlay-panel overlay-out">
                                <h1>어서오세요</h1>
                                <p style={{ paddingTop: "15%" }}>계정이 있으신가요?</p>
                            </div>
                        </div>
                        <button className="open-button" onClick={logIOEffectEvent}>{'----- ' + '+' +' ----- '}</button>
                    </div> 
                </div>
            </div>
        </div>
    );
}
