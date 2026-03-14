// src/lib/dbIndexes.js
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import Wishlist from "@/models/Wishlist";

export const createIndexes = async () => {
  try {
    await connectDB();

    console.log("Creating database indexes...");

    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ createdAt: -1 });
    console.log("✓ User indexes created");

    // Product indexes
    await Product.collection.createIndex({ category: 1 });
    await Product.collection.createIndex({ type: 1 });
    await Product.collection.createIndex({ name: "text", description: "text" });
    await Product.collection.createIndex({ price: 1 });
    await Product.collection.createIndex({ createdAt: -1 });
    await Product.collection.createIndex({ stock: 1 });
    console.log("✓ Product indexes created");

    // Order indexes
    await Order.collection.createIndex({ user: 1, createdAt: -1 });
    await Order.collection.createIndex({ razorpayOrderId: 1 });
    await Order.collection.createIndex({ paymentId: 1 });
    await Order.collection.createIndex({ status: 1 });
    await Order.collection.createIndex({ paymentStatus: 1 });
    console.log("✓ Order indexes created");

    // Cart indexes
    await Cart.collection.createIndex({ user: 1 }, { unique: true });
    await Cart.collection.createIndex({ updatedAt: 1 });
    console.log("✓ Cart indexes created");

    // Wishlist indexes
    await Wishlist.collection.createIndex({ user: 1 }, { unique: true });
    await Wishlist.collection.createIndex({ updatedAt: 1 });
    console.log("✓ Wishlist indexes created");

    console.log("✅ All database indexes created successfully!");
    return { success: true, message: "Indexes created" };
  } catch (error) {
    if (error.code === 48) {
      // Index already exists
      console.log("⚠️  Indexes already exist");
      return { success: true, message: "Indexes already exist" };
    }
    console.error("Error creating indexes:", error);
    throw error;
  }
};

export const dropIndexes = async () => {
  try {
    await connectDB();

    console.log("Dropping database indexes...");

    const collections = [
      User.collection,
      Product.collection,
      Order.collection,
      Cart.collection,
      Wishlist.collection,
    ];

    for (const collection of collections) {
      const indexes = await collection.getIndexes();
      const indexNames = Object.keys(indexes).filter((name) => name !== "_id_");

      for (const indexName of indexNames) {
        await collection.dropIndex(indexName);
      }
    }

    console.log("✅ All indexes dropped successfully!");
    return { success: true, message: "Indexes dropped" };
  } catch (error) {
    console.error("Error dropping indexes:", error);
    throw error;
  }
};

export const getIndexStats = async () => {
  try {
    await connectDB();

    const stats = {
      user: await User.collection.getIndexes(),
      product: await Product.collection.getIndexes(),
      order: await Order.collection.getIndexes(),
      cart: await Cart.collection.getIndexes(),
      wishlist: await Wishlist.collection.getIndexes(),
    };

    return stats;
  } catch (error) {
    console.error("Error getting index stats:", error);
    throw error;
  }
};
