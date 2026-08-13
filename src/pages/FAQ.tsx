import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Is img365.in really free to use?",
    answer: "Yes, img365.in is completely free to use. There are no hidden fees, subscriptions, or limits on the number of files you can process. All features are available at no cost."
  },
  {
    question: "Are my images stored on your servers?",
    answer: "No, your images are never uploaded to our servers. All processing happens entirely in your browser using client-side JavaScript. This ensures maximum privacy and security for your files."
  },
  {
    question: "What image formats do you support?",
    answer: "We support all major image formats including JPG, JPEG, PNG, HEIC, HEIF, WebP, AVIF, BMP, TIFF, and many more. Our tool can convert between any of these formats."
  },
  {
    question: "Can I convert HEIC files from my iPhone?",
    answer: "Yes! We have excellent support for HEIC files from iPhones and other Apple devices. You can easily convert HEIC to JPG, PNG, or any other format."
  },
  {
    question: "Is there a file size limit?",
    answer: "There are no artificial file size limits imposed by our service. However, very large files may take longer to process and are limited by your device's memory and processing power."
  },
  {
    question: "Can I process multiple images at once?",
    answer: "Absolutely! Our batch processing feature allows you to upload and process multiple images simultaneously, saving you time and effort."
  },
  {
    question: "How does the compression work?",
    answer: "Our compression uses advanced algorithms to reduce file size while maintaining visual quality. You can adjust the quality slider to balance between file size and image quality according to your needs."
  },
  {
    question: "Do I need to create an account?",
    answer: "No account creation is required. You can start using all our tools immediately without any registration or sign-up process."
  },
  {
    question: "Can I use this on my mobile device?",
    answer: "Yes, img365.in is fully responsive and works perfectly on mobile devices, tablets, and desktops. The interface adapts to your screen size for optimal usability."
  },
  {
    question: "What browsers are supported?",
    answer: "Our tool works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version of your browser for the best experience."
  },
  {
    question: "Can I convert images to PDF?",
    answer: "Yes! We offer both image-to-PDF conversion (combine multiple images into one PDF) and PDF-to-image conversion (extract pages from PDF as images)."
  },
  {
    question: "How long does processing take?",
    answer: "Processing time depends on the file size and your device's performance. Most images are processed within seconds since everything happens locally in your browser."
  }
];

export const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <HelpCircle className="w-12 h-12 text-blue-600 dark:text-blue-400 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Frequently Asked Questions
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Find answers to common questions about img365.in
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                    {item.question}
                  </h3>
                  {openItems.includes(index) ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  )}
                </button>
                
                {openItems.includes(index) && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-lg mb-6">
              Can't find the answer you're looking for? We're here to help!
            </p>
            <a
              href="mailto:supthenexte@gmail.com"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};