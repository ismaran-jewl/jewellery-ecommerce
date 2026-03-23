const mongoose = require('mongoose');
const fs = require('fs');

async function importProducts() {
  const MONGODB_URI = process.argv[2]; // Gets the URI from the command line argument

  if (!MONGODB_URI) {
    console.error("❌ Please provide your LIVE MONGODB_URI as an argument.");
    console.log("Usage: node import-products.js \"mongodb+srv://YOUR_LIVE_URI\"");
    process.exit(1);
  }

  try {
    console.log("Connecting to LIVE database...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Successfully connected to LIVE database.");

    // Define the schema
    const productSchema = new mongoose.Schema({}, { strict: false });
    const Product = mongoose.models.Product || mongoose.model("Product", productSchema, "products");

    // Read the local products
    console.log("Reading local products from local-products.json...");
    const rawData = fs.readFileSync('local-products.json', 'utf8');
    const localProducts = JSON.parse(rawData);

    if (localProducts.length === 0) {
      console.log("No products found in local-products.json to import.");
      return;
    }

    // Optional: Clear existing live products if we want a strict mirror
    // await Product.deleteMany({});
    // console.log("Cleared old live products.");

    // Import the documents
    console.log(`Starting import of ${localProducts.length} products...`);
    
    // Using bulkWrite for better performance and to handle existing _id's
    const bulkOps = localProducts.map(product => {
      // Create a copy and handle _id mapping
      const copy = { ...product };
      if (copy._id && copy._id.$oid) {
         copy._id = new mongoose.Types.ObjectId(copy._id.$oid);
      }
      
      return {
        updateOne: {
          filter: { _id: copy._id },
          update: { $set: copy },
          upsert: true
        }
      };
    });

    const result = await Product.bulkWrite(bulkOps);
    
    console.log("✅ Import completely successfully!");
    console.log(`Added/Updated ${result.upsertedCount + result.modifiedCount} products.`);

  } catch (error) {
    console.error("❌ Error importing products:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database.");
  }
}

importProducts();
