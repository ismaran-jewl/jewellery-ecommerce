import mongoose from "mongoose";
import dns from "dns";

// 1. FORCED DNS FIX: Tells Node to use public DNS resolvers to find Atlas
// (usable as a temporary workaround when local resolver blocks SRV queries)
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/jewellery-ecommerce";

// Use existing global cache or initialize a new one
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Critical: Fail fast if connection is down
      serverSelectionTimeoutMS: 5000, // Short timeout for server selection
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset promise on failure
    throw e;
  }

  return cached.conn;
}

export default dbConnect;