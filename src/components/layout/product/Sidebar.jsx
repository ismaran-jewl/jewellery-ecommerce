"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";
import Filters from "@/components/shop/Filters";

const ALL_FILTER_KEYS = ["gender", "category", "type", "material", "maxPrice"];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    types: [],
    materials: [],
    genders: []
  });
  const [loading, setLoading] = useState(false);

  // Fetch filter options from API
  useEffect(() => {
    if (pathname.includes("/shop")) {
      setLoading(true);
      fetch("/api/products/filters")
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            console.error(data.error);
            setFilterOptions({ categories: [], types: [], materials: [], genders: [] });
          } else {
            setFilterOptions(data);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch filters", err);
          setFilterOptions({ categories: [], types: [], materials: [], genders: [] });
          setLoading(false);
        });
    }
  }, [pathname]);

  const getParamValues = useCallback((key) => {
    const val = searchParams.get(key);
    return val ? val.split(",").map(v => v.trim()).filter(Boolean) : [];
  }, [searchParams]);

  const handleParamToggle = useCallback((key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // special handling for maxPrice to make it exclusive (radio behavior)
    if (key === "maxPrice") {
        const current = params.get(key);
        if (current === value) {
            params.delete(key);
        } else {
            params.set(key, value);
        }
    } else {
        const current = getParamValues(key);
        const exists = current.some(v => v.toLowerCase() === value.toLowerCase());
        
        const next = exists 
            ? current.filter(v => v.toLowerCase() !== value.toLowerCase()) 
            : [...current, value];

        if (next.length) params.set(key, next.join(","));
        else params.delete(key);
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, getParamValues, router, pathname]);

  const handleClearAll = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const activeFilters = useMemo(() => {
    const filters = {};
    ALL_FILTER_KEYS.forEach(k => {
        filters[k] = getParamValues(k);
    });
    return filters;
  }, [getParamValues]);

  const activeCount = useMemo(() => 
    Object.values(activeFilters).reduce((sum, vals) => sum + (Array.isArray(vals) ? vals.length : 0), 0),
  [activeFilters]);

  // Only render filters if we are on a shop-related page
  if (!pathname.includes("/shop")) {
    return null;
  }

  if (loading && !filterOptions.categories.length) {
    return <div className="p-8 text-xs font-bold uppercase tracking-widest text-gray-400 animate-pulse">Loading Filters...</div>;
  }

  return (
    <div className="p-4">
      <Filters 
        categories={filterOptions.categories}
        types={filterOptions.types}
        materials={filterOptions.materials}
        activeFilters={activeFilters}
        activeCount={activeCount}
        onToggle={handleParamToggle}
        onClearAll={handleClearAll}
      />
    </div>
  );
}