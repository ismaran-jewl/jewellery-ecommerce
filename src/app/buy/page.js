'use client';

const jewelleryData = [
  {
    id: 1,
    name: "Diamond Ring",
    price: "₹48",
    category: "Ring",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e",
  },
  {
    id: 2,
    name: "Gold Necklace",
    price: "₹72,500",
    category: "Necklace",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0",
  },
  {
    id: 3,
    name: "Pearl Earrings",
    price: "₹19,999",
    category: "Earrings",
    image: "https://images.unsplash.com/photo-1585386959984-a41552231693",
  },
  {
    id: 4,
    name: "Bridal Bangles",
    price: "₹36,750",
    category: "Bangles",
    image: "https://images.unsplash.com/photo-1603575448364-6b4a9bffb4c5",
  },
];

export default function BuyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-white">

      {/* Hero */}
      <section className="px-8 py-20 text-center">
        <h1 className="text-5xl font-bold">
          Sell Your Jewellery with <span className="text-yellow-400">Elegance</span>
        </h1>
        <p className="mt-6 text-lg text-neutral-300 max-w-2xl mx-auto">
          List your premium jewellery and reach trusted buyers instantly.
        </p>
        <button className="mt-8 px-8 py-4 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition">
          Start Selling
        </button>
      </section>

      {/* Products */}
      <section className="px-8 pb-24">
        <h2 className="text-3xl font-semibold mb-10 text-center">
          Featured Jewellery
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {jewelleryData.map((item) => (
            <div
              key={item.id}
              className="bg-neutral-900 rounded-2xl overflow-hidden hover:scale-105 transition shadow-lg"
            >
              <div className="h-60 w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-5">
                <span className="text-sm text-yellow-400">{item.category}</span>
                <h3 className="text-lg font-semibold mt-1">{item.name}</h3>
                <p className="text-xl font-bold mt-2">{item.price}</p>

                <button className="mt-4 w-full py-2 rounded-lg border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition">
                  Sell Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral-900 py-16 text-center">
        <h3 className="text-3xl font-semibold">
          Turn Your Jewellery into Instant Value 💎
        </h3>
        <p className="mt-4 text-neutral-400">
          Secure payments • Transparent pricing • Trusted buyers
        </p>
        <button className="mt-6 px-10 py-4 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition">
          Get Free Valuation
        </button>
      </section>
    </div>
  );
}
