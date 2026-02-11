"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Royal Gold Necklace",
      price: 24999,
      image: "/images/product1.jpg",
      quantity: 1,
    },
    {
      id: 2,
      name: "Diamond Stud Earrings",
      price: 12499,
      image: "/images/product2.jpg",
      quantity: 1,
    },
  ]);

  const updateQuantity = (id, amount) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="bg-[#0a0a0a] text-white min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="py-20 text-center border-b border-[#C59D5F]/20">
        <h1 className="text-4xl md:text-6xl font-serif text-[#C59D5F] tracking-wide">
          Your Cart
        </h1>
        <p className="mt-4 text-neutral-400">
          Review your selected pieces before checkout.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
        
        {/* LEFT: Cart Items */}
        <div className="md:col-span-2 space-y-8">
          {cartItems.length === 0 ? (
            <p className="text-neutral-400">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-6 border-b border-neutral-800 pb-6"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-32 h-32 object-cover rounded-lg"
                />

                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-[#C59D5F] mt-1">
                      ₹{item.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-neutral-700 rounded">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-3 py-1 hover:bg-neutral-800"
                      >
                        -
                      </button>
                      <span className="px-4">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-3 py-1 hover:bg-neutral-800"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-neutral-400 hover:text-red-500 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT: Summary */}
        <div className="bg-[#111] p-8 rounded-xl border border-[#C59D5F]/20 h-fit">
          <h2 className="text-xl font-serif text-[#C59D5F] mb-6">
            Order Summary
          </h2>

          <div className="flex justify-between mb-4 text-neutral-300">
            <span>Subtotal</span>
            <span>₹{total.toLocaleString()}</span>
          </div>

          <div className="flex justify-between mb-4 text-neutral-300">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <div className="border-t border-neutral-700 my-4" />

          <div className="flex justify-between text-lg font-medium">
            <span>Total</span>
            <span className="text-[#C59D5F]">
              ₹{total.toLocaleString()}
            </span>
          </div>

          <Button className="mt-8 w-full bg-[#C59D5F] text-black hover:bg-[#b88a45] transition">
            Proceed to Checkout
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
