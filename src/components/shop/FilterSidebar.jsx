"use client";

export default function FilterSidebar() {
  return (
    <aside className="w-64 p-6 border-r border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      <div className="mb-6">
        <h3 className="font-medium mb-2">Category</h3>
        <ul className="space-y-2 text-sm">
          <li>Gold</li>
          <li>Diamond</li>
          <li>Bridal</li>
          <li>Rings</li>
          <li>Necklaces</li>
        </ul>
      </div>

      <div>
        <h3 className="font-medium mb-2">Price</h3>
        <ul className="space-y-2 text-sm">
          <li>₹0 - ₹10,000</li>
          <li>₹10,000 - ₹50,000</li>
          <li>₹50,000+</li>
        </ul>
      </div>
    </aside>
  );
}
