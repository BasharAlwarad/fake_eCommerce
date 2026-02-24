import ProductCard from '../components/ProductCard';

/**
 * PRESENTATIONAL COMPONENT - No data fetching
 *
 * Cart data comes from App.jsx state (cartList prop),
 * not from an API. This is state lifting - state lives
 * in the parent and is passed down to children.
 */
const Cart = ({ cartList, setCartList }) => {
  // Show empty state if no items in cart
  if (cartList.length === 0) {
    return (
      <div className="min-h-screen bg-base-200 px-6 py-10">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-lg">Your cart is empty</p>
        </div>
      </div>
    );
  }

  // Show cart items if cart has products
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
