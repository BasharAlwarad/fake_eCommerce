import { useState, createContext } from 'react';

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartList, setCartList] = useState([]);

  return (
    <CartContext value={{ cartList, setCartList }}>{children}</CartContext>
  );
};

export { CartContext, CartProvider };
