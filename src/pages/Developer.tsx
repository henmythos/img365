import React from 'react';
import { Code, Mail, User, Shield, Instagram, Cpu, Sparkles, Award } from 'lucide-react';
import { SEO } from '../components/SEO';

export const Developer: React.FC = () => {
  return (
    <>
      <SEO
        title="Harsh Mythri (@harshxworldwide) - Lead Developer of img365.in"
        description="Meet Harsh Mythri, full-stack developer and creator of img365.in - the safest client-side image and PDF converter. Follow on Instagram @harshxworldwide."
        keywords="harsh mythri, harshxworldwide, developer img365, client side image converter developer, safest image converter creator"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-10">
            
            {/* Developer Hero */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 dark:border-gray-700 text-center space-y-6">
              <div className="w-28 h-28 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-3xl mx-auto flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-700">
                <User className="w-14 h-14 text-white" />
              </div>
              
              <div>
                <div className="inline-flex items-center space-x-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                  <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Creator & Lead Engineer</span>
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                  Harsh Mythri
                </h1>
                <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold mt-1">
                  Full Stack Engineer & Creator of img365.in
                </p>
              </div>

              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Architect of <strong>img365.in</strong> — built to pioneer zero-trust, browser-isolated client processing so user files never touch third-party cloud servers.
              </p>

              {/* Social Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <a
                  href="https://instagram.com/harshxworldwide"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-sm shadow-lg transition-transform hover:scale-105"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram: @harshxworldwide</span>
                </a>

                <a
                  href="mailto:supthenexte@gmail.com"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-900 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 text-white rounded-xl font-bold text-sm shadow-md transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact Developer</span>
                </a>
              </div>
            </div>

            {/* Technical Innovation Section */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100 dark:border-gray-700 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <Sparkles className="w-6 h-6 text-blue-600 mr-2" />
                The Engineering Innovation Behind img365.in
              </h2>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Frustrated by online converter sites that upload personal documents to unknown servers, <strong>Harsh Mythri</strong> engineered img365.in as the <strong>safest image and PDF converter ever built</strong>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="p-5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-200 dark:border-gray-600 space-y-2">
                  <div className="font-bold text-gray-900 dark:text-white flex items-center text-sm">
                    <Shield className="w-4 h-4 mr-2 text-emerald-500" />
                    Zero Server Storage & DPDP Compliance
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    0 bytes of files uploaded to remote servers. All processing completes locally in the client browser, offering military-grade privacy.
                  </p>
                </div>

                <div className="p-5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-200 dark:border-gray-600 space-y-2">
                  <div className="font-bold text-gray-900 dark:text-white flex items-center text-sm">
                    <Cpu className="w-4 h-4 mr-2 text-blue-500" />
                    Hardware-Accelerated Client Engine
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    Powered by WebAssembly, Web Worker ArrayBuffers, and <code className="font-mono text-[11px]">createImageBitmap</code> GPU textures for instant conversion.
                  </p>
                </div>
              </div>
            </div>

            {/* Technical Stack */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Code className="w-5 h-5 mr-2 text-blue-600" />
                Technical Architecture Stack
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Core Framework</div>
                  <div className="font-bold text-gray-900 dark:text-white text-sm mt-1">React 18 + TS</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Build System</div>
                  <div className="font-bold text-gray-900 dark:text-white text-sm mt-1">Vite 5</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Styling</div>
                  <div className="font-bold text-gray-900 dark:text-white text-sm mt-1">Tailwind CSS</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Execution</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-1">100% Client JS</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};