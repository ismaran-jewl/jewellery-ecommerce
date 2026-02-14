import { Button } from "@/components/ui/button";

export default function Page() {
	return (
		<main className="flex items-center justify-center">
			<div className="bg-white rounded-xl border p-8 shadow-md max-w-sm w-full">
				<h1 className="text-2xl font-bold mb-6 text-[#2d1a10]">Forgot Password</h1>
				<form className="space-y-4">
					<div>
						<label className="block mb-1 font-medium">Email</label>
						<input className="w-full border rounded px-3 py-2" type="email" placeholder="Enter your email" required />
					</div>
					<Button className="w-full mt-2" variant="default">Reset Password</Button>
				</form>
				<div className="flex justify-between mt-4 text-sm">
					<a href="/login" className="text-blue-600 underline">Back to Login</a>
				</div>
			</div>
		</main>
	);
}
