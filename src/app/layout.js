import HomeLayout from "@/components/layout/home/layout";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "LuxeJewels",
  description: "Premium Jewellery Collection",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#FAF9F6] text-[#2D2D2D]">
        <HomeLayout>
          <Toaster />
          {children}
        </HomeLayout>
      </body>
    </html>
  );
}
