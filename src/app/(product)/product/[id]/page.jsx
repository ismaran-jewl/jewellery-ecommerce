import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductClient from "./ProductClient";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { id } = await params;
  await dbConnect();
  const product = await Product.findById(id).lean();

  if (!product) {
    return {
      title: "Product Not Found | Jewellery Store",
    };
  }

  return {
    title: `${product.name} | Premium ${product.category} | Jewellery Store`,
    description: product.description || `Exquisite ${product.name} handcrafted in ${product.material}. Shop premium jewellery online.`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function Page({ params }) {
  const { id } = await params;
  await dbConnect();
  
  const rawProduct = await Product.findById(id).lean();

  if (!rawProduct) {
    notFound();
  }

  // Convert MongoDB object to plain object for client component
  const product = {
    ...rawProduct,
    _id: rawProduct._id.toString(),
    createdAt: rawProduct.createdAt?.toISOString(),
    updatedAt: rawProduct.updatedAt?.toISOString(),
  };

  return <ProductClient product={product} id={id} />;
}
