import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';

import ProductsList from './pages/ProductsList';
import NotFound from './pages/NotFound';
import Cart from './pages/Cart';

import Nav from './components/Nav';

function App() {
  const [cartList, setCartList] = useState([]);

  return (
    <BrowserRouter>
      <Nav cartList={cartList} />
      <Routes>
        <Route path="/" element={<ProductsList setCartList={setCartList} />} />
        <Route
          path="/cart"
          element={<Cart cartList={cartList} setCartList={setCartList} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
