import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Download, Settings, Trash2, AlertCircle } from 'lucide-react';
import { enhanceDocumentImage } from '../utils/imageEnhancer';
import { formatFileSize } from '../utils/helpers';
import { findDocumentContour, cropToContour, Point } from '../utils/borderDetection';

export const CameraProcessor: React.FC = () => {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [processedPDF, setProcessedPDF] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [settings, setSettings] = useState({
    enhanceMode: 'document' as 'document' | 'photo' | 'grayscale',
    sharpen: true,
    autoContrast: true,
    pageSize: 'A4' as const,
    orientation: 'portrait' as const,
    autoBorderDetection: true,
  });

  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [detectedContour, setDetectedContour] = useState<Point[] | null>(null);
  const detectionFrameRef = useRef<number | null>(null);
  const detectionTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (processedPDF) {
      const el = document.getElementById('results-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [processedPDF]);

  const startCamera = async () => {
    try {
      let stream: MediaStream | null = null;

      // 1. Try environment camera (rear camera on phones)
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } }
        });
      } catch {
        // 2. Try front camera
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' }
          });
        } catch {
          // 3. Try any available camera stream
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        }
      }

      if (!stream) {
        throw new Error('No video stream available.');
      }

      streamRef.current = stream;
      setShowCamera(true);
      setError(null);

      // Allow video element to mount before setting srcObject
      setTimeout(async () => {
        if (videoRef.current && streamRef.current) {
          videoRef.current.srcObject = streamRef.current;
          try {
            await videoRef.current.play();
          } catch (e) {
            console.warn('Video play interrupted:', e);
          }
        }
      }, 100);
    } catch (err) {
      setError('Could not access camera. Please allow camera permissions in your browser or upload document images directly.');
      console.error('Camera access error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (detectionFrameRef.current) {
      cancelAnimationFrame(detectionFrameRef.current);
      detectionFrameRef.current = null;
    }
    if (detectionTimeoutRef.current) {
      clearTimeout(detectionTimeoutRef.current);
      detectionTimeoutRef.current = null;
    }
    setShowCamera(false);
    setDetectedContour(null);
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);

    let finalCanvas = canvas;

    // Apply border detection and cropping on full-resolution capture
    if (settings.autoBorderDetection) {
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const contour = detectedContour && detectedContour.length === 4 ? detectedContour : findDocumentContour(imageData);
        if (contour && contour.length === 4) {
          finalCanvas = cropToContour(canvas, contour);
        }
      } catch (error) {
        console.error('Error cropping to contour during capture:', error);
      }
    }

    finalCanvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        const preview = URL.createObjectURL(blob);
        setImages(prev => [...prev, { file, preview }]);
      }
    }, 'image/jpeg', 0.95);

    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const preview = URL.createObjectURL(file);
        setImages(prev => [...prev, { file, preview }]);
      }
    });
    setError(null);
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const clearAll = () => {
    images.forEach(img => URL.revokeObjectURL(img.preview));
    setImages([]);
    setProcessedPDF(null);
    setError(null);
  };

  const processAndConvert = async () => {
    if (images.length === 0) return;

    setIsProcessing(true);
    setError(null);

    try {
      const enhancedFiles: File[] = [];

      for (const img of images) {
        const enhanced = await enhanceDocumentImage(img.file, {
          mode: settings.enhanceMode,
          sharpen: settings.sharpen,
          autoContrast: settings.autoContrast,
        });
        enhancedFiles.push(enhanced);
      }

      // Dynamic import - PDF library only loads when user clicks convert
      const { convertImagesToPDF } = await import('../utils/pdfProcessor');

      const pdfBlob = await convertImagesToPDF(enhancedFiles, {
        quality: 90,
        pageSize: settings.pageSize,
        orientation: settings.orientation,
        margin: 10,
        fitToPage: true,
      });

      setProcessedPDF(pdfBlob);
    } catch (err) {
      console.error('Processing error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during processing');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPDF = () => {
    if (!processedPDF) return;

    const url = URL.createObjectURL(processedPDF);
    const a = document.createElement('a');
    a.href = url;
    a.download = `img365docscanner.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Border detection effect - runs when camera is on and border detection is enabled
  useEffect(() => {
    if (!showCamera || !settings.autoBorderDetection || !videoRef.current || !overlayCanvasRef.current) {
      setDetectedContour(null);
      if (overlayCanvasRef.current) {
        const ctx = overlayCanvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
        }
      }
      return;
    }

    const detectBorders = async () => {
      if (!videoRef.current || !overlayCanvasRef.current) return;

      const video = videoRef.current;
      const overlay = overlayCanvasRef.current;

      // Check if video is ready
      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        detectionFrameRef.current = requestAnimationFrame(detectBorders);
        return;
      }

      // Get video display dimensions
      const videoRect = video.getBoundingClientRect();
      const displayWidth = videoRect.width;
      const displayHeight = videoRect.height;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Set overlay canvas size to match video display size
      if (overlay.width !== displayWidth || overlay.height !== displayHeight) {
        overlay.width = displayWidth;
        overlay.height = displayHeight;
      }

      try {
        // Create temporary canvas to get image data (use actual video dimensions)
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = videoWidth;
        tempCanvas.height = videoHeight;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) {
          detectionFrameRef.current = requestAnimationFrame(detectBorders);
          return;
        }

        tempCtx.drawImage(video, 0, 0);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

        // Detect document contour (in video coordinate space)
        const contour = findDocumentContour(imageData);
        setDetectedContour(contour);

        // Draw overlay (scale coordinates to display size)
        const overlayCtx = overlay.getContext('2d');
        if (overlayCtx) {
          overlayCtx.clearRect(0, 0, overlay.width, overlay.height);

          if (contour && contour.length === 4) {
            const scaleX = displayWidth / videoWidth;
            const scaleY = displayHeight / videoHeight;

            overlayCtx.strokeStyle = '#00ff00'; // Neon green
            overlayCtx.lineWidth = 2;
            overlayCtx.beginPath();
            overlayCtx.moveTo(contour[0].x * scaleX, contour[0].y * scaleY);
            for (let i = 1; i < contour.length; i++) {
              overlayCtx.lineTo(contour[i].x * scaleX, contour[i].y * scaleY);
            }
            overlayCtx.closePath();
            overlayCtx.stroke();
          }
        }
      } catch (error) {
        console.error('Error detecting borders:', error);
      }

      // Continue detection loop (throttle to ~10fps for performance)
      detectionTimeoutRef.current = window.setTimeout(() => {
        detectionFrameRef.current = requestAnimationFrame(detectBorders);
      }, 100);
    };

    detectBorders();

    return () => {
      if (detectionFrameRef.current) {
        cancelAnimationFrame(detectionFrameRef.current);
        detectionFrameRef.current = null;
      }
      if (detectionTimeoutRef.current) {
        clearTimeout(detectionTimeoutRef.current);
        detectionTimeoutRef.current = null;
      }
    };
  }, [showCamera, settings.autoBorderDetection]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Camera to PDF Scanner
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Capture documents with your camera or upload images. Automatic enhancement and PDF conversion.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      )}

      {showCamera ? (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="relative w-full mb-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg"
            />
            <canvas
              ref={overlayCanvasRef}
              className="absolute top-0 left-0 pointer-events-none rounded-lg"
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={capturePhoto}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <Camera className="w-5 h-5 mr-2" />
              Capture Photo
            </button>
            <button
              onClick={stopCamera}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={startCamera}
              className="flex items-center justify-center py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Camera className="w-6 h-6 mr-2" />
              Open Camera
            </button>

            <label className="flex items-center justify-center py-4 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors cursor-pointer">
              <Upload className="w-6 h-6 mr-2" />
              Upload Images
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Settings className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Enhancement Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enhancement Mode
              </label>
              <select
                value={settings.enhanceMode}
                onChange={(e) => setSettings(prev => ({ ...prev, enhanceMode: e.target.value as any }))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="document">Document (B&W High Contrast)</option>
                <option value="grayscale">Grayscale</option>
                <option value="photo">Photo (Color)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Page Size
              </label>
              <select
                value={settings.pageSize}
                onChange={(e) => setSettings(prev => ({ ...prev, pageSize: e.target.value as any }))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="A4">A4</option>
                <option value="Letter">Letter</option>
                <option value="Legal">Legal</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-6 mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.sharpen}
                onChange={(e) => setSettings(prev => ({ ...prev, sharpen: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Text Sharpening</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.autoContrast}
                onChange={(e) => setSettings(prev => ({ ...prev, autoContrast: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Auto Contrast</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.autoBorderDetection}
                onChange={(e) => setSettings(prev => ({ ...prev, autoBorderDetection: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Auto Border Detection</span>
            </label>
          </div>

          <button
            onClick={processAndConvert}
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Settings className="w-5 h-5 mr-2" />
                Convert to PDF
              </>
            )}
          </button>
        </div>
      )}

      {images.length > 0 && (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Captured Images ({images.length})
            </h3>
            <button
              onClick={clearAll}
              className="text-red-600 hover:text-red-700 flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img.preview}
                  alt={`Capture ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  {formatFileSize(img.file.size)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {processedPDF && (
        <div id="results-section" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            PDF Ready!
          </h3>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                img365docscanner.pdf
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatFileSize(processedPDF.size)}
              </p>
            </div>
            <button
              onClick={downloadPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
