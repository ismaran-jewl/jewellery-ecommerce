"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useCart() {
	const [cart, setCart] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		// Initial load
		const loadCart = () => {
			const savedCart = localStorage.getItem("cart");
			if (savedCart) {
				try {
					setCart(JSON.parse(savedCart));
				} catch (error) {
					console.error("Failed to parse cart", error);
				}
			}
			setIsLoaded(true);
		};

		loadCart();

		// Listen for storage events (cross-tab)
		const handleStorageChange = (e) => {
			if (e.key === "cart") {
				loadCart();
			}
		};

		// Listen for custom events (same-tab)
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
		// Dispatch custom event to notify other components in the same tab
		window.dispatchEvent(new Event("cart-local-update"));
	};

	const addToCart = (product, quantity = 1) => {
		const existingItem = cart.find((item) => item.id === product.id);
		let newCart;
		if (existingItem) {
			newCart = cart.map((item) =>
				item.id === product.id ? { ...item, qty: item.qty + quantity } : item
			);
		} else {
			newCart = [...cart, { id: product.id, qty: quantity }];
		}
		saveCart(newCart);
		toast.success(`Added ${product.name} to cart`);
	};

	const updateQty = (productId, delta) => {
		const newCart = cart.map((item) => {
			if (item.id === productId) {
				return { ...item, qty: Math.max(1, item.qty + delta) };
			}
			return item;
		});
		saveCart(newCart);
	};

	const removeFromCart = (productId) => {
		const newCart = cart.filter((item) => item.id !== productId);
		saveCart(newCart);
		toast.success("Removed from cart");
	};

	const clearCart = () => {
		saveCart([]);
		toast.success("Cart cleared");
	};

	return { cart, addToCart, updateQty, removeFromCart, clearCart, isLoaded };
}