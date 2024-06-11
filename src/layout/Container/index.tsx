import { SIGNIN_PATH, SIGNUP_PATH } from 'constant';
import Header from 'layout/Header';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

export default function Container() {

    const {pathname} = useLocation();

  return (
    <>
        <Header />
        <Outlet />
    </>
  )
}
