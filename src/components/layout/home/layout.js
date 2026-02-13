import Navbar from "@/components/layout/home/navbar";
import Footer from "@/components/layout/home/footer";
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
