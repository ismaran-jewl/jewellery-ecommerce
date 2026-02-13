import { products } from "@/data/products";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import HomeLayout from "@/components/layout/home/layout";

export default function Page() {
    return (
        <>
            <HomeLayout>
                <main className="min-h-screen bg-gradient-to-br from-[#fffaf6] to-[#f1e6e1]">
                    <section className="py-16 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[#2d1a10]">Luxury Jewellery for Every Occasion</h1>
                        <p className="text-lg md:text-2xl text-[#7c6a58] mb-8">Discover timeless elegance and modern designs.</p>
                        <Button className="px-8 py-4 text-lg" variant="default" asChild>
                            <a href="/shop">Shop Now</a>
                        </Button>
                    </section>
                    <section className="container mx-auto px-4 py-12">
                        <h2 className="text-2xl font-semibold mb-6 text-[#2d1a10]">Featured Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {products.slice(0, 4).map((product) => (
                                <Card key={product.id}>
                                    <CardHeader>
                                        <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-2 border" loading="lazy" />
                                        <CardTitle>{product.name}</CardTitle>
                                        <CardDescription className="capitalize text-xs text-[#a78b71]">{product.material} {product.type}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-[#5c4632] font-medium mb-2">₹{product.price.toLocaleString()}</div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full" variant="default" asChild>
                                            <a href={`/product/${product.id}`}>View Details</a>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </section>
                </main>
            </HomeLayout>

        </>
    );
}
