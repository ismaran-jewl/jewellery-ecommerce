import { products } from "@/data/products";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Page({ params }) {
	const id = Number(params?.id);
	const product = products.find((p) => p.id === id);
	if (!product) {
		return (
			<main className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
					<a href="/shop" className="text-blue-600 underline">Back to Shop</a>
				</div>
			</main>
		);
	}
	return (
		<main className="min-h-screen bg-[#fffaf6] py-12">
			<div className="container mx-auto px-4 max-w-2xl">
				<Card>
					<CardHeader>
						<img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-lg mb-2 border" loading="lazy" />
						<CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
						<CardDescription className="capitalize text-[#a78b71]">{product.material} {product.type}</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-[#5c4632] font-semibold text-xl mb-2">₹{product.price.toLocaleString()}</div>
						<div className="text-[#7c6a58] mb-4">Premium jewellery for every occasion.</div>
					</CardContent>
					<CardFooter>
						<Button className="w-full" variant="default">Buy Now</Button>
					</CardFooter>
				</Card>
			</div>
		</main>
	);
}
