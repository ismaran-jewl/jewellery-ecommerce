"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/data/products";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProductFilters from "@/components/product/ProductFilters";
import { useFilters } from "@/features/filters/useFilters";
import { Heart, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function Page() {
	return (
		<Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">Loading...</div>}>
			<ShopContent />
		</Suspense>
	);
}

function ShopContent() {
	const { availableFilters, clearAllFilters } = useFilters();
	const [localFilters, setLocalFilters] = useState({});
	const [searchQuery, setSearchQuery] = useState("");
	const searchParams = useSearchParams();

	useEffect(() => {
		const category = searchParams.get("category");
		const search = searchParams.get("search");

		if (category) {
			setLocalFilters((prev) => ({ ...prev, category: [category] }));
		} else {
			// If no category param, ensure we don't have a stale category filter if navigating back to shop
			setLocalFilters((prev) => {
				const next = { ...prev };
				delete next.category;
				return next;
			});
		}

		if (search) {
			setSearchQuery(search);
		} else {
			setSearchQuery("");
		}
	}, [searchParams]);

	const handleFilterChange = (filterType, filterValue, isChecked) => {
		setLocalFilters((prev) => {
			const updatedFilters = { ...prev };
			if (!updatedFilters[filterType]) {
				updatedFilters[filterType] = [];
			}
			if (isChecked) {
				updatedFilters[filterType].push(filterValue);
			} else {
				updatedFilters[filterType] = updatedFilters[filterType].filter((v) => v !== filterValue);
			}
			return updatedFilters;
		});
	};

	const handleClearFilters = () => {
		setLocalFilters({});
		setSearchQuery("");
		clearAllFilters();
	};

	const addToCart = (e, product) => {
		e.preventDefault();
		toast.success(`Added ${product.name} to cart`);
	};

	const toggleWishlist = (e, product) => {
		e.preventDefault();
		toast.success(`Added ${product.name} to wishlist`);
	};

	const filteredProducts = useMemo(() => {
		return products.filter((product) => {
			// Search filter
			if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
				return false;
			}

			// Category filter
			if (localFilters.category && localFilters.category.length > 0) {
				if (!localFilters.category.includes(product.category)) {
					return false;
				}
			}

			// Type filter
			if (localFilters.type && localFilters.type.length > 0) {
				if (!localFilters.type.includes(product.type)) {
					return false;
				}
			}

			// Material filter
			if (localFilters.material && localFilters.material.length > 0) {
				if (!localFilters.material.includes(product.material)) {
					return false;
				}
			}

			return true;
		});
	}, [localFilters, searchQuery]);

	return (
		<main className="min-h-screen bg-[#f8fafc] py-10">
			<div className="container mx-auto px-4">
				<h1 className="text-3xl font-bold mb-6 text-[#2d1a10]">Shop Jewellery</h1>

				{/* Search Bar */}
				<div className="mb-8">
					<input
						type="text"
						placeholder="Search products..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full max-w-md border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5c4632]"
					/>
				</div>

				<div className="flex flex-col md:flex-row gap-8">
					{/* Filters Sidebar */}
					<ProductFilters
						availableFilters={availableFilters}
						onFilterChange={handleFilterChange}
						onClearFilters={handleClearFilters}
					/>

					{/* Products Grid */}
					<div className="flex-1">
						<div className="mb-4 text-[#7c6a58]">
							Showing {filteredProducts.length} of {products.length} products
						</div>
						{filteredProducts.length === 0 ? (
							<div className="text-center text-[#7c6a58] py-12">
								No products found matching your filters.
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
								{filteredProducts.map((product) => (
									<Card key={product.id} className="hover:shadow-lg transition-shadow relative group">
										<button
											className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 z-10"
											onClick={(e) => toggleWishlist(e, product)}
										>
											<Heart className="w-5 h-5" />
										</button>
										<CardHeader>
											<img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-2 border" loading="lazy" />
											<CardTitle>{product.name}</CardTitle>
											<CardDescription className="capitalize text-xs text-[#a78b71]">{product.material} {product.type}</CardDescription>
										</CardHeader>
										<CardContent>
											<div className="text-[#5c4632] font-medium mb-2">₹{product.price.toLocaleString()}</div>
										</CardContent>
										<CardFooter className="gap-2">
											<Button className="flex-1" variant="default" asChild>
												<Link href={`/product/${product.id}`}>View Details</Link>
											</Button>
											<Button variant="outline" size="icon" onClick={(e) => addToCart(e, product)}>
												<ShoppingCart className="w-4 h-4" />
											</Button>
										</CardFooter>
									</Card>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}
