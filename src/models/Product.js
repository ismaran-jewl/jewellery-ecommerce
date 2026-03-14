import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    material: {
      type: String,
      required: true,
    },
    // NEW: gender field — store exactly "Women", "Men", or "Unisex"
    gender: {
      type: String,
      enum: ["Women", "Men", "Unisex"],
      default: "Women",
    },
    // Phase 2: Smart Pricing Engine fields
    metalType: {
      type: String,
      enum: ["Gold", "Silver", "Platinum", "Rose Gold", "None"],
      default: "None",
    },
    purity: {
      type: String, // e.g., "22K", "18K", "925"
      default: "",
    },
    metalWeight: {
      type: Number, // in grams
      default: 0,
    },
    diamondWeight: {
      type: Number, // in carats
      default: 0,
    },
    gemstoneValue: {
      type: Number,
      default: 0,
    },
    makingCharges: {
      type: Number,
      default: 0,
    },
    isPriceFixed: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
ProductSchema.index({ category: 1 });
ProductSchema.index({ type: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ stock: 1 });
ProductSchema.index({ name: "text", description: "text" });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
