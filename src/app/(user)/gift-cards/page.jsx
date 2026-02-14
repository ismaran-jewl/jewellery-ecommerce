import { Button } from "@/components/ui/button";

export default function Page() {
	const cards = [
		{ value: 1000, desc: "Perfect for birthdays and special occasions." },
		{ value: 5000, desc: "Gift luxury with a higher value card." },
		{ value: 10000, desc: "The ultimate gift for loved ones." },
	];
	return (
		<main className="min-h-screen bg-[#f8fafc] py-10">
			<div className="container mx-auto px-4 max-w-2xl">
				<h1 className="text-3xl font-bold mb-6 text-[#2d1a10]">Gift Cards</h1>
				<div className="space-y-6">
					{cards.map((card, idx) => (
						<div key={idx} className="bg-white rounded-xl border p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-2">
							<div>
								<div className="font-semibold text-lg text-[#5c4632] mb-1">₹{card.value.toLocaleString()}</div>
								<div className="text-[#7c6a58]">{card.desc}</div>
							</div>
							<Button variant="default">Buy Gift Card</Button>
						</div>
					))}
				</div>
			</div>
		</main>
	);
}
