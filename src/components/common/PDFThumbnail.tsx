import React, { useEffect, useRef, useState } from 'react';

interface PDFThumbnailProps {
    url: string;
    className?: string;
    style?: React.CSSProperties;
}

export const PDFThumbnail: React.FC<PDFThumbnailProps> = ({ url, className, style }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const renderThumbnail = async () => {
            try {
                const pdfjsLib = await import('pdfjs-dist');
                const { default: workerUrl } = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
                pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

                const loadingTask = pdfjsLib.getDocument(url);
                const pdf = await loadingTask.promise;

                if (!isMounted) return;

                const page = await pdf.getPage(1);

                if (!isMounted || !canvasRef.current) return;

                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');

                if (!context) return;

                // Render at a reasonable resolution for thumbnail
                // We use a scale of 1.5 for better quality on high DPI screens
                const viewport = page.getViewport({ scale: 1.5 });

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                } as any;

                await page.render(renderContext).promise;

                if (isMounted) {
                    setLoaded(true);
                }
            } catch (error) {
                console.error('Error rendering PDF thumbnail:', error);
            }
        };

        renderThumbnail();

        return () => {
            isMounted = false;
        };
    }, [url]);

    return (
        <canvas
            ref={canvasRef}
            className={`object-cover w-full h-full transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${className || ''}`}
            style={style}
        />
    );
};
