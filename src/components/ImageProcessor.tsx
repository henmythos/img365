import React, { useState, useCallback } from 'react';
import JSZip from 'jszip';
import { Upload, Download, Settings, Eye, Trash2, FileImage, FileArchive } from 'lucide-react';

interface ProcessedImage {
  id: string;
  originalFile: File;
  processedBlob: Blob;
  originalSize: number;
  processedSize: number;
  outputFormat: string;
  quality: number;
}

interface ImageProcessorProps {
  mode: 'convert' | 'compress' | 'both';
  title: string;
  description: string;
}

export const ImageProcessor: React.FC<ImageProcessorProps> = ({ mode, title, description }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [outputFormat, setOutputFormat] = useState('jpeg');
  const [quality, setQuality] = useState(80);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  const supportedFormats = ['jpeg', 'jpg', 'png', 'webp', 'avif', 'bmp'];

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

    const droppedFiles = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );

    if (droppedFiles.length > 0) {
      setFiles(prev => [...prev, ...droppedFiles]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const processImages = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    const results: ProcessedImage[] = [];

    // Process images in non-blocking batches for smooth UI on bulk operations
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const processedBlob = await processImage(file, {
          format: outputFormat,
          quality: quality / 100,
          maxWidth: 3840,
          maxHeight: 2160,
        });

        results.push({
          id: Math.random().toString(36).substr(2, 9),
          originalFile: file,
          processedBlob,
          originalSize: file.size,
          processedSize: processedBlob.size,
          outputFormat,
          quality,
        });

        // Update UI progressively
        setProcessedImages([...results]);

        // Yield to event loop to keep main UI thread responsive during bulk jobs
        await new Promise(r => setTimeout(r, 0));
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }

    setIsProcessing(false);
  };

  const downloadImage = (processedImage: ProcessedImage) => {
    const url = URL.createObjectURL(processedImage.processedBlob);
    const a = document.createElement('a');
    a.href = url;
    const baseName = processedImage.originalFile.name.substring(0, processedImage.originalFile.name.lastIndexOf('.')) || 'image';
    a.download = `img365_${baseName}.${processedImage.outputFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllZip = async () => {
    if (processedImages.length === 0) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      processedImages.forEach((img, idx) => {
        const baseName = img.originalFile.name.substring(0, img.originalFile.name.lastIndexOf('.')) || `image_${idx + 1}`;
        zip.file(`${baseName}.${img.outputFormat}`, img.processedBlob);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `img365_processed_images_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const downloadAll = () => {
    downloadAllZip();
  };

  const clearFiles = () => {
    setFiles([]);
    setProcessedImages([]);
    setShowPreview(null);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getCompressionRatio = (original: number, processed: number) => {
    return Math.round((1 - processed / original) * 100);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{description}</p>
      </div>

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
        <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          Drop your images here
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          or click to browse files
        </p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="file-input"
        />
        <label
          htmlFor="file-input"
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors"
        >
          <FileImage className="w-5 h-5 mr-2" />
          Choose Files
        </label>
        <p className="text-sm text-gray-400 mt-2">
          Supports JPG, PNG, HEIC, WEBP, AVIF, BMP, TIFF and more
        </p>
      </div>

      {/* Settings */}
      {files.length > 0 && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Settings className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(mode === 'convert' || mode === 'both') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Output Format
                </label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {supportedFormats.map(format => (
                    <option key={format} value={format}>
                      {format.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(mode === 'compress' || mode === 'both') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quality: {quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Smaller size</span>
                  <span>Better quality</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={processImages}
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
                Process Images
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
                  <FileImage className="w-5 h-5 text-gray-400" />
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
      {processedImages.length > 0 && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Processed Images ({processedImages.length})
            </h3>
            <button
              onClick={downloadAllZip}
              disabled={isZipping}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 shadow-md"
            >
              {isZipping ? (
                <span>Generating ZIP...</span>
              ) : (
                <>
                  <FileArchive className="w-4 h-4" />
                  <span>Download All (ZIP)</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-4">
            {processedImages.map((img) => (
              <div key={img.id} className="border dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {img.originalFile.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(img.originalSize)} → {formatFileSize(img.processedSize)}
                      {img.processedSize < img.originalSize && (
                        <span className="text-green-600 ml-2">
                          ({getCompressionRatio(img.originalSize, img.processedSize)}% smaller)
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowPreview(img.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => downloadImage(img)}
                      className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {img.outputFormat.toUpperCase()}
                  </span>
                  <span className="mx-2">•</span>
                  <span>Quality: {img.quality}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl max-h-full overflow-auto">
            <div className="p-4 border-b dark:border-gray-600">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Image Preview
                </h3>
                <button
                  onClick={() => setShowPreview(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-4">
              {processedImages.find(img => img.id === showPreview) && (
                <img
                  src={URL.createObjectURL(processedImages.find(img => img.id === showPreview)!.processedBlob)}
                  alt="Preview"
                  className="max-w-full max-h-96 mx-auto rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};