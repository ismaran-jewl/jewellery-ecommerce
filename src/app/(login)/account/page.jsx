"use client";

import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { Package } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Page() {
	const { data: session, status } = useSession();

	if (status === "loading") return <div className="min-h-screen flex items-center justify-center bg-[#fffaf6]">Loading...</div>;

	if (!session) return (
		<main className="min-h-screen bg-[#fffaf6] py-10">
			<div className="container mx-auto px-4 text-center">
				<h1 className="text-2xl font-bold mb-4">Please Log In</h1>
				<Button asChild><Link href="/login">Login</Link></Button>
			</div>
		</main>
	);

	return (
		<main className="min-h-screen bg-[#fffaf6] py-10">
			<div className="container mx-auto px-4 max-w-4xl">
				<h1 className="text-3xl font-bold mb-8 text-[#2d1a10]">My Account</h1>
				
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="md:col-span-1 space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Profile</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="font-semibold text-lg">{session.user.name}</div>
								<div className="text-[#7c6a58] mb-4">{session.user.email}</div>
								<Button variant="destructive" className="w-full" onClick={() => signOut()}>
									Logout
								</Button>
							</CardContent>
						</Card>
					</div>

					<div className="md:col-span-2 space-y-8">
						<div>
							<h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
								<Package className="w-5 h-5" /> Order History
							</h2>
							{true ? ( // Replace with actual orders check
								<Card className="p-6 text-center text-[#7c6a58]">
									No orders found.
								</Card>
							) : (
								<div className="space-y-4">
									{/* Orders will be displayed here */}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
