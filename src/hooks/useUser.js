"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useUser() {
	const [user, setUser] = useState(null);
	const [orders, setOrders] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const loadData = () => {
			const savedUser = localStorage.getItem("user");
			const savedOrders = localStorage.getItem("orders");

			if (savedUser) {
				setUser(JSON.parse(savedUser));
			} else {
				// Default demo user
				const defaultUser = { name: "Priya Sharma", email: "priya@example.com" };
				setUser(defaultUser);
				localStorage.setItem("user", JSON.stringify(defaultUser));
			}

			if (savedOrders) {
				setOrders(JSON.parse(savedOrders));
			}
			setIsLoaded(true);
		};

		loadData();

		const handleStorageChange = (e) => {
			if (e.key === "user") setUser(JSON.parse(e.newValue));
			if (e.key === "orders") setOrders(JSON.parse(e.newValue));
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

	const addOrder = (order) => {
		const newOrders = [order, ...orders];
		setOrders(newOrders);
		localStorage.setItem("orders", JSON.stringify(newOrders));
	};

	const logout = () => {
		localStorage.removeItem("user");
		localStorage.removeItem("orders");
		localStorage.removeItem("cart");
		localStorage.removeItem("wishlist");
		setUser(null);
		setOrders([]);
		toast.success("Logged out successfully");
		window.location.href = "/";
	};

	return { user, orders, addOrder, logout, isLoaded };
}