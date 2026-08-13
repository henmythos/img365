import React from 'react';
import { Shield, Zap, Cpu, Server, Globe, CheckCircle2, Flame, Infinity as InfinityIcon, Sparkles } from 'lucide-react';
import { SEO } from '../components/SEO';
import { ToolsMenu } from '../components/ToolsMenu';

export const WhyUs: React.FC = () => {
  return (
    <>
      <SEO
        title="Why img365.in? - Infinite Concurrency & Zero Server Processing"
        description="Discover why img365.in can handle billions of concurrent file conversions without server delays. 100% client-side browser execution, zero server uploads, 100% private, and rocket fast."
        keywords="why img365, client side image processing, zero server upload, infinite file conversion scale, private pdf converter, fast image compressor"
        toolName="Why img365.in - Infinite Concurrency & Zero Server Architecture"
        faqs={[
          { question: "How does img365.in handle billions of concurrent file conversions?", answer: "All image and PDF processing logic runs 100% locally inside your web browser on your device CPU/GPU. There are zero server uploads or server bottlenecks." },
          { question: "Are my confidential files uploaded or saved on a server?", answer: "No! 0 bytes of your files touch remote servers or databases. img365.in is 100% private and fully compliant with DPDP Act 2023." },
          { question: "Does img365.in work offline without internet?", answer: "Yes! Once loaded in your web browser, img365.in tools run 100% offline without any active network connection." }
        ]}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 mb-8">
          <div className="max-w-6xl mx-auto">
            <ToolsMenu />
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4 shadow-lg animate-pulse">
                <Flame className="w-4 h-4 text-amber-300" />
                <span>The Zero-Server Architecture Revolution</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                How img365.in Processes <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">Billions of Files</span> Simultaneously
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Traditional file converter websites upload your confidential documents to cloud servers, making you wait in long queues. 
                <strong className="text-gray-900 dark:text-white"> img365.in operates 100% inside your browser</strong> — delivering instant execution, absolute privacy, and infinite scalability.
              </p>
            </div>

            {/* Benchmark Card Matrix */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 text-center">
                <InfinityIcon className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <div className="text-2xl font-black text-gray-900 dark:text-white">Unlimited</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Concurrent Scale</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 text-center">
                <Zap className="w-8 h-8 mx-auto text-amber-500 mb-2" />
                <div className="text-2xl font-black text-gray-900 dark:text-white">0.00 sec</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Server Queue Delay</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 text-center">
                <Shield className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                <div className="text-2xl font-black text-gray-900 dark:text-white">0 Bytes</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Server Uploads</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 text-center">
                <Cpu className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                <div className="text-2xl font-black text-gray-900 dark:text-white">Hardware GPU</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Device Accelerated</div>
              </div>
            </div>

            {/* Main Content Section */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-gray-100 dark:border-gray-700">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
                <Sparkles className="w-8 h-8 text-blue-600 mr-3" />
                Why img365.in Can Support Billions of Users with Rocket Speed
              </h2>

              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xl shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      100% Client-Side Computing Power
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      Instead of relaying files to distant cloud data centers, img365.in ships high-performance WebAssembly, Web Worker, and Canvas engines directly into your device's browser. Whether 10 users or 1,000,000,000 users process files simultaneously, each user harnesses their own smartphone or computer processor.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xl shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Zero Server Congestion & Zero File Upload Wait
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      Traditional websites fail during peak traffic hours because their cloud servers run out of CPU memory. On img365.in, there is no server processing queue. Your file conversions begin in milliseconds because no data needs to travel across mobile networks to a remote server disk.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black text-xl shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Unbreakable Military-Grade Privacy
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      Because your files are never uploaded to any remote database, your confidential legal PDFs, financial Excel budgets, personal photos, and signatures remain 100% private. img365.in fully complies with India's Digital Personal Data Protection Act (DPDP Act 2023).
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-xl shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Eco-Friendly & Carbon Neutral Processing
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      Eliminating massive cloud server data transfers saves megawatts of power annually. img365.in is built to be clean, lightweight, and environmentally sustainable.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Architectural Comparison Table */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-12 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Traditional Cloud Converters vs. img365.in
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <th className="py-4 px-4">Feature</th>
                      <th className="py-4 px-4 text-red-600 dark:text-red-400">Old Server-Based Converters</th>
                      <th className="py-4 px-4 text-emerald-600 dark:text-emerald-400">img365.in Client-Side Engine</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm text-gray-600 dark:text-gray-300">
                    <tr>
                      <td className="py-4 px-4 font-semibold text-gray-900 dark:text-white">Max Concurrency Limit</td>
                      <td className="py-4 px-4 text-red-500">Slows down under heavy load</td>
                      <td className="py-4 px-4 font-bold text-emerald-600 dark:text-emerald-400">Unlimited (Billions of Users)</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-semibold text-gray-900 dark:text-white">File Upload Privacy</td>
                      <td className="py-4 px-4 text-red-500">Uploaded to third-party cloud</td>
                      <td className="py-4 px-4 font-bold text-emerald-600 dark:text-emerald-400">100% Private (Never leaves device)</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-semibold text-gray-900 dark:text-white">Processing Speed</td>
                      <td className="py-4 px-4 text-red-500">Slow (Upload + Queue + Download)</td>
                      <td className="py-4 px-4 font-bold text-emerald-600 dark:text-emerald-400">Rocket Speed (Instant In-Browser)</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-semibold text-gray-900 dark:text-white">Offline Capability</td>
                      <td className="py-4 px-4 text-red-500">Requires active internet</td>
                      <td className="py-4 px-4 font-bold text-emerald-600 dark:text-emerald-400">Works 100% Offline</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-3xl p-8 text-center shadow-2xl">
              <Server className="w-12 h-12 mx-auto mb-4 text-amber-300" />
              <h2 className="text-3xl font-extrabold mb-3">Experience Rocket Speed File Processing</h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto mb-6">
                No waiting, no data uploads, and no subscriptions. Start converting your images, PDFs, and spreadsheets with maximum privacy right now.
              </p>
              <div className="flex justify-center items-center space-x-2 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                <span>100% Free Forever • Unlimited Files • Zero Registration</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};
