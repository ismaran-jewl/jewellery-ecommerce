"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { Package, LogOut } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Page() {
	const { user, orders, logout, isLoaded } = useUser();

	if (!isLoaded) return <div className="min-h-screen flex items-center justify-center bg-[#fffaf6]">Loading...</div>;

	if (!user) return (
		<main className="min-h-screen bg-[#fffaf6] py-10">
			<div className="container mx-auto px-4 text-center">
				<h1 className="text-2xl font-bold mb-4">Please Log In</h1>
				<Button asChild><Link href="/">Go Home</Link></Button>
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
								<div className="font-semibold text-lg">{user.name}</div>
								<div className="text-[#7c6a58] mb-4">{user.email}</div>
								<Button variant="destructive" className="w-full" onClick={logout}>
									<LogOut className="w-4 h-4 mr-2" /> Logout
								</Button>
							</CardContent>
						</Card>
					</div>

					<div className="md:col-span-2 space-y-8">
						<div>
							<h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
								<Package className="w-5 h-5" /> Order History
							</h2>
							{orders.length === 0 ? (
								<Card className="p-6 text-center text-[#7c6a58]">
									No orders found.
								</Card>
							) : (
								<div className="space-y-4">
									{orders.map((order) => (
										<Card key={order.id}>
											<CardHeader className="bg-gray-50/50 pb-3">
												<div className="flex justify-between items-center">
													<div>
														<div className="font-semibold">{order.id}</div>
														<div className="text-sm text-[#7c6a58]">{order.date}</div>
													</div>
													<div className="text-right">
														<div className="font-bold text-[#5c4632]">₹{order.total.toLocaleString()}</div>
														<div className="text-sm text-green-600 font-medium">{order.status}</div>
													</div>
												</div>
											</CardHeader>
											<CardContent className="pt-4">
												<div className="space-y-2">
													{order.items.map((item, idx) => (
														<div key={idx} className="flex justify-between text-sm">
															<span>{item.name} <span className="text-[#7c6a58]">x{item.qty}</span></span>
															<span>₹{(item.price * item.qty).toLocaleString()}</span>
														</div>
													))}
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
