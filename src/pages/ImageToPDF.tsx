import React from 'react';
import { PDFProcessor } from '../components/PDFProcessor';
import { ToolsMenu } from '../components/ToolsMenu';
import { SuggestedTools } from '../components/SuggestedTools';
import { SEO } from '../components/SEO';

export const ImageToPDF: React.FC = () => {
  return (
    <>
      <SEO
        title="JPG to PDF - Convert Images to PDF Online Free | img365.in"
        description="Convert JPG to PDF online free. Convert multiple images (JPG, PNG, JPEG) to PDF in seconds. Batch processing with custom page sizes. 100% client-side, no upload needed. Best JPG to PDF converter in India."
        keywords="jpg to pdf, convert jpg to pdf, image to pdf, png to pdf, jpeg to pdf, photo to pdf, jpg to pdf converter, free jpg to pdf, online jpg to pdf, multiple images to pdf, picture to pdf, jpg to pdf online free, batch jpg to pdf"
        toolName="JPG to PDF Converter - Free Online Image to PDF"
        faqs={[
          { question: "How do I convert JPG to PDF?", answer: "Upload your JPG images, arrange them in the desired order by dragging, choose page size and orientation, then download as a single PDF." },
          { question: "What image formats are supported?", answer: "JPG, JPEG, PNG, WebP, BMP, and most common image formats. All will be converted to high-quality PDF pages." },
          { question: "Can I convert multiple JPG to one PDF?", answer: "Yes! Upload all your JPG images and they will be combined into a single PDF document." },
          { question: "Is there a limit on number of images?", answer: "No fixed limit! Since processing happens in your browser, you can convert as many images as your device can handle." },
        ]}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 mb-8">
          <div className="max-w-6xl mx-auto">
            <ToolsMenu />
          </div>
        </div>
        <PDFProcessor
          mode="imageToPdf"
          title="Convert Images to PDF"
          description="Convert multiple images into a single PDF document. Perfect for creating photo albums, presentations, or document compilations."
        />

        {/* Suggested Tools - shown after processing */}
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <SuggestedTools tools={['PDF to Image', 'Image Converter', 'Image Compressor']} />
          </div>
        </div>

        {/* Additional SEO Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
              Professional Image to PDF Conversion
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Features
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Multiple images in one PDF</li>
                  <li>• Custom page sizes (A4, Letter, Legal, etc.)</li>
                  <li>• Portrait and landscape orientation</li>
                  <li>• Adjustable margins and quality</li>
                  <li>• Fit to page or maintain aspect ratio</li>
                  <li>• Batch processing support</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Use Cases
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Create photo albums</li>
                  <li>• Compile documents</li>
                  <li>• Make presentations</li>
                  <li>• Archive images</li>
                  <li>• Share multiple images easily</li>
                  <li>• Professional portfolios</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};