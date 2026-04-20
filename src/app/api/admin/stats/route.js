// src/app/api/admin/stats/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

export const dynamic = "force-dynamic";

function isAdmin(session) {
  return session?.user?.role === "admin";
}

export async function GET() {
  try {
    const session = await auth();
    if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await connectDB();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalOrders,
      ordersThisMonth,
      ordersLastMonth,
      totalProducts,
      totalUsers,
      revenueData,
      revenueLastMonth,
      recentOrders,
      ordersByStatus,
      lowStockProducts,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
      Product.countDocuments(),
      User.countDocuments(),
      // Total revenue from paid orders
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      // Last month revenue
      Order.aggregate([
        { $match: { isPaid: true, createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      // 5 most recent orders
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "name email")
        .lean(),
      // Order count by status
      Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      // Low stock alert (stock <= 5)
      Product.find({ stock: { $lte: 5 } }).select("name stock image").lean(),
    ]);

    const totalRevenue = revenueData[0]?.total ?? 0;
    const lastMonthRevenue = revenueLastMonth[0]?.total ?? 0;
    const revenueGrowth = lastMonthRevenue > 0
      ? Math.round(((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
      : 0;
    const orderGrowth = ordersLastMonth > 0
      ? Math.round(((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100)
      : 0;

    const statusMap = {};
    ordersByStatus.forEach(({ _id, count }) => { statusMap[_id] = count; });

    return NextResponse.json({
      totalOrders,
      ordersThisMonth,
      orderGrowth,
      totalRevenue,
      revenueGrowth,
      totalProducts,
      totalUsers,
      recentOrders,
      ordersByStatus: statusMap,
      lowStockProducts,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
