import React from 'react';
import { ImageProcessor } from '../components/ImageProcessor';
import { ToolsMenu } from '../components/ToolsMenu';
import { SuggestedTools } from '../components/SuggestedTools';
import { SEO } from '../components/SEO';

export const Convert: React.FC = () => {
  return (
    <>
      <SEO
        title="Image Converter Free Online - HEIC to JPG, PNG to JPG, WebP Converter | img365.in"
        description="Convert images online free. HEIC to JPG for iPhone photos, PNG to JPG, WebP to JPG, AVIF converter. Best image format converter in India. Batch conversion, 100% private, works offline. No sign-up needed."
        keywords="image converter, heic to jpg, png to jpg, convert image, image format converter, heic converter, webp to jpg, avif to jpg, jpg converter, png converter, convert heic to jpg online free, iphone photo converter, image converter online free, batch image converter, convert png to jpg, photo converter india"
        toolName="Image Converter - Free HEIC to JPG, PNG to JPG Converter"
        faqs={[
          { question: "How do I convert HEIC to JPG?", answer: "Simply upload your iPhone HEIC photos, select JPG as output, and download. Batch conversion supported for multiple files." },
          { question: "Which image formats are supported?", answer: "Input: HEIC, HEIF, JPEG, PNG, WebP, AVIF, BMP, TIFF. Output: JPEG, PNG, WebP, AVIF, BMP. All conversions maintain quality." },
          { question: "Is my data secure during conversion?", answer: "Yes! All processing happens in your browser. Your images never leave your device - completely private and secure." },
          { question: "Can I convert multiple images at once?", answer: "Absolutely! Our batch converter handles multiple images simultaneously, saving you time." },
        ]}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 mb-8">
          <div className="max-w-6xl mx-auto">
            <ToolsMenu />
          </div>
        </div>
        <ImageProcessor
          mode="convert"
          title="Convert Images"
          description="Convert your images to any format. Support for HEIC to JPG, PNG to WebP, AVIF conversion and all major image formats."
        />

        {/* Suggested Tools - shown after processing */}
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <SuggestedTools tools={['Image Compressor', 'Image to PDF', 'Image Resize']} />
          </div>
        </div>

        {/* Additional SEO Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
              Professional Image Format Conversion
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Popular Conversions
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• HEIC to JPG online - Convert iPhone photos</li>
                  <li>• JPG to PNG - Add transparency support</li>
                  <li>• PNG to WebP - Optimize for web</li>
                  <li>• AVIF to JPG - Modern format conversion</li>
                  <li>• RAW to JPEG - Professional photo processing</li>
                  <li>• BMP to PNG - Lossless conversion</li>
                  <li>• TIFF to JPG - Archive optimization</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Supported Formats
                </h3>
                <div className="grid grid-cols-2 gap-4 text-gray-600 dark:text-gray-300">
                  <div>
                    <strong>Input:</strong>
                    <ul className="mt-2 space-y-1">
                      <li>• HEIC/HEIF</li>
                      <li>• JPEG/JPG</li>
                      <li>• JPG</li>
                      <li>• PNG</li>
                      <li>• WebP</li>
                      <li>• AVIF</li>
                      <li>• BMP</li>
                      <li>• TIFF</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Output:</strong>
                    <ul className="mt-2 space-y-1">
                      <li>• JPEG</li>
                      <li>• JPG</li>
                      <li>• PNG</li>
                      <li>• WebP</li>
                      <li>• AVIF</li>
                      <li>• BMP</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};