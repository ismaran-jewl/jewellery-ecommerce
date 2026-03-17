"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useCart() {
	const [cart, setCart] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const loadCart = () => {
			const savedCart = localStorage.getItem("cart");
			if (savedCart) {
				try {
					const parsed = JSON.parse(savedCart);
					setCart(Array.isArray(parsed) ? parsed.filter(Boolean) : []);
				} catch (error) {
					console.error("Failed to parse cart", error);
				}
			}
			setIsLoaded(true);
		};

		loadCart();

		const handleStorageChange = (e) => { if (e.key === "cart") loadCart(); };
		const handleLocalUpdate = () => loadCart();

		window.addEventListener("storage", handleStorageChange);
		window.addEventListener("cart-local-update", handleLocalUpdate);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
			window.removeEventListener("cart-local-update", handleLocalUpdate);
		};
	}, []);

	const saveCart = (newCart) => {
		localStorage.setItem("cart", JSON.stringify(newCart));
		setCart(newCart);
		window.dispatchEvent(new Event("cart-local-update"));
	};

	// ── DB helpers (fire-and-forget — local state is source of truth for UI) ──

	const dbAdd = async (productId, quantity) => {
		try {
			await fetch("/api/cart", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ productId, quantity }),
			});
		} catch {
			// silently fail — local cart still works
		}
	};

	const dbUpdateQty = async (productId, quantity) => {
		try {
			await fetch("/api/cart", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ productId, quantity }),
			});
		} catch {}
	};

	const dbRemove = async (productId) => {
		try {
			await fetch("/api/cart", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ productId }),
			});
		} catch {}
	};

	const dbClear = async () => {
		try {
			await fetch("/api/cart", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ clearAll: true }),
			});
		} catch {}
	};

	// ── Public methods ────────────────────────────────────────

	const addToCart = (product, quantity = 1) => {
		const existingItem = cart.find((item) => item.id === product._id);
		let newCart;
		if (existingItem) {
			newCart = cart.map((item) =>
				item.id === product._id ? { ...item, qty: item.qty + quantity } : item
			);
		} else {
			newCart = [...cart, { id: product._id, qty: quantity }];
		}
		saveCart(newCart);
		dbAdd(product._id, quantity); // save to DB
		toast.success(`Added ${product.name} to cart`);
	};

	const updateQty = (productId, delta) => {
		const item = cart.find((i) => i.id === productId);
		if (!item) return;
		const newQty = Math.max(1, item.qty + delta);
		const newCart = cart.map((i) =>
			i.id === productId ? { ...i, qty: newQty } : i
		);
		saveCart(newCart);
		dbUpdateQty(productId, newQty); // save to DB
	};

	const removeFromCart = (productId) => {
		const newCart = cart.filter((item) => item.id !== productId);
		saveCart(newCart);
		dbRemove(productId); // save to DB
		toast.success("Removed from cart");
	};

	const clearCart = () => {
		saveCart([]);
		dbClear(); // save to DB
		toast.success("Cart cleared");
	};

	const updateItem = (productId, updates) => {
		const newCart = cart.map((item) =>
			item.id === productId ? { ...item, ...updates } : item
		);
		saveCart(newCart);
		// If message is being updated, sync to DB
		if (updates.message !== undefined) {
			fetch("/api/cart", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ productId, message: updates.message }),
			}).catch(() => {});
		}
	};

	return { cart, addToCart, updateQty, removeFromCart, clearCart, updateItem, isLoaded };
}