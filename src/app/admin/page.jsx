export default function Page() {
	return (
		<main className="min-h-screen bg-[#f8fafc] py-10">
			<div className="container mx-auto px-4 max-w-2xl">
				<h1 className="text-3xl font-bold mb-6 text-[#2d1a10]">Admin Dashboard</h1>
				<div className="bg-white rounded-xl border p-6 shadow-sm space-y-4">
					<p className="text-[#5c4632]">Welcome, Admin! This dashboard will allow you to manage products, orders, users, and more.</p>
					<ul className="list-disc pl-6 text-[#7c6a58]">
						<li>Product Management (coming soon)</li>
						<li>Order Management (coming soon)</li>
						<li>User Management (coming soon)</li>
						<li>Analytics (coming soon)</li>
					</ul>
				</div>
			</div>
		</main>
	);
}
