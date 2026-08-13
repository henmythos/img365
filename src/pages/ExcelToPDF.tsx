import React, { useState, useCallback } from 'react';
import { 
  Upload, 
  FileSpreadsheet, 
  X, 
  GripVertical, 
  Download, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  MoveUp,
  MoveDown,
  Settings,
  Eye,
  FileText,
  Check,
  Building2,
  Table as TableIcon
} from 'lucide-react';
import { ToolsMenu } from '../components/ToolsMenu';
import { SuggestedTools } from '../components/SuggestedTools';
import { SEO } from '../components/SEO';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ParsedSheet {
  id: string;
  fileName: string;
  sheetName: string;
  headers: string[];
  rows: (string | number)[][];
  rowCount: number;
  colCount: number;
  enabled: boolean;
}

interface ExcelFile {
  id: string;
  file: File;
  name: string;
  sheets: ParsedSheet[];
}

export const ExcelToPDF: React.FC = () => {
  const [excelFiles, setExcelFiles] = useState<ExcelFile[]>([]);
  const [sheetsSequence, setSheetsSequence] = useState<ParsedSheet[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Styling & Layout Options
  const [orientation, setOrientation] = useState<'portrait' | 'landscape' | 'auto'>('auto');
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'legal'>('a4');
  const [themeStyle, setThemeStyle] = useState<'office' | 'corporate' | 'emerald' | 'minimal'>('office');
  const [showGridlines, setShowGridlines] = useState(true);
  const [showPageNumbers, setShowPageNumbers] = useState(true);
  const [showSheetHeader, setShowSheetHeader] = useState(true);
  const [customTitle, setCustomTitle] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState<string | null>(null);

  // Handle Drag Over
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const parseExcelFile = async (file: File): Promise<ParsedSheet[]> => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array', cellDates: true });
    const parsedSheets: ParsedSheet[] = [];

    workbook.SheetNames.forEach((name) => {
      const worksheet = workbook.Sheets[name];
      const json: (string | number)[][] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '',
        blankrows: false,
      });

      if (json.length > 0) {
        // First non-empty row as headers
        const rawHeaders = json[0] || [];
        const headers = rawHeaders.map((h, idx) => (h !== undefined && h !== null && String(h).trim() !== '' ? String(h) : `Column ${idx + 1}`));
        const rows = json.slice(1).map(row => 
          row.map(cell => (cell !== undefined && cell !== null ? cell : ''))
        );

        parsedSheets.push({
          id: `${file.name}-${name}-${Math.random().toString(36).substring(2, 7)}`,
          fileName: file.name,
          sheetName: name,
          headers,
          rows,
          rowCount: rows.length,
          colCount: headers.length,
          enabled: true,
        });
      }
    });

    return parsedSheets;
  };

  const processFiles = async (files: File[]) => {
    setIsProcessing(true);
    setError(null);
    setProgressMessage('Parsing Excel files...');

    const validFiles = files.filter(f => 
      f.name.endsWith('.xlsx') || f.name.endsWith('.xls') || f.name.endsWith('.csv')
    );

    if (validFiles.length === 0) {
      setError('Please select valid Excel (.xlsx, .xls) or CSV (.csv) files.');
      setIsProcessing(false);
      return;
    }

    try {
      const newExcelFiles: ExcelFile[] = [];
      const newSheets: ParsedSheet[] = [];

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        setProgress(Math.round(((i + 1) / validFiles.length) * 100));
        const sheets = await parseExcelFile(file);

        newExcelFiles.push({
          id: `${Date.now()}-${i}`,
          file,
          name: file.name,
          sheets,
        });

        newSheets.push(...sheets);
      }

      setExcelFiles(prev => [...prev, ...newExcelFiles]);
      setSheetsSequence(prev => [...prev, ...newSheets]);

      if (newSheets.length > 0 && !activePreviewTab) {
        setActivePreviewTab(newSheets[0].id);
      }

      setPdfBlobUrl(null);
    } catch (err: any) {
      console.error(err);
      setError('Failed to read Excel file. Please make sure the file is not corrupted.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  const toggleSheetEnabled = (id: string) => {
    setSheetsSequence(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const moveSheet = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sheetsSequence.length) return;

    const newSeq = [...sheetsSequence];
    const temp = newSeq[index];
    newSeq[index] = newSeq[targetIndex];
    newSeq[targetIndex] = temp;
    setSheetsSequence(newSeq);
  };

  const handleItemDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleItemDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newSeq = [...sheetsSequence];
    const item = newSeq.splice(draggedIndex, 1)[0];
    newSeq.splice(index, 0, item);
    setDraggedIndex(index);
    setSheetsSequence(newSeq);
  };

  const handleItemDragEnd = () => {
    setDraggedIndex(null);
  };

  const removeSheet = (id: string) => {
    setSheetsSequence(prev => prev.filter(s => s.id !== id));
  };

  const clearAll = () => {
    setExcelFiles([]);
    setSheetsSequence([]);
    setPdfBlobUrl(null);
    setError(null);
    setActivePreviewTab(null);
  };

  const getThemeColors = () => {
    switch (themeStyle) {
      case 'corporate':
        return { headFill: [30, 58, 138], headText: [255, 255, 255], alternate: [243, 244, 246] };
      case 'emerald':
        return { headFill: [6, 95, 70], headText: [255, 255, 255], alternate: [240, 253, 244] };
      case 'minimal':
        return { headFill: [243, 244, 246], headText: [17, 24, 39], alternate: [255, 255, 255] };
      case 'office':
      default:
        return { headFill: [37, 99, 235], headText: [255, 255, 255], alternate: [248, 250, 252] };
    }
  };

  const generatePDF = () => {
    const activeSheets = sheetsSequence.filter(s => s.enabled);
    if (activeSheets.length === 0) {
      setError('Please enable at least one worksheet in sequence to generate PDF.');
      return;
    }

    setIsProcessing(true);
    setProgressMessage('Generating clean Office PDF document...');
    setError(null);

    setTimeout(() => {
      try {
        const firstSheet = activeSheets[0];
        let defaultOrientation: 'portrait' | 'landscape' = 'portrait';
        if (orientation === 'auto') {
          defaultOrientation = firstSheet.colCount > 6 ? 'landscape' : 'portrait';
        } else {
          defaultOrientation = orientation;
        }

        const doc = new jsPDF({
          orientation: defaultOrientation,
          unit: 'pt',
          format: pageSize,
        });

        const colors = getThemeColors();

        activeSheets.forEach((sheet, sheetIdx) => {
          if (sheetIdx > 0) {
            let sheetOrientation: 'portrait' | 'landscape' = defaultOrientation;
            if (orientation === 'auto') {
              sheetOrientation = sheet.colCount > 6 ? 'landscape' : 'portrait';
            }
            doc.addPage(pageSize, sheetOrientation);
          }

          let startY = 40;

          // Header Title / Document Header
          if (customTitle && sheetIdx === 0) {
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(31, 41, 55);
            doc.text(customTitle, 40, startY);
            startY += 24;
          }

          // Section Header for Worksheet
          if (showSheetHeader) {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(37, 99, 235);
            doc.text(`${sheet.sheetName} (${sheet.fileName})`, 40, startY);
            startY += 20;
          }

          // Generate Table
          autoTable(doc, {
            startY,
            head: [sheet.headers],
            body: sheet.rows,
            theme: showGridlines ? 'grid' : 'striped',
            headStyles: {
              fillColor: colors.headFill as [number, number, number],
              textColor: colors.headText as [number, number, number],
              fontStyle: 'bold',
              fontSize: 9,
              halign: 'left',
            },
            alternateRowStyles: {
              fillColor: colors.alternate as [number, number, number],
            },
            styles: {
              fontSize: 8,
              cellPadding: 5,
              overflow: 'linebreak',
              valign: 'middle',
            },
            margin: { top: 40, bottom: 40, left: 40, right: 40 },
            didDrawPage: (data) => {
              // Page Numbers
              if (showPageNumbers) {
                const totalPages = (doc as any).internal.getNumberOfPages();
                const currentPage = data.pageNumber;
                doc.setFontSize(8);
                doc.setTextColor(156, 163, 175);
                const pageString = `Page ${currentPage} of ${totalPages}`;
                const pageWidth = doc.internal.pageSize.width;
                doc.text(pageString, pageWidth - 40, doc.internal.pageSize.height - 20, { align: 'right' });

                // Footer watermark / domain
                doc.text('Generated with img365.in - Offline & Private', 40, doc.internal.pageSize.height - 20);
              }
            },
          });
        });

        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        const name = customTitle 
          ? `${customTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf` 
          : `excel_export_${Date.now()}.pdf`;

        setPdfBlobUrl(url);
        setPdfFileName(name);
      } catch (err: any) {
        console.error(err);
        setError('Failed to generate PDF. Please check your Excel structure.');
      } finally {
        setIsProcessing(false);
      }
    }, 200);
  };

  const activePreviewSheet = sheetsSequence.find(s => s.id === activePreviewTab);

  return (
    <>
      <SEO
        title="Excel to PDF Converter Free Online | XLSX & XLS to PDF with Sequence | img365.in"
        description="Convert Excel spreadsheets (XLSX, XLS, CSV) to PDF online for free. Custom sheet sequence reordering, orientation, gridlines, financial & budget reports. 100% private, client-side, fast & offline."
        keywords="excel to pdf, xlsx to pdf, xls to pdf, convert excel to pdf, csv to pdf, spreadsheet to pdf, budget to pdf, planning to pdf, sheet sequence, excel converter free"
        toolName="Excel to PDF Converter Free Online"
        faqs={[
          { question: "How do I convert Excel to PDF with sequence?", answer: "Upload your XLSX, XLS, or CSV files. Drag or click arrows to order your worksheets, customize paper size and budgeting color themes, then click Convert to PDF." },
          { question: "Are my corporate budget spreadsheets uploaded to a server?", answer: "No! All parsing and PDF rendering happen 100% locally in your web browser. Your financial sheets never leave your device." },
          { question: "Does it support multiple Excel files?", answer: "Yes! You can upload multiple spreadsheet files simultaneously and combine sheets into one sequenced PDF report." }
        ]}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          {/* Main Container */}
          <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 p-8 text-white">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl">
                  <FileSpreadsheet className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Excel to PDF Converter</h1>
                  <p className="text-emerald-100 text-sm">
                    Convert XLSX, XLS, and CSV spreadsheets with sheet sequencing, page fitting & office formatting.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              
              {/* Dropzone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 scale-[0.99]'
                    : 'border-gray-300 dark:border-gray-600 hover:border-emerald-500 dark:hover:border-emerald-400 bg-gray-50/50 dark:bg-gray-800/50'
                }`}
                onClick={() => document.getElementById('excel-file-input')?.click()}
              >
                <input
                  id="excel-file-input"
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                />
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-emerald-100 dark:bg-emerald-900/50 rounded-full mb-4 text-emerald-600 dark:text-emerald-400">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Drag & Drop Excel files here
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Supports .xlsx, .xls, and .csv spreadsheets (Multiple files supported)
                  </p>
                  <button
                    type="button"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl shadow-md transition-colors inline-flex items-center space-x-2"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Select Excel Files</span>
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center space-x-3 text-red-700 dark:text-red-300">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              {/* Progress Indicator */}
              {isProcessing && (
                <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between text-sm font-medium text-emerald-800 dark:text-emerald-300">
                    <span className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                      <span>{progressMessage}</span>
                    </span>
                    {progress > 0 && <span>{progress}%</span>}
                  </div>
                  <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress > 0 ? progress : 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Sequence & Settings Section */}
              {sheetsSequence.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Left Column: Sequence Manager & Controls */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                          <GripVertical className="w-5 h-5 text-emerald-600" />
                          <span>Sheet Sequence & Selection</span>
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Drag or use arrows to reorder worksheets in exact PDF page sequence
                        </p>
                      </div>
                      <button
                        onClick={clearAll}
                        className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 font-medium hover:underline"
                      >
                        Clear All
                      </button>
                    </div>

                    {/* Sequence List */}
                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                      {sheetsSequence.map((sheet, index) => (
                        <div
                          key={sheet.id}
                          draggable
                          onDragStart={() => handleItemDragStart(index)}
                          onDragOver={(e) => handleItemDragOver(e, index)}
                          onDragEnd={handleItemDragEnd}
                          className={`flex items-center justify-between p-3.5 bg-white dark:bg-gray-900 border rounded-xl shadow-sm transition-all ${
                            sheet.enabled
                              ? 'border-gray-200 dark:border-gray-700'
                              : 'border-gray-200 dark:border-gray-800 opacity-50 bg-gray-50 dark:bg-gray-950'
                          }`}
                        >
                          <div className="flex items-center space-x-3 overflow-hidden">
                            <input
                              type="checkbox"
                              checked={sheet.enabled}
                              onChange={() => toggleSheetEnabled(sheet.id)}
                              className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                            />
                            <div className="cursor-grab text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                              <GripVertical className="w-4 h-4" />
                            </div>
                            <div className="truncate">
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                                  {sheet.sheetName}
                                </span>
                                <span className="text-[11px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-md font-mono">
                                  {sheet.rowCount} rows × {sheet.colCount} cols
                                </span>
                              </div>
                              <span className="text-xs text-gray-400 block truncate">
                                {sheet.fileName}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => moveSheet(index, 'up')}
                              disabled={index === 0}
                              className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-30"
                              title="Move Up in Sequence"
                            >
                              <MoveUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => moveSheet(index, 'down')}
                              disabled={index === sheetsSequence.length - 1}
                              className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-30"
                              title="Move Down in Sequence"
                            >
                              <MoveDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeSheet(sheet.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                              title="Remove Worksheet"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* PDF Document Options */}
                    <div className="p-5 bg-gray-50 dark:bg-gray-900/60 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                        <Settings className="w-4 h-4 text-emerald-600" />
                        <span>PDF Formatting & Page Setup</span>
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Custom Title */}
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Document Title / Report Header
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Q3 Budget & Financial Forecast 2026"
                            value={customTitle}
                            onChange={(e) => setCustomTitle(e.target.value)}
                            className="w-full text-xs p-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                          />
                        </div>

                        {/* Page Orientation */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Page Orientation
                          </label>
                          <select
                            value={orientation}
                            onChange={(e: any) => setOrientation(e.target.value)}
                            className="w-full text-xs p-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                          >
                            <option value="auto">Auto (Landscape if more than 6 cols)</option>
                            <option value="portrait">Portrait</option>
                            <option value="landscape">Landscape</option>
                          </select>
                        </div>

                        {/* Page Size */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Page Format
                          </label>
                          <select
                            value={pageSize}
                            onChange={(e: any) => setPageSize(e.target.value)}
                            className="w-full text-xs p-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                          >
                            <option value="a4">A4 (Standard Office)</option>
                            <option value="letter">US Letter</option>
                            <option value="legal">US Legal</option>
                          </select>
                        </div>

                        {/* Theme Style */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Table Color Preset
                          </label>
                          <select
                            value={themeStyle}
                            onChange={(e: any) => setThemeStyle(e.target.value)}
                            className="w-full text-xs p-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                          >
                            <option value="office">Modern Office Blue</option>
                            <option value="corporate">Executive Navy</option>
                            <option value="emerald">Financial Emerald</option>
                            <option value="minimal">Minimalist Gray</option>
                          </select>
                        </div>

                        {/* Toggles */}
                        <div className="space-y-2 text-xs pt-1">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={showGridlines}
                              onChange={(e) => setShowGridlines(e.target.checked)}
                              className="w-4 h-4 text-emerald-600 rounded"
                            />
                            <span className="text-gray-700 dark:text-gray-300">Show Table Gridlines</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={showPageNumbers}
                              onChange={(e) => setShowPageNumbers(e.target.checked)}
                              className="w-4 h-4 text-emerald-600 rounded"
                            />
                            <span className="text-gray-700 dark:text-gray-300">Show Page Numbers</span>
                          </label>
                        </div>
                      </div>

                      {/* Convert Button */}
                      <button
                        onClick={generatePDF}
                        disabled={isProcessing}
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 text-base"
                      >
                        <FileText className="w-5 h-5" />
                        <span>Generate & Export PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Live Data Preview & Download */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                        <Eye className="w-5 h-5 text-emerald-600" />
                        <span>Data Preview</span>
                      </h2>
                    </div>

                    {/* Download Card if PDF generated */}
                    {pdfBlobUrl && (
                      <div className="p-5 bg-emerald-500/10 border-2 border-emerald-500 rounded-2xl text-center space-y-3 animate-fadeIn">
                        <div className="p-3 bg-emerald-500 text-white rounded-full w-12 h-12 mx-auto flex items-center justify-center shadow-md">
                          <Check className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          PDF Ready for Download!
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {pdfFileName}
                        </p>
                        <a
                          href={pdfBlobUrl}
                          download={pdfFileName}
                          className="inline-flex items-center justify-center space-x-2 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download PDF</span>
                        </a>
                      </div>
                    )}

                    {/* Sheet Tabs Preview */}
                    <div className="bg-gray-50 dark:bg-gray-900/60 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-4">
                      {/* Tabs */}
                      <div className="flex space-x-2 overflow-x-auto pb-2 border-b border-gray-200 dark:border-gray-800">
                        {sheetsSequence.map(sheet => (
                          <button
                            key={sheet.id}
                            onClick={() => setActivePreviewTab(sheet.id)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                              activePreviewTab === sheet.id
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            {sheet.sheetName}
                          </button>
                        ))}
                      </div>

                      {/* Active Table Data Preview */}
                      {activePreviewSheet ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>Showing first 5 rows</span>
                            <span>{activePreviewSheet.rowCount} total rows</span>
                          </div>
                          <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900">
                            <table className="w-full text-xs text-left">
                              <thead className="bg-emerald-600 text-white">
                                <tr>
                                  {activePreviewSheet.headers.map((h, i) => (
                                    <th key={i} className="p-2 border-b border-emerald-700 font-semibold truncate max-w-[120px]">
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {activePreviewSheet.rows.slice(0, 5).map((row, rIdx) => (
                                  <tr key={rIdx} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    {activePreviewSheet.headers.map((_, cIdx) => (
                                      <td key={cIdx} className="p-2 truncate max-w-[120px] text-gray-700 dark:text-gray-300">
                                        {row[cIdx] !== undefined ? String(row[cIdx]) : ''}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-xs text-gray-400">
                          Select a sheet tab above to preview contents
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Office & Planning Use Cases Section */}
          <div className="mt-16 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl w-12 h-12 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base mb-2">Office & Management</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                Convert corporate spreadsheets, employee directory sheets, and project status trackers into clean executive PDF reports.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl w-12 h-12 flex items-center justify-center mb-4">
                <TableIcon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base mb-2">Budgeting & Finance</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                Keep accounting tables, monthly balance sheets, and expense sheets neatly formatted with financial emerald gridlines.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-xl w-12 h-12 flex items-center justify-center mb-4">
                <GripVertical className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base mb-2">Custom Sheet Sequence</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                Reorder multiple worksheets across different Excel files into your desired page sequence before generating your final document.
              </p>
            </div>
          </div>

          {/* Quick Access Tools */}
          <div className="mt-12 max-w-6xl mx-auto">
            <ToolsMenu />
            <SuggestedTools tools={['Image to PDF', 'PDF to Text', 'Merge PDF', 'Sign PDF']} />
          </div>

        </div>
      </div>
    </>
  );
};

export default ExcelToPDF;
