export default function Footer() {
  return (
    <footer className="bg-white py-12 md:py-16 text-center text-sm text-neutral-500 border-t border-neutral-200">
      <p className="font-medium text-neutral-700">
        © {new Date().getFullYear()} ISMARAN Jewellery
      </p>
      <p className="mt-2 text-neutral-500 italic">
        Crafted with purity & tradition
      </p>
    </footer>
  );
}
