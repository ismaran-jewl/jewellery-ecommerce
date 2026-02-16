export default function Footer() {
  return (
    <footer className="w-full border-t bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand & Newsletter */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-[#7c6a58]">LuxeJewels</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Discover exquisite jewelry crafted with passion. Timeless elegance for every occasion.
            </p>
            {/* Newsletter Signup */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <button className="px-6 py-2 bg-[#7c6a58] hover:bg-[#7c6a58]/90 text-white text-sm font-medium rounded-md transition-colors">
                Subscribe
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold text-foreground mb-4">Quick Links</h4>
            <nav className="space-y-2 text-sm text-[#7c6a58]">
              <a href="/collections" className="block hover:underline transition-colors">Shop Collections</a>
              <a href="/new-arrivals" className="block hover:underline transition-colors">New Arrivals</a>
              <a href="/gifts" className="block hover:underline transition-colors">Gift Ideas</a>
              <a href="/customize" className="block hover:underline transition-colors">Custom Design</a>
            </nav>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-base font-semibold text-foreground mb-4">Customer Service</h4>
            <nav className="space-y-2 text-sm text-[#7c6a58]">
              <a href="/faq" className="block hover:underline transition-colors">FAQ</a>
              <a href="/shipping" className="block hover:underline transition-colors">Shipping</a>
              <a href="/returns" className="block hover:underline transition-colors">Returns</a>
              <a href="/track-order" className="block hover:underline transition-colors">Track Order</a>
            </nav>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <div>
              <h4 className="text-base font-semibold text-foreground mb-2">Contact Us</h4>
              <div className="space-y-1 text-sm text-[#7c6a58]">
                <p>info@luxejewels.com</p>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div>
              <h4 className="text-base font-semibold text-foreground mb-2">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-8 h-8 rounded-full bg-[#7c6a58]/10 flex items-center justify-center hover:bg-[#7c6a58]/20 transition-colors">
                  <span className="sr-only">Instagram</span> {/* Add icon here */}
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-[#7c6a58]/10 flex items-center justify-center hover:bg-[#7c6a58]/20 transition-colors">
                  <span className="sr-only">Facebook</span> {/* Add icon here */}
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-[#7c6a58]/10 flex items-center justify-center hover:bg-[#7c6a58]/20 transition-colors">
                  <span className="sr-only">Pinterest</span> {/* Add icon here */}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between text-[#7c6a58] text-sm space-y-4 md:space-y-0">
          <div>
            &copy; {new Date().getFullYear()} LuxeJewels. All rights reserved.
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-end">
            <a href="/privacy-policy" className="hover:underline transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:underline transition-colors">Terms</a>
            <a href="/contact" className="hover:underline transition-colors">Contact</a>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center space-x-4 opacity-75">
            <span className="sr-only">We accept</span>
            {/* Add payment icons here */}
            <div className="w-8 h-5 bg-gray-200 rounded-sm" /> {/* Visa placeholder */}
            <div className="w-8 h-5 bg-gray-200 rounded-sm" /> {/* Mastercard */}
            <div className="w-8 h-5 bg-gray-200 rounded-sm" /> {/* PayPal */}
          </div>
        </div>
      </div>
    </footer>
  );
}
