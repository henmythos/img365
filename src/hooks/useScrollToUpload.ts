import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Tool routes that should auto-scroll to upload section
const TOOL_ROUTES = [
    '/convert',
    '/compress',
    '/image-to-pdf',
    '/pdf-to-image',
    '/camera-to-pdf',
    '/excel-to-pdf',
    '/merge-pdf',
    '/split-pdf',
    '/watermark',
    '/pdf-to-text',
    '/crop-pdf',
    '/sign-pdf',
    '/image-resize',
    '/image-crop',
    '/image-rotate',
    '/smart-scan',
];

/**
 * Custom hook that automatically scrolls to the upload section
 * when navigating between tool pages in the SPA.
 * 
 * Uses the border-dashed class which is present on all upload areas
 * across ImageProcessor, PDFProcessor, and CameraProcessor components.
 */
export function useScrollToUpload() {
    const location = useLocation();

    useEffect(() => {
        const isToolRoute = TOOL_ROUTES.some(route => location.pathname === route);

        if (!isToolRoute) return;

        // Small delay to allow lazy-loaded components to render
        const timeoutId = setTimeout(() => {
            const uploadElement = document.querySelector('[class*="border-dashed"]');
            if (uploadElement) {
                uploadElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 150);

        return () => clearTimeout(timeoutId);
    }, [location.pathname]);
}
