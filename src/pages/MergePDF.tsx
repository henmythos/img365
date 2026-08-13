import React, { useState, useCallback } from 'react';
import { 
  Upload, 
  FileText, 
  X, 
  GripVertical, 
  Download, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  MoveUp,
  MoveDown,
  ArrowUpToLine,
  ArrowDownToLine,
  SortAsc,
  SortDesc,
  RotateCcw,
  Plus
} from 'lucide-react';
import { ToolsMenu } from '../components/ToolsMenu';
import { SuggestedTools } from '../components/SuggestedTools';
import { SEO } from '../components/SEO';

// Type for merge result
interface MergeResult {
    blob: Blob;
    pageCount: number;
    fileName: string;
}

interface PDFFile {
    id: string;
    file: File;
    name: string;
    size: number;
    pageCount?: number;
}

export const MergePDF: React.FC = () => {
    const [files, setFiles] = useState<PDFFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressMessage, setProgressMessage] = useState('');
    const [result, setResult] = useState<MergeResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

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
        const droppedFiles = Array.from(e.dataTransfer.files).filter(
            file => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
        );
        addFiles(droppedFiles);
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files).filter(
                file => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
            );
            addFiles(selectedFiles);
        }
    }, []);

    const fetchPageCounts = async (pdfFiles: PDFFile[]) => {
        try {
            const { PDFDocument } = await import('pdf-lib');
            const updated = await Promise.all(
                pdfFiles.map(async (pdf) => {
                    if (pdf.pageCount) return pdf;
                    try {
                        const buffer = await pdf.file.arrayBuffer();
                        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
                        return { ...pdf, pageCount: doc.getPageCount() };
                    } catch {
                        return pdf;
                    }
                })
            );
            setFiles(updated);
        } catch {
            // Ignore if pdf-lib preview fails
        }
    };

    const addFiles = (newFiles: File[]) => {
        if (newFiles.length === 0) return;
        const pdfFiles: PDFFile[] = newFiles.map(file => ({
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            file,
            name: file.name,
            size: file.size,
        }));

        setFiles(prev => {
            const next = [...prev, ...pdfFiles];
            fetchPageCounts(next);
            return next;
        });
        setResult(null);
        setError(null);
    };

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
        setResult(null);
    };

    const moveFile = (index: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= files.length) return;

        const updated = [...files];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;
        setFiles(updated);
        setResult(null);
    };

    const moveFileToExtremity = (index: number, position: 'top' | 'bottom') => {
        if (index < 0 || index >= files.length) return;
        const updated = [...files];
        const [movedItem] = updated.splice(index, 1);

        if (position === 'top') {
            updated.unshift(movedItem);
        } else {
            updated.push(movedItem);
        }
        setFiles(updated);
        setResult(null);
    };

    const sortFilesAlphabetically = (ascending: boolean) => {
        const sorted = [...files].sort((a, b) => {
            return ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        });
        setFiles(sorted);
        setResult(null);
    };

    const reverseSequence = () => {
        setFiles(prev => [...prev].reverse());
        setResult(null);
    };

    const clearAllFiles = () => {
        setFiles([]);
        setResult(null);
        setError(null);
    };

    // Drag-and-Drop Items Sequence Reordering
    const handleItemDragStart = (index: number) => {
        setDraggedItemIndex(index);
    };

    const handleItemDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedItemIndex === null || draggedItemIndex === index) return;
        const updated = [...files];
        const draggedItem = updated.splice(draggedItemIndex, 1)[0];
        updated.splice(index, 0, draggedItem);
        setDraggedItemIndex(index);
        setFiles(updated);
        setResult(null);
    };

    const handleItemDragEnd = () => {
        setDraggedItemIndex(null);
    };

    const handleMerge = async () => {
        if (files.length < 2) {
            setError('Please add at least 2 PDF files to merge.');
            return;
        }
        setIsProcessing(true);
        setError(null);
        setProgress(0);
        try {
            const { mergePDFs } = await import('../utils/mergePdf');
            const mergeResult = await mergePDFs(files.map(f => f.file), (prog, msg) => {
                setProgress(prog);
                setProgressMessage(msg);
            });
            setResult(mergeResult);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to merge PDFs.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!result) return;
        const url = URL.createObjectURL(result.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.fileName || 'merged_document.pdf';
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

    const totalMergedPages = files.reduce((acc, curr) => acc + (curr.pageCount || 0), 0);

    return (
        <>
            <SEO
                title="Merge PDF Online Free - Sequence & Order PDF Files | img365.in"
                description="Merge and combine multiple PDF files in custom sequence order online for free. Rearrange PDF page order with drag and drop or quick up/down controls. 100% private, client-side & offline."
                keywords="merge PDF online free, combine PDF files, sequence PDF pages, order PDF files, join PDF documents, reorder PDF merger, free PDF combiner"
                toolName="Merge PDF - Free Online PDF Combiner"
                faqs={[
                    { question: "How do I merge multiple PDF files in sequence?", answer: "Upload your PDF files, click Move Up/Down or Sort A-Z to order them in your desired sequence, then click Merge PDF Files." },
                    { question: "Is there a limit on how many PDF files I can combine?", answer: "No! You can combine unlimited PDF files. Because processing runs in your web browser, memory scales with your device." },
                    { question: "Are my merged PDF files kept private?", answer: "Yes! 100% private. All combining operations take place locally inside your browser without uploading files to any server." }
                ]}
            />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="container mx-auto px-4 mb-8">
                    <div className="max-w-6xl mx-auto"><ToolsMenu /></div>
                </div>

                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-6">
                        
                        {/* Title Header */}
                        <div className="text-center">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                Merge & Sequence PDF Files
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                                Combine multiple PDF documents into a single PDF. Easily arrange files in exact sequence order before merging.
                            </p>
                        </div>

                        {/* Upload Zone */}
                        <div
                            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                                isDragging 
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[0.99]' 
                                    : 'border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-gray-800'
                            }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('pdf-file-input')?.click()}
                        >
                            <div className="flex flex-col items-center">
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/40 rounded-full mb-3 text-blue-600 dark:text-blue-400">
                                    <Upload className="w-8 h-8" />
                                </div>
                                <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                                    Drag & drop PDF files here
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                    Select multiple PDFs to combine & reorder sequence
                                </p>
                                <input 
                                    type="file" 
                                    accept=".pdf,application/pdf" 
                                    multiple 
                                    onChange={handleFileInput} 
                                    className="hidden" 
                                    id="pdf-file-input" 
                                />
                                <button
                                    type="button"
                                    className="inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors shadow-md"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Select PDF Files
                                </button>
                            </div>
                        </div>

                        {/* Sequence Manager Controls */}
                        {files.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden space-y-4 p-5">
                                
                                {/* Sequence Controls Bar */}
                                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center space-x-2">
                                            <span>PDF Sequence Order</span>
                                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs rounded-full font-mono">
                                                {files.length} {files.length === 1 ? 'file' : 'files'}
                                                {totalMergedPages > 0 ? ` • ${totalMergedPages} total pages` : ''}
                                            </span>
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                            Reorder PDF files using drag & drop or action buttons
                                        </p>
                                    </div>

                                    {/* Sort Buttons */}
                                    <div className="flex items-center space-x-1.5 flex-wrap">
                                        <button
                                            onClick={() => sortFilesAlphabetically(true)}
                                            className="px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1"
                                            title="Sort Name A-Z"
                                        >
                                            <SortAsc className="w-3.5 h-3.5" />
                                            <span className="hidden sm:inline">A-Z</span>
                                        </button>

                                        <button
                                            onClick={() => sortFilesAlphabetically(false)}
                                            className="px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1"
                                            title="Sort Name Z-A"
                                        >
                                            <SortDesc className="w-3.5 h-3.5" />
                                            <span className="hidden sm:inline">Z-A</span>
                                        </button>

                                        <button
                                            onClick={reverseSequence}
                                            className="px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1"
                                            title="Reverse Sequence"
                                        >
                                            <RotateCcw className="w-3.5 h-3.5" />
                                            <span className="hidden sm:inline">Reverse</span>
                                        </button>

                                        <button
                                            onClick={clearAllFiles}
                                            className="px-2.5 py-1.5 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium transition-colors"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>

                                {/* Reorderable Sequence List */}
                                <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                                    {files.map((pdf, index) => (
                                        <div
                                            key={pdf.id}
                                            draggable
                                            onDragStart={() => handleItemDragStart(index)}
                                            onDragOver={(e) => handleItemDragOver(e, index)}
                                            onDragEnd={handleItemDragEnd}
                                            className={`flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl transition-all ${
                                                draggedItemIndex === index ? 'opacity-40 border-blue-500 scale-[0.98]' : 'hover:border-blue-400'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3 min-w-0 flex-1 mr-3">
                                                {/* Drag handle */}
                                                <div className="cursor-grab text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                                    <GripVertical className="w-4 h-4" />
                                                </div>

                                                {/* Sequence Number Badge */}
                                                <span className="w-7 h-7 flex items-center justify-center bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm flex-shrink-0">
                                                    {index + 1}
                                                </span>

                                                <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />

                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                        {pdf.name}
                                                    </p>
                                                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                                                        <span>{formatFileSize(pdf.size)}</span>
                                                        {pdf.pageCount !== undefined && (
                                                            <>
                                                                <span>•</span>
                                                                <span className="text-blue-600 dark:text-blue-400 font-medium">
                                                                    {pdf.pageCount} {pdf.pageCount === 1 ? 'page' : 'pages'}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Sequence Action Buttons */}
                                            <div className="flex items-center space-x-1 flex-shrink-0">
                                                <button
                                                    onClick={() => moveFileToExtremity(index, 'top')}
                                                    disabled={index === 0}
                                                    className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg disabled:opacity-20"
                                                    title="Move to First Position"
                                                >
                                                    <ArrowUpToLine className="w-3.5 h-3.5" />
                                                </button>

                                                <button
                                                    onClick={() => moveFile(index, 'up')}
                                                    disabled={index === 0}
                                                    className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg disabled:opacity-20"
                                                    title="Move Up 1 Position"
                                                >
                                                    <MoveUp className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => moveFile(index, 'down')}
                                                    disabled={index === files.length - 1}
                                                    className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg disabled:opacity-20"
                                                    title="Move Down 1 Position"
                                                >
                                                    <MoveDown className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => moveFileToExtremity(index, 'bottom')}
                                                    disabled={index === files.length - 1}
                                                    className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg disabled:opacity-20"
                                                    title="Move to Last Position"
                                                >
                                                    <ArrowDownToLine className="w-3.5 h-3.5" />
                                                </button>

                                                <button
                                                    onClick={() => removeFile(pdf.id)}
                                                    className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg ml-1"
                                                    title="Remove File"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Merge Action CTA */}
                                {!result && (
                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 text-center space-y-2">
                                        <button
                                            onClick={handleMerge}
                                            disabled={isProcessing || files.length < 2}
                                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-base rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span>Merging in Sequence... {progress}%</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FileText className="w-5 h-5" />
                                                    <span>Merge {files.length} PDFs in Selected Sequence</span>
                                                </>
                                            )}
                                        </button>
                                        {isProcessing && (
                                            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                                {progressMessage}
                                            </p>
                                        )}
                                        {files.length < 2 && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Add at least 2 PDF files to enable merging
                                            </p>
                                        )}
                                    </div>
                                )}

                            </div>
                        )}

                        {/* Error Alert */}
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center space-x-3 text-red-700 dark:text-red-300">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}

                        {/* Result Download Card */}
                        {result && (
                            <div className="p-6 bg-emerald-500/10 border-2 border-emerald-500 rounded-2xl text-center space-y-4 animate-fadeIn">
                                <div className="p-3 bg-emerald-500 text-white rounded-full w-12 h-12 mx-auto flex items-center justify-center shadow-md">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                        PDFs Merged Successfully!
                                    </h3>
                                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                                        Combined {files.length} PDF files into {result.pageCount} total pages ({formatFileSize(result.blob.size)})
                                    </p>
                                </div>
                                <button
                                    onClick={handleDownload}
                                    className="inline-flex items-center justify-center space-x-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-xl shadow-lg transition-all w-full sm:w-auto"
                                >
                                    <Download className="w-5 h-5" />
                                    <span>Download Merged PDF</span>
                                </button>
                            </div>
                        )}

                        <SuggestedTools tools={['PDF to Text', 'Image to PDF', 'Excel to PDF', 'Compress']} />

                    </div>
                </div>
            </div>
        </>
    );
};

export default MergePDF;
