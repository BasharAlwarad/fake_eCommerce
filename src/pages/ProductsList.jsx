import { useState, useEffect } from 'react';
import axios from 'axios';

import ProductCard from '../components/ProductCard';

const ProductsList = ({ setCartList }) => {
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get('https://fakestoreapi.com/products');
      setProductsList(data);
    };

    fetchProducts();
  }, []);

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
};

export default ProductsList;
