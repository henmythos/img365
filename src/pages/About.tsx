import React from 'react';
import { Shield, Zap, Globe, Users, Heart, Lock, Instagram, Cpu, Award } from 'lucide-react';
import { SEO } from '../components/SEO';

export const About: React.FC = () => {
  return (
    <>
      <SEO
        title="About img365.in - The Safest Image & PDF Converter Ever Built"
        description="Learn about img365.in, engineered by Harsh Mythri (@harshxworldwide). Discover why our zero-server client-side sandboxing makes it the safest image and PDF converter ever built."
        keywords="about img365, safest image converter, harsh mythri, harshxworldwide, zero server upload, client side image processing"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-10">
            
            {/* Header Section */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Security Innovation Benchmark</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                The Safest Image & PDF Converter Ever Built
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Architected from the ground up by Lead Developer <strong className="text-gray-900 dark:text-white">Harsh Mythri</strong> to ensure zero server data exposure.
              </p>
            </div>

            {/* Safest Technology Explanation */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100 dark:border-gray-700 space-y-6">
              <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-400">
                <Lock className="w-8 h-8" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Why img365.in is the Safest Platform in the World
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Traditional online converters transmit your confidential legal contracts, personal photos, financial balance sheets, and passport scans over mobile networks to third-party cloud servers. This exposes your private files to server logs, data breaches, and unauthorized cloud storage retention.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                <strong className="text-gray-900 dark:text-white">img365.in eliminates this risk completely.</strong> Utilizing multi-threaded WebAssembly binary engines, Web Worker isolation, and hardware-accelerated <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded font-mono text-sm">createImageBitmap</code> Canvas sandboxing, all conversions take place <strong>100% inside your device's browser memory</strong>.
              </p>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-5 space-y-2">
                <div className="font-semibold text-emerald-800 dark:text-emerald-200 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                  DPDP Act 2023 Compliant Architecture
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
                  0 bytes of user files ever touch a remote server disk or database. What happens on your device stays on your device.
                </p>
              </div>
            </div>

            {/* Developer Spotlight */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Lead Engineer & Creator
                </div>
                <h2 className="text-3xl font-extrabold">Harsh Mythri</h2>
                <p className="text-blue-100 text-sm max-w-md leading-relaxed">
                  Pioneering zero-trust, client-side web utility architectures. Dedicated to building private, accessible, rocket-fast digital tools for users across India and worldwide.
                </p>
                <div className="pt-2">
                  <a
                    href="https://instagram.com/harshxworldwide"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white text-gray-900 hover:bg-gray-100 rounded-xl font-bold text-sm shadow-md transition-transform hover:scale-105"
                  >
                    <Instagram className="w-4 h-4 text-pink-600" />
                    <span>Follow @harshxworldwide</span>
                  </a>
                </div>
              </div>
              <div className="w-32 h-32 rounded-3xl bg-white/10 border-2 border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                <Cpu className="w-16 h-16 text-amber-300" />
              </div>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-3">
                  <Zap className="w-6 h-6 text-amber-500" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Rocket Processing Speed</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  No network latency or file upload queues. Conversions execute in milliseconds using local CPU/GPU hardware.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-3">
                  <Globe className="w-6 h-6 text-blue-500" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">100% Offline Capability</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Once loaded, img365.in works completely offline without requiring any active internet connection.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};