// src/proxy.js
import { auth } from "@/lib/auth"; // Update this path to where your NextAuth config is
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const protectedRoutes = ["/dashboard", "/admin", "/wishlist", "/cart"];
  const adminRoutes = ["/admin"];

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // 🔐 Not logged in
  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 👑 Not admin
  if (isAdminRoute && userRole !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const response = NextResponse.next();

  // Security Headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

  // Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https: blob:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://api.razorpay.com https://checkout.razorpay.com;
    frame-src https://checkout.razorpay.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
  `.replace(/\s{2,}/g, " ");

  response.headers.set("Content-Security-Policy", cspHeader);

  return response;
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/wishlist", "/cart"],
};
