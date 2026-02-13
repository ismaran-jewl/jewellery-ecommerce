export default function Page() {
	const reviews = [
		{
			name: "Amit Verma",
			rating: 5,
			text: "Absolutely loved the diamond ring! Fast delivery and beautiful packaging.",
		},
		{
			name: "Sneha Patel",
			rating: 4,
			text: "Great quality and design. Will shop again!",
		},
		{
			name: "Rahul Singh",
			rating: 5,
			text: "Customer support was very helpful. Highly recommend this store.",
		},
	];
	return (
		<main className="min-h-screen bg-[#fffaf6] py-10">
			<div className="container mx-auto px-4 max-w-2xl">
				<h1 className="text-3xl font-bold mb-6 text-[#2d1a10]">Customer Reviews</h1>
				<div className="space-y-6">
					{reviews.map((review, idx) => (
						<div key={idx} className="bg-white rounded-xl border p-6 shadow-sm">
							<div className="font-semibold text-lg text-[#5c4632] mb-1">{review.name}</div>
							<div className="text-yellow-500 mb-2">{"★".repeat(review.rating)}<span className="text-gray-300">{"★".repeat(5 - review.rating)}</span></div>
							<div className="text-[#7c6a58]">{review.text}</div>
						</div>
					))}
				</div>
			</div>
		</main>
	);
}
