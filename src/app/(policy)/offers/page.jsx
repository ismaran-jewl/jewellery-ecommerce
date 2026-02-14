export default function Page() {
	const offers = [
		{
			title: "Valentine's Day Sale",
			desc: "Flat 20% off on all diamond jewellery. Use code: LOVE20",
		},
		{
			title: "Gold Fest",
			desc: "Buy 1 Get 1 Free on select gold rings.",
		},
		{
			title: "Free Shipping",
			desc: "Enjoy free shipping on orders above ₹10,000.",
		},
	];
	return (
		<main className="min-h-screen bg-[#fffaf6] py-10">
			<div className="container mx-auto px-4 max-w-2xl">
				<h1 className="text-3xl font-bold mb-6 text-[#2d1a10]">Current Offers</h1>
				<div className="space-y-6">
					{offers.map((offer, idx) => (
						<div key={idx} className="bg-white rounded-xl border p-6 shadow-sm">
							<div className="font-semibold text-lg text-[#5c4632] mb-1">{offer.title}</div>
							<div className="text-[#7c6a58]">{offer.desc}</div>
						</div>
					))}
				</div>
			</div>
		</main>
	);
}
