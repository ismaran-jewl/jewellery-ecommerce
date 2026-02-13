import { Button } from "@/components/ui/button";

// Dummy addresses data
const addresses = [
	{
		id: 1,
		name: "Priya Sharma",
		address: "123, Rose Villa, MG Road, Mumbai, 400001",
		phone: "9876543210",
	},
	{
		id: 2,
		name: "Priya Sharma",
		address: "Flat 12B, Lotus Residency, Pune, 411045",
		phone: "9876543210",
	},
];

export default function Page() {
	return (
		<main className="min-h-screen bg-[#fffaf6] py-10">
			<div className="container mx-auto px-4 max-w-2xl">
				<h1 className="text-3xl font-bold mb-6 text-[#2d1a10]">My Addresses</h1>
				{addresses.length === 0 ? (
					<div className="text-[#7c6a58]">No addresses found.</div>
				) : (
					<div className="space-y-6">
						{addresses.map((addr) => (
							<div key={addr.id} className="bg-white rounded-xl border p-6 shadow-sm flex flex-col gap-2">
								<div className="font-semibold">{addr.name}</div>
								<div className="text-[#7c6a58]">{addr.address}</div>
								<div className="text-[#5c4632]">Phone: {addr.phone}</div>
								<div className="flex gap-2 mt-2">
									<Button size="sm" variant="outline">Edit</Button>
									<Button size="sm" variant="destructive">Delete</Button>
								</div>
							</div>
						))}
					</div>
				)}
				<Button className="w-full mt-8" variant="default">Add New Address</Button>
			</div>
		</main>
	);
}
