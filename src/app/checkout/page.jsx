"use client";

import { useState } from "react";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, CreditCard, MapPin, Phone, User, Mail, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Page() {
	const { cart, isLoaded, clearCart } = useCart();
	const { addOrder } = useUser();
	const router = useRouter();
	const [isProcessing, setIsProcessing] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState("card");

	const cartItems = cart.map((item) => {
		const product = products.find((p) => p.id === item.id);
		return product ? { ...product, qty: item.qty } : null;
	}).filter(Boolean);

	const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
	const shipping = subtotal > 10000 ? 0 : 500;
	const total = subtotal + shipping;

	const handlePlaceOrder = (e) => {
		e.preventDefault();
		setIsProcessing(true);

		const order = {
			id: `ORD-${Date.now()}`,
			date: new Date().toLocaleDateString(),
			items: cartItems,
			total: total,
			status: "Processing",
		};

		// Simulate API call
		setTimeout(() => {
			setIsProcessing(false);
			addOrder(order);
			clearCart();
			router.push("/order-confirmation");
			toast.success("Order placed successfully!");
		}, 1500);
	};

	if (!isLoaded) {
		return <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] text-[#5c4632]">Loading checkout...</div>;
	}

	if (cartItems.length === 0) {
		return (
			<main className="min-h-screen bg-[#f8fafc] py-20">
				<div className="container mx-auto px-4 text-center max-w-md">
					<div className="mb-6 flex justify-center">
						<div className="h-24 w-24 bg-[#fff0e5] rounded-full flex items-center justify-center">
							<CreditCard className="h-10 w-10 text-[#5c4632]" />
						</div>
					</div>
					<h1 className="text-3xl font-bold mb-4 text-[#2d1a10]">Your cart is empty</h1>
					<p className="text-[#7c6a58] mb-8">Looks like you haven't added any items to your cart yet.</p>
					<Button asChild className="w-full sm:w-auto">
						<Link href="/shop">Start Shopping</Link>
					</Button>
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-[#f8fafc] py-10">
			<div className="container mx-auto px-4 max-w-6xl">
				<div className="mb-8">
					<Link href="/cart" className="text-[#7c6a58] hover:text-[#2d1a10] flex items-center gap-2 text-sm font-medium transition-colors">
						<ArrowLeft className="w-4 h-4" /> Back to Cart
					</Link>
				</div>
				
				<h1 className="text-3xl font-serif font-bold mb-8 text-[#2d1a10]">Checkout</h1>
				
				<form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
					{/* Left Column: Shipping & Payment */}
					<div className="lg:col-span-7 space-y-8">
						{/* Shipping Details */}
						<Card className="border-none shadow-md">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-xl">
									<MapPin className="w-5 h-5 text-[#C59D5F]" /> Shipping Details
								</CardTitle>
							</CardHeader>
							<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2 md:col-span-2">
									<label className="text-sm font-medium text-[#2d1a10]">Full Name</label>
									<div className="relative">
										<User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
										<input className="w-full border rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-[#C59D5F] focus:border-transparent outline-none transition-all" placeholder="John Doe" required />
									</div>
								</div>
								<div className="space-y-2 md:col-span-2">
									<label className="text-sm font-medium text-[#2d1a10]">Email Address</label>
									<div className="relative">
										<Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
										<input type="email" className="w-full border rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-[#C59D5F] focus:border-transparent outline-none transition-all" placeholder="john@example.com" required />
									</div>
								</div>
								<div className="space-y-2 md:col-span-2">
									<label className="text-sm font-medium text-[#2d1a10]">Phone Number</label>
									<div className="relative">
										<Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
										<input type="tel" className="w-full border rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-[#C59D5F] focus:border-transparent outline-none transition-all" placeholder="+91 98765 43210" required minLength={10} pattern="[0-9]{10,}" title="Please enter a valid 10-digit mobile number" />
									</div>
								</div>
								<div className="space-y-2 md:col-span-2">
									<label className="text-sm font-medium text-[#2d1a10]">Address</label>
									<textarea className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#C59D5F] focus:border-transparent outline-none transition-all min-h-[80px]" placeholder="123, Street Name, Area" required />
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium text-[#2d1a10]">City</label>
									<input className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#C59D5F] focus:border-transparent outline-none transition-all" placeholder="Mumbai" required />
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium text-[#2d1a10]">Pincode</label>
									<input className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#C59D5F] focus:border-transparent outline-none transition-all" placeholder="400001" required />
								</div>
							</CardContent>
						</Card>

						{/* Payment Method */}
						<Card className="border-none shadow-md">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-xl">
									<CreditCard className="w-5 h-5 text-[#C59D5F]" /> Payment Method
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div className={`border rounded-lg transition-colors ${paymentMethod === 'card' ? 'border-[#C59D5F] bg-[#fffaf6]' : 'border-gray-200'}`}>
										<label className="flex items-center p-4 cursor-pointer">
											<input type="radio" name="payment" className="w-4 h-4 text-[#C59D5F] focus:ring-[#C59D5F]" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
											<span className="ml-3 font-medium text-[#2d1a10]">Credit / Debit Card</span>
										</label>
										{paymentMethod === 'card' && (
											<div className="px-4 pb-4 space-y-3 animate-in slide-in-from-top-2">
												<input type="text" placeholder="Card Number" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#C59D5F] outline-none" required />
												<div className="grid grid-cols-2 gap-4">
													<input type="text" placeholder="MM/YY" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#C59D5F] outline-none" required />
													<input type="text" placeholder="CVV" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#C59D5F] outline-none" required />
												</div>
											</div>
										)}
									</div>
									<div className={`border rounded-lg transition-colors ${paymentMethod === 'upi' ? 'border-[#C59D5F] bg-[#fffaf6]' : 'border-gray-200'}`}>
										<label className="flex items-center p-4 cursor-pointer">
											<input type="radio" name="payment" className="w-4 h-4 text-[#C59D5F] focus:ring-[#C59D5F]" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
											<span className="ml-3 font-medium text-[#2d1a10]">UPI / Net Banking</span>
										</label>
										{paymentMethod === 'upi' && (
											<div className="px-4 pb-4 animate-in slide-in-from-top-2">
												<input type="text" placeholder="UPI ID (e.g. user@upi)" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#C59D5F] outline-none" required />
											</div>
										)}
									</div>
									<div className={`border rounded-lg transition-colors ${paymentMethod === 'cod' ? 'border-[#C59D5F] bg-[#fffaf6]' : 'border-gray-200'}`}>
										<label className="flex items-center p-4 cursor-pointer">
											<input type="radio" name="payment" className="w-4 h-4 text-[#C59D5F] focus:ring-[#C59D5F]" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
											<span className="ml-3 font-medium text-[#2d1a10]">Cash on Delivery</span>
										</label>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Right Column: Order Summary */}
					<div className="lg:col-span-5">
						<div className="sticky top-24 space-y-6">
							<Card className="border-none shadow-md bg-white">
								<CardHeader className="pb-4 border-b">
									<CardTitle className="text-xl">Order Summary</CardTitle>
									<CardDescription>{cartItems.length} items in your cart</CardDescription>
								</CardHeader>
								<CardContent className="pt-6">
									<ul className="space-y-4 max-h-[300px] overflow-auto pr-2 custom-scrollbar">
										{cartItems.map((item) => (
											<li key={item.id} className="flex gap-4">
												<div className="h-16 w-16 rounded-md border overflow-hidden flex-shrink-0">
													<img src={item.image} alt={item.name} className="h-full w-full object-cover" />
												</div>
												<div className="flex-1 min-w-0">
													<h4 className="text-sm font-medium text-[#2d1a10] truncate">{item.name}</h4>
													<p className="text-xs text-[#7c6a58] capitalize">{item.material} {item.type}</p>
													<div className="flex justify-between items-center mt-1">
														<span className="text-xs text-[#7c6a58]">Qty: {item.qty}</span>
														<span className="text-sm font-medium text-[#5c4632]">₹{(item.price * item.qty).toLocaleString()}</span>
													</div>
												</div>
											</li>
										))}
									</ul>
									
									<div className="mt-6 space-y-3 pt-6 border-t">
										<div className="flex justify-between text-sm text-[#7c6a58]">
											<span>Subtotal</span>
											<span>₹{subtotal.toLocaleString()}</span>
										</div>
										<div className="flex justify-between text-sm text-[#7c6a58]">
											<span>Shipping</span>
											<span>{shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : `₹${shipping}`}</span>
										</div>
										<div className="flex justify-between text-lg font-bold text-[#2d1a10] pt-2">
											<span>Total</span>
											<span>₹{total.toLocaleString()}</span>
										</div>
									</div>
								</CardContent>
								<CardFooter className="flex-col gap-4 bg-[#fffaf6] rounded-b-xl p-6">
									<Button className="w-full h-12 text-lg bg-[#2d1a10] hover:bg-[#4a2c1d]" disabled={isProcessing} type="submit">
										{isProcessing ? "Processing..." : `Pay ₹${total.toLocaleString()}`}
									</Button>
									<div className="flex items-center justify-center gap-4 text-xs text-[#7c6a58]">
										<span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Secure Payment</span>
										<div className="flex items-center gap-1">
											<motion.div animate={{ x: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
												<Truck className="w-3 h-3" />
											</motion.div>
											Fast Delivery
										</div>
									</div>
								</CardFooter>
							</Card>
						</div>
					</div>
				</form>
			</div>
		</main>
	);
}
