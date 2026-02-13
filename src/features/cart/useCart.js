// Cart state management
import { create } from 'zustand'; // Using simple state, can integrate with zustand later

export const cartSlice = {
  state: {
    items: [],
    total: 0,
  },
  addItem: (product, quantity) => {
    // Logic to add item to cart
  },
  removeItem: (productId) => {
    // Logic to remove item from cart
  },
  updateQuantity: (productId, quantity) => {
    // Logic to update item quantity
  },
};

// useCart hook
export const useCart = () => {
  const items = [];
  const addToCart = (product, quantity = 1) => {
    console.log(`Added ${quantity} of ${product.name} to cart`);
  };
  const removeFromCart = (productId) => {
    console.log(`Removed product ${productId} from cart`);
  };
  const updateQuantity = (productId, quantity) => {
    console.log(`Updated quantity for product ${productId} to ${quantity}`);
  };
  const clearCart = () => {
    console.log("Cart cleared");
  };

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};

export default useCart;
