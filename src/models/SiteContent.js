import mongoose from "mongoose";

const SiteContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true, // e.g., "home_hero", "seasonal_banner"
    },
    title: {
      type: String,
      default: "",
    },
    subtitle: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    buttonText: {
      type: String,
      default: "",
    },
    buttonLink: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SiteContent || mongoose.model("SiteContent", SiteContentSchema);
