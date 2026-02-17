import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // CHANGE: 'products' is now an array of objects, not just IDs
  products: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product", 
        required: true 
      },
      quantity: { 
        type: Number, 
        default: 1 
      },
      // THIS IS WHERE YOU EXTRACT THE MESSAGE
      customMessage: { 
        type: String, 
        default: "" 
      },
      // If they upload a file/image
      customImageUrl: { 
        type: String, 
        default: "" 
      }
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
