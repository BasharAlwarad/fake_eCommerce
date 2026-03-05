import { useState, useEffect } from 'react';
import axios from 'axios';

import ProductCard from '../components/ProductCard';

export default function ProductList({ setCartList }) {
  // State to store the products after we fetch them
  const [productsList, setProductsList] = useState([]);

  // State to track if data is currently loading
  const [isLoading, setIsLoading] = useState(true);

  // State to track any errors that happen during fetch
  const [error, setError] = useState(null);

  // ===== FETCH ON RENDER PATTERN =====
  // useEffect hook with empty dependency array []
  // This means: "Run this code ONCE when the component first renders"
  useEffect(() => {
    // Create an async function to fetch the data
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Make the API call
        const { data } = await axios.get('https://fakestoreapi.com/products');
        console.log(data);
        // Save the data to state
        setProductsList(data);
        setIsLoading(false);
      } catch (err) {
        // If something goes wrong, save the error
        setError(err.message);
        setIsLoading(false);
      }
    };

    // Call the async function
    fetchProducts();

    // Empty dependency array = only run when component mounts
  }, []);

  // Show loading message while fetching
  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 px-6 py-10">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  // Show error message if fetch failed
  if (error) {
    return (
      <div className="min-h-screen bg-base-200 px-6 py-10">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-lg text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  // Show products once data is loaded
  return (
    <div className="min-h-screen bg-base-200 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-base-content">Products</h1>
          <p className="text-base text-base-content/70">
            Discover curated picks from the fake store catalog.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productsList.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              setCartList={setCartList}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
