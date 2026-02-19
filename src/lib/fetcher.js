// src/lib/fetcher.js
// Use this instead of bare fetch("/api/...") to avoid
// "Failed to parse URL" errors when Next.js tries to
// render client components on the server during build.

export function apiUrl(path) {
  if (typeof window === "undefined") {
    // Server-side: needs absolute URL
    const base =
      process.env.NEXTAUTH_URL ??
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000";
    return `${base}${path}`;
  }
  // Client-side: relative path works fine
  return path;
}