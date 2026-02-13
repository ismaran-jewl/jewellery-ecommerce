// Product feature logic
export const productSlice = {
  state: {
    products: [],
    selectedProduct: null,
    filters: {},
  },
};

// useProduct hook
export const useProduct = () => {
  const products = [];
  const selectedProduct = null;

  const fetchProductById = (id) => {
    console.log(`Fetching product with id: ${id}`);
  };

  const applyRating = (productId, rating) => {
    console.log(`Applied rating ${rating} to product ${productId}`);
  };

  const getReviews = (productId) => {
    console.log(`Fetching reviews for product ${productId}`);
  };

  return {
    products,
    selectedProduct,
    fetchProductById,
    applyRating,
    getReviews,
  };
};

export default useProduct;
