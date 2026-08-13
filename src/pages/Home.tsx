import React from 'react';
import { ImageProcessor } from '../components/ImageProcessor';
import { ToolsMenu } from '../components/ToolsMenu';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';
import { Image, Zap, Shield, Globe, FileText, Camera, Sparkles, CheckCircle, FileSpreadsheet } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="JPG to PDF Converter Free Online | Image Compressor, PDF to JPG | img365.in"
        description="Free online JPG to PDF converter, image compressor, PDF to JPG, background remover. Convert images to PDF, compress photos, merge PDF - 100% free, no sign-up. Best image tools in India. Works offline, 100% private."
        keywords="jpg to pdf, pdf to jpg, image compressor, compress image, background remover, image to pdf, pdf converter, merge pdf, sign pdf, heic to jpg, png to jpg, reduce image size, photo compressor, free online converter, image tools india, compress photo online, jpg to pdf converter free, pdf to image, combine images to pdf, reduce photo size, compress jpg"
        faqs={[
          { question: "Is JPG to PDF conversion free?", answer: "Yes, 100% free with no sign-up, no watermarks, and no limits. Convert unlimited JPG files to PDF." },
          { question: "Are my images uploaded to a server?", answer: "No! All processing happens locally in your browser. Your images never leave your device - completely private and secure." },
          { question: "Can I compress images for passport photos?", answer: "Yes! Perfect for passport photos, visa applications, and documents that need specific file sizes like 100KB or 50KB." },
          { question: "Does it work on mobile phones?", answer: "Yes! All tools work perfectly on Android, iPhone, tablets, and desktop computers. No app download needed." },
        ]}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              JPG to PDF Converter & Image Tools
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Free online tools: <Link to="/image-to-pdf" className="underline">JPG to PDF</Link>, <Link to="/pdf-to-image" className="underline">PDF to JPG</Link>, <Link to="/compress" className="underline">Image Compressor</Link>. No sign-up needed. 100% private.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-white/20 px-4 py-2 rounded-full flex items-center"><CheckCircle className="w-4 h-4 mr-2" />No file size limits</span>
              <span className="bg-white/20 px-4 py-2 rounded-full flex items-center"><CheckCircle className="w-4 h-4 mr-2" />Works offline</span>
              <span className="bg-white/20 px-4 py-2 rounded-full flex items-center"><CheckCircle className="w-4 h-4 mr-2" />100% private</span>
              <span className="bg-white/20 px-4 py-2 rounded-full flex items-center"><CheckCircle className="w-4 h-4 mr-2" />No registration</span>
              <span className="bg-white/20 px-4 py-2 rounded-full flex items-center"><CheckCircle className="w-4 h-4 mr-2" />Free forever</span>
            </div>
          </div>
        </div>

        {/* Quick Access Tools Menu */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <ToolsMenu />
          </div>
        </div>

        {/* Main Tool */}
        <ImageProcessor
          mode="both"
          title="Convert & Compress Images"
          description="Upload your images and convert them to any format while optimizing file size. Perfect for web optimization, social media, and storage savings. Also check out our PDF conversion tools below!"
        />

        {/* PDF Tools Section */}
        <div className="py-16 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              JPG to PDF & PDF Conversion Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 text-center">
                <div className="bg-emerald-100 dark:bg-emerald-900 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FileSpreadsheet className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Excel to PDF
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Convert XLSX, XLS & CSV spreadsheets to PDF with custom sheet sequence order, budgeting table styling & page fitting.
                </p>
                <Link
                  to="/excel-to-pdf"
                  className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                >
                  Excel to PDF Free
                </Link>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 text-center">
                <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  JPG to PDF Converter
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Convert JPG images to PDF online free. Combine multiple JPG, PNG, JPEG photos into a single PDF document. Best for photo albums and documents.
                </p>
                <Link
                  to="/image-to-pdf"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  JPG to PDF Free
                </Link>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 text-center">
                <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Image className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  PDF to JPG Converter
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Convert PDF to JPG images online free. Extract all PDF pages as high-quality JPG, PNG, or WebP images. Perfect for sharing and editing.
                </p>
                <Link
                  to="/pdf-to-image"
                  className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  PDF to JPG Free
                </Link>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 text-center">
                <div className="bg-orange-100 dark:bg-orange-900 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Camera to PDF
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Scan documents with your camera and convert to PDF with auto-enhancement, sharpening,
                  and black & white mode.
                </p>
                <Link
                  to="/camera-to-pdf"
                  className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                >
                  Try Camera Scanner
                </Link>
              </div>
            </div>
          </div>
        </div>



        {/* Features Section - Why Choose img365.in */}
        <div className="py-16 bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Why Choose img365.in?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Lightning Fast</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Client-side processing means your images are processed instantly without uploading to servers.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">100% Private</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your images never leave your device. All processing happens in your browser for maximum privacy.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Globe className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Universal Format Support</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Support for all major image formats including HEIC, AVIF, WebP, and traditional formats.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <div className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                Complete Image Processing Solution
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Free Online Image Converter
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Convert images between any formats instantly. Our free online image converter supports
                    HEIC to JPG online conversion, PNG to WebP, AVIF to JPG, and many more format combinations.
                  </p>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• HEIC to JPG online conversion</li>
                    <li>• JPG to PNG conversion</li>
                    <li>• PNG to WebP optimization</li>
                    <li>• AVIF to JPG conversion</li>
                    <li>• Images to PDF conversion</li>
                    <li>• RAW to standard formats</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Image Size Reducer Online
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Compress PNG size, reduce JPG file size, and optimize images for web use. Our image
                    size reducer online tool helps you maintain quality while significantly reducing file sizes.
                  </p>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• Compress PNG size up to 80%</li>
                    <li>• Reduce JPG file size efficiently</li>
                    <li>• PDF to images extraction</li>
                    <li>• Batch image compression</li>
                    <li>• Quality preservation algorithms</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  How to Use img365.in
                </h3>
                <ol className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li><strong>1.</strong> Upload your images by dragging and dropping or clicking to browse</li>
                  <li><strong>2.</strong> Choose your desired output format and quality settings</li>
                  <li><strong>3.</strong> Click "Process Images" to convert and compress</li>
                  <li><strong>4.</strong> Download your optimized images individually or in bulk</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};