const mongoose = require('mongoose');
const fs = require('fs');

const MONGODB_URI = "mongodb://localhost:27017/jewellery-ecommerce";

// Define a minimal schema to extract the data
const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.models.Product || mongoose.model("Product", productSchema, "products");

async function exportProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to local database.");

    const products = await Product.find().lean();
    console.log(`Found ${products.length} products.`);

    fs.writeFileSync('local-products.json', JSON.stringify(products, null, 2));
    console.log("Successfully exported to local-products.json");

  } catch (error) {
    console.error("Error exporting products:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database.");
  }
}

exportProducts();
