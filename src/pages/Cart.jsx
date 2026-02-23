import ProductCard from '../components/ProductCard';

const Cart = ({ cartList, setCartList }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cartList.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          setCartList={setCartList}
        />
      ))}
    </div>
  );
};

export default Cart;
