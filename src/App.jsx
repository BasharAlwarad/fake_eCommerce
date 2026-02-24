import { useState, Suspense } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
  useOutletContext,
} from 'react-router';

import { createResource } from './utils/resourceCache';
import ProductsList from './pages/ProductsList';
import NotFound from './pages/NotFound';
import Cart from './pages/Cart';
import Nav from './components/Nav';

// ===== RENDER AS YOU FETCH PATTERN =====
// Start fetching data IMMEDIATELY when the app loads
// This is NOT in useEffect - it happens at the top level
// Data fetching STARTS BEFORE rendering happens
const productsResource = createResource('https://fakestoreapi.com/products');

// Root layout component - holds cart state and renders Nav + page content
function RootLayout() {
  const [cartList, setCartList] = useState([]);

  return (
    <>
      <Nav cartList={cartList} />
      <Outlet context={{ cartList, setCartList }} />
    </>
  );
}

// Wrapper for ProductsList page to access outlet context
function ProductsListPage() {
  const { setCartList } = useOutletContext();
  return (
    <Suspense fallback={<LoadingScreen message="Loading products..." />}>
      <ProductsList
        productsResource={productsResource}
        setCartList={setCartList}
      />
    </Suspense>
  );
}

// Wrapper for Cart page to access outlet context
function CartPage() {
  const { cartList, setCartList } = useOutletContext();
  return <Cart cartList={cartList} setCartList={setCartList} />;
}

// Define routes using createRoutesFromElements
const routes = createRoutesFromElements(
  <Route element={<RootLayout />}>
    <Route path="/" element={<ProductsListPage />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="*" element={<NotFound />} />
  </Route>
);

// Create the router with createBrowserRouter
const router = createBrowserRouter(routes);

function App() {
  return <RouterProvider router={router} />;
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
