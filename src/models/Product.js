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
