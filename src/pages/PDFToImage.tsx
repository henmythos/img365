import React from 'react';
import { PDFProcessor } from '../components/PDFProcessor';
import { ToolsMenu } from '../components/ToolsMenu';
import { SuggestedTools } from '../components/SuggestedTools';
import { SEO } from '../components/SEO';

export const PDFToImage: React.FC = () => {
  return (
    <>
      <SEO
        title="PDF to JPG Converter Free Online - Convert PDF to Images Instantly | img365.in"
        description="Convert PDF to JPG online free. Extract PDF pages as JPG, PNG, or WebP images instantly. High-quality PDF to image conversion, no upload needed. Best PDF to JPG converter in India. 100% private, works offline."
        keywords="pdf to jpg, pdf to image, convert pdf to jpg, pdf to jpg converter, pdf to png, pdf to jpeg, extract pdf pages, pdf converter online free, pdf to image converter, pdf to jpg online free, convert pdf to image, pdf page to jpg, pdf to picture, free pdf converter india"
        toolName="PDF to JPG Converter - Free Online PDF to Image Tool"
        faqs={[
          { question: "How do I convert PDF to JPG?", answer: "Upload your PDF file, choose JPG as output format, set quality/DPI, and download your images. Each PDF page becomes a separate JPG image." },
          { question: "Is PDF to JPG conversion free?", answer: "Yes, 100% free! No sign-up, no watermarks, no limits. Convert unlimited PDF files to JPG images." },
          { question: "Will my PDF be uploaded to a server?", answer: "No! All conversion happens in your browser. Your PDF never leaves your device - completely private and secure." },
          { question: "What image quality can I expect?", answer: "High-quality output at 150 DPI default. Increase to 300 DPI for print-quality images or decrease for smaller file sizes." },
        ]}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 mb-8">
          <div className="max-w-6xl mx-auto">
            <ToolsMenu />
          </div>
        </div>
        <PDFProcessor
          mode="pdfToImage"
          title="Convert PDF to Images"
          description="Extract all pages from PDF documents as high-quality images. Perfect for presentations, web use, or image editing."
        />

        {/* Suggested Tools - shown after processing */}
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <SuggestedTools tools={['Image to PDF', 'Image Converter', 'Split PDF']} />
          </div>
        </div>

        {/* Additional SEO Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
              Professional PDF to Image Conversion
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Features
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Extract all PDF pages</li>
                  <li>• Multiple output formats (JPG, PNG, WebP)</li>
                  <li>• Adjustable DPI (72-300)</li>
                  <li>• Custom quality settings</li>
                  <li>• Batch PDF processing</li>
                  <li>• High-resolution output</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Use Cases
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Create thumbnails</li>
                  <li>• Web publishing</li>
                  <li>• Social media sharing</li>
                  <li>• Image editing</li>
                  <li>• Presentations</li>
                  <li>• Archive conversion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};