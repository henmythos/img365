import React, { useState, useCallback } from 'react';
import { 
  Upload, 
  Scissors, 
  Download, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Check, 
  Layers, 
  FileText,
  FileArchive
} from 'lucide-react';
import { ToolsMenu } from '../components/ToolsMenu';
import { SuggestedTools } from '../components/SuggestedTools';
import { SEO } from '../components/SEO';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

interface PDFPageItem {
  pageIndex: number;
  selected: boolean;
}

export const SplitPDF: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pages, setPages] = useState<PDFPageItem[]>([]);
  const [rangeInput, setRangeInput] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resultPdfUrl, setResultPdfUrl] = useState<string | null>(null);
  const [resultZipUrl, setResultZipUrl] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const loadPDF = async (pdfFile: File) => {
    setIsProcessing(true);
    setError(null);
    setProgressMessage('Loading PDF pages...');
    setResultPdfUrl(null);
    setResultZipUrl(null);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const count = pdfDoc.getPageCount();
      
      setFile(pdfFile);
      setPageCount(count);
      
      const initialPages: PDFPageItem[] = Array.from({ length: count }, (_, i) => ({
        pageIndex: i,
        selected: true,
      }));
      setPages(initialPages);
      setRangeInput(`1-${count}`);
    } catch (err: any) {
      console.error(err);
      setError('Failed to load PDF. Please make sure the file is valid.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf' || droppedFile.name.toLowerCase().endsWith('.pdf')) {
        loadPDF(droppedFile);
      } else {
        setError('Please upload a valid PDF file.');
      }
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      loadPDF(e.target.files[0]);
    }
  };

  const togglePageSelection = (index: number) => {
    setPages(prev => prev.map(p => p.pageIndex === index ? { ...p, selected: !p.selected } : p));
  };

  const selectAll = () => setPages(prev => prev.map(p => ({ ...p, selected: true })));
  const deselectAll = () => setPages(prev => prev.map(p => ({ ...p, selected: false })));

  const applyRangeSelection = () => {
    if (!rangeInput.trim()) return;
    const selectedIndices = new Set<number>();
    const parts = rangeInput.split(',');

    parts.forEach(part => {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(pageCount, end); i++) {
            selectedIndices.add(i - 1);
          }
        }
      } else {
        const pageNum = parseInt(trimmed, 10);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= pageCount) {
          selectedIndices.add(pageNum - 1);
        }
      }
    });

    setPages(prev => prev.map(p => ({ ...p, selected: selectedIndices.has(p.pageIndex) })));
  };

  const exportSelectedPagesPDF = async () => {
    if (!file) return;
    const selected = pages.filter(p => p.selected).map(p => p.pageIndex);
    if (selected.length === 0) {
      setError('Please select at least 1 page to extract.');
      return;
    }

    setIsProcessing(true);
    setProgressMessage('Extracting selected pages into PDF...');
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();

      const copiedPages = await newDoc.copyPages(srcDoc, selected);
      copiedPages.forEach(p => newDoc.addPage(p));

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultPdfUrl(URL.createObjectURL(blob));
    } catch (err: any) {
      console.error(err);
      setError('Failed to extract PDF pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  const exportSinglePagesZip = async () => {
    if (!file) return;
    const selected = pages.filter(p => p.selected).map(p => p.pageIndex);
    if (selected.length === 0) {
      setError('Please select at least 1 page to export.');
      return;
    }

    setIsProcessing(true);
    setProgressMessage('Generating individual PDF pages ZIP archive...');
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const zip = new JSZip();

      for (let i = 0; i < selected.length; i++) {
        const pageIdx = selected[i];
        const singleDoc = await PDFDocument.create();
        const [copiedPage] = await singleDoc.copyPages(srcDoc, [pageIdx]);
        singleDoc.addPage(copiedPage);

        const singleBytes = await singleDoc.save();
        const pageFileName = `page_${pageIdx + 1}.pdf`;
        zip.file(pageFileName, singleBytes);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      setResultZipUrl(URL.createObjectURL(zipBlob));
    } catch (err: any) {
      console.error(err);
      setError('Failed to generate ZIP archive.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <SEO
        title="Split PDF Online Free - Extract Pages & Split PDF Documents | img365.in"
        description="Split PDF files online for free. Extract specific page ranges or split PDF into separate single-page PDF files. 100% private, client-side & offline."
        keywords="split pdf online, extract pdf pages, split pdf file, separate pdf pages, pdf page extractor, split pdf free"
        toolName="Split PDF - Free Page Extractor"
        faqs={[
          { question: "How do I split a PDF file online?", answer: "Upload your PDF file, enter page ranges (e.g., 1-3, 5, 8-10) or click page numbers to select pages, then click Extract Selected Pages." },
          { question: "Can I download split PDF pages as a ZIP file?", answer: "Yes! Click Extract to ZIP Archive to get all selected pages as individual PDF files in a single .zip download." },
          { question: "Will my confidential PDF be saved on a server?", answer: "No! All splitting happens inside your web browser. Your PDF document never leaves your personal device." }
        ]}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 p-6 md:p-8 space-y-8">
            
            {/* Title Header */}
            <div className="flex items-center space-x-3 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="p-3 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl">
                <Scissors className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Split & Extract PDF Pages</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Select page ranges, pick individual pages, or extract PDF pages into separate single files.
                </p>
              </div>
            </div>

            {/* Dropzone */}
            {!file && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('split-pdf-input')?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 scale-[0.99]'
                    : 'border-gray-300 dark:border-gray-700 hover:border-red-500 bg-gray-50/50 dark:bg-gray-800/50'
                }`}
              >
                <input
                  id="split-pdf-input"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-red-100 dark:bg-red-900/50 rounded-full mb-3 text-red-600 dark:text-red-400">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Drag & Drop a PDF file to Split
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Supports any PDF document (Instant client-side extraction)
                  </p>
                  <button
                    type="button"
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-xl shadow-md transition-colors"
                  >
                    Select PDF File
                  </button>
                </div>
              </div>
            )}

            {/* Progress Message */}
            {isProcessing && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center space-x-3 text-red-700 dark:text-red-300 text-sm">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{progressMessage}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center space-x-3 text-red-700 dark:text-red-300 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Loaded PDF Page Selection Workspace */}
            {file && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-6 h-6 text-red-500" />
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate max-w-xs">{file.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{pageCount} total pages</p>
                    </div>
                  </div>

                  <button
                    onClick={() => { setFile(null); setPages([]); setPdfResult(); }}
                    className="text-xs text-red-600 hover:underline font-medium"
                  >
                    Choose Different PDF
                  </button>
                </div>

                {/* Range Selection Input Bar */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900/60 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">Page Range Selection</h4>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="e.g. 1-3, 5, 8-10"
                      value={rangeInput}
                      onChange={e => setRangeInput(e.target.value)}
                      className="flex-1 text-xs p-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={applyRangeSelection}
                      className="px-4 py-2.5 bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 text-white rounded-xl text-xs font-medium"
                    >
                      Apply Range
                    </button>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <button onClick={selectAll} className="text-blue-600 hover:underline">Select All</button>
                    <span>•</span>
                    <button onClick={deselectAll} className="text-red-600 hover:underline">Deselect All</button>
                    <span className="ml-auto text-gray-500">
                      Selected: {pages.filter(p => p.selected).length} of {pageCount} pages
                    </span>
                  </div>
                </div>

                {/* Page Grid Badges */}
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 max-h-64 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800">
                  {pages.map(p => (
                    <button
                      key={p.pageIndex}
                      onClick={() => togglePageSelection(p.pageIndex)}
                      className={`p-3 rounded-xl border font-bold text-xs flex flex-col items-center justify-center transition-all ${
                        p.selected
                          ? 'bg-red-600 text-white border-red-600 shadow-md scale-[1.02]'
                          : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 opacity-60'
                      }`}
                    >
                      <span>Page</span>
                      <span className="text-base">{p.pageIndex + 1}</span>
                      {p.selected && <Check className="w-3.5 h-3.5 mt-1" />}
                    </button>
                  ))}
                </div>

                {/* Export Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={exportSelectedPagesPDF}
                    disabled={isProcessing}
                    className="py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center space-x-2"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Extract Selected Pages to Single PDF</span>
                  </button>

                  <button
                    onClick={exportSinglePagesZip}
                    disabled={isProcessing}
                    className="py-3.5 bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center space-x-2"
                  >
                    <FileArchive className="w-4 h-4 text-amber-400" />
                    <span>Export Pages as Individual Files (ZIP)</span>
                  </button>
                </div>

                {/* Download Result Cards */}
                {resultPdfUrl && (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-500 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                      <span className="text-sm font-bold text-gray-900 dark:text-white">Merged PDF Page Extraction Ready</span>
                    </div>
                    <a
                      href={resultPdfUrl}
                      download={`split_extracted_${file.name}`}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </a>
                  </div>
                )}

                {resultZipUrl && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-500 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileArchive className="w-6 h-6 text-amber-500" />
                      <span className="text-sm font-bold text-gray-900 dark:text-white">ZIP Archive Ready</span>
                    </div>
                    <a
                      href={resultZipUrl}
                      download={`pages_archive_${file.name.replace('.pdf', '')}.zip`}
                      className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download ZIP</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8">
              <ToolsMenu />
              <SuggestedTools tools={['Merge PDF', 'PDF to Text', 'Image to PDF']} />
            </div>

          </div>
        </div>
      </div>
    </>
  );

  function setPdfResult() {
    setResultPdfUrl(null);
    setResultZipUrl(null);
  }
};

export default SplitPDF;
