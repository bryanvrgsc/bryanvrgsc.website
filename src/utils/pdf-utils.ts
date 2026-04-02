/**
 * PDF Utilities
 * 
 * Helper functions for handling PDF documents in the digital library.
 */

const URL_WITH_PROTOCOL_RE = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;
const NETWORK_URL_RE = /^\/\//;

function encodePathSegment(segment: string): string {
    try {
        return encodeURIComponent(decodeURIComponent(segment));
    } catch {
        return encodeURIComponent(segment);
    }
}

/**
 * Normalize URLs for files served from the public directory.
 * - Preserves external URLs and special protocols
 * - Ensures a leading slash for local public assets
 * - Encodes path segments so filenames with spaces open/download correctly
 */
export function normalizePublicAssetUrl(url: string): string {
    if (!url) return url;

    if (URL_WITH_PROTOCOL_RE.test(url) || NETWORK_URL_RE.test(url)) {
        return url;
    }

    const [beforeHash, hash = ''] = url.split('#', 2);
    const [pathname, search = ''] = beforeHash.split('?', 2);
    const normalizedPath = (pathname.startsWith('/') ? pathname : `/${pathname}`)
        .split('/')
        .map((segment, index) => (index === 0 ? '' : encodePathSegment(segment)))
        .join('/');

    return `${normalizedPath}${search ? `?${search}` : ''}${hash ? `#${hash}` : ''}`;
}

/**
 * Check whether the resolved URL points to a PDF file.
 */
export function isPdfDocumentUrl(url: string): boolean {
    const normalizedUrl = normalizePublicAssetUrl(url);
    const pathname = normalizedUrl.split('#', 1)[0].split('?', 1)[0];
    return pathname.toLowerCase().endsWith('.pdf');
}

/**
 * Download a PDF file
 * @param url - URL of the PDF file
 * @param filename - Desired filename for download
 */
export function downloadPDF(url: string, filename: string): void {
    const normalizedUrl = normalizePublicAssetUrl(url);
    const link = document.createElement('a');
    link.href = normalizedUrl;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Open PDF in new tab
 * @param url - URL of the PDF file
 */
export function openPDFInNewTab(url: string): void {
    window.open(normalizePublicAssetUrl(url), '_blank', 'noopener,noreferrer');
}

/**
 * Format file size from bytes
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
