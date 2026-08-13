import React from 'react';
import { FileText, AlertCircle, CheckCircle, XCircle, Scale } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Please read these terms carefully before using our service.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Last updated: December 2024
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
              <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                Agreement Overview
              </h2>
            </div>
            <p className="text-blue-800 dark:text-blue-200">
              By using img365.in, you agree to these terms of service. Our service is provided 
              free of charge and is designed to help you convert and compress images safely 
              and efficiently.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
              <div className="flex items-center mb-6">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Permitted Uses
                </h2>
              </div>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>You may use img365.in for:</p>
                <ul className="space-y-2 ml-4">
                  <li>• Converting images between supported formats</li>
                  <li>• Compressing images to reduce file size</li>
                  <li>• Converting images to PDF and PDF to images</li>
                  <li>• Batch processing of multiple images</li>
                  <li>• Personal and commercial use</li>
                  <li>• Educational and research purposes</li>
                  <li>• Website optimization and development</li>
                </ul>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
              <div className="flex items-center mb-6">
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Prohibited Uses
                </h2>
              </div>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>You may not use img365.in for:</p>
                <ul className="space-y-2 ml-4">
                  <li>• Processing illegal, offensive, or copyrighted content without permission</li>
                  <li>• Attempting to reverse engineer or modify our service</li>
                  <li>• Automated bulk processing that impacts service performance</li>
                  <li>• Distributing malware or harmful content</li>
                  <li>• Violating any applicable laws or regulations</li>
                  <li>• Impersonating others or misrepresenting your identity</li>
                </ul>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
              <div className="flex items-center mb-6">
                <Scale className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Intellectual Property
                </h2>
              </div>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  <strong>Your Content:</strong> You retain all rights to your images. We don't 
                  claim ownership of any content you process through our service.
                </p>
                <p>
                  <strong>Our Service:</strong> The img365.in website, including its design, 
                  functionality, and code, is protected by copyright and other intellectual 
                  property laws.
                </p>
                <p>
                  <strong>Open Source:</strong> Our service uses open-source libraries and 
                  technologies. We respect and comply with their respective licenses.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
              <div className="flex items-center mb-6">
                <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Service Availability
                </h2>
              </div>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  <strong>Best Effort:</strong> We strive to provide reliable service but cannot 
                  guarantee 100% uptime or availability.
                </p>
                <p>
                  <strong>Maintenance:</strong> We may temporarily interrupt service for 
                  maintenance, updates, or improvements.
                </p>
                <p>
                  <strong>Browser Compatibility:</strong> Our service works best with modern 
                  browsers that support current web standards.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Disclaimers and Limitations
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  <strong>No Warranties:</strong> Our service is provided "as is" without 
                  warranties of any kind, express or implied.
                </p>
                <p>
                  <strong>Quality:</strong> While we strive to maintain image quality during 
                  processing, results may vary based on source material and chosen settings.
                </p>
                <p>
                  <strong>Data Loss:</strong> We recommend keeping backups of your original 
                  images. We're not responsible for any data loss.
                </p>
                <p>
                  <strong>Limitation of Liability:</strong> Our liability is limited to the 
                  maximum extent permitted by law.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Privacy and Data Protection
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  <strong>Client-Side Processing:</strong> Your images are processed entirely 
                  in your browser and never uploaded to our servers.
                </p>
                <p>
                  <strong>Privacy Policy:</strong> Our privacy practices are detailed in our 
                  Privacy Policy, which is incorporated into these terms.
                </p>
                <p>
                  <strong>GDPR Compliance:</strong> We comply with applicable data protection 
                  laws, including GDPR where applicable.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Changes to Terms
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  We may update these Terms of Service from time to time. Changes will be 
                  posted on this page with an updated revision date. Continued use of our 
                  service after changes are posted constitutes acceptance of the new terms.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Contact Information
              </h2>
              <div className="text-gray-600 dark:text-gray-300">
                <p className="mb-4">
                  If you have questions about these Terms of Service, please contact us:
                </p>
                <p>
                  <strong>Email:</strong> <a href="mailto:supthenexte@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">supthenexte@gmail.com</a>
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Effective Date
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                These Terms of Service are effective as of December 2024 and will remain 
                in effect until updated. By using img365.in, you acknowledge that you have 
                read, understood, and agree to be bound by these terms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};