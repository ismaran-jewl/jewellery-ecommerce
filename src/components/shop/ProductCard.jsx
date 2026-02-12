import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="border rounded-xl p-4 hover:shadow-lg transition"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-lg"
      />
      <h3 className="mt-4 font-semibold">{product.name}</h3>
      <p className="text-[#C59D5F] font-medium">{product.price}</p>
    </Link>
  );
}
