import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/dashboard", "/admin","/wishlist","/cart"];
const adminRoutes = ["/admin"];

export async function proxy(req) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAdminRoute = adminRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 🔐 Not logged in
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 👑 Not admin
  if (isAdminRoute && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*","/wishlist","/cart"],
};
