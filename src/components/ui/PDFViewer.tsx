import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../Icons';
import { DYNAMIC_COLORS } from '../../constants/colors';
import { normalizePublicAssetUrl } from '../../utils/pdf-utils';

/**
 * PDFViewer Component
 * 
 * Renders PDF files with navigation controls.
 * Features loading states, error handling, and page navigation.
 * Uses PDF.js library for rendering.
 * 
 * @param url - URL of the PDF file to display
 * @param onLoadSuccess - Callback when PDF is loaded successfully
 * @param className - Optional CSS class for container
 * @param showZoomControls - Whether to show zoom controls (Página/Ancho). Default: true
 */
export const PDFViewer = ({
    url,
    onLoadSuccess,
    className = "",
    showZoomControls = true
}: {
    url: string,
    onLoadSuccess?: (numPages: number) => void,
    className?: string,
    showZoomControls?: boolean
}) => {
    const resolvedUrl = normalizePublicAssetUrl(url);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pdfDoc, setPdfDoc] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [zoomMode, setZoomMode] = useState<'fitPage' | 'fitWidth'>('fitPage');
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const renderTaskRef = useRef<any>(null);

    // Track container size for responsive scaling
    useEffect(() => {
        if (!containerRef.current) return;

        // Initialize immediately with current dimensions
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({
            width: rect.width,
            height: rect.height
        });

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                setContainerSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height
                });
            }
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // Load PDF document
    useEffect(() => {
        if (typeof window === 'undefined') return;

        let isActive = true;
        let loadingTask: any = null;

        const loadPDF = async () => {
            try {
                setLoading(true);
                setError(false);
                setCurrentPage(1);
                setTotalPages(0);
                setPdfDoc(null);

                // Dynamic import of PDF.js
                const pdfjsLib = await import('pdfjs-dist');

                // Use Vite's ?url import to get the worker as a local URL
                // This avoids CSP issues with external CDNs
                const { default: workerUrl } = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
                pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

                console.log('PDF.js loading document with local worker:', resolvedUrl);
                loadingTask = pdfjsLib.getDocument(resolvedUrl);
                const pdf = await loadingTask.promise;

                if (!isActive) {
                    await pdf.destroy();
                    return;
                }

                setPdfDoc(pdf);
                setTotalPages(pdf.numPages);
                setLoading(false);
                onLoadSuccess?.(pdf.numPages);
            } catch (err) {
                if (!isActive) {
                    return;
                }

                console.error('Error loading PDF:', err);
                setError(true);
                setLoading(false);
            }
        };

        loadPDF();

        return () => {
            isActive = false;
            if (loadingTask) {
                loadingTask.destroy();
            }
        };
    }, [resolvedUrl]);

    // Render current page
    useEffect(() => {
        if (!pdfDoc || !canvasRef.current) return;

        const renderPage = async () => {
            try {
                const page = await pdfDoc.getPage(currentPage);
                const canvas = canvasRef.current!;
                const context = canvas.getContext('2d')!;

                // Get page viewport to calculate base dimensions
                const viewport = page.getViewport({ scale: 1 });

                // Calculate scale to fit container based on zoomMode
                let scale = 1;
                const padding = 32; // Corresponds to p-4/p-8

                // Use containerSize if available, otherwise fall back to canvas parent dimensions
                let availableWidth = containerSize.width || containerRef.current?.clientWidth || 800;
                let availableHeight = containerSize.height || containerRef.current?.clientHeight || 600;
                availableWidth -= (padding * 2);
                availableHeight -= (padding * 2);

                if (zoomMode === 'fitWidth') {
                    scale = availableWidth / viewport.width;
                } else {
                    // fitPage: fit both width and height
                    const scaleW = availableWidth / viewport.width;
                    const scaleH = availableHeight / viewport.height;
                    scale = Math.min(scaleW, scaleH);
                }

                // Limit minimum scale for legibility
                scale = Math.max(scale, 0.4);

                const scaledViewport = page.getViewport({ scale: scale * window.devicePixelRatio });

                // Set canvas size accounting for high DPI screens
                canvas.height = scaledViewport.height;
                canvas.width = scaledViewport.width;
                canvas.style.height = `${scaledViewport.height / window.devicePixelRatio}px`;
                canvas.style.width = `${scaledViewport.width / window.devicePixelRatio}px`;

                const renderContext = {
                    canvasContext: context,
                    viewport: scaledViewport,
                };

                // Cancel previous render task if it exists
                if (renderTaskRef.current) {
                    renderTaskRef.current.cancel();
                }

                const renderTask = page.render(renderContext);
                renderTaskRef.current = renderTask;
                await renderTask.promise;
            } catch (err: any) {
                if (err.name === 'RenderingCancelledException') return;
                console.error('Error rendering page:', err);
            }
        };

        renderPage();

        return () => {
            if (renderTaskRef.current) {
                renderTaskRef.current.cancel();
            }
        };
    }, [pdfDoc, currentPage, zoomMode, containerSize]);

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    if (loading) {
        return (
            <div className="relative w-full h-full bg-[var(--bg-secondary)] flex items-center justify-center">
                <div className="text-center">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
                        style={{ borderBottomColor: DYNAMIC_COLORS.raw.light.primary }}
                    ></div>
                    <p className="text-[var(--text-secondary)]">Cargando presentación...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative w-full h-full bg-[var(--bg-secondary)] flex items-center justify-center">
                <div className="text-center p-4">
                    <p className="text-[var(--text-secondary)] mb-4">No se pudo cargar el PDF</p>
                    <a href={resolvedUrl} target="_blank" rel="noreferrer" className="font-bold hover:underline" style={{ color: DYNAMIC_COLORS.raw.light.primary }}>
                        Descargar PDF
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative w-full h-full bg-[var(--app-bg-secondary)] dark:bg-[#0f172a]/30 flex flex-col ${className}`}>
            {/* PDF Canvas Overlay Gradient for better integration */}
            <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-[var(--bg-primary)]/10 to-transparent pointer-events-none z-10" />

            {/* PDF Canvas area */}
            <div
                ref={containerRef}
                className="flex-1 overflow-auto flex items-center justify-center p-4 md:p-8 custom-scrollbar bg-[var(--bg-secondary)]/50"
            >
                <div className="relative">
                    <canvas ref={canvasRef} className="max-w-full h-auto shadow-2xl rounded-sm border border-[var(--card-border)]/50 transition-all duration-300 ease-out" />
                </div>
            </div>

            {/* Navigation & Zoom Controls - Using Glass Morphism */}
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 p-4 md:p-6 bg-[var(--card-bg)] backdrop-blur-xl border-t border-[var(--card-border)]/50 z-20">
                {/* Page Navigation */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        className="group p-2.5 rounded-xl text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-lg hover:scale-105 active:scale-95"
                        style={{ backgroundColor: DYNAMIC_COLORS.raw.light.primary }}
                        title="Página Anterior"
                    >
                        <Icons.ArrowUp className="w-5 h-5 rotate-[-90deg] group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <div className="px-5 py-2.5 rounded-xl bg-[var(--input-bg)] backdrop-blur-md border border-[var(--card-border)] shadow-inner min-w-[100px] text-center">
                        <span className="font-mono text-sm tracking-tighter">
                            <span className="font-bold text-[var(--text-primary)]">{currentPage}</span>
                            <span className="text-[var(--text-tertiary)] mx-1.5">/</span>
                            <span className="text-[var(--text-secondary)]">{totalPages}</span>
                        </span>
                    </div>

                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="group p-2.5 rounded-xl text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-lg hover:scale-105 active:scale-95"
                        style={{ backgroundColor: DYNAMIC_COLORS.raw.light.primary }}
                        title="Página Siguiente"
                    >
                        <Icons.ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Vertical Divider (Desktop) - Only shown with zoom controls */}
                {showZoomControls && (
                    <div className="hidden md:block w-px h-8 bg-[var(--card-border)]/50" />
                )}

                {/* Zoom Controls - Conditional */}
                {showZoomControls && (
                    <div className="flex items-center bg-[var(--input-bg)]/50 rounded-2xl p-1.5 border border-[var(--card-border)]/50 shadow-sm">
                        <button
                            onClick={() => setZoomMode('fitPage')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${zoomMode === 'fitPage'
                                ? 'bg-[var(--card-bg)] text-[var(--text-primary)] shadow-md border border-[var(--card-border)]/50'
                                : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            <Icons.Maximize className="w-3.5 h-3.5" />
                            Página
                        </button>
                        <button
                            onClick={() => setZoomMode('fitWidth')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${zoomMode === 'fitWidth'
                                ? 'bg-[var(--card-bg)] text-[var(--text-primary)] shadow-md border border-[var(--card-border)]/50'
                                : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            <Icons.Maximize className="w-3.5 h-3.5 rotate-90" />
                            Ancho
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
