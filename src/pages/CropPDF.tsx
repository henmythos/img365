import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, FileText, Download, Loader2, AlertCircle, CheckCircle, Scissors, ChevronLeft, ChevronRight } from 'lucide-react';
import { ToolsMenu } from '../components/ToolsMenu';
import { SuggestedTools } from '../components/SuggestedTools';
import { SEO } from '../components/SEO';

interface CropMargins {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export const CropPDF: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagePreview, setPagePreview] = useState<string | null>(null);
    const [margins, setMargins] = useState<CropMargins>({ top: 10, right: 10, bottom: 10, left: 10 });
    const [applyToAll, setApplyToAll] = useState(true);
    const [result, setResult] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
    const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = Array.from(e.dataTransfer.files).find(f => f.type === 'application/pdf');
        if (droppedFile) loadPDF(droppedFile);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) loadPDF(e.target.files[0]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadPDF = async (pdfFile: File) => {
        setFile(pdfFile);
        setResult(null);
        setError(null);
        setIsLoading(true);
        try {
            const pdfjsLib = await import('pdfjs-dist');
            const version = pdfjsLib.version;
            try {
                const response = await fetch('/pdf.worker.min.mjs', { method: 'HEAD' });
                pdfjsLib.GlobalWorkerOptions.workerSrc = response.ok ? '/pdf.worker.min.mjs' : `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/build/pdf.worker.min.mjs`;
            } catch {
                pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/build/pdf.worker.min.mjs`;
            }
            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            setPageCount(pdf.numPages);
            setCurrentPage(1);
            await renderPage(pdf, 1);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load PDF');
        } finally {
            setIsLoading(false);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderPage = async (pdf: any, pageNum: number) => {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            await page.render({ canvasContext: ctx, viewport }).promise;
            setPagePreview(canvas.toDataURL());
        }
    };

    const handlePageChange = async (newPage: number) => {
        if (!file || newPage < 1 || newPage > pageCount) return;
        setCurrentPage(newPage);
        setIsLoading(true);
        try {
            const pdfjsLib = await import('pdfjs-dist');
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            await renderPage(pdf, newPage);
        } catch {
            setError('Failed to load page');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCrop = async () => {
        if (!file) return;
        setIsProcessing(true);
        setError(null);
        setProgress(0);
        try {
            const { PDFDocument } = await import('pdf-lib');
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();
            for (let i = 0; i < pages.length; i++) {
                setProgress(Math.round(((i + 1) / pages.length) * 100));
                const page = pages[i];
                const { width, height } = page.getSize();
                const cropTop = (margins.top / 100) * height;
                const cropRight = (margins.right / 100) * width;
                const cropBottom = (margins.bottom / 100) * height;
                const cropLeft = (margins.left / 100) * width;
                page.setCropBox(cropLeft, cropBottom, width - cropLeft - cropRight, height - cropTop - cropBottom);
            }
            const croppedPdfBytes = await pdfDoc.save();
            setResult(new Blob([new Uint8Array(croppedPdfBytes)], { type: 'application/pdf' }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to crop PDF');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!result || !file) return;
        const url = URL.createObjectURL(result);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'img365pdfcropped.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        if (!pagePreview || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            const top = (margins.top / 100) * img.height;
            const right = (margins.right / 100) * img.width;
            const bottom = (margins.bottom / 100) * img.height;
            const left = (margins.left / 100) * img.width;
            ctx.fillRect(0, 0, img.width, top);
            ctx.fillRect(0, img.height - bottom, img.width, bottom);
            ctx.fillRect(0, top, left, img.height - top - bottom);
            ctx.fillRect(img.width - right, top, right, img.height - top - bottom);
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(left, top, img.width - left - right, img.height - top - bottom);
        };
        img.src = pagePreview;
    }, [pagePreview, margins]);

    return (
        <>
            <SEO
                title="Crop PDF Online Free - Trim PDF Margins & Pages | img365.in"
                description="Crop PDF pages online for free. Remove margins, trim whitespace, resize PDF pages easily. Visual cropping with live preview. 100% client-side, secure and private. Best PDF cropper India."
                keywords="crop PDF online free, trim PDF margins, remove PDF whitespace, PDF cropper, resize PDF pages, cut PDF margins, PDF trimmer online, crop PDF pages, remove PDF borders, adjust PDF size"
                toolName="Crop PDF - Free PDF Page Cropper"
                faqs={[
                    { question: "How do I crop PDF margins?", answer: "Upload your PDF, adjust the margin percentages for top, right, bottom, and left sides using the sliders, preview the crop, and download the cropped PDF." },
                    { question: "Can I crop all pages at once?", answer: "Yes! Enable 'Apply to all pages' to crop every page in your PDF with the same margins. You can also navigate between pages to preview." },
                    { question: "Will cropping reduce PDF quality?", answer: "No! Our tool only adjusts the crop box without re-encoding the PDF content, preserving original quality of text and images." },
                    { question: "Is this safe for confidential documents?", answer: "Completely safe! Everything happens in your browser. Your PDF never gets uploaded to any server." },
                ]}
            />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="container mx-auto px-4 mb-8">
                    <div className="max-w-6xl mx-auto"><ToolsMenu /></div>
                </div>

                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Crop PDF</h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300">Remove margins and trim PDF pages to your desired size.</p>
                        </div>

                        {!file && (
                            <div
                                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Drag & drop a PDF file here</p>
                                <input type="file" accept=".pdf,application/pdf" onChange={handleFileInput} className="hidden" id="pdf-input" />
                                <label htmlFor="pdf-input" className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium cursor-pointer transition-colors">Select PDF</label>
                            </div>
                        )}

                        {file && !result && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-red-500" />
                                        <span className="font-medium text-gray-900 dark:text-white">{file.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1 || isLoading} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Page {currentPage} of {pageCount}</span>
                                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= pageCount || isLoading} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-100 dark:bg-gray-900 flex items-center justify-center min-h-64">
                                    {isLoading ? <Loader2 className="w-8 h-8 animate-spin text-blue-600" /> : <canvas ref={canvasRef} className="max-w-full max-h-96 object-contain shadow-lg" />}
                                </div>

                                <div className="p-6 space-y-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Crop Margins (%)</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {(['top', 'right', 'bottom', 'left'] as const).map(side => (
                                            <div key={side}>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">{side}</label>
                                                <input type="number" min="0" max="40" value={margins[side]} onChange={(e) => setMargins(prev => ({ ...prev, [side]: Number(e.target.value) }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="applyAll" checked={applyToAll} onChange={(e) => setApplyToAll(e.target.checked)} className="rounded" />
                                        <label htmlFor="applyAll" className="text-sm text-gray-700 dark:text-gray-300">Apply to all pages</label>
                                    </div>
                                    <button onClick={handleCrop} disabled={isProcessing} className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors">
                                        {isProcessing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Cropping... {progress}%</> : <><Scissors className="w-5 h-5 mr-2" /> Crop PDF</>}
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

                        {result && (
                            <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                                <div className="flex items-center justify-center mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                                    <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">PDF Cropped Successfully!</h3>
                                </div>
                                <div className="flex justify-center gap-4">
                                    <button onClick={handleDownload} className="inline-flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                                        <Download className="w-5 h-5 mr-2" /> Download Cropped PDF
                                    </button>
                                    <button onClick={() => { setFile(null); setResult(null); }} className="px-6 py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Crop Another</button>
                                </div>
                            </div>
                        )}

                        <SuggestedTools tools={['Merge PDF', 'Sign PDF', 'PDF to Image']} />
                    </div>
                </div>
            </div>
        </>
    );
};
