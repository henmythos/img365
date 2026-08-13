import React from 'react';
import { ImageProcessor } from '../components/ImageProcessor';
import { ToolsMenu } from '../components/ToolsMenu';
import { SuggestedTools } from '../components/SuggestedTools';
import { SEO } from '../components/SEO';

export const Compress: React.FC = () => {
  return (
    <>
      <SEO
        title="Image Compressor Free Online - Reduce Photo Size to 100KB, 50KB | img365.in"
        description="Compress images online free. Reduce photo size to 100KB, 50KB, 20KB without losing quality. Best image compressor for passport photos, documents. Compress JPG, PNG instantly. 100% private, works offline. Best in India."
        keywords="image compressor, compress image, reduce photo size, image size reducer, compress jpg, compress png, photo compressor online, reduce image size, compress image to 100kb, compress photo to 50kb, image compressor free, compress image online, reduce file size, photo size reducer, compress passport photo, document photo compressor india"
        toolName="Image Compressor - Free Online Photo Size Reducer"
        faqs={[
          { question: "How much can I compress my image?", answer: "Compress images by 50-80% while maintaining visual quality. Reduce photos to 100KB, 50KB, or even 20KB for documents." },
          { question: "Will compression reduce image quality?", answer: "Our smart compression maintains visual quality. At 80% quality, images look identical to originals but are much smaller." },
          { question: "Can I compress images for passport photos?", answer: "Yes! Perfect for passport photos, visa applications, and government documents that require specific file sizes." },
          { question: "Is batch compression available?", answer: "Yes! Upload multiple images and compress them all at once. Perfect for optimizing entire photo galleries." },
        ]}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 mb-8">
          <div className="max-w-6xl mx-auto">
            <ToolsMenu />
          </div>
        </div>
        <ImageProcessor
          mode="compress"
          title="Compress Images"
          description="Reduce image file size without losing quality. Perfect for web optimization, email attachments, and storage savings."
        />

        {/* Suggested Tools - shown after processing */}
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <SuggestedTools tools={['Image Converter', 'Image to PDF', 'Image Crop']} />
          </div>
        </div>

        {/* Additional SEO Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
              Advanced Image Compression
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Compression Benefits
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Reduce file size by up to 80%</li>
                  <li>• Maintain visual quality</li>
                  <li>• Faster website loading</li>
                  <li>• Save storage space</li>
                  <li>• Optimize for social media</li>
                  <li>• Batch processing available</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Compression Options
                </h3>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <div>
                    <strong>Quality Levels:</strong>
                    <ul className="mt-2 space-y-1">
                      <li>• High Quality (80-100%)</li>
                      <li>• Medium Quality (60-80%)</li>
                      <li>• Low Quality (30-60%)</li>
                      <li>• Custom Quality (10-100%)</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Use Cases:</strong>
                    <ul className="mt-2 space-y-1">
                      <li>• Web optimization</li>
                      <li>• Email attachments</li>
                      <li>• Social media uploads</li>
                      <li>• Archive storage</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Compression Tips
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Use 80% quality for general web use</li>
                <li>• Use 60% quality for thumbnails</li>
                <li>• PNG compression works best for images with transparency</li>
                <li>• JPEG compression is ideal for photos</li>
                <li>• WebP offers the best compression ratios</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};