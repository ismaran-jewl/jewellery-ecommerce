import mongoose from "mongoose";

const promoSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["percentage", "fixed", "free_shipping"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    // Minimum cart value to apply
    minOrderValue: {
      type: Number,
      default: 0,
    },
    // Max discount cap (relevant for percentage type)
    maxDiscount: {
      type: Number,
      default: null,
    },
    // Usage limits
    usageLimit: {
      type: Number,
      default: null, // null = unlimited
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    // Per-user usage limit
    perUserLimit: {
      type: Number,
      default: 1,
    },
    // Users who have used this code
    usedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

promoSchema.index({ code: 1 });
promoSchema.index({ active: 1, expiresAt: 1 });

export default mongoose.models.Promo || mongoose.model("Promo", promoSchema);
