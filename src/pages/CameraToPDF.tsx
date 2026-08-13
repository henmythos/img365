import React from 'react';
import { CameraProcessor } from '../components/CameraProcessor';
import { ToolsMenu } from '../components/ToolsMenu';
import { SuggestedTools } from '../components/SuggestedTools';
import { SEO } from '../components/SEO';

export const CameraToPDF: React.FC = () => {
  return (
    <>
      <SEO
        title="Camera to PDF Scanner - Document Scanner with Auto Enhancement | img365.in"
        description="Scan documents with your camera and convert to PDF. Auto document enhancement, text sharpening, and instant PDF creation. Free camera scanner for students and professionals in India."
        keywords="camera to PDF, document scanner online, scan to PDF free, photo to PDF, mobile scanner, document scanner app, scan documents, camera scanner, PDF scanner, document digitization, phone scanner"
        toolName="Camera to PDF Scanner - Free Document Digitizer"
        faqs={[
          { question: "How does the camera scanner work?", answer: "Capture documents using your phone/webcam or upload existing photos. Our tool auto-enhances the image for document clarity and converts to PDF." },
          { question: "Does it have OCR for text recognition?", answer: "Currently focused on image-to-PDF conversion with enhancement. For text extraction, use our PDF to Text tool after scanning." },
          { question: "What types of documents can I scan?", answer: "Receipts, invoices, notes, contracts, ID cards, book pages, forms - any flat document that fits in your camera frame." },
          { question: "Will it fix poor lighting in my photos?", answer: "Yes! Auto-enhancement adjusts brightness, contrast, and sharpness to make text clearer, even in suboptimal lighting conditions." },
        ]}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 mb-8">
          <div className="max-w-6xl mx-auto">
            <ToolsMenu />
          </div>
        </div>
        <CameraProcessor />

        {/* Suggested Tools - shown after processing */}
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <SuggestedTools tools={['Image to PDF', 'PDF to Image', 'Image Converter']} />
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
              Professional Document Scanner
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Features
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Capture photos from camera or upload</li>
                  <li>• Automatic document enhancement</li>
                  <li>• Text sharpening for clarity</li>
                  <li>• Black & white document mode</li>
                  <li>• Instant PDF conversion</li>
                  <li>• 100% client-side processing</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Use Cases
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Scan receipts and invoices</li>
                  <li>• Digitize documents</li>
                  <li>• Create study notes</li>
                  <li>• Archive important papers</li>
                  <li>• Business card scanning</li>
                  <li>• Contract digitization</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
