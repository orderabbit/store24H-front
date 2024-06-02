import Map from 'components/map';
import Test from 'components/map/test';
import { MAIN_PATH, TEST_PATH } from 'constant';
import { Route, Routes } from 'react-router-dom';
import './App.css';



function App() {
  return (
    <Routes>
      <Route path={MAIN_PATH()} element={<Map />}></Route>
      <Route path={TEST_PATH()} element={<Test />}></Route>
    </Routes>
  );
}

export default App;
