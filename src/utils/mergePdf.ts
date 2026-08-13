import { PDFDocument } from 'pdf-lib';

export interface MergeResult {
  blob: Blob;
  pageCount: number;
  fileName: string;
}

/**
 * Merge multiple PDF files into a single PDF
 * Uses pdf-lib for client-side processing
 */
export const mergePDFs = async (
  files: File[],
  onProgress?: (progress: number, message: string) => void
): Promise<MergeResult> => {
  if (files.length === 0) {
    throw new Error('No PDF files provided');
  }

  if (files.length === 1) {
    // If only one file, just return it as-is
    const arrayBuffer = await files[0].arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pdfBytes = await pdfDoc.save();
    return {
      blob: new Blob([pdfBytes], { type: 'application/pdf' }),
      pageCount: pdfDoc.getPageCount(),
      fileName: 'img365merged.pdf'
    };
  }

  onProgress?.(0, 'Creating merged PDF document...');

  // Create a new PDF document
  const mergedPdf = await PDFDocument.create();
  let totalPages = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const progress = Math.round(((i + 1) / files.length) * 100);
    onProgress?.(progress, `Processing ${file.name}...`);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true
      });

      // Copy all pages from the source PDF
      const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());

      for (const page of pages) {
        mergedPdf.addPage(page);
        totalPages++;
      }
    } catch (error) {
      throw new Error(`Failed to process ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  onProgress?.(100, 'Finalizing merged PDF...');

  // Save the merged PDF
  const mergedPdfBytes = await mergedPdf.save();

  return {
    blob: new Blob([mergedPdfBytes], { type: 'application/pdf' }),
    pageCount: totalPages,
    fileName: 'img365merged.pdf'
  };
};

/**
 * Validate that a file is a valid PDF
 */
export const validatePDF = async (file: File): Promise<boolean> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    return true;
  } catch {
    return false;
  }
};
