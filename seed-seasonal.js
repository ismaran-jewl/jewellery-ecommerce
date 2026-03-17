import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" }); // Ensure correct config path

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/jewellery-ecommerce";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    type: { type: String, required: true },
    material: { type: String, required: true },
    gender: { type: String, enum: ["Women", "Men", "Unisex"], default: "Women" },
    homepageSections: {
      type: [String],
      enum: ["Featured", "Seasonal", "VoiceGift", "Modern Minimalist", "The Bridal Suite", "Royal Heritage"],
      default: [],
    },
    image: { type: String, required: true },
    stock: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true, strict: false }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const items = [
  { type: "Rings", src: "/images/product1.jpg", label: "New Arrival", name: "Seasonal Solitaire Ring" },
  { type: "Necklaces", src: "/videos/product1.mp4", label: "Live Demo", name: "Dynamic Glow Necklace" },
  { type: "Earrings", src: "/images/product2.jpg", label: "Limited Edition", name: "Limited Edition Starlight Earrings" },
  { type: "Bracelets", src: "/images/product3.jpg", label: "Organic", name: "Organic Vine Bracelet" },
  { type: "Necklaces", src: "/videos/product2.mp4", label: "BTS", name: "Behind The Scenes Choker" },
  { type: "Rings", src: "/images/product4.jpg", label: "Best Seller", name: "Best Seller Eternity Ring" },
  { type: "Bracelets", src: "/images/product5.jpg", label: "Trending", name: "Trending Cuff Bracelet" },
  { type: "Earrings", src: "/videos/product3.mp4", label: "Collection", name: "Collection Masterpiece Earrings" },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB.");

    // Remove existing seasonal
    // await Product.deleteMany({ homepageSections: "Seasonal" });

    const inserted = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        let existing = await Product.findOne({ image: item.src });
        if (!existing) {
            existing = new Product({
                name: item.name,
                description: `Experience the pinnacle of our seasonal collection. Designed for the modern silhouette. Features the badge: ${item.label}.`,
                price: 189.0 + i * 10,
                category: "Jewellery",
                type: item.type,
                material: "Gold",
                homepageSections: ["Seasonal"],
                image: item.src,
                stock: 10,
            });
            await existing.save();
            console.log("Saved", item.name);
        } else {
            console.log("Already exists", item.name);
            if (!existing.homepageSections.includes("Seasonal")) {
                existing.homepageSections.push("Seasonal");
                await existing.save();
            }
            if(existing.name !== item.name) {
                existing.name = item.name;
                await existing.save();
            }
        }
        inserted.push(existing);
    }

    console.log("Done seeding seasonal products.");
    process.exit(0);
  } catch(e) {
      console.error(e);
      process.exit(1);
  }
}

seed();
