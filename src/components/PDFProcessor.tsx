import JSZip from 'jszip';
import React, { useState, useCallback, useEffect } from 'react';
import { Upload, Download, Settings, FileText, Image as ImageIcon, Trash2, AlertCircle, FileArchive } from 'lucide-react';
import { formatFileSize } from '../utils/helpers';

interface PDFProcessorProps {
  mode: 'imageToPdf' | 'pdfToImage';
  title: string;
  description: string;
}

// Type definitions for lazy-loaded module
interface FormatOption {
  value: string;
  label: string;
  extension: string;
}

interface PageSizeOption {
  value: string;
  label: string;
}

export const PDFProcessor: React.FC<PDFProcessorProps> = ({ mode, title, description }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [processedFiles, setProcessedFiles] = useState<Blob[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lazy-loaded format and page size options
  const [formats, setFormats] = useState<FormatOption[]>([
    { value: 'jpeg', label: 'JPEG', extension: 'jpg' },
    { value: 'png', label: 'PNG', extension: 'png' },
    { value: 'webp', label: 'WebP', extension: 'webp' },
  ]);
  const [pageSizes, setPageSizes] = useState<PageSizeOption[]>([
    { value: 'A4', label: 'A4 (210 × 297 mm)' },
    { value: 'Letter', label: 'Letter (8.5 × 11 in)' },
    { value: 'Legal', label: 'Legal (8.5 × 14 in)' },
    { value: 'A3', label: 'A3 (297 × 420 mm)' },
    { value: 'A5', label: 'A5 (148 × 210 mm)' },
  ]);

  // PDF settings
  const [pdfSettings, setPdfSettings] = useState({
    pageSize: 'A4' as const,
    orientation: 'portrait' as const,
    margin: 10,
    fitToPage: true,
    quality: 80,
    dpi: 150,
    outputFormat: 'jpeg',
  });

  // Load options from module when user has files (prepares for processing)
  useEffect(() => {
    if (files.length > 0) {
      import('../utils/pdfProcessor').then((module) => {
        setFormats(module.getSupportedPDFFormats());
        setPageSizes(module.getPDFPageSizes());
      }).catch(console.error);
    }
  }, [files.length > 0]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => {
      if (mode === 'imageToPdf') {
        return file.type.startsWith('image/');
      } else {
        return file.type === 'application/pdf';
      }
    });

    if (droppedFiles.length > 0) {
      setFiles(prev => [...prev, ...droppedFiles]);
    } else {
      setError(`Please drop ${mode === 'imageToPdf' ? 'image' : 'PDF'} files only.`);
    }
  }, [mode]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
    setError(null);
  };

  const processFiles = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Dynamic import - PDF libraries only load when user clicks process
      const { convertImagesToPDF, convertPDFToImages } = await import('../utils/pdfProcessor');

      if (mode === 'imageToPdf') {
        const pdfBlob = await convertImagesToPDF(files, {
          quality: pdfSettings.quality,
          pageSize: pdfSettings.pageSize,
          orientation: pdfSettings.orientation,
          margin: pdfSettings.margin,
          fitToPage: pdfSettings.fitToPage,
        });
        setProcessedFiles([pdfBlob]);
      } else {
        // PDF to Images
        const imageBlobs: Blob[] = [];
        for (const file of files) {
          const images = await convertPDFToImages(file, {
            format: pdfSettings.outputFormat,
            quality: pdfSettings.quality,
            dpi: pdfSettings.dpi,
          });
          imageBlobs.push(...images);
        }
        setProcessedFiles(imageBlobs);
      }
    } catch (error) {
      console.error('Processing error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during processing');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = (blob: Blob, index: number) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    if (mode === 'imageToPdf') {
      a.download = `img365document.pdf`;
    } else {
      const format = formats.find(f => f.value === pdfSettings.outputFormat);
      a.download = `img365page${index + 1}.${format?.extension || 'jpg'}`;
    }

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllZip = async () => {
    if (processedFiles.length === 0) return;
    try {
      const zip = new JSZip();
      const format = formats.find(f => f.value === pdfSettings.outputFormat);
      const ext = format?.extension || 'jpg';

      processedFiles.forEach((blob, idx) => {
        zip.file(`page_${idx + 1}.${ext}`, blob);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pdf_extracted_pages_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating zip:', err);
    }
  };

  const downloadAll = () => {
    if (mode === 'pdfToImage' && processedFiles.length > 1) {
      downloadAllZip();
    } else {
      processedFiles.forEach((file, index) => downloadFile(file, index));
    }
  };

  const clearFiles = () => {
    setFiles([]);
    setProcessedFiles([]);
    setError(null);
  };

  useEffect(() => {
    if (processedFiles.length > 0) {
      const el = document.getElementById('results-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [processedFiles]);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const acceptedTypes = mode === 'imageToPdf' ? 'image/*' : 'application/pdf';
  const fileTypeText = mode === 'imageToPdf' ? 'image files' : 'PDF files';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{description}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${dragActive
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {mode === 'imageToPdf' ? (
          <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        ) : (
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        )}
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          Drop your {fileTypeText} here
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          or click to browse files
        </p>
        <input
          type="file"
          multiple={mode === 'imageToPdf'}
          accept={acceptedTypes}
          onChange={handleFileInput}
          className="hidden"
          id="pdf-file-input"
        />
        <label
          htmlFor="pdf-file-input"
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors"
        >
          <Upload className="w-5 h-5 mr-2" />
          Choose Files
        </label>
        <p className="text-sm text-gray-400 mt-2">
          {mode === 'imageToPdf'
            ? 'Supports JPG, PNG, WEBP, HEIC and more'
            : 'Supports PDF files (non-password protected)'
          }
        </p>
      </div>

      {/* Settings */}
      {files.length > 0 && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Settings className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mode === 'imageToPdf' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Page Size
                  </label>
                  <select
                    value={pdfSettings.pageSize}
                    onChange={(e) => setPdfSettings(prev => ({ ...prev, pageSize: e.target.value as typeof prev.pageSize }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {pageSizes.map(size => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Orientation
                  </label>
                  <select
                    value={pdfSettings.orientation}
                    onChange={(e) => setPdfSettings(prev => ({ ...prev, orientation: e.target.value as typeof prev.orientation }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Margin: {pdfSettings.margin}mm
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={pdfSettings.margin}
                    onChange={(e) => setPdfSettings(prev => ({ ...prev, margin: Number(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Output Format
                  </label>
                  <select
                    value={pdfSettings.outputFormat}
                    onChange={(e) => setPdfSettings(prev => ({ ...prev, outputFormat: e.target.value }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {formats.map(format => (
                      <option key={format.value} value={format.value}>
                        {format.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    DPI: {pdfSettings.dpi}
                  </label>
                  <input
                    type="range"
                    min="72"
                    max="300"
                    step="1"
                    value={pdfSettings.dpi}
                    onChange={(e) => setPdfSettings(prev => ({ ...prev, dpi: Number(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quality: {pdfSettings.quality}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={pdfSettings.quality}
                onChange={(e) => setPdfSettings(prev => ({ ...prev, quality: Number(e.target.value) }))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          {mode === 'imageToPdf' && (
            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={pdfSettings.fitToPage}
                  onChange={(e) => setPdfSettings(prev => ({ ...prev, fitToPage: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Fit images to page size
                </span>
              </label>
            </div>
          )}

          <button
            onClick={processFiles}
            disabled={isProcessing}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Settings className="w-5 h-5 mr-2" />
                {mode === 'imageToPdf' ? 'Create PDF' : 'Extract Images'}
              </>
            )}
          </button>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Files ({files.length})
            </h3>
            <button
              onClick={clearFiles}
              className="text-red-600 hover:text-red-700 flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear All
            </button>
          </div>

          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  {mode === 'imageToPdf' ? (
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <FileText className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {processedFiles.length > 0 && (
        <div id="results-section" className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {mode === 'imageToPdf' ? 'Generated PDF' : `Extracted Images (${processedFiles.length})`}
            </h3>
            {processedFiles.length > 1 && (
              <button
                onClick={downloadAll}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download All
              </button>
            )}
          </div>

          <div className="space-y-4">
            {processedFiles.map((file, index) => (
              <div key={index} className="border dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {mode === 'imageToPdf'
                        ? 'img365document.pdf'
                        : `img365page${index + 1}.${formats.find(f => f.value === pdfSettings.outputFormat)?.extension || 'jpg'}`
                      }
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    onClick={() => downloadFile(file, index)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};