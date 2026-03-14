import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    body: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    images: [
      {
        type: String, // URLs of review images
      },
    ],
    verified: {
      type: Boolean,
      default: false, // True if user has ordered the product
    },
    helpful: {
      type: Number,
      default: 0, // Number of "helpful" votes
    },
  },
  {
    timestamps: true,
  }
);

// One review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ product: 1, rating: -1 });

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);
