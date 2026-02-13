import { Button } from "@/components/ui/button";

export default function Page() {
	return (
		<main className="min-h-screen bg-[#f8fafc] py-10">
			<div className="container mx-auto px-4 max-w-2xl">
				<h1 className="text-3xl font-bold mb-6 text-[#2d1a10]">Contact Us</h1>
				<form className="bg-white rounded-xl border p-6 shadow-sm space-y-4 mb-6">
					<div>
						<label className="block mb-1 font-medium">Name</label>
						<input className="w-full border rounded px-3 py-2" type="text" placeholder="Your name" required />
					</div>
					<div>
						<label className="block mb-1 font-medium">Email</label>
						<input className="w-full border rounded px-3 py-2" type="email" placeholder="Your email" required />
					</div>
					<div>
						<label className="block mb-1 font-medium">Message</label>
						<textarea className="w-full border rounded px-3 py-2" rows={4} placeholder="Your message" required />
					</div>
					<Button className="w-full mt-2" variant="default">Send Message</Button>
				</form>
				<div className="text-[#7c6a58] text-sm">
					<div><b>Email:</b> support@jewellery-ecommerce.com</div>
					<div><b>Phone:</b> +91 98765 43210</div>
					<div><b>Address:</b> 123, Rose Villa, MG Road, Mumbai, 400001</div>
				</div>
			</div>
		</main>
	);
}
