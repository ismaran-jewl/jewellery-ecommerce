import HomeLayout from "@/components/layout/home/layout";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/providers/auth-provider";

export const metadata = {
  title: "LuxeJewels",
  description: "Premium Jewellery Collection",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#FAF9F6] text-[#2D2D2D]">
        <AuthProvider>
          <HomeLayout>
            <Toaster />
            {children}
          </HomeLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
