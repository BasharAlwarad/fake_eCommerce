/**
 * RENDER AS YOU FETCH PATTERN
 *
 * Notice: NO useEffect! NO useState for data!
 *
 * Instead, the data resource is created in App.jsx BEFORE
 * this component is rendered. This component just READS the data.
 *
 * If data isn't ready yet, this component suspends (pauses)
 * and Suspense shows a loading fallback.
 */

import ProductCard from '../components/ProductCard';

const ProductsList = ({ productsResource, setCartList }) => {
  // Read the products from the resource
  // If data is still loading, this throws a promise and Suspense catches it
  const productsList = productsResource.read();

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
