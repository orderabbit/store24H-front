import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Map from 'components/map';
import { MAIN_PATH } from 'constant';



function App() {
  return (
    <Routes>
      <Route path={MAIN_PATH()} element={<Map />}></Route>
    </Routes>
  );
}

export default App;
