export default function Page() {
	const faqs = [
		{
			q: "How do I place an order?",
			a: "Browse our collection, add items to your cart, and proceed to checkout."
		},
		{
			q: "What payment methods are accepted?",
			a: "We accept all major credit/debit cards, UPI, and net banking."
		},
		{
			q: "How can I track my order?",
			a: "You can track your order status from your account dashboard."
		},
		{
			q: "Is my purchase secure?",
			a: "Yes, we use industry-standard encryption and secure payment gateways."
		},
		{
			q: "Can I return or exchange jewellery?",
			a: "Yes, please refer to our return policy for details."
		},
	];
	return (
		<main className="min-h-screen bg-[#fffaf6] py-10">
			<div className="container mx-auto px-4 max-w-2xl">
				<h1 className="text-3xl font-bold mb-6 text-[#2d1a10]">Frequently Asked Questions</h1>
				<div className="bg-white rounded-xl border p-6 shadow-sm space-y-6">
					{faqs.map((faq, idx) => (
						<div key={idx}>
							<div className="font-semibold text-[#5c4632] mb-1">Q: {faq.q}</div>
							<div className="text-[#7c6a58]">A: {faq.a}</div>
						</div>
					))}
				</div>
			</div>
		</main>
	);
}
