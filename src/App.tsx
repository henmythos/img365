import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ThemeProvider } from './contexts/ThemeContext';
import { SEO } from './components/SEO';
import { useScrollToUpload } from './hooks/useScrollToUpload';

import { ErrorBoundary } from './components/ErrorBoundary';

// Component to handle scroll-to-upload on route changes (must be inside Router)
function ScrollToUploadHandler() {
  useScrollToUpload();
  return null;
}

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Convert = lazy(() => import('./pages/Convert').then(module => ({ default: module.Convert })));
const Compress = lazy(() => import('./pages/Compress').then(module => ({ default: module.Compress })));
const ImageToPDF = lazy(() => import('./pages/ImageToPDF').then(module => ({ default: module.ImageToPDF })));
const PDFToImage = lazy(() => import('./pages/PDFToImage').then(module => ({ default: module.PDFToImage })));
const CameraToPDF = lazy(() => import('./pages/CameraToPDF').then(module => ({ default: module.CameraToPDF })));
const FAQ = lazy(() => import('./pages/FAQ').then(module => ({ default: module.FAQ })));
const Developer = lazy(() => import('./pages/Developer').then(module => ({ default: module.Developer })));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const WhyUs = lazy(() => import('./pages/WhyUs').then(module => ({ default: module.WhyUs })));
const Contact = lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })));
const Privacy = lazy(() => import('./pages/Privacy').then(module => ({ default: module.Privacy })));
const BlogList = lazy(() => import('./pages/BlogList').then(module => ({ default: module.BlogList })));
const BlogPost = lazy(() => import('./pages/BlogPost').then(module => ({ default: module.BlogPost })));
const Terms = lazy(() => import('./pages/Terms').then(module => ({ default: module.Terms })));

// New PDF Tools
const ExcelToPDF = lazy(() => import('./pages/ExcelToPDF').then(module => ({ default: module.ExcelToPDF })));
const MergePDF = lazy(() => import('./pages/MergePDF').then(module => ({ default: module.MergePDF })));
const SplitPDF = lazy(() => import('./pages/SplitPDF').then(module => ({ default: module.SplitPDF })));
const Watermark = lazy(() => import('./pages/Watermark').then(module => ({ default: module.Watermark })));
const PDFToText = lazy(() => import('./pages/PDFToText').then(module => ({ default: module.PDFToText })));
const CropPDF = lazy(() => import('./pages/CropPDF').then(module => ({ default: module.CropPDF })));
const SignPDF = lazy(() => import('./pages/SignPDF').then(module => ({ default: module.SignPDF })));

// New Image Tools
const ImageResize = lazy(() => import('./pages/ImageResize').then(module => ({ default: module.ImageResize })));
const ImageCrop = lazy(() => import('./pages/ImageCrop').then(module => ({ default: module.ImageCrop })));
const ImageRotate = lazy(() => import('./pages/ImageRotate').then(module => ({ default: module.ImageRotate })));
const SmartScan = lazy(() => import('./pages/SmartScan').then(module => ({ default: module.SmartScan })));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToUploadHandler />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <SEO />
          <Header />
          <main className="pt-16">
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/convert" element={<Convert />} />
                  <Route path="/compress" element={<Compress />} />
                  <Route path="/image-to-pdf" element={<ImageToPDF />} />
                  <Route path="/pdf-to-image" element={<PDFToImage />} />
                  <Route path="/camera-to-pdf" element={<CameraToPDF />} />
                  {/* New PDF Tools */}
                  <Route path="/excel-to-pdf" element={<ExcelToPDF />} />
                  <Route path="/merge-pdf" element={<MergePDF />} />
                  <Route path="/split-pdf" element={<SplitPDF />} />
                  <Route path="/watermark" element={<Watermark />} />
                  <Route path="/pdf-to-text" element={<PDFToText />} />
                  <Route path="/crop-pdf" element={<CropPDF />} />
                  <Route path="/sign-pdf" element={<SignPDF />} />
                  {/* New Image Tools */}
                  <Route path="/image-resize" element={<ImageResize />} />
                  <Route path="/image-crop" element={<ImageCrop />} />
                  <Route path="/image-rotate" element={<ImageRotate />} />
                  <Route path="/smart-scan" element={<SmartScan />} />
                  {/* Info Pages */}
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/developer" element={<Developer />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/why-us" element={<WhyUs />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/blog" element={<BlogList />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="*" element={<Home />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;