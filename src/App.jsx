import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';

import ProductsList from './pages/ProductsList';
import NotFound from './pages/NotFound';
import Cart from './pages/Cart';

import Nav from './components/Nav';

function App() {
  // This state holds all items in the shopping cart
  // It's stored here in App.jsx so all child components can access/modify it
  const [cartList, setCartList] = useState([]);

  return (
    <BrowserRouter>
      <Nav cartList={cartList} />
      <Routes>
        {/* ProductsList page fetches products ON RENDER using useEffect */}
        <Route path="/" element={<ProductsList setCartList={setCartList} />} />

        {/* Cart page does NOT fetch - it uses cartList from App state */}
        <Route
          path="/cart"
          element={<Cart cartList={cartList} setCartList={setCartList} />}
        />

        {/* Fallback for any route that doesn't match */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
