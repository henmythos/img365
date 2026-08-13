import React from 'react';
import { Link } from 'react-router-dom';
import { Image, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Image className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">img365.in</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Free online image converter and compressor. Convert and compress any image file
              format quickly and securely with our privacy-first approach.
            </p>

            <p className="text-xs text-gray-400 mt-4">
              SSL Secured • Encrypted HTTPS • Fully compliant with India’s{" "}
              <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>.
              Users can request data deletion anytime at{" "}
              <a
                href="mailto:img365.in@gmail.com"
                className="underline hover:text-gray-300"
              >
                img365.in@gmail.com
              </a>
              .
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-1 text-gray-400">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span>for the community</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <span className="text-2xl">🇮🇳</span>
                <span className="font-semibold">Made in India</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Tools</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/convert" className="hover:text-white transition-colors">
                  Image Converter
                </Link>
              </li>
              <li>
                <Link to="/compress" className="hover:text-white transition-colors">
                  Image Compressor
                </Link>
              </li>
              <li>
                <Link to="/image-to-pdf" className="hover:text-white transition-colors">
                  Image to PDF
                </Link>
              </li>
              <li>
                <Link to="/pdf-to-image" className="hover:text-white transition-colors">
                  PDF to Image
                </Link>
              </li>
              <li>
                <Link to="/camera-to-pdf" className="hover:text-white transition-colors">
                  Camera to PDF
                </Link>
              </li>
              <li>
                <Link to="/excel-to-pdf" className="hover:text-white transition-colors">
                  Excel to PDF
                </Link>
              </li>
              <li>
                <Link to="/split-pdf" className="hover:text-white transition-colors">
                  Split PDF
                </Link>
              </li>
              <li>
                <Link to="/watermark" className="hover:text-white transition-colors">
                  Watermark Tool
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/developer" className="hover:text-white transition-colors">
                  Developer
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/why-us" className="hover:text-white transition-colors">
                  Why img365.in
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center space-x-6 mt-6 text-gray-400">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/img365.in/?__pwa=1"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-6 h-6"
            >
              <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-.25a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z" />
            </svg>
          </a>

          {/* X (Twitter) */}
          <a
            href="https://x.com/Img365In"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-6 h-6"
            >
              <path d="M18.244 2H22l-7.51 8.577L22 22h-8.077l-5.3-7.638L3.4 22H0l8.205-9.362L0 2h8.077l4.973 7.143L18.244 2z" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/company/img365/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-6 h-6"
            >
              <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.24 8.1h4.52V24H.24V8.1zM8.34 8.1h4.33v2.16h.06c.6-1.14 2.07-2.33 4.25-2.33 4.55 0 5.39 2.99 5.39 6.88V24h-4.52v-7.92c0-1.89-.03-4.32-2.63-4.32-2.64 0-3.04 2.06-3.04 4.18V24H8.34V8.1z" />
            </svg>
          </a>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 img365.in. All rights reserved. No files are stored on our servers.</p>
          <p className="mt-2 text-sm">
            Developed by <a href="mailto:supthenexte@gmail.com" className="text-blue-400 hover:text-blue-300">Harsh Mythri</a>
          </p>
        </div>
      </div>
    </footer>
  );
};