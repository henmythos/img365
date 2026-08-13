import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, FileText, Download, Loader2, AlertCircle, CheckCircle, Pen, Trash2, ChevronLeft, ChevronRight, Move } from 'lucide-react';
import { ToolsMenu } from '../components/ToolsMenu';
import { SuggestedTools } from '../components/SuggestedTools';
import { SEO } from '../components/SEO';

interface SignatureData {
    type: 'draw' | 'text' | 'image';
    data: string;
    x: number;
    y: number;
    width: number;
    height: number;
    page: number;
}

export const SignPDF: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagePreview, setPagePreview] = useState<string | null>(null);
    const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });
    const [signature, setSignature] = useState<SignatureData | null>(null);
    const [signatureMode, setSignatureMode] = useState<'draw' | 'text' | 'image'>('draw');
    const [isDrawing, setIsDrawing] = useState(false);
    const [textSignature, setTextSignature] = useState('');
    const [result, setResult] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [signaturePosition, setSignaturePosition] = useState({ x: 50, y: 80 });
    const [isDraggingSig, setIsDraggingSig] = useState(false);

    const drawCanvasRef = useRef<HTMLCanvasElement>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);
    const lastPos = useRef({ x: 0, y: 0 });

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
        setSignature(null);
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
        setPageDimensions({ width: viewport.width, height: viewport.height });

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

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = drawCanvasRef.current;
        if (!canvas) return;

        e.preventDefault(); // Prevent scrolling on touch
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        lastPos.current = { x: clientX - rect.left, y: clientY - rect.top };
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !drawCanvasRef.current) return;

        e.preventDefault(); // Prevent scrolling on touch
        const canvas = drawCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();

        lastPos.current = { x, y };
    };

    const stopDrawing = () => setIsDrawing(false);

    const clearDrawing = () => {
        const canvas = drawCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const createSignatureFromDraw = () => {
        const canvas = drawCanvasRef.current;
        if (!canvas) return;

        const dataUrl = canvas.toDataURL('image/png');
        setSignature({
            type: 'draw',
            data: dataUrl,
            x: signaturePosition.x,
            y: signaturePosition.y,
            width: 150,
            height: 60,
            page: currentPage
        });
        setShowSignatureModal(false);
    };

    const createSignatureFromText = () => {
        if (!textSignature.trim()) return;

        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 80;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.font = 'italic 32px "Brush Script MT", cursive, serif';
        ctx.fillStyle = '#000000';
        ctx.textBaseline = 'middle';
        ctx.fillText(textSignature, 10, 40);

        setSignature({
            type: 'text',
            data: canvas.toDataURL('image/png'),
            x: signaturePosition.x,
            y: signaturePosition.y,
            width: 150,
            height: 60,
            page: currentPage
        });
        setShowSignatureModal(false);
    };

    const handleSignatureImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                setSignature({
                    type: 'image',
                    data: event.target.result as string,
                    x: signaturePosition.x,
                    y: signaturePosition.y,
                    width: 150,
                    height: 60,
                    page: currentPage
                });
                setShowSignatureModal(false);
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    const handleSignPDF = async () => {
        if (!file || !signature) return;
        setIsProcessing(true);
        setError(null);

        try {
            const { PDFDocument } = await import('pdf-lib');
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            const signatureImageBytes = await fetch(signature.data).then(r => r.arrayBuffer());
            const signatureImage = await pdfDoc.embedPng(new Uint8Array(signatureImageBytes));

            const pages = pdfDoc.getPages();
            const page = pages[signature.page - 1];
            const { width, height } = page.getSize();

            const sigX = (signature.x / 100) * width;
            const sigY = height - (signature.y / 100) * height - signature.height;

            page.drawImage(signatureImage, {
                x: sigX,
                y: sigY,
                width: signature.width,
                height: signature.height,
            });

            const signedPdfBytes = await pdfDoc.save();
            setResult(new Blob([new Uint8Array(signedPdfBytes)], { type: 'application/pdf' }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to sign PDF');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!result || !file) return;
        const url = URL.createObjectURL(result);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'img365signed.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handlePreviewMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        if (!signature) return;
        e.preventDefault(); // Prevent scrolling on touch
        setIsDraggingSig(true);
    };

    const handlePreviewMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDraggingSig || !previewCanvasRef.current) return;

        e.preventDefault(); // Prevent scrolling on touch
        const rect = previewCanvasRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;

        setSignaturePosition({ x: Math.max(0, Math.min(90, x)), y: Math.max(0, Math.min(90, y)) });
        if (signature) {
            setSignature(prev => prev ? { ...prev, x, y } : null);
        }
    };

    const handlePreviewMouseUp = () => setIsDraggingSig(false);

    useEffect(() => {
        if (!pagePreview || !previewCanvasRef.current) return;

        const canvas = previewCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const pageImg = new Image();
        pageImg.onload = () => {
            canvas.width = pageImg.width;
            canvas.height = pageImg.height;
            ctx.drawImage(pageImg, 0, 0);

            if (signature && signature.page === currentPage) {
                const sigImg = new Image();
                sigImg.onload = () => {
                    const x = (signature.x / 100) * canvas.width;
                    const y = (signature.y / 100) * canvas.height;
                    const w = (signature.width / pageDimensions.width) * canvas.width * 1.5;
                    const h = (signature.height / pageDimensions.height) * canvas.height * 1.5;

                    ctx.drawImage(sigImg, x, y, w, h);
                    ctx.strokeStyle = '#3b82f6';
                    ctx.lineWidth = 2;
                    ctx.setLineDash([5, 5]);
                    ctx.strokeRect(x, y, w, h);
                };
                sigImg.src = signature.data;
            }
        };
        pageImg.src = pagePreview;
    }, [pagePreview, signature, currentPage, pageDimensions]);

    return (
        <>
            <SEO
                title="Sign PDF Online Free - Add Signature to PDF | img365.in"
                description="Sign PDF documents online for free. Draw, type, or upload your signature. Add digital signature to PDF without printing. 100% client-side, secure and private. Best free PDF signer in India."
                keywords="sign PDF online free, add signature to PDF, PDF signature, eSign PDF, digital signature PDF, free PDF signer, online PDF signature, draw signature, electronic signature, PDF annotation"
                toolName="Sign PDF - Free Digital PDF Signer"
                faqs={[
                    { question: "How do I sign a PDF online?", answer: "Upload your PDF, create your signature by drawing, typing, or uploading an image, position it on the document, and download the signed PDF instantly." },
                    { question: "Is my signed PDF legally valid?", answer: "Our tool adds a visual signature to the PDF. For legally binding documents, you may need a certified digital signature with a certificate authority." },
                    { question: "Can I move the signature after placing it?", answer: "Yes! Simply drag the signature to reposition it anywhere on the page before finalizing the signed document." },
                    { question: "Is my PDF data secure?", answer: "Absolutely! All processing happens in your browser. Your PDF and signature never leave your device or get uploaded to any server." },
                ]}
            />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="container mx-auto px-4 mb-8">
                    <div className="max-w-6xl mx-auto"><ToolsMenu /></div>
                </div>

                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Sign PDF</h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300">Add your signature to PDF documents. Draw, type, or upload.</p>
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
                                        <span className="font-medium text-gray-900 dark:text-white truncate max-w-xs">{file.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1 || isLoading} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50">
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Page {currentPage} of {pageCount}</span>
                                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= pageCount || isLoading} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div
                                    className="p-4 bg-gray-100 dark:bg-gray-900 flex items-center justify-center min-h-64"
                                    onMouseMove={handlePreviewMouseMove}
                                    onMouseUp={handlePreviewMouseUp}
                                    onMouseLeave={handlePreviewMouseUp}
                                    onTouchMove={handlePreviewMouseMove}
                                    onTouchEnd={handlePreviewMouseUp}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                    ) : (
                                        <div className="relative">
                                            <canvas
                                                ref={previewCanvasRef}
                                                className="max-w-full max-h-96 object-contain shadow-lg cursor-crosshair"
                                                style={{ touchAction: 'none' }}
                                                onMouseDown={handlePreviewMouseDown}
                                                onTouchStart={handlePreviewMouseDown}
                                            />
                                            {signature && (
                                                <div className="absolute top-2 right-2 text-xs bg-blue-600 text-white px-2 py-1 rounded flex items-center">
                                                    <Move className="w-3 h-3 mr-1" /> Drag to reposition
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setShowSignatureModal(true)}
                                            className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                                        >
                                            <Pen className="w-5 h-5 mr-2" />
                                            {signature ? 'Change Signature' : 'Create Signature'}
                                        </button>
                                        {signature && (
                                            <button onClick={() => setSignature(null)} className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>

                                    {signature && (
                                        <button onClick={handleSignPDF} disabled={isProcessing} className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors">
                                            {isProcessing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Signing...</> : <><Pen className="w-5 h-5 mr-2" /> Sign PDF</>}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {showSignatureModal && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                                <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Create Signature</h3>

                                    <div className="flex gap-2 mb-4">
                                        {(['draw', 'text', 'image'] as const).map(mode => (
                                            <button
                                                key={mode}
                                                onClick={() => setSignatureMode(mode)}
                                                className={`flex-1 py-2 rounded-lg font-medium capitalize ${signatureMode === mode ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                                            >
                                                {mode}
                                            </button>
                                        ))}
                                    </div>

                                    {signatureMode === 'draw' && (
                                        <div className="space-y-4">
                                            <canvas
                                                ref={drawCanvasRef}
                                                width={400}
                                                height={120}
                                                className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white cursor-crosshair"
                                                style={{ touchAction: 'none' }}
                                                onMouseDown={startDrawing}
                                                onMouseMove={draw}
                                                onMouseUp={stopDrawing}
                                                onMouseLeave={stopDrawing}
                                                onTouchStart={startDrawing}
                                                onTouchMove={draw}
                                                onTouchEnd={stopDrawing}
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={clearDrawing} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">Clear</button>
                                                <button onClick={createSignatureFromDraw} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">Use Signature</button>
                                            </div>
                                        </div>
                                    )}

                                    {signatureMode === 'text' && (
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                value={textSignature}
                                                onChange={(e) => setTextSignature(e.target.value)}
                                                placeholder="Type your name"
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-2xl italic"
                                                style={{ fontFamily: '"Brush Script MT", cursive' }}
                                            />
                                            <button onClick={createSignatureFromText} disabled={!textSignature.trim()} className="w-full px-4 py-2 bg-blue-600 disabled:bg-gray-400 text-white rounded-lg font-medium">Use Signature</button>
                                        </div>
                                    )}

                                    {signatureMode === 'image' && (
                                        <div className="space-y-4">
                                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                                                <input type="file" accept="image/*" onChange={handleSignatureImage} className="hidden" id="sig-image" />
                                                <label htmlFor="sig-image" className="cursor-pointer text-blue-600 hover:text-blue-700">Click to upload signature image</label>
                                            </div>
                                        </div>
                                    )}

                                    <button onClick={() => setShowSignatureModal(false)} className="mt-4 w-full px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">Cancel</button>
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
                                    <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">PDF Signed Successfully!</h3>
                                </div>
                                <div className="flex justify-center gap-4">
                                    <button onClick={handleDownload} className="inline-flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                                        <Download className="w-5 h-5 mr-2" /> Download Signed PDF
                                    </button>
                                </div>
                            </div>
                        )}

                        <SuggestedTools tools={['Merge PDF', 'Crop PDF', 'PDF to Image']} />
                    </div>
                </div>
            </div>
        </>
    );
};
