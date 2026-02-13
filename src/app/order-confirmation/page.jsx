import { Button } from "@/components/ui/button";

export default function Page() {
	return (
		<main className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
			<div className="bg-white rounded-xl border p-8 shadow-md max-w-md w-full text-center">
				<h1 className="text-3xl font-bold mb-4 text-green-700">Order Confirmed!</h1>
				<p className="text-[#5c4632] mb-6">Thank you for your purchase. Your order has been placed successfully. You will receive a confirmation email soon.</p>
				<Button variant="default" asChild>
					<a href="/shop">Continue Shopping</a>
				</Button>
			</div>
		</main>
	);
}
