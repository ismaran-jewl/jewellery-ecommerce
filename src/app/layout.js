import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "LuxeJewels",
  description: "Premium Jewellery Collection",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#FAF9F6] text-[#2D2D2D]">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
