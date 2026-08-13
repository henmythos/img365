import React, { useState, useCallback } from 'react';
import { Upload, Wand2, Download, Loader2, AlertCircle, CheckCircle, SunMedium, Contrast, Sparkles } from 'lucide-react';
import { ToolsMenu } from '../components/ToolsMenu';
import { SuggestedTools } from '../components/SuggestedTools';
import { SEO } from '../components/SEO';

interface EnhanceSettings {
    brightness: number;
    contrast: number;
    sharpen: boolean;
    denoise: boolean;
    autoEnhance: boolean;
}

export const SmartScan: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [settings, setSettings] = useState<EnhanceSettings>({
        brightness: 0,
        contrast: 0,
        sharpen: true,
        denoise: false,
        autoEnhance: true
    });
    const [result, setResult] = useState<Blob | null>(null);
    const [resultPreview, setResultPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [outputFormat, setOutputFormat] = useState<string>('jpeg');

    const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
    const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);

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
        setPreview(URL.createObjectURL(imageFile));
    };

    const processImage = async () => {
        if (!file || !preview) return;
        setIsProcessing(true);
        setError(null);

        try {
            const img = new Image();
            img.src = preview;
            await new Promise(resolve => { img.onload = resolve; });

            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');

            ctx.drawImage(img, 0, 0);
            let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            // Auto-enhance: find optimal brightness/contrast
            if (settings.autoEnhance) {
                imageData = autoEnhance(imageData);
            }

            // Apply brightness
            if (settings.brightness !== 0) {
                imageData = adjustBrightness(imageData, settings.brightness);
            }

            // Apply contrast
            if (settings.contrast !== 0) {
                imageData = adjustContrast(imageData, settings.contrast);
            }

            // Apply sharpening
            if (settings.sharpen) {
                imageData = applySharpen(imageData);
            }

            // Apply denoising (simple blur for noise reduction)
            if (settings.denoise) {
                imageData = applyDenoise(imageData);
            }

            ctx.putImageData(imageData, 0, 0);

            const mimeType = outputFormat === 'jpeg' ? 'image/jpeg' : `image/${outputFormat}`;
            const blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob(b => b ? resolve(b) : reject(new Error('Failed')), mimeType, 0.95);
            });

            setResultPreview(URL.createObjectURL(blob));
            setResult(blob);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to enhance image');
        } finally {
            setIsProcessing(false);
        }
    };

    // Image processing functions
    const autoEnhance = (imageData: ImageData): ImageData => {
        const data = imageData.data;
        let min = 255, max = 0;

        // Find min/max for auto-levels
        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            if (avg < min) min = avg;
            if (avg > max) max = avg;
        }

        const range = max - min;
        if (range < 10) return imageData;

        // Apply auto-levels
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, Math.max(0, ((data[i] - min) / range) * 255));
            data[i + 1] = Math.min(255, Math.max(0, ((data[i + 1] - min) / range) * 255));
            data[i + 2] = Math.min(255, Math.max(0, ((data[i + 2] - min) / range) * 255));
        }

        return imageData;
    };

    const adjustBrightness = (imageData: ImageData, value: number): ImageData => {
        const data = imageData.data;
        const adjustment = value * 2.55; // Convert -100 to 100 range to -255 to 255

        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, Math.max(0, data[i] + adjustment));
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + adjustment));
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + adjustment));
        }

        return imageData;
    };

    const adjustContrast = (imageData: ImageData, value: number): ImageData => {
        const data = imageData.data;
        const factor = (259 * (value + 255)) / (255 * (259 - value));

        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
            data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
            data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
        }

        return imageData;
    };

    const applySharpen = (imageData: ImageData): ImageData => {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const newData = new Uint8ClampedArray(data);

        const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];

        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                for (let c = 0; c < 3; c++) {
                    let sum = 0;
                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
                            sum += data[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
                        }
                    }
                    newData[(y * width + x) * 4 + c] = Math.max(0, Math.min(255, sum));
                }
            }
        }

        return new ImageData(newData, width, height);
    };

    const applyDenoise = (imageData: ImageData): ImageData => {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const newData = new Uint8ClampedArray(data);

        // Simple 3x3 box blur for noise reduction
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                for (let c = 0; c < 3; c++) {
                    let sum = 0;
                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            sum += data[((y + ky) * width + (x + kx)) * 4 + c];
                        }
                    }
                    newData[(y * width + x) * 4 + c] = sum / 9;
                }
            }
        }

        return new ImageData(newData, width, height);
    };

    const handleDownload = () => {
        if (!result || !file) return;
        const url = URL.createObjectURL(result);
        const a = document.createElement('a');
        a.href = url;
        a.download = `img365enhanced.${outputFormat === 'jpeg' ? 'jpg' : outputFormat}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <SEO
                title="Smart Scan Enhancer - Fix Document Photos | img365.in"
                description="Enhance scanned documents and photos with one click. Auto-brightness, contrast, sharpening for perfect scans. Fix dark or blurry document photos. 100% client-side, secure. Best document scan enhancer in India."
                keywords="scan enhancer, document enhancer, fix scanned document, brighten scan, sharpen scan, improve document quality, auto enhance image, clean up scan, document photo fix, improve scan quality"
                toolName="Smart Scan Enhancer - Document Photo Fixer"
                faqs={[
                    { question: "How does Smart Scan Enhancer work?", answer: "It automatically analyzes your document photo and applies optimal brightness, contrast, and sharpening to make text clearer and more readable." },
                    { question: "Can I fix dark document photos?", answer: "Yes! The auto-enhance feature detects dark areas and adjusts brightness levels. You can also manually adjust brightness and contrast sliders." },
                    { question: "Will it work on handwritten documents?", answer: "Absolutely! Our tool enhances contrast to make handwriting more visible and legible, especially useful for notes or filled forms." },
                    { question: "Is this better than a real scanner?", answer: "While a dedicated scanner offers higher quality, our tool significantly improves phone camera photos of documents, making them suitable for digital storage and sharing." },
                ]}
            />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="container mx-auto px-4 mb-8">
                    <div className="max-w-6xl mx-auto"><ToolsMenu /></div>
                </div>

                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Smart Scan Enhancer</h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300">Auto-enhance scanned documents with one click. Fix brightness, contrast and sharpness.</p>
                        </div>

                        {!preview && (
                            <div
                                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Drag & drop a scanned document</p>
                                <input type="file" accept="image/*" onChange={handleFileInput} className="hidden" id="image-input" />
                                <label htmlFor="image-input" className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium cursor-pointer transition-colors">Select Image</label>
                            </div>
                        )}

                        {preview && !result && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                                <div className="p-4 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                                    <img src={preview} alt="Preview" className="max-w-full max-h-64 object-contain" />
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Auto Enhance Toggle */}
                                    <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Sparkles className="w-6 h-6 text-purple-600" />
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">Auto Enhance</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Automatically optimize brightness and contrast</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSettings(prev => ({ ...prev, autoEnhance: !prev.autoEnhance }))}
                                            className={`w-12 h-6 rounded-full transition-colors ${settings.autoEnhance ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                                        >
                                            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.autoEnhance ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                        </button>
                                    </div>

                                    {/* Manual Controls */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                <SunMedium className="w-4 h-4" /> Brightness: {settings.brightness}
                                            </label>
                                            <input type="range" min="-50" max="50" value={settings.brightness} onChange={(e) => setSettings(prev => ({ ...prev, brightness: Number(e.target.value) }))} className="w-full" />
                                        </div>
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                <Contrast className="w-4 h-4" /> Contrast: {settings.contrast}
                                            </label>
                                            <input type="range" min="-50" max="50" value={settings.contrast} onChange={(e) => setSettings(prev => ({ ...prev, contrast: Number(e.target.value) }))} className="w-full" />
                                        </div>
                                    </div>

                                    {/* Toggles */}
                                    <div className="flex flex-wrap gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={settings.sharpen} onChange={(e) => setSettings(prev => ({ ...prev, sharpen: e.target.checked }))} className="rounded" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Sharpen</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={settings.denoise} onChange={(e) => setSettings(prev => ({ ...prev, denoise: e.target.checked }))} className="rounded" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Reduce Noise</span>
                                        </label>
                                    </div>

                                    {/* Output Format */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Output Format</label>
                                        <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                            <option value="jpeg">JPEG</option>
                                            <option value="png">PNG</option>
                                            <option value="webp">WebP</option>
                                        </select>
                                    </div>

                                    <button onClick={processImage} disabled={isProcessing} className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors">
                                        {isProcessing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Enhancing...</> : <><Wand2 className="w-5 h-5 mr-2" /> Enhance Document</>}
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
                                    <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">Document Enhanced!</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-500 mb-2">Before</p>
                                        <img src={preview!} alt="Before" className="max-w-full max-h-48 object-contain mx-auto rounded-lg" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-500 mb-2">After</p>
                                        <img src={resultPreview} alt="After" className="max-w-full max-h-48 object-contain mx-auto rounded-lg" />
                                    </div>
                                </div>
                                <div className="flex justify-center gap-4">
                                    <button onClick={handleDownload} className="inline-flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                                        <Download className="w-5 h-5 mr-2" /> Download
                                    </button>
                                    <button onClick={() => { setResult(null); setResultPreview(null); }} className="px-6 py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Adjust Settings</button>
                                </div>
                            </div>
                        )}

                        <SuggestedTools tools={['Camera to PDF', 'Image to PDF', 'Image Crop']} />
                    </div>
                </div>
            </div>
        </>
    );
};
