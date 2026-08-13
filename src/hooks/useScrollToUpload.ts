import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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

export function useScrollToUpload() {
    const location = useLocation();

    useEffect(() => {
        // ALWAYS scroll to top of page on any route change (footer links, navbar, internal links)
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

        const isToolRoute = TOOL_ROUTES.some(route => location.pathname === route);
        if (!isToolRoute) return;

        // Smooth scroll to upload zone for tool pages
        const timeoutId = setTimeout(() => {
            const uploadElement = document.querySelector('[class*="border-dashed"]');
            if (uploadElement) {
                uploadElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 120);

        return () => clearTimeout(timeoutId);
    }, [location.pathname]);
}
