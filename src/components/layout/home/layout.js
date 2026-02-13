import Navbar from "@/components/layout/home/Navbar";
import Footer from "@/components/layout/home/Footer";
import "@/app/globals.css";

export default function HomeLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-56px-80px)]">{children}</div>
      <Footer />
    </>
  );
}
