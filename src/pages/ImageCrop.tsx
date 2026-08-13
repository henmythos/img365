import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, Crop, Download, Loader2, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';
import { ToolsMenu } from '../components/ToolsMenu';
import { SuggestedTools } from '../components/SuggestedTools';
import { SEO } from '../components/SEO';

interface CropArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

const ASPECT_RATIOS = [
    { label: 'Free', value: null },
    { label: '1:1 (Square)', value: 1 },
    { label: '4:3', value: 4 / 3 },
    { label: '3:4', value: 3 / 4 },
    { label: '16:9', value: 16 / 9 },
    { label: '9:16', value: 9 / 16 },
    { label: 'A4', value: 210 / 297 },
];

export const ImageCrop: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 });
    const [aspectRatio, setAspectRatio] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeHandle, setResizeHandle] = useState<string | null>(null);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<Blob | null>(null);
    const [resultPreview, setResultPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [outputFormat, setOutputFormat] = useState<string>('jpeg');
    const [quality, setQuality] = useState<number>(90);
    const [scale, setScale] = useState(1);

    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

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

        const droppedFile = Array.from(e.dataTransfer.files).find(f => f.type.startsWith('image/'));
        if (droppedFile) loadImage(droppedFile);
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) loadImage(e.target.files[0]);
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
            setImageDimensions({ width: img.width, height: img.height });
            // Initialize crop area to 80% of image, centered
            const cropW = img.width * 0.8;
            const cropH = img.height * 0.8;
            setCropArea({
                x: (img.width - cropW) / 2,
                y: (img.height - cropH) / 2,
                width: cropW,
                height: cropH
            });
        };
        img.src = url;
    };

    useEffect(() => {
        if (imageRef.current && containerRef.current) {
            const containerWidth = containerRef.current.clientWidth - 32;
            const newScale = Math.min(1, containerWidth / imageDimensions.width);
            setScale(newScale);
        }
    }, [imageDimensions]);

    const handleAspectRatioChange = (ratio: number | null) => {
        setAspectRatio(ratio);
        if (ratio && imageDimensions.width > 0) {
            const newHeight = cropArea.width / ratio;
            setCropArea(prev => ({
                ...prev,
                height: Math.min(newHeight, imageDimensions.height - prev.y)
            }));
        }
    };

    const handleCropAreaMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setStartPos({ x: e.clientX - cropArea.x * scale, y: e.clientY - cropArea.y * scale });
        setIsDragging(true);
    };

    const handleResizeMouseDown = (e: React.MouseEvent, handle: string) => {
        e.stopPropagation();
        setResizeHandle(handle);
        setIsResizing(true);
        setStartPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isDragging && !isResizing) {
            const newX = Math.max(0, Math.min((e.clientX - startPos.x) / scale, imageDimensions.width - cropArea.width));
            const newY = Math.max(0, Math.min((e.clientY - startPos.y) / scale, imageDimensions.height - cropArea.height));
            setCropArea(prev => ({ ...prev, x: newX, y: newY }));
        } else if (isResizing && resizeHandle) {
            const deltaX = (e.clientX - startPos.x) / scale;
            const deltaY = (e.clientY - startPos.y) / scale;
            setStartPos({ x: e.clientX, y: e.clientY });

            setCropArea(prev => {
                let { x, y, width, height } = prev;

                if (resizeHandle.includes('e')) width = Math.max(20, Math.min(width + deltaX, imageDimensions.width - x));
                if (resizeHandle.includes('w')) { x = Math.max(0, x + deltaX); width = Math.max(20, width - deltaX); }
                if (resizeHandle.includes('s')) height = Math.max(20, Math.min(height + deltaY, imageDimensions.height - y));
                if (resizeHandle.includes('n')) { y = Math.max(0, y + deltaY); height = Math.max(20, height - deltaY); }

                if (aspectRatio) {
                    if (resizeHandle.includes('e') || resizeHandle.includes('w')) {
                        height = width / aspectRatio;
                    } else {
                        width = height * aspectRatio;
                    }
                }

                return { x, y, width: Math.min(width, imageDimensions.width - x), height: Math.min(height, imageDimensions.height - y) };
            });
        }
    }, [isDragging, isResizing, resizeHandle, startPos, scale, aspectRatio, imageDimensions, cropArea.width, cropArea.height]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setIsResizing(false);
        setResizeHandle(null);
    }, []);

    useEffect(() => {
        if (isDragging || isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

    const handleCrop = async () => {
        if (!file || !preview) return;
        setIsProcessing(true);
        setError(null);

        try {
            const img = new Image();
            img.src = preview;
            await new Promise((resolve) => { img.onload = resolve; });

            const canvas = document.createElement('canvas');
            canvas.width = Math.round(cropArea.width);
            canvas.height = Math.round(cropArea.height);

            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');

            ctx.drawImage(
                img,
                Math.round(cropArea.x), Math.round(cropArea.y),
                Math.round(cropArea.width), Math.round(cropArea.height),
                0, 0,
                Math.round(cropArea.width), Math.round(cropArea.height)
            );

            const mimeType = outputFormat === 'jpeg' ? 'image/jpeg' : `image/${outputFormat}`;
            const blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob(b => b ? resolve(b) : reject(new Error('Failed')), mimeType, quality / 100);
            });

            setResultPreview(URL.createObjectURL(blob));
            setResult(blob);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to crop image');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!result || !file) return;
        const url = URL.createObjectURL(result);
        const a = document.createElement('a');
        a.href = url;
        a.download = `img365cropped.${outputFormat === 'jpeg' ? 'jpg' : outputFormat}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const resetCrop = () => {
        const cropW = imageDimensions.width * 0.8;
        const cropH = imageDimensions.height * 0.8;
        setCropArea({
            x: (imageDimensions.width - cropW) / 2,
            y: (imageDimensions.height - cropH) / 2,
            width: cropW,
            height: cropH
        });
        setAspectRatio(null);
    };

    return (
        <>
            <SEO
                title="Crop Image Online Free - Image Cropper Tool | img365.in"
                description="Crop images online for free. Custom crop area with preset aspect ratios (1:1, 4:3, 16:9, 9:16). Visual cropping with live preview. 100% client-side, secure and private. Best free image cropper in India."
                keywords="crop image online free, image cropper, cut image, trim image, resize crop, aspect ratio crop, free image cropper, online image cropper, square crop, 16:9 crop, custom crop"
                toolName="Crop Image - Free Online Image Cropper"
                faqs={[
                    { question: "How do I crop an image to a specific size?", answer: "Upload your image, drag the crop area to select the region you want, and use the resize handles to adjust. You can also choose preset aspect ratios like 1:1 for square." },
                    { question: "Can I crop images for social media?", answer: "Yes! Use our preset aspect ratios: 1:1 for Instagram posts, 16:9 for YouTube thumbnails, 9:16 for Stories and Reels." },
                    { question: "Will cropping reduce image quality?", answer: "The cropped area maintains original quality. You can also choose the output format (JPEG, PNG, WebP) and quality level." },
                    { question: "Can I preview the crop before downloading?", answer: "Yes! The crop area shows exactly what will be included in your final image with visual grid lines for precise alignment." },
                ]}
            />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="container mx-auto px-4 mb-8">
                    <div className="max-w-6xl mx-auto"><ToolsMenu /></div>
                </div>

                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Crop Image</h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300">Select and crop the perfect area from your image.</p>
                        </div>

                        {!preview && (
                            <div
                                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Drag & drop an image here</p>
                                <input type="file" accept="image/*" onChange={handleFileInput} className="hidden" id="image-input" />
                                <label htmlFor="image-input" className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium cursor-pointer transition-colors">Select Image</label>
                            </div>
                        )}

                        {preview && !result && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {ASPECT_RATIOS.map(ar => (
                                            <button
                                                key={ar.label}
                                                onClick={() => handleAspectRatioChange(ar.value)}
                                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${aspectRatio === ar.value ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                                            >
                                                {ar.label}
                                            </button>
                                        ))}
                                        <button onClick={resetCrop} className="px-3 py-1 rounded text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center">
                                            <RotateCcw className="w-3 h-3 mr-1" /> Reset
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Crop: {Math.round(cropArea.width)} × {Math.round(cropArea.height)} pixels</p>
                                </div>

                                <div ref={containerRef} className="relative p-4 bg-gray-100 dark:bg-gray-900 overflow-hidden" style={{ cursor: isDragging ? 'grabbing' : 'default' }}>
                                    <div className="relative inline-block" style={{ width: imageDimensions.width * scale, height: imageDimensions.height * scale }}>
                                        <img ref={imageRef} src={preview} alt="Preview" style={{ width: '100%', height: '100%', display: 'block' }} />

                                        {/* Darkened overlay */}
                                        <div className="absolute inset-0 bg-black/50" style={{ clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${cropArea.x * scale}px ${cropArea.y * scale}px, ${cropArea.x * scale}px ${(cropArea.y + cropArea.height) * scale}px, ${(cropArea.x + cropArea.width) * scale}px ${(cropArea.y + cropArea.height) * scale}px, ${(cropArea.x + cropArea.width) * scale}px ${cropArea.y * scale}px, ${cropArea.x * scale}px ${cropArea.y * scale}px)` }} />

                                        {/* Crop selection */}
                                        <div
                                            className="absolute border-2 border-white cursor-move"
                                            style={{ left: cropArea.x * scale, top: cropArea.y * scale, width: cropArea.width * scale, height: cropArea.height * scale }}
                                            onMouseDown={handleCropAreaMouseDown}
                                        >
                                            {/* Grid lines */}
                                            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 33.33%, rgba(255,255,255,0.3) 33.33%, rgba(255,255,255,0.3) 33.5%, transparent 33.5%, transparent 66.66%, rgba(255,255,255,0.3) 66.66%, rgba(255,255,255,0.3) 66.83%, transparent 66.83%), linear-gradient(to bottom, transparent 33.33%, rgba(255,255,255,0.3) 33.33%, rgba(255,255,255,0.3) 33.5%, transparent 33.5%, transparent 66.66%, rgba(255,255,255,0.3) 66.66%, rgba(255,255,255,0.3) 66.83%, transparent 66.83%)' }} />

                                            {/* Resize handles */}
                                            {['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'].map(handle => (
                                                <div
                                                    key={handle}
                                                    className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full"
                                                    style={{
                                                        cursor: handle.length === 2 ? `${handle}-resize` : (handle === 'n' || handle === 's' ? 'ns-resize' : 'ew-resize'),
                                                        ...(handle.includes('n') ? { top: -8 } : handle.includes('s') ? { bottom: -8 } : { top: '50%', marginTop: -8 }),
                                                        ...(handle.includes('w') ? { left: -8 } : handle.includes('e') ? { right: -8 } : { left: '50%', marginLeft: -8 })
                                                    }}
                                                    onMouseDown={(e) => handleResizeMouseDown(e, handle)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Output Format</label>
                                            <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                                <option value="jpeg">JPEG</option>
                                                <option value="png">PNG</option>
                                                <option value="webp">WebP</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quality: {quality}%</label>
                                            <input type="range" min="1" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full" />
                                        </div>
                                    </div>

                                    <button onClick={handleCrop} disabled={isProcessing} className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors">
                                        {isProcessing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</> : <><Crop className="w-5 h-5 mr-2" /> Crop Image</>}
                                    </button>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
                                <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                                <p className="text-red-700 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        {result && resultPreview && (
                            <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                                <div className="flex items-center justify-center mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                                    <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">Image Cropped!</h3>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 flex items-center justify-center">
                                    <img src={resultPreview} alt="Cropped" className="max-w-full max-h-64 object-contain" />
                                </div>
                                <div className="flex justify-center gap-4">
                                    <button onClick={handleDownload} className="inline-flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                                        <Download className="w-5 h-5 mr-2" /> Download
                                    </button>
                                    <button onClick={() => { setResult(null); setResultPreview(null); }} className="px-6 py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Crop Again</button>
                                </div>
                            </div>
                        )}

                        <SuggestedTools tools={['Image Resize', 'Image Rotate', 'Image Compressor']} />
                    </div>
                </div>
            </div>
        </>
    );
};
