import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/providers/auth-provider";
import { siteConfig, generateStructuredData } from "@/config/seo";
import "@/app/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: {
    default: "ISMARN Jewels | Luxury Handcrafted Memory Jewellery",
    template: "%s | ISMARN Jewels",
  },
  description: siteConfig.description,
  keywords: ["jewellery", "gold", "diamonds", "bridal", "accessories", "luxury jewellery"],
  author: siteConfig.author,
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: "ISMARN Jewels | Luxury Handcrafted Memory Jewellery",
    description: siteConfig.description,
    images: [
      {
        url: `${siteConfig.url}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "ISMARN Jewels",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ISMARN Jewels",
    description: siteConfig.description,
    images: [`${siteConfig.url}/og-image.jpg`],
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export default function RootLayout({ children }) {
  const structuredData = generateStructuredData("organization");

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#2D5A40" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF7F2]">
        <AuthProvider>
          <Toaster />
          <main className="flex-1">
            {children}
          </main>
          <Analytics />
          <SpeedInsights />
        </AuthProvider>
      </body>
    </html>
  );
}