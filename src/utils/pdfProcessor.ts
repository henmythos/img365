import jsPDF from 'jspdf';

export interface PDFConversionOptions {
  quality: number;
  pageSize: 'A4' | 'Letter' | 'Legal' | 'A3' | 'A5';
  orientation: 'portrait' | 'landscape';
  margin: number;
  fitToPage: boolean;
}

export const convertImagesToPDF = async (
  files: File[],
  options: PDFConversionOptions
): Promise<Blob> => {
  const pdf = new jsPDF({
    orientation: options.orientation,
    unit: 'mm',
    format: options.pageSize.toLowerCase(),
  });

  let isFirstPage = true;

  for (const file of files) {
    if (!isFirstPage) {
      pdf.addPage();
    }

    let imgWidth = 0;
    let imgHeight = 0;
    let imageDataUrl = '';

    try {
      const bitmap = await createImageBitmap(file);
      imgWidth = bitmap.width;
      imgHeight = bitmap.height;
      bitmap.close();
      imageDataUrl = await fileToDataURL(file);
    } catch {
      imageDataUrl = await fileToDataURL(file);
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageDataUrl;
      });
      imgWidth = img.width;
      imgHeight = img.height;
    }

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = options.margin;

    const availableWidth = pageWidth - (margin * 2);
    const availableHeight = pageHeight - (margin * 2);

    if (options.fitToPage) {
      const widthRatio = availableWidth / imgWidth;
      const heightRatio = availableHeight / imgHeight;
      const ratio = Math.min(widthRatio, heightRatio);

      imgWidth *= ratio;
      imgHeight *= ratio;
    } else {
      imgWidth = (imgWidth * 25.4) / 96;
      imgHeight = (imgHeight * 25.4) / 96;

      if (imgWidth > availableWidth) {
        const ratio = availableWidth / imgWidth;
        imgWidth = availableWidth;
        imgHeight *= ratio;
      }

      if (imgHeight > availableHeight) {
        const ratio = availableHeight / imgHeight;
        imgHeight = availableHeight;
        imgWidth *= ratio;
      }
    }

    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    pdf.addImage(imageDataUrl, 'JPEG', x, y, imgWidth, imgHeight);
    isFirstPage = false;
  }

  return pdf.output('blob');
};

// Initialize PDF.js worker once
let workerInitialized = false;
let workerInitPromise: Promise<void> | null = null;

const initializePDFWorker = async (): Promise<void> => {
  if (workerInitialized) return;
  if (workerInitPromise) return workerInitPromise;

  workerInitPromise = (async () => {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      const version = pdfjsLib.version;

      // Worker sources in order of preference
      // Note: pdfjs-dist 5.x uses .mjs files (ES modules)
      const workerSources = [
        // 1. Local worker file (most reliable, bundled with app)
        '/pdf.worker.min.mjs',
        // 2. CDN fallbacks (in case local file fails) - try both .mjs and .js
        `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/build/pdf.worker.min.mjs`,
        `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/build/pdf.worker.min.js`,
        `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`,
        `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.js`,
        `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.mjs`,
      ];

      // Try to use local worker first
      let workerSrc = workerSources[0];
      let workerFound = false;

      // Test if local worker is accessible
      try {
        const response = await fetch(workerSources[0], {
          method: 'HEAD',
          cache: 'no-cache'
        });
        if (response.ok) {
          workerFound = true;
        }
      } catch {
        // Local worker not available, will use CDN fallback
        console.warn('Local PDF.js worker not found, using CDN fallback');
      }

      // If local worker not found, try CDN fallbacks
      if (!workerFound) {
        for (let i = 1; i < workerSources.length; i++) {
          try {
            const response = await fetch(workerSources[i], {
              method: 'HEAD',
              cache: 'no-cache'
            });
            if (response.ok) {
              workerSrc = workerSources[i];
              workerFound = true;
              break;
            }
          } catch {
            // Try next source
            continue;
          }
        }
      }

      if (!workerFound) {
        throw new Error('Could not find PDF.js worker from any source');
      }

      // Set the worker source
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
      workerInitialized = true;
    } catch (error) {
      console.error('Failed to initialize PDF.js worker:', error);
      throw new Error(
        `Failed to initialize PDF.js worker: ${error instanceof Error ? error.message : 'Unknown error'}. ` +
        'Please ensure you have an internet connection or refresh the page and try again.'
      );
    }
  })();

  return workerInitPromise;
};

export const convertPDFToImages = async (
  pdfFile: File,
  options: { format: string; quality: number; dpi: number }
): Promise<Blob[]> => {
  try {
    await initializePDFWorker();
    const pdfjsLib = await import('pdfjs-dist');

    const arrayBuffer = await pdfFile.arrayBuffer();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loadingTask = (pdfjsLib as any).getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
      verbosity: 0
    });
    const pdf = await loadingTask.promise;
    const images: Blob[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const scale = options.dpi / 72;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Could not get canvas context');
      }

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      const imageFormat = options.format === 'jpeg' ? 'image/jpeg' : `image/${options.format}`;

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert canvas to blob'));
            }
          },
          imageFormat,
          options.quality / 100
        );
      });

      images.push(blob);
      canvas.width = 0;
      canvas.height = 0;
      // Yield to event loop to keep UI thread responsive during bulk PDF page conversions
      await new Promise(r => setTimeout(r, 0));
    }

    return images;
  } catch (error) {
    console.error('Error converting PDF to images:', error);
    throw new Error(`Failed to convert PDF to images: ${error instanceof Error ? error.message : 'Unknown error'}. Please ensure the PDF is valid and not password protected.`);
  }
};

const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const getSupportedPDFFormats = () => {
  return [
    { value: 'jpeg', label: 'JPEG', extension: 'jpg' },
    { value: 'png', label: 'PNG', extension: 'png' },
    { value: 'webp', label: 'WebP', extension: 'webp' },
  ];
};

export const getPDFPageSizes = () => {
  return [
    { value: 'A4', label: 'A4 (210 × 297 mm)' },
    { value: 'Letter', label: 'Letter (8.5 × 11 in)' },
    { value: 'Legal', label: 'Legal (8.5 × 14 in)' },
    { value: 'A3', label: 'A3 (297 × 420 mm)' },
    { value: 'A5', label: 'A5 (148 × 210 mm)' },
  ];
};