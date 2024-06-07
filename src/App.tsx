import Map from 'components/map';
import Test from 'components/map/test';
import { MAIN_PATH, PRODUCT_PATH, SEARCH_LIST_PATH, TEST_PATH } from 'constant';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Search from 'views/product/main';
import SearchList from 'views/product/searchList';
import CartList from 'views/product/cart-list';



function App() {
  return (
    <Routes>
      {/* <Route path={MAIN_PATH()} element={<Map />}></Route> */}
      <Route path={TEST_PATH()} element={<Test />}></Route>
      <Route path="/" element={<Search />} />
      <Route path="/search" element={<SearchList />} />
      <Route path="/cart" element={<CartList />}/>
    </Routes>

  );
}

export default App;
