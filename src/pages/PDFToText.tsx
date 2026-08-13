import React, { useState, useCallback } from 'react';
import { Upload, FileText, Copy, Download, Loader2, AlertCircle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { ToolsMenu } from '../components/ToolsMenu';
import { SuggestedTools } from '../components/SuggestedTools';
import { SEO } from '../components/SEO';
import { extractTextFromPDF, PDFTextResult } from '../utils/pdfToText';

export const PDFToText: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressMessage, setProgressMessage] = useState('');
    const [result, setResult] = useState<PDFTextResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [expandedPages, setExpandedPages] = useState<Set<number>>(new Set());
    const [viewMode, setViewMode] = useState<'full' | 'pages'>('full');

    const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
    const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = Array.from(e.dataTransfer.files).find(f => f.type === 'application/pdf');
        if (droppedFile) { setFile(droppedFile); setResult(null); setError(null); }
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) { setFile(e.target.files[0]); setResult(null); setError(null); }
    }, []);

    const handleExtract = async () => {
        if (!file) return;
        setIsProcessing(true);
        setError(null);
        setProgress(0);
        try {
            const textResult = await extractTextFromPDF(file, (prog, msg) => { setProgress(prog); setProgressMessage(msg); });
            setResult(textResult);
            setExpandedPages(new Set([1]));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to extract text from PDF');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCopyAll = async () => {
        if (!result) return;
        try { await navigator.clipboard.writeText(result.fullText); setCopied(true); setTimeout(() => setCopied(false), 2000); }
        catch { setError('Failed to copy to clipboard'); }
    };

    const handleCopyPage = async (pageNumber: number) => {
        const page = result?.pages.find(p => p.pageNumber === pageNumber);
        if (!page) return;
        try { await navigator.clipboard.writeText(page.text); setCopied(true); setTimeout(() => setCopied(false), 2000); }
        catch { setError('Failed to copy to clipboard'); }
    };

    const handleDownload = () => {
        if (!result) return;
        const blob = new Blob([result.fullText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'img365text.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const togglePage = (pageNumber: number) => {
        const newExpanded = new Set(expandedPages);
        if (newExpanded.has(pageNumber)) newExpanded.delete(pageNumber);
        else newExpanded.add(pageNumber);
        setExpandedPages(newExpanded);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <>
            <SEO
                title="PDF to Text Converter Online Free - Extract Text from PDF | img365.in"
                description="Extract text from PDF files online for free. Copy text from PDF documents instantly. 100% client-side processing, secure and private. Best free PDF to text converter in India."
                keywords="PDF to text converter, extract text from PDF, copy text from PDF, PDF text extractor, convert PDF to text free, PDF to TXT online, read PDF text, PDF content extractor, get text from PDF, PDF to plain text"
                toolName="PDF to Text - Free PDF Text Extractor"
                faqs={[
                    { question: "Can I extract text from scanned PDFs?", answer: "This tool works best with text-based PDFs. For scanned documents, you may need OCR (Optical Character Recognition) technology." },
                    { question: "Is my PDF content kept private?", answer: "Absolutely! All processing happens in your browser. Your PDF content is never sent to any server, ensuring complete confidentiality." },
                    { question: "Can I copy extracted text to clipboard?", answer: "Yes! Click the 'Copy to Clipboard' button to instantly copy all extracted text. You can then paste it anywhere." },
                    { question: "What if my PDF has multiple pages?", answer: "Our tool extracts text from all pages. You can view text page-by-page or see the complete document text at once." },
                ]}
            />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="container mx-auto px-4 mb-8">
                    <div className="max-w-6xl mx-auto"><ToolsMenu /></div>
                </div>

                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">PDF to Text Converter</h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300">Extract text from PDF documents. Copy to clipboard or download as TXT file.</p>
                        </div>

                        {!result && (
                            <div
                                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Drag & drop a PDF file here</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">or click to browse</p>
                                <input type="file" accept=".pdf,application/pdf" onChange={handleFileInput} className="hidden" id="pdf-input" />
                                <label htmlFor="pdf-input" className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium cursor-pointer transition-colors">Select PDF File</label>
                            </div>
                        )}

                        {file && !result && (
                            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
                                <div className="flex items-center">
                                    <FileText className="w-8 h-8 text-red-500 mr-3" />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
                                    </div>
                                    <button onClick={handleExtract} disabled={isProcessing} className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors">
                                        {isProcessing ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" />{progress}%</>) : 'Extract Text'}
                                    </button>
                                </div>
                                {isProcessing && (
                                    <div className="mt-4">
                                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{progressMessage}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {error && (
                            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
                                <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                                <p className="text-red-700 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        {result && (
                            <div className="mt-6">
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div className="flex items-center">
                                            <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                                            <div>
                                                <h3 className="font-semibold text-green-700 dark:text-green-400">Text Extracted Successfully!</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">{result.totalPages} pages • {result.fullText.length.toLocaleString()} characters</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={handleCopyAll} className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors">
                                                <Copy className="w-4 h-4 mr-2" />{copied ? 'Copied!' : 'Copy All'}
                                            </button>
                                            <button onClick={handleDownload} className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                                                <Download className="w-4 h-4 mr-2" />Download TXT
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 mb-4">
                                    <button onClick={() => setViewMode('full')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'full' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Full Text</button>
                                    <button onClick={() => setViewMode('pages')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'pages' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>By Page</button>
                                </div>

                                {viewMode === 'full' ? (
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                                        <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono max-h-96 overflow-y-auto">{result.fullText || 'No text content found in this PDF.'}</pre>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {result.pages.map((page) => (
                                            <div key={page.pageNumber} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                                                <button onClick={() => togglePage(page.pageNumber)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                    <span className="font-medium text-gray-900 dark:text-white">Page {page.pageNumber}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-gray-500 dark:text-gray-400">{page.text.length.toLocaleString()} chars</span>
                                                        {expandedPages.has(page.pageNumber) ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                                    </div>
                                                </button>
                                                {expandedPages.has(page.pageNumber) && (
                                                    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                                                        <div className="flex justify-end mb-2">
                                                            <button onClick={() => handleCopyPage(page.pageNumber)} className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">Copy page text</button>
                                                        </div>
                                                        <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono max-h-64 overflow-y-auto">{page.text || 'No text content on this page.'}</pre>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-6 text-center">
                                    <button onClick={() => { setFile(null); setResult(null); }} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">Extract from another PDF</button>
                                </div>
                            </div>
                        )}

                        <SuggestedTools tools={['Merge PDF', 'PDF to Image', 'Image to PDF']} />
                    </div>
                </div>
            </div>
        </>
    );
};
