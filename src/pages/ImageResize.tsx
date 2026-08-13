import React, { useState, useCallback, useRef } from 'react';
import { Upload, Image as ImageIcon, Download, Loader2, AlertCircle, CheckCircle, Lock, Unlock } from 'lucide-react';
import { ToolsMenu } from '../components/ToolsMenu';
import { SuggestedTools } from '../components/SuggestedTools';
import { SEO } from '../components/SEO';

interface ResizeResult {
    blob: Blob;
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
}

export const ImageResize: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
    const [targetWidth, setTargetWidth] = useState<number>(0);
    const [targetHeight, setTargetHeight] = useState<number>(0);
    const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
    const [resizeMode, setResizeMode] = useState<'pixels' | 'percentage'>('pixels');
    const [percentage, setPercentage] = useState<number>(100);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<ResizeResult | null>(null);
    const [resultPreview, setResultPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [outputFormat, setOutputFormat] = useState<string>('jpeg');
    const [quality, setQuality] = useState<number>(90);
    const aspectRatio = useRef<number>(1);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = Array.from(e.dataTransfer.files).find(
            f => f.type.startsWith('image/')
        );

        if (droppedFile) {
            loadImage(droppedFile);
        }
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            loadImage(e.target.files[0]);
        }
    }, []);

    const loadImage = (imageFile: File) => {
        setFile(imageFile);
        setResult(null);
        setResultPreview(null);
        setError(null);

        const url = URL.createObjectURL(imageFile);
        setPreview(url);

        const img = new Image();
        img.onload = () => {
            setOriginalDimensions({ width: img.width, height: img.height });
            setTargetWidth(img.width);
            setTargetHeight(img.height);
            aspectRatio.current = img.width / img.height;
        };
        img.src = url;
    };

    const handleWidthChange = (value: number) => {
        setTargetWidth(value);
        if (maintainAspectRatio) {
            setTargetHeight(Math.round(value / aspectRatio.current));
        }
    };

    const handleHeightChange = (value: number) => {
        setTargetHeight(value);
        if (maintainAspectRatio) {
            setTargetWidth(Math.round(value * aspectRatio.current));
        }
    };

    const handlePercentageChange = (value: number) => {
        setPercentage(value);
        setTargetWidth(Math.round(originalDimensions.width * value / 100));
        setTargetHeight(Math.round(originalDimensions.height * value / 100));
    };

    const handleResize = async () => {
        if (!file || !preview) return;

        setIsProcessing(true);
        setError(null);

        try {
            const img = new Image();
            img.src = preview;
            await new Promise((resolve) => { img.onload = resolve; });

            const canvas = document.createElement('canvas');
            canvas.width = targetWidth;
            canvas.height = targetHeight;

            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');

            // Use high-quality image rendering
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

            const mimeType = outputFormat === 'jpeg' ? 'image/jpeg' : `image/${outputFormat}`;

            const blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob(
                    (b) => b ? resolve(b) : reject(new Error('Failed to create blob')),
                    mimeType,
                    quality / 100
                );
            });

            const resultUrl = URL.createObjectURL(blob);
            setResultPreview(resultUrl);
            setResult({
                blob,
                width: targetWidth,
                height: targetHeight,
                originalWidth: originalDimensions.width,
                originalHeight: originalDimensions.height
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to resize image');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!result || !file) return;

        const url = URL.createObjectURL(result.blob);
        const a = document.createElement('a');
        a.href = url;
        const extension = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
        a.download = `img365resized.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <>
            <SEO
                title="Resize Image Online Free - Image Resizer Tool | img365.in"
                description="Resize images online for free. Change image dimensions in pixels or percentage while maintaining quality. 100% client-side, secure and private. Best free image resizer tool in India."
                keywords="resize image online free, image resizer, resize photo, change image size, reduce image dimensions, enlarge image, scale image, free image resizer, online image resizer, batch resize, change picture size"
                toolName="Resize Image - Free Online Image Resizer"
                faqs={[
                    { question: "How do I resize an image without losing quality?", answer: "Our tool uses high-quality image scaling algorithms. For best results when enlarging, don't exceed 200% of the original size." },
                    { question: "Can I maintain aspect ratio while resizing?", answer: "Yes! The 'Lock Aspect Ratio' option ensures your image proportions stay the same when you change width or height." },
                    { question: "What image formats are supported?", answer: "You can resize JPEG, PNG, WebP, GIF, and BMP images. Output can be saved as JPEG, PNG, or WebP." },
                    { question: "Is there a file size limit?", answer: "Since processing happens in your browser, there's no server limit. However, very large images may be slower on older devices." },
                ]}
            />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="container mx-auto px-4 mb-8">
                    <div className="max-w-6xl mx-auto">
                        <ToolsMenu />
                    </div>
                </div>

                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                Resize Image
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                Change image dimensions while maintaining quality. Perfect for social media and web.
                            </p>
                        </div>

                        {/* Upload Area */}
                        {!preview && (
                            <div
                                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                                    }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Drag & drop an image here
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    or click to browse
                                </p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileInput}
                                    className="hidden"
                                    id="image-input"
                                />
                                <label
                                    htmlFor="image-input"
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium cursor-pointer transition-colors"
                                >
                                    Select Image
                                </label>
                            </div>
                        )}

                        {/* Image Preview and Controls */}
                        {preview && !result && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                                {/* Preview */}
                                <div className="p-4 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="max-w-full max-h-64 object-contain"
                                    />
                                </div>

                                {/* Controls */}
                                <div className="p-6 space-y-6">
                                    {/* Original Dimensions */}
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Original: {originalDimensions.width} × {originalDimensions.height} pixels
                                    </div>

                                    {/* Resize Mode Toggle */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setResizeMode('pixels')}
                                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${resizeMode === 'pixels'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            By Pixels
                                        </button>
                                        <button
                                            onClick={() => setResizeMode('percentage')}
                                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${resizeMode === 'percentage'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            By Percentage
                                        </button>
                                    </div>

                                    {resizeMode === 'pixels' ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Width (px)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={targetWidth}
                                                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Height (px)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={targetHeight}
                                                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Scale: {percentage}%
                                            </label>
                                            <input
                                                type="range"
                                                min="1"
                                                max="200"
                                                value={percentage}
                                                onChange={(e) => handlePercentageChange(Number(e.target.value))}
                                                className="w-full"
                                            />
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                Result: {targetWidth} × {targetHeight} pixels
                                            </div>
                                        </div>
                                    )}

                                    {/* Aspect Ratio Lock */}
                                    <button
                                        onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                                        className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${maintainAspectRatio
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                            }`}
                                    >
                                        {maintainAspectRatio ? (
                                            <><Lock className="w-4 h-4 mr-2" /> Aspect Ratio Locked</>
                                        ) : (
                                            <><Unlock className="w-4 h-4 mr-2" /> Aspect Ratio Unlocked</>
                                        )}
                                    </button>

                                    {/* Output Format */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Output Format
                                            </label>
                                            <select
                                                value={outputFormat}
                                                onChange={(e) => setOutputFormat(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            >
                                                <option value="jpeg">JPEG</option>
                                                <option value="png">PNG</option>
                                                <option value="webp">WebP</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Quality: {quality}%
                                            </label>
                                            <input
                                                type="range"
                                                min="1"
                                                max="100"
                                                value={quality}
                                                onChange={(e) => setQuality(Number(e.target.value))}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    {/* Resize Button */}
                                    <button
                                        onClick={handleResize}
                                        disabled={isProcessing}
                                        className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                                    >
                                        {isProcessing ? (
                                            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Resizing...</>
                                        ) : (
                                            <><ImageIcon className="w-5 h-5 mr-2" /> Resize Image</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
                                <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                                <p className="text-red-700 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        {/* Result */}
                        {result && resultPreview && (
                            <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                                <div className="flex items-center justify-center mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                                    <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">
                                        Image Resized Successfully!
                                    </h3>
                                </div>

                                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 flex items-center justify-center">
                                    <img src={resultPreview} alt="Resized" className="max-w-full max-h-64 object-contain" />
                                </div>

                                <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
                                    {result.originalWidth}×{result.originalHeight} → {result.width}×{result.height} pixels ({formatFileSize(result.blob.size)})
                                </p>

                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={handleDownload}
                                        className="inline-flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        <Download className="w-5 h-5 mr-2" />
                                        Download Resized Image
                                    </button>
                                    <button
                                        onClick={() => { setResult(null); setResultPreview(null); }}
                                        className="px-6 py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        Resize Again
                                    </button>
                                </div>
                            </div>
                        )}

                        <SuggestedTools tools={['Image Crop', 'Image Compressor', 'Image Converter']} />

                        {/* SEO Content */}
                        <div className="mt-16">
                            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                                Professional Image Resizer
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Features</h3>
                                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                        <li>• Resize by pixels or percentage</li>
                                        <li>• Maintain aspect ratio</li>
                                        <li>• Multiple output formats</li>
                                        <li>• Adjustable quality</li>
                                        <li>• 100% client-side</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Use Cases</h3>
                                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                        <li>• Social media profile pictures</li>
                                        <li>• Website thumbnails</li>
                                        <li>• Email-friendly images</li>
                                        <li>• Print preparation</li>
                                        <li>• Mobile wallpapers</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
