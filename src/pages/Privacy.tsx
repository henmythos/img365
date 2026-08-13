import React from 'react';
import { Shield, Eye, Lock, Server, Trash2, Users } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Your privacy is our priority. Learn how we protect your data.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Last updated: December 2024
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <Shield className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
              <h2 className="text-2xl font-bold text-green-900 dark:text-green-100">
                Privacy-First Approach
              </h2>
            </div>
            <p className="text-green-800 dark:text-green-200">
              <strong>img365.in is designed with privacy at its core.</strong> All image processing 
              happens entirely in your browser. We never see, store, or have access to your files. 
              Your files never leave your device.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
              <div className="flex items-center mb-6">
                <Eye className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  What We Don't Collect
                </h2>
              </div>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span><strong>Your Files:</strong> We never see or store your uploaded images or PDFs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span><strong>Personal Information:</strong> No registration or personal data required</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span><strong>File Metadata:</strong> No EXIF data or file information is collected</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span><strong>Processing History:</strong> No record of what files you've processed</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
              <div className="flex items-center mb-6">
                <Server className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  How Our Technology Works
                </h2>
              </div>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  <strong>Client-Side Processing:</strong> All image conversion and compression 
                  happens in your web browser using JavaScript. Your files are processed locally 
                  on your device and never uploaded to our servers.
                </p>
                <p>
                  <strong>No Server Storage:</strong> Since processing happens in your browser, 
                  there's no need to upload files to our servers. This ensures your images 
                  remain private and secure.
                </p>
                <p>
                  <strong>Automatic Cleanup:</strong> After processing, all file data is 
                  automatically cleared from your browser's memory when you close the tab or 
                  navigate away.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
              <div className="flex items-center mb-6">
                <Lock className="w-8 h-8 text-red-600 dark:text-red-400 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  What We Do Collect
                </h2>
              </div>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  To provide our service and improve the user experience, we collect minimal, 
                  non-personal information:
                </p>
                <ul className="space-y-2 ml-4">
                  <li>• <strong>Anonymous Usage Analytics:</strong> Page views, button clicks, and feature usage (no personal identification)</li>
                  <li>• <strong>Technical Information:</strong> Browser type, device type, and screen resolution for optimization</li>
                  <li>• <strong>Performance Data:</strong> Error logs and performance metrics to improve our service</li>
                  <li>• <strong>Preferences:</strong> Theme settings and other preferences stored locally in your browser</li>
                </ul>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
              <div className="flex items-center mb-6">
                <Users className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Third-Party Services
                </h2>
              </div>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  We use minimal third-party services to operate our website:
                </p>
                <ul className="space-y-2 ml-4">
                  <li>• <strong>Web Hosting:</strong> For serving the website files (no user data processing)</li>
                  <li>• <strong>CDN Services:</strong> For faster content delivery (no personal data)</li>
                  <li>• <strong>Analytics:</strong> Anonymous usage statistics (no personal identification)</li>
                </ul>
                <p>
                  These services do not have access to your images or personal information.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
              <div className="flex items-center mb-6">
                <Trash2 className="w-8 h-8 text-gray-600 dark:text-gray-400 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Data Retention
                </h2>
              </div>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  <strong>Files:</strong> We don't retain your files because they never leave your device.
                </p>
                <p>
                  <strong>Analytics Data:</strong> Anonymous usage data is retained for up to 12 months 
                  for service improvement purposes.
                </p>
                <p>
                  <strong>Technical Logs:</strong> Error logs and performance data are retained for 
                  up to 30 days for troubleshooting.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Your Rights
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  Even though we collect minimal data, you have the right to:
                </p>
                <ul className="space-y-2 ml-4">
                  <li>• Know what information we collect</li>
                  <li>• Request deletion of any data we have</li>
                  <li>• Opt out of analytics tracking</li>
                  <li>• Contact us about privacy concerns</li>
                </ul>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Contact Us
              </h2>
              <div className="text-gray-600 dark:text-gray-300">
                <p className="mb-4">
                  If you have any questions about this Privacy Policy or our practices, 
                  please contact us at:
                </p>
                <p>
                  <strong>Email:</strong> <a href="mailto:supthenexte@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">supthenexte@gmail.com</a>
                </p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                Updates to This Policy
              </h2>
              <p className="text-blue-800 dark:text-blue-200">
                We may update this Privacy Policy from time to time. Any changes will be 
                posted on this page with an updated revision date. We encourage you to 
                review this policy periodically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};