import { Button } from "@/components/ui/button";

// Dummy orders data
const orders = [
	{
		id: "ORD1234",
		date: "2026-02-10",
		total: 48000,
		status: "Delivered",
		items: [
			{ name: "Classic Gold Ring", qty: 1 },
			{ name: "Gold Chain Necklace", qty: 1 },
		],
	},
	{
		id: "ORD1235",
		date: "2026-01-22",
		total: 18000,
		status: "Shipped",
		items: [
			{ name: "Diamond Solitaire Ring", qty: 1 },
		],
	},
];

export default function Page() {
	return (
		<main className="min-h-screen bg-[#f8fafc] py-10">
			<div className="container mx-auto px-4 max-w-2xl">
				<h1 className="text-3xl font-bold mb-6 text-[#2d1a10]">My Orders</h1>
				{orders.length === 0 ? (
					<div className="text-[#7c6a58]">You have no orders yet.</div>
				) : (
					<div className="space-y-6">
						{orders.map((order) => (
							<div key={order.id} className="bg-white rounded-xl border p-6 shadow-sm">
								<div className="flex justify-between items-center mb-2">
									<span className="font-semibold">Order #{order.id}</span>
									<span className="text-sm text-[#7c6a58]">{order.date}</span>
								</div>
								<div className="mb-2 text-[#5c4632]">Status: <span className="font-medium">{order.status}</span></div>
								<ul className="mb-2 text-sm text-[#7c6a58]">
									{order.items.map((item, idx) => (
										<li key={idx}>{item.name} x {item.qty}</li>
									))}
								</ul>
								<div className="font-bold text-lg mb-2">Total: ₹{order.total.toLocaleString()}</div>
								<Button variant="outline" size="sm">View Details</Button>
							</div>
						))}
					</div>
				)}
			</div>
		</main>
	);
}
