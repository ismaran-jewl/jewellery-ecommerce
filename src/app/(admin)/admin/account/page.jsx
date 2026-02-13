import { Button } from "@/components/ui/button";

// Dummy user info
const user = {
	name: "Priya Sharma",
	email: "priya@example.com",
};

export default function Page() {
	return (
		<main className="min-h-screen bg-[#fffaf6] py-10">
			<div className="container mx-auto px-4 max-w-xl">
				<h1 className="text-3xl font-bold mb-6 text-[#2d1a10]">My Account</h1>
				<div className="bg-white rounded-xl border p-6 shadow-sm mb-8">
					<div className="mb-2 text-lg font-semibold">{user.name}</div>
					<div className="mb-4 text-[#7c6a58]">{user.email}</div>
					<div className="flex gap-4">
						<Button variant="default" asChild>
							<a href="/account/orders">My Orders</a>
						</Button>
						<Button variant="outline" asChild>
							<a href="/account/addresses">My Addresses</a>
						</Button>
					</div>
				</div>
				<Button className="w-full" variant="destructive">Logout</Button>
			</div>
		</main>
	);
}
