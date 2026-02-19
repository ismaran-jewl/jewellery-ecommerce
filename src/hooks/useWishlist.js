"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export function useWishlist() {
  const { data: session, status } = useSession();
  const [wishlist, setWishlist] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // =====================================
  // 1️⃣ Load from localStorage ALWAYS
  // =====================================
  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (err) {
        console.error("Wishlist parse error", err);
      }
    }
    setIsLoaded(true);
  }, []);

  // =====================================
  // 2️⃣ If logged in → sync from DB
  // =====================================
  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchWishlist = async () => {
      try {
        const res = await fetch("/api/wishlist");
        if (!res.ok) return;

        const data = await res.json();
        const dbWishlist = data.wishlist.map((item) => item.product);

        setWishlist(dbWishlist);
        localStorage.setItem("wishlist", JSON.stringify(dbWishlist));
      } catch (err) {
        console.error("Wishlist fetch error", err);
      }
    };

    fetchWishlist();
  }, [status]);

  const saveLocal = (newWishlist) => {
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    setWishlist(newWishlist);
  };

  // =====================================
  // 3️⃣ Add
  // =====================================
  const addToWishlist = useCallback(
    async (product) => {
      if (wishlist.some((item) => item._id === product._id)) return;

      const updated = [...wishlist, product];
      saveLocal(updated);
      toast.success("Added to wishlist");

      // Call API ONLY if logged in
      if (status === "authenticated") {
        try {
          await fetch("/api/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: product._id }),
          });
        } catch (err) {
          console.error("DB add failed", err);
        }
      }
    },
    [wishlist, status]
  );

  // =====================================
  // 4️⃣ Remove
  // =====================================
  const removeFromWishlist = useCallback(
    async (productId) => {
      const updated = wishlist.filter((item) => item._id !== productId);
      saveLocal(updated);
      toast.success("Removed from wishlist");

      // Call API ONLY if logged in
      if (status === "authenticated") {
        try {
          await fetch("/api/wishlist", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
          });
        } catch (err) {
          console.error("DB remove failed", err);
        }
      }
    },
    [wishlist, status]
  );

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

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    isLoaded,
  };
}
