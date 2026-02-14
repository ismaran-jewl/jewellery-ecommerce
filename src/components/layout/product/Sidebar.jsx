"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const FILTER_CONFIG = {
  category: ["Rings", "Necklaces", "Earrings", "Bracelets"],
  material: ["Gold", "Silver", "Platinum", "Diamond"],
  type: ["Traditional", "Modern", "Luxury"]
};

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Only render filters if we are on the shop page
  if (pathname !== "/shop") {
    return (
      <div className="p-6 text-sm text-[#a78b71]">
        Navigate to the Shop to see product filters.
      </div>
    );
  }

  const handleFilterChange = (key, value, checked) => {
    const params = new URLSearchParams(searchParams.toString());
    let currentFilters = params.get(key) ? params.get(key).split(",") : [];

    if (checked) {
      currentFilters.push(value);
    } else {
      currentFilters = currentFilters.filter((v) => v !== value);
    }

    if (currentFilters.length > 0) {
      params.set(key, currentFilters.join(","));
    } else {
      params.delete(key);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAll = () => router.push(pathname);

  return (
    <div className="p-6 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg text-[#2d1a10]">Filters</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearAll}
          className="text-xs hover:bg-red-50 hover:text-red-600"
        >
          Clear All
        </Button>
      </div>

      {Object.entries(FILTER_CONFIG).map(([group, options]) => (
        <div key={group} className="space-y-4">
          <h3 className="font-semibold capitalize text-[#5c4632] border-b pb-2">
            {group}
          </h3>
          <div className="space-y-2">
            {options.map((option) => {
              const isActive = searchParams.get(group)?.split(",").includes(option);
              return (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${group}-${option}`}
                    checked={isActive}
                    onCheckedChange={(checked) => handleFilterChange(group, option, checked)}
                  />
                  <label 
                    htmlFor={`${group}-${option}`} 
                    className="text-sm font-medium leading-none cursor-pointer text-[#7c6a58]"
                  >
                    {option}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}