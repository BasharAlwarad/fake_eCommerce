import ProductCard from '../components/ProductCard';

const Cart = ({ cartList, setCartList }) => {
  // NOTE: The Cart component does NOT fetch data on render.
  // Why? Because the cart data is managed by the parent App.jsx component
  // and passed down as a prop. This is called "lifting state up".
  //
  // The cart items come from state that's already in memory (App.jsx),
  // so we don't need to fetch them from an API.

  if (cartList.length === 0) {
    return (
      <div className="min-h-screen bg-base-200 px-6 py-10">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-lg">Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content">
            Shopping Cart
          </h1>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cartList.map((product, index) => (
            <ProductCard
              key={`${product.id}-${index}`}
              product={product}
              setCartList={setCartList}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cart;
