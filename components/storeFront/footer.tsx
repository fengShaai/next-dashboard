// components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo & Description */}
        <div>
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Compu<span className="text-gray-800">Work</span>
          </Link>
          <p className="text-sm text-gray-600 mt-2">
            Your trusted source for high-performance laptops and accessories.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-2 text-gray-700">Quick Links</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li><Link href="/products">Products</Link></li>
            <li><Link href="/categories">Categories</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-semibold mb-2 text-gray-700">Contact</h4>
          <p className="text-sm text-gray-600">Email: support@compuwork.com</p>
          <p className="text-sm text-gray-600">Phone: +94 77 123 4567</p>
          <p className="text-sm text-gray-600">Address: Colombo, Sri Lanka</p>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 py-4 border-t">
        &copy; {new Date().getFullYear()} CompuWork. All rights reserved.
      </div>
    </footer>
  );
}
