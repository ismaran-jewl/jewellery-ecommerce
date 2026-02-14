export default function Footer() {
  return (
    <footer className="w-full border-t bg-white/80">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between text-[#7c6a58] text-sm">
        <div>
          &copy; {new Date().getFullYear()} LuxeJewels. All rights reserved.
        </div>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
          <a href="/terms" className="hover:underline">Terms</a>
          <a href="/contact" className="hover:underline">Contact</a>
        </div>
      </div>
    </footer>
  );
}
