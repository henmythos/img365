/**
 * PDF to Text extraction utility using pdfjs-dist
 * Extracts text content from PDF files client-side
 */

// Initialize PDF.js worker
let workerInitialized = false;
let workerInitPromise: Promise<void> | null = null;

const initializePDFWorker = async (): Promise<void> => {
    if (workerInitialized) return;
    if (workerInitPromise) return workerInitPromise;

    workerInitPromise = (async () => {
        try {
            const pdfjsLib = await import('pdfjs-dist');
            const version = pdfjsLib.version;

            const workerSources = [
                '/pdf.worker.min.mjs',
                `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/build/pdf.worker.min.mjs`,
                `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/build/pdf.worker.min.js`,
                `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`,
            ];

            let workerSrc = workerSources[0];
            let workerFound = false;

            try {
                const response = await fetch(workerSources[0], {
                    method: 'HEAD',
                    cache: 'no-cache'
                });
                if (response.ok) {
                    workerFound = true;
                }
            } catch {
                console.warn('Local PDF.js worker not found, using CDN fallback');
            }

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
                        continue;
                    }
                }
            }

            if (!workerFound) {
                throw new Error('Could not find PDF.js worker from any source');
            }

            pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
            workerInitialized = true;
        } catch (error) {
            console.error('Failed to initialize PDF.js worker:', error);
            throw new Error('Failed to initialize PDF.js worker');
        }
    })();

    return workerInitPromise;
};

export interface PageText {
    pageNumber: number;
    text: string;
}

export interface PDFTextResult {
    pages: PageText[];
    totalPages: number;
    fullText: string;
}

/**
 * Extract text from a PDF file
 */
export const extractTextFromPDF = async (
    file: File,
    onProgress?: (progress: number, message: string) => void
): Promise<PDFTextResult> => {
    await initializePDFWorker();
    const pdfjsLib = await import('pdfjs-dist');

    onProgress?.(0, 'Loading PDF...');

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        useSystemFonts: true,
        verbosity: 0
    });

    const pdf = await loadingTask.promise;
    const pages: PageText[] = [];
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const progress = Math.round((i / pdf.numPages) * 100);
        onProgress?.(progress, `Extracting page ${i} of ${pdf.numPages}...`);

        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        // Extract text from content items
        let pageText = '';
        let lastY: number | null = null;

        for (const item of textContent.items) {
            if ('str' in item) {
                // Check if we need a line break (based on Y position change)
                if (lastY !== null && 'transform' in item) {
                    const currentY = item.transform[5];
                    if (Math.abs(currentY - lastY) > 5) {
                        pageText += '\n';
                    } else if (pageText.length > 0 && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
                        pageText += ' ';
                    }
                }

                pageText += item.str;

                if ('transform' in item) {
                    lastY = item.transform[5];
                }
            }
        }

        pages.push({
            pageNumber: i,
            text: pageText.trim()
        });

        if (pageText.trim()) {
            fullText += `--- Page ${i} ---\n${pageText.trim()}\n\n`;
        }
    }

    onProgress?.(100, 'Done!');

    return {
        pages,
        totalPages: pdf.numPages,
        fullText: fullText.trim()
    };
};

/**
 * Get PDF page count without extracting text
 */
export const getPDFPageCount = async (file: File): Promise<number> => {
    await initializePDFWorker();
    const pdfjsLib = await import('pdfjs-dist');

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer, verbosity: 0 });
    const pdf = await loadingTask.promise;

    return pdf.numPages;
};
