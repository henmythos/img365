import React, { useState, useCallback } from 'react';
import { Upload, RotateCw, RotateCcw, FlipHorizontal, FlipVertical, Download, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { ToolsMenu } from '../components/ToolsMenu';
import { SuggestedTools } from '../components/SuggestedTools';
import { SEO } from '../components/SEO';

interface TransformState {
    rotation: number;
    flipH: boolean;
    flipV: boolean;
}

export const ImageRotate: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [transform, setTransform] = useState<TransformState>({ rotation: 0, flipH: false, flipV: false });
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<Blob | null>(null);
    const [resultPreview, setResultPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [outputFormat, setOutputFormat] = useState<string>('jpeg');
    const [quality, setQuality] = useState<number>(90);

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
        setTransform({ rotation: 0, flipH: false, flipV: false });
        setPreview(URL.createObjectURL(imageFile));
    };

    const rotateLeft = () => setTransform(prev => ({ ...prev, rotation: (prev.rotation - 90 + 360) % 360 }));
    const rotateRight = () => setTransform(prev => ({ ...prev, rotation: (prev.rotation + 90) % 360 }));
    const flipHorizontal = () => setTransform(prev => ({ ...prev, flipH: !prev.flipH }));
    const flipVertical = () => setTransform(prev => ({ ...prev, flipV: !prev.flipV }));
    const setRotation = (angle: number) => setTransform(prev => ({ ...prev, rotation: angle }));

    const handleApply = async () => {
        if (!file || !preview) return;
        setIsProcessing(true);
        setError(null);

        try {
            const img = new Image();
            img.src = preview;
            await new Promise(resolve => { img.onload = resolve; });

            const radians = (transform.rotation * Math.PI) / 180;
            const sin = Math.abs(Math.sin(radians));
            const cos = Math.abs(Math.cos(radians));

            const newWidth = Math.round(img.width * cos + img.height * sin);
            const newHeight = Math.round(img.width * sin + img.height * cos);

            const canvas = document.createElement('canvas');
            canvas.width = newWidth;
            canvas.height = newHeight;

            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');

            ctx.translate(newWidth / 2, newHeight / 2);
            ctx.rotate(radians);
            if (transform.flipH) ctx.scale(-1, 1);
            if (transform.flipV) ctx.scale(1, -1);
            ctx.drawImage(img, -img.width / 2, -img.height / 2);

            const mimeType = outputFormat === 'jpeg' ? 'image/jpeg' : `image/${outputFormat}`;
            const blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob(b => b ? resolve(b) : reject(new Error('Failed')), mimeType, quality / 100);
            });

            setResultPreview(URL.createObjectURL(blob));
            setResult(blob);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to transform image');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!result || !file) return;
        const url = URL.createObjectURL(result);
        const a = document.createElement('a');
        a.href = url;
        a.download = `img365rotated.${outputFormat === 'jpeg' ? 'jpg' : outputFormat}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const getTransformStyle = () => {
        const transforms = [];
        if (transform.rotation !== 0) transforms.push(`rotate(${transform.rotation}deg)`);
        if (transform.flipH) transforms.push('scaleX(-1)');
        if (transform.flipV) transforms.push('scaleY(-1)');
        return transforms.join(' ') || 'none';
    };

    return (
        <>
            <SEO
                title="Rotate Image Online Free - Flip & Rotate Photos | img365.in"
                description="Rotate images online for free. Rotate by 90°, 180°, or custom angles. Flip horizontally or vertically. Live preview with instant results. 100% client-side, secure and private. Best free image rotator in India."
                keywords="rotate image online free, flip image, rotate photo, image rotator, flip photo horizontal, flip photo vertical, rotate 90 degrees, rotate image online, free image rotator, mirror image, turn picture"
                toolName="Rotate Image - Free Image Rotator & Flipper"
                faqs={[
                    { question: "How do I rotate an image 90 degrees?", answer: "Simply upload your image and click the '90° Right' or '90° Left' button for quick rotation. You can rotate multiple times." },
                    { question: "Can I rotate by a custom angle?", answer: "Yes! Use the angle slider to rotate your image by any degree from 0° to 359°. Preset buttons are also available for common angles." },
                    { question: "What's the difference between flip and rotate?", answer: "Rotate turns the image around its center, while flip mirrors it horizontally (left-right) or vertically (top-bottom)." },
                    { question: "Does rotating affect image quality?", answer: "Our tool maintains original quality. Choose high-quality output format (PNG for lossless, JPEG for smaller size) when downloading." },
                ]}
            />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="container mx-auto px-4 mb-8">
                    <div className="max-w-6xl mx-auto"><ToolsMenu /></div>
                </div>

                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Rotate & Flip Image</h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300">Rotate images by any angle and flip horizontally or vertically.</p>
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
                                <div className="p-4 bg-gray-100 dark:bg-gray-900 flex items-center justify-center min-h-64">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="max-w-full max-h-64 object-contain transition-transform duration-200"
                                        style={{ transform: getTransformStyle() }}
                                    />
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Quick Rotate Buttons */}
                                    <div className="flex justify-center gap-4">
                                        <button onClick={rotateLeft} className="flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                                            <RotateCcw className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                                            <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">90° Left</span>
                                        </button>
                                        <button onClick={rotateRight} className="flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                                            <RotateCw className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                                            <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">90° Right</span>
                                        </button>
                                        <button onClick={flipHorizontal} className={`flex flex-col items-center p-4 rounded-lg transition-colors ${transform.flipH ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                                            <FlipHorizontal className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                                            <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">Flip H</span>
                                        </button>
                                        <button onClick={flipVertical} className={`flex flex-col items-center p-4 rounded-lg transition-colors ${transform.flipV ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                                            <FlipVertical className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                                            <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">Flip V</span>
                                        </button>
                                    </div>

                                    {/* Preset Angles */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preset Angles</label>
                                        <div className="flex flex-wrap gap-2">
                                            {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                                                <button
                                                    key={angle}
                                                    onClick={() => setRotation(angle)}
                                                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${transform.rotation === angle ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}
                                                >
                                                    {angle}°
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Custom Angle Slider */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Custom Angle: {transform.rotation}°
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="359"
                                            value={transform.rotation}
                                            onChange={(e) => setRotation(Number(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Output Options */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Format</label>
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

                                    <button onClick={handleApply} disabled={isProcessing} className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors">
                                        {isProcessing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</> : <><RotateCw className="w-5 h-5 mr-2" /> Apply Transformation</>}
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
                                    <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">Image Transformed!</h3>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 flex items-center justify-center">
                                    <img src={resultPreview} alt="Result" className="max-w-full max-h-64 object-contain" />
                                </div>
                                <div className="flex justify-center gap-4">
                                    <button onClick={handleDownload} className="inline-flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                                        <Download className="w-5 h-5 mr-2" /> Download
                                    </button>
                                    <button onClick={() => { setResult(null); setResultPreview(null); setTransform({ rotation: 0, flipH: false, flipV: false }); }} className="px-6 py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Transform Again</button>
                                </div>
                            </div>
                        )}

                        <SuggestedTools tools={['Image Crop', 'Image Resize', 'Image Compressor']} />
                    </div>
                </div>
            </div>
        </>
    );
};
