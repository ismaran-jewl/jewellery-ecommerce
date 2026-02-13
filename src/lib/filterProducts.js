export function applyFilters(products, searchParams, routeCategory) {
  let filtered = [...products];

  // Route category (from dynamic URL)
  if (routeCategory) {
    filtered = filtered.filter(
      (product) => product.category === routeCategory
    );
  }

  // Sidebar category
  if (searchParams?.category) {
    filtered = filtered.filter(
      (product) => product.category === searchParams.category
    );
  }

  // Price filtering
  if (searchParams?.price) {
    const price = searchParams.price;

    if (price === "0-10000") {
      filtered = filtered.filter((p) => p.price <= 10000);
    }

    if (price === "10000-50000") {
      filtered = filtered.filter(
        (p) => p.price >= 10000 && p.price <= 50000
      );
    }

    if (price === "50000+") {
      filtered = filtered.filter((p) => p.price >= 50000);
    }
  }

  return filtered;
}
