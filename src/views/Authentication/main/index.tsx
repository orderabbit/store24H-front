import signup_html from '../SignUp/index';
import signin_html from '../SignIn/index';
import './style.css';
import React, { useState } from 'react';

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
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button className="ghost" id="signIn" onClick={logIOEffectEvent}>Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start journey with us</p>
                            <button className="ghost" id="signUp" onClick={logIOEffectEvent}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
