import { SIGNIN_PATH, SIGNUP_PATH } from 'constant';
import Header from 'layout/Header';
import React from 'react';
import Footer from '../Footer';
import { Outlet, useLocation } from 'react-router-dom';

export default function Container() {

  return (
    <>
    <div className="container">
      <Header />
      <div className="content">
      <Outlet />
      <Footer />
      </div>
      </div>
    </>
  )
}
