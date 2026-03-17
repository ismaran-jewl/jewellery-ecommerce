import dbConnect from "./src/lib/mongodb.js";
import Product from "./src/models/Product.js";

async function check() {
  await dbConnect();
  const products = await Product.find({ homepageSections: "Modern Minimalist" });
  console.log(JSON.stringify(products, null, 2));
  process.exit(0);
}

check();
