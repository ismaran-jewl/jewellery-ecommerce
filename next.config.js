/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // Swagger UI for API docs
  swaggerUI: {
    url: "/api-docs",
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: "Jewellery E-Commerce",
  },
};

module.exports = nextConfig;
