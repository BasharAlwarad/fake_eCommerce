import { use } from 'react';
import { CartContext } from '../contexts/CartContext';

const ProductCard = ({ product }) => {
  const { dispatch } = use(CartContext);
  return (
    <div className="card bg-base-100 shadow-xl">
      <figure className="bg-base-200 p-6">
        <img
          src={product.image}
          alt={product.title}
          className="h-40 w-full object-contain"
          loading="lazy"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title line-clamp-2 text-base">{product.title}</h2>
        <p className="line-clamp-2 text-sm text-base-content/70">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-primary">
            ${product.price}
          </span>
          <div className="badge badge-ghost">{product.category}</div>
        </div>
        <div className="card-actions justify-end">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => dispatch({ type: 'ADD_TO_CART', payload: product })}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
