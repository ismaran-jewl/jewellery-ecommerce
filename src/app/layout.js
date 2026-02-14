import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/providers/auth-provider";
import "@/app/globals.css";
export const metadata = {
  title: "ISMARN",
  description: "Premium Jewellery Collection",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#FAF9F6] text-[#2D2D2D]">
        <AuthProvider>
            <Toaster />
            {children}
        </AuthProvider>
      </body>
    </html>
  );
}
