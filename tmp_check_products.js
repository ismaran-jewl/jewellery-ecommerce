
import dbConnect from "./src/lib/mongodb.js";
import Product from "./src/models/Product.js";

async function checkProducts() {
    await dbConnect();
    const products = await Product.find({}).limit(50);
    console.log(JSON.stringify(products.map(p => ({ name: p.name, category: p.category })), null, 2));
    process.exit(0);
}

checkProducts();
