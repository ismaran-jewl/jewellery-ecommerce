"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/useWishlist";
import Link from "next/link";
import { Trash2 } from "lucide-react";

export default function Page() {
	const { wishlist, removeFromWishlist, isLoaded } = useWishlist();

	if (!isLoaded) return <main className="min-h-screen bg-[#f8fafc] py-10"><div className="container mx-auto px-4">Loading wishlist...</div></main>;

	return (
		<main className="min-h-screen bg-[#f8fafc] py-10">
			<div className="container mx-auto px-4 max-w-3xl">
				<h1 className="text-3xl font-bold mb-6 text-[#2d1a10]">Your Wishlist ({wishlist.length})</h1>
				{wishlist.length === 0 ? (
					<div className="text-[#7c6a58]">Your wishlist is empty.</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
						{wishlist.map((product) => (
							<Card key={product.id} className="bg-[#fff0e5] border-[#ffdab9]">
								<CardHeader>
									<img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-2 border" loading="lazy" />
									<CardTitle>{product.name}</CardTitle>
									<CardDescription className="capitalize text-xs text-[#a78b71]">{product.material} {product.type}</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="text-[#5c4632] font-medium mb-2">₹{product.price.toLocaleString()}</div>
								</CardContent>
								<CardFooter>
									<div className="flex gap-2 w-full">
										<Button className="flex-1" variant="default" asChild>
											<Link href={`/product/${product.id}`}>View Details</Link>
										</Button>
										<Button variant="outline" size="icon" onClick={() => removeFromWishlist(product.id)}>
											<Trash2 className="w-4 h-4 text-red-500" />
										</Button>
									</div>
								</CardFooter>
							</Card>
						))}
					</div>
				)}
			</div>
		</main>
	);
}
