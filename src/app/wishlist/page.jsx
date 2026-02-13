import { products } from "@/data/products";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Dummy wishlist data (ids)
const wishlist = [2, 4];

export default function Page() {
	const items = wishlist.map((id) => products.find((p) => p.id === id)).filter(Boolean);
	return (
		<main className="min-h-screen bg-[#f8fafc] py-10">
			<div className="container mx-auto px-4 max-w-3xl">
				<h1 className="text-3xl font-bold mb-6 text-[#2d1a10]">Your Wishlist</h1>
				{items.length === 0 ? (
					<div className="text-[#7c6a58]">Your wishlist is empty.</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
						{items.map((product) => (
							<Card key={product.id}>
								<CardHeader>
									<img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-2 border" loading="lazy" />
									<CardTitle>{product.name}</CardTitle>
									<CardDescription className="capitalize text-xs text-[#a78b71]">{product.material} {product.type}</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="text-[#5c4632] font-medium mb-2">₹{product.price.toLocaleString()}</div>
								</CardContent>
								<CardFooter>
									<Button className="w-full" variant="default" asChild>
										<a href={`/product/${product.id}`}>View Details</a>
									</Button>
								</CardFooter>
							</Card>
						))}
					</div>
				)}
			</div>
		</main>
	);
}
