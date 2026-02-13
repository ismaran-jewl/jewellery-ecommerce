// Product filtering
export const filtersSlice = {
  state: {
    activeFilters: {},
    availableFilters: {},
  },
};

// useFilters hook
export const useFilters = () => {
  const activeFilters = {};
  const availableFilters = {
    category: ['women', 'men', 'engagement', 'wedding'],
    type: ['ring', 'necklace', 'bracelet', 'earrings', 'chain'],
    material: ['gold', 'silver', 'diamond', 'platinum'],
    priceRange: [0, 150000],
  };

  const applyFilter = (filterName, filterValue) => {
    console.log(`Applied filter: ${filterName} = ${filterValue}`);
  };

  const removeFilter = (filterName) => {
    console.log(`Removed filter: ${filterName}`);
  };

  const clearAllFilters = () => {
    console.log("All filters cleared");
  };

  const getFilteredProducts = (products) => {
    console.log("Filtering products with active filters");
  };

  return {
    activeFilters,
    availableFilters,
    applyFilter,
    removeFilter,
    clearAllFilters,
    getFilteredProducts,
  };
};

export default useFilters;
