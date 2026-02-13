import { Button } from "@/components/ui/button";

export default function Page() {
	return (
		<main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fffaf6] to-[#f1e6e1] p-4 text-center">
			<div className="space-y-6 max-w-lg">
				<div className="relative">
					<h1 className="text-9xl font-black text-[#2d1a10]/10 select-none">404</h1>
					<div className="absolute inset-0 flex items-center justify-center">
						<h2 className="text-3xl md:text-4xl font-bold text-[#2d1a10]">Page Not Found</h2>
					</div>
				</div>
				
				<p className="text-[#7c6a58] text-lg">
					Oops! The page you are looking for does not exist. It might have been moved or deleted.
				</p>

				<div className="pt-4">
					<Button size="lg" className="min-w-[200px] shadow-md hover:shadow-xl transition-all" asChild>
						<a href="/">Go to Home</a>
					</Button>
				</div>
			</div>
		</main>
	);
}
