import { use } from 'react';
import { CartContext } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';

const Cart = () => {
  const { cartList } = use(CartContext);
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cartList.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default Cart;
