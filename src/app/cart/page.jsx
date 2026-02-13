import { products } from "@/data/products";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Dummy cart data (ids and qty)
const cart = [
	{ id: 1, qty: 1 },
	{ id: 3, qty: 2 },
];

export default function Page() {
	const cartItems = cart.map((item) => {
		const product = products.find((p) => p.id === item.id);
		return { ...product, qty: item.qty };
	});
	const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
	return (
		<main className="min-h-screen bg-[#f8fafc] py-10">
			<div className="container mx-auto px-4 max-w-2xl">
				<h1 className="text-3xl font-bold mb-6 text-[#2d1a10]">Your Cart</h1>
				{cartItems.length === 0 ? (
					<div className="text-[#7c6a58]">Your cart is empty.</div>
				) : (
					<div className="space-y-6">
						{cartItems.map((item) => (
							<Card key={item.id} className="flex flex-row items-center gap-4 p-4">
								<img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg border" />
								<div className="flex-1">
									<CardTitle>{item.name}</CardTitle>
									<CardDescription className="capitalize text-xs text-[#a78b71]">{item.material} {item.type}</CardDescription>
									<div className="text-[#5c4632] font-medium">Qty: {item.qty}</div>
									<div className="text-[#5c4632] font-semibold">₹{(item.price * item.qty).toLocaleString()}</div>
								</div>
							</Card>
						))}
						<div className="flex justify-between items-center mt-6">
							<span className="text-xl font-bold text-[#2d1a10]">Total:</span>
							<span className="text-xl font-bold text-[#2d1a10]">₹{total.toLocaleString()}</span>
						</div>
						<Button className="w-full mt-4" variant="default" asChild>
							<a href="/checkout">Proceed to Checkout</a>
						</Button>
					</div>
				)}
			</div>
		</main>
	);
}
