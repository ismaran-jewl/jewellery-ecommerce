import { products } from "@/data/products";
import { Button } from "@/components/ui/button";

// Dummy cart data
const cart = [
	{ id: 1, qty: 1 },
	{ id: 3, qty: 2 },
];
const cartItems = cart.map((item) => {
	const product = products.find((p) => p.id === item.id);
	return { ...product, qty: item.qty };
});
const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

export default function Page() {
	return (
		<main className="min-h-screen bg-[#fffaf6] py-10">
			<div className="container mx-auto px-4 max-w-3xl">
				<h1 className="text-3xl font-bold mb-6 text-[#2d1a10]">Checkout</h1>
				<form className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div className="space-y-4">
						<div>
							<label className="block mb-1 font-medium">Full Name</label>
							<input className="w-full border rounded px-3 py-2" placeholder="Enter your name" required />
						</div>
						<div>
							<label className="block mb-1 font-medium">Address</label>
							<input className="w-full border rounded px-3 py-2" placeholder="Enter your address" required />
						</div>
						<div>
							<label className="block mb-1 font-medium">City</label>
							<input className="w-full border rounded px-3 py-2" placeholder="Enter your city" required />
						</div>
						<div>
							<label className="block mb-1 font-medium">Pincode</label>
							<input className="w-full border rounded px-3 py-2" placeholder="Enter pincode" required />
						</div>
						<div>
							<label className="block mb-1 font-medium">Phone</label>
							<input className="w-full border rounded px-3 py-2" placeholder="Enter phone number" required />
						</div>
					</div>
					<div className="bg-white rounded-xl border p-6 shadow-sm flex flex-col gap-4">
						<h2 className="text-xl font-semibold mb-2">Order Summary</h2>
						<ul className="divide-y">
							{cartItems.map((item) => (
								<li key={item.id} className="py-2 flex justify-between">
									<span>{item.name} x {item.qty}</span>
									<span>₹{(item.price * item.qty).toLocaleString()}</span>
								</li>
							))}
						</ul>
						<div className="flex justify-between font-bold text-lg mt-4">
							<span>Total:</span>
							<span>₹{total.toLocaleString()}</span>
						</div>
						<Button className="w-full mt-4" variant="default" asChild>
							<a href="/order-confirmation">Place Order</a>
						</Button>
					</div>
				</form>
			</div>
		</main>
	);
}
