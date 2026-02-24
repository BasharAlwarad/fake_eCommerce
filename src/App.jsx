import { useState, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';

import { createResource } from './utils/resourceCache';
import ProductsList from './pages/ProductsList';
import NotFound from './pages/NotFound';
import Cart from './pages/Cart';
import Nav from './components/Nav';

function App() {
  // ===== RENDER AS YOU FETCH PATTERN =====
  // Start fetching data IMMEDIATELY when App loads
  // This is NOT in useEffect - it happens at the top level
  // Data fetching STARTS BEFORE rendering happens
  const productsResource = createResource('https://fakestoreapi.com/products');

  // This state holds all items in the shopping cart
  // It's stored here in App.jsx so all child components can access/modify it
  const [cartList, setCartList] = useState([]);

  return (
    <BrowserRouter>
      <Nav cartList={cartList} />
      <Routes>
        {/* 
          Suspense catches when ProductsList tries to read data that's not ready yet.
          While loading, it shows the fallback (Loading products...)
          Once data is ready, ProductsList renders with the data
        */}
        <Route
          path="/"
          element={
            <Suspense
              fallback={<LoadingScreen message="Loading products..." />}
            >
              <ProductsList
                productsResource={productsResource}
                setCartList={setCartList}
              />
            </Suspense>
          }
        />
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

// Simple loading screen component
function LoadingScreen({ message }) {
  return (
    <div className="min-h-screen bg-base-200 px-6 py-10">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-lg">⏳ {message}</p>
      </div>
    </div>
  );
}

export default App;
