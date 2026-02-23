import { createContext, useReducer } from 'react';

const initialState = [];

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return [...state, action.payload];

    case 'CLEAR_CART':
      state = [];
      return state;

    default:
      return state;
  }
};

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartList, dispatch] = useReducer(cartReducer, initialState);

  return <CartContext value={{ cartList, dispatch }}>{children}</CartContext>;
};

export { CartContext, CartProvider };
