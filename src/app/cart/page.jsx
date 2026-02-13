"use client";

import { products } from "@/data/products";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Page() {
	const { cart, updateQty, removeFromCart, isLoaded } = useCart();

	const cartItems = cart.map((item) => {
		const product = products.find((p) => p.id === item.id);
		return product ? { ...product, qty: item.qty } : null;
	}).filter(Boolean);

	const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

	if (!isLoaded) return <main className="min-h-screen bg-[#f8fafc] py-10"><div className="container mx-auto px-4">Loading cart...</div></main>;

	return (
		<main className="min-h-screen bg-[#f8fafc] py-10 relative overflow-hidden">
			{/* Background Motion */}
			<div className="absolute inset-0 z-0 pointer-events-none">
				<motion.div
					animate={{
						scale: [1, 1.2, 1],
						rotate: [0, 90, 0],
						x: [0, 50, 0]
					}}
					transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
					className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-[#F5FFFA] rounded-full blur-[120px] opacity-40"
				/>
				<motion.div
					animate={{
						scale: [1, 1.3, 1],
						y: [0, 100, 0]
					}}
					transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
					className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#FFDAB9]/20 rounded-full blur-[150px]"
				/>
			</div>

			<div className="container mx-auto px-4 max-w-2xl relative z-10">
				<h1 className="text-3xl font-bold mb-6 text-[#2d1a10]">Your Cart</h1>
				{cartItems.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16 text-center">
						<motion.div
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ duration: 0.5 }}
							className="bg-white p-6 rounded-full shadow-lg mb-6"
						>
							<ShoppingBag className="w-12 h-12 text-[#C59D5F]" />
						</motion.div>
						<h2 className="text-2xl font-serif font-bold text-[#2d1a10] mb-2">Your Cart is Empty</h2>
						<p className="text-[#7c6a58] mb-8 max-w-md">Looks like you haven't added any exquisite pieces to your collection yet.</p>
						<Button asChild className="bg-[#2d1a10] hover:bg-[#4a2c1d] text-white px-8 py-6 rounded-full text-lg group transition-all duration-300 hover:shadow-xl">
							<Link href="/shop" className="flex items-center gap-2">Shop for Elegance <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Link>
						</Button>
					</div>
				) : (
					<div className="space-y-6">
						{cartItems.map((item) => (
							<Card key={item.id} className="flex flex-col sm:flex-row items-center gap-4 p-4">
								<img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg border" />
								<div className="flex-1 text-center sm:text-left">
									<CardTitle>{item.name}</CardTitle>
									<CardDescription className="capitalize text-xs text-[#a78b71]">{item.material} {item.type}</CardDescription>
									<div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
										<Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQty(item.id, -1)}>
											<Minus className="w-3 h-3" />
										</Button>
										<span className="w-8 text-center text-[#5c4632] font-medium">{item.qty}</span>
										<Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQty(item.id, 1)}>
											<Plus className="w-3 h-3" />
										</Button>
										<Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => removeFromCart(item.id)}>
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>
								</div>
								<div className="text-right">
									<div className="text-[#5c4632] font-semibold">₹{(item.price * item.qty).toLocaleString()}</div>
								</div>
							</Card>
						))}
						<div className="flex justify-between items-center mt-6">
							<span className="text-xl font-bold text-[#2d1a10]">Total:</span>
							<span className="text-xl font-bold text-[#2d1a10]">₹{total.toLocaleString()}</span>
						</div>
						<Button className="w-full mt-4" variant="default" asChild>
							<a href="/checkout">Proceed to Checkout</a>
						</Button>
					</div>
				)}
			</div>
		</main>
	);
}
