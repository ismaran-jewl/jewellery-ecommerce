import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One wishlist document per user
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

// Create indexes
wishlistSchema.index({ user: 1 }, { unique: true });
wishlistSchema.index({ updatedAt: 1 });

export default mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);