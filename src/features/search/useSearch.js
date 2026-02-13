// Search functionality
export const searchSlice = {
  state: {
    query: '',
    results: [],
    isLoading: false,
  },
};

// useSearch hook
export const useSearch = () => {
  const query = '';
  const results = [];
  const isLoading = false;

  const search = (searchQuery) => {
    console.log(`Searching for: ${searchQuery}`);
  };

  const clearSearch = () => {
    console.log("Search cleared");
  };

  const autocomplete = (input) => {
    console.log(`Autocomplete for: ${input}`);
  };

  return {
    query,
    results,
    isLoading,
    search,
    clearSearch,
    autocomplete,
  };
};

export default useSearch;
