"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useWishlist() {
	const [wishlist, setWishlist] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const loadWishlist = () => {
			const savedWishlist = localStorage.getItem("wishlist");
			if (savedWishlist) {
				try {
					setWishlist(JSON.parse(savedWishlist));
				} catch (error) {
					console.error("Failed to parse wishlist", error);
				}
			}
			setIsLoaded(true);
		};

		loadWishlist();

		const handleStorageChange = (e) => {
			if (e.key === "wishlist") {
				loadWishlist();
			}
		};

		const handleLocalUpdate = () => loadWishlist();

		window.addEventListener("storage", handleStorageChange);
		window.addEventListener("wishlist-local-update", handleLocalUpdate);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
			window.removeEventListener("wishlist-local-update", handleLocalUpdate);
		};
	}, []);

	const saveWishlist = (newWishlist) => {
		localStorage.setItem("wishlist", JSON.stringify(newWishlist));
		setWishlist(newWishlist);
		window.dispatchEvent(new Event("wishlist-local-update"));
	};

	const addToWishlist = (product) => {
		if (!wishlist.some((item) => item._id === product._id)) {
			const newWishlist = [...wishlist, product];
			saveWishlist(newWishlist);
			toast.success("Added to wishlist");
		}
	};

	const removeFromWishlist = (productId) => {
		const newWishlist = wishlist.filter((item) => item._id !== productId);
		saveWishlist(newWishlist);
		toast.success("Removed from wishlist");
	};

	const toggleWishlist = (product) => {
		if (wishlist.some((item) => item._id === product._id)) {
			removeFromWishlist(product._id);
		} else {
			addToWishlist(product);
		}
	};

	const isInWishlist = (productId) => {
		return wishlist.some((item) => item._id === productId);
	};

	return { wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, isLoaded };
}