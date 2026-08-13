import React, { useState, useCallback } from 'react';
import { 
  Upload, 
  Stamp, 
  Download, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  FileText,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { ToolsMenu } from '../components/ToolsMenu';
import { SuggestedTools } from '../components/SuggestedTools';
import { SEO } from '../components/SEO';
import { PDFDocument, rgb, degrees } from 'pdf-lib';

export const Watermark: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'pdf' | 'image' | null>(null);
  const [watermarkText, setWatermarkText] = useState<string>('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState<number>(36);
  const [opacity, setOpacity] = useState<number>(0.3);
  const [rotation, setRotation] = useState<number>(-45);
  const [color, setColor] = useState<string>('#ef4444');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const loadFile = (f: File) => {
    setError(null);
    setResultUrl(null);
    const name = f.name.toLowerCase();

    if (name.endsWith('.pdf') || f.type === 'application/pdf') {
      setFileType('pdf');
      setFile(f);
    } else if (f.type.startsWith('image/')) {
      setFileType('image');
      setFile(f);
    } else {
      setError('Please select a valid PDF or Image file (PNG, JPG, WebP).');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      loadFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      loadFile(e.target.files[0]);
    }
  };

  const hexToRgbRatio = (hex: string) => {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) / 255 || 0.9;
    const g = parseInt(clean.substring(2, 4), 16) / 255 || 0.2;
    const b = parseInt(clean.substring(4, 6), 16) / 255 || 0.2;
    return { r, g, b };
  };

  const applyWatermarkPDF = async () => {
    if (!file || fileType !== 'pdf') return;
    setIsProcessing(true);
    setProgressMessage('Adding watermark to PDF pages...');
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pages = pdfDoc.getPages();
      const { r, g, b } = hexToRgbRatio(color);

      pages.forEach(page => {
        const { width, height } = page.getSize();
        page.drawText(watermarkText || 'CONFIDENTIAL', {
          x: width / 4,
          y: height / 2,
          size: fontSize,
          color: rgb(r, g, b),
          opacity: opacity,
          rotate: degrees(rotation),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
    } catch (err: any) {
      console.error(err);
      setError('Failed to watermark PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const applyWatermarkImage = async () => {
    if (!file || fileType !== 'image') return;
    setIsProcessing(true);
    setProgressMessage('Watermarking image...');
    setError(null);

    try {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          ctx.drawImage(img, 0, 0);

          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.font = `bold ${fontSize * (canvas.width / 800)}px sans-serif`;
          ctx.fillStyle = color;
          ctx.globalAlpha = opacity;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(watermarkText || 'CONFIDENTIAL', 0, 0);
          ctx.restore();

          canvas.toBlob((blob) => {
            if (blob) {
              setResultUrl(URL.createObjectURL(blob));
            }
            setIsProcessing(false);
          }, 'image/png');
        };
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error(err);
      setError('Failed to watermark image.');
      setIsProcessing(false);
    }
  };

  return (
    <>
      <SEO
        title="Watermark PDF & Image Free Online | Add Text & Stamp | img365.in"
        description="Add custom text watermarks to PDF files and photos online for free. Control font size, opacity, rotation angle, and color. 100% private, client-side & offline."
        keywords="watermark pdf, watermark image, add watermark to pdf, photo watermark, confidential stamp pdf, free watermark tool"
        toolName="Watermark Tool - PDF & Image Stamping"
        faqs={[
          { question: "How do I add a watermark text to a PDF?", answer: "Upload your PDF or image file, enter your desired watermark text (e.g. CONFIDENTIAL or DO NOT COPY), adjust opacity and rotation, then click Apply Watermark." },
          { question: "Can I adjust watermark transparency and rotation angle?", answer: "Yes! You can adjust opacity from 10% to 100%, change font size, pick text colors, and rotate from -90 degrees to 90 degrees." },
          { question: "Is my watermarked document uploaded to a server?", answer: "No! All stamping occurs locally in your browser. Your files never leave your personal computer or mobile device." }
        ]}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 space-y-8">
            
            {/* Header Title */}
            <div className="flex items-center space-x-3 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-xl">
                <Stamp className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">PDF & Image Watermark</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add custom text stamps, security text, or branding onto PDF documents & photos.
                </p>
              </div>
            </div>

            {/* Dropzone */}
            {!file && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('watermark-input')?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-[0.99]'
                    : 'border-gray-300 dark:border-gray-700 hover:border-purple-500 bg-gray-50/50 dark:bg-gray-800/50'
                }`}
              >
                <input
                  id="watermark-input"
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-purple-100 dark:bg-purple-900/50 rounded-full mb-3 text-purple-600 dark:text-purple-400">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Drag & Drop PDF or Image file
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Supports .pdf documents and image formats (.png, .jpg, .webp)
                  </p>
                  <button
                    type="button"
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm rounded-xl shadow-md transition-colors"
                  >
                    Select File
                  </button>
                </div>
              </div>
            )}

            {/* Processing State */}
            {isProcessing && (
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl flex items-center space-x-3 text-purple-700 dark:text-purple-300 text-sm">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{progressMessage}</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center space-x-3 text-red-700 dark:text-red-300 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Watermark Configuration Options */}
            {file && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    {fileType === 'pdf' ? <FileText className="w-6 h-6 text-red-500" /> : <ImageIcon className="w-6 h-6 text-blue-500" />}
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate max-w-xs">{file.name}</h4>
                      <p className="text-xs text-gray-500 uppercase">{fileType}</p>
                    </div>
                  </div>
                  <button onClick={() => { setFile(null); setResultUrl(null); }} className="text-xs text-red-600 hover:underline">Change File</button>
                </div>

                {/* Settings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-gray-50 dark:bg-gray-900/60 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Watermark Text</label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={e => setWatermarkText(e.target.value)}
                      placeholder="e.g. CONFIDENTIAL / DO NOT COPY / DRAFT"
                      className="w-full text-xs p-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Font Size: {fontSize}px</label>
                    <input
                      type="range"
                      min="16"
                      max="72"
                      value={fontSize}
                      onChange={e => setFontSize(parseInt(e.target.value, 10))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Opacity: {Math.round(opacity * 100)}%</label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={opacity}
                      onChange={e => setOpacity(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Rotation: {rotation}°</label>
                    <input
                      type="range"
                      min="-90"
                      max="90"
                      step="5"
                      value={rotation}
                      onChange={e => setRotation(parseInt(e.target.value, 10))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Watermark Color</label>
                    <input
                      type="color"
                      value={color}
                      onChange={e => setColor(e.target.value)}
                      className="w-full h-9 p-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer"
                    />
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={fileType === 'pdf' ? applyWatermarkPDF : applyWatermarkImage}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center space-x-2"
                >
                  <Stamp className="w-5 h-5" />
                  <span>Apply Watermark & Generate File</span>
                </button>

                {/* Result Card */}
                {resultUrl && (
                  <div className="p-5 bg-purple-50 dark:bg-purple-900/20 border border-purple-500 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-purple-600" />
                      <span className="text-sm font-bold text-gray-900 dark:text-white">Watermarked File Ready!</span>
                    </div>
                    <a
                      href={resultUrl}
                      download={`watermarked_${file.name}`}
                      className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center space-x-2 shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download File</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8">
              <ToolsMenu />
              <SuggestedTools tools={['Sign PDF', 'Merge PDF', 'Image to PDF']} />
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Watermark;
