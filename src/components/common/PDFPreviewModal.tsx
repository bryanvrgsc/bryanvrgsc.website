import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icons } from '../Icons';
import { DYNAMIC_COLORS } from '../../constants/colors';
import { PDFViewer } from '../ui/PDFViewer';

interface PDFPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfUrl: string;
    title: string;
    filename: string;
    description?: string;
    category?: string;
    type?: 'paper' | 'slides';
    lang?: 'en' | 'es';
}

// Translations
const translations = {
    en: {
        loading: 'Loading document...',
        summary: 'Summary',
        openNewTab: 'Open in new tab',
        download: 'Download',
        docInfo: 'Document Info',
        paper: 'Research Paper',
        slides: 'Presentation'
    },
    es: {
        loading: 'Cargando documento...',
        summary: 'Resumen',
        openNewTab: 'Abrir en nueva ventana',
        download: 'Descargar',
        docInfo: 'Información del documento',
        paper: 'Artículo',
        slides: 'Presentación'
    }
};

/**
 * PDFPreviewModal Component
 * 
 * Modal window for previewing PDF documents with download option.
 * Uses createPortal to render above all other elements.
 */
export const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({
    isOpen,
    onClose,
    pdfUrl,
    title,
    filename,
    description,
    category,
    type = 'paper',
    lang = 'es'
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [showInfo, setShowInfo] = useState(true);
    const t = translations[lang];

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setIsLoading(true);
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
        }
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleOpenInNewTab = () => {
        window.open(pdfUrl, '_blank');
    };

    const typeColor = type === 'paper' ? DYNAMIC_COLORS.raw.light.primary : '#8b5cf6';
    const typeLabel = type === 'paper' ? t.paper : t.slides;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 md:p-6 animate-fadeIn">
            {/* Backdrop - clickable to close */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-xl cursor-pointer"
                onClick={onClose}
            />

            {/* Modal Window */}
            <div className="relative bg-[var(--card-bg)] backdrop-blur-3xl border border-[var(--card-border)] w-full max-w-[95vw] h-[95vh] md:max-w-[92vw] md:h-[90vh] rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-slide-up">

                {/* Header Bar */}
                <div className="flex-shrink-0 h-16 md:h-20 bg-gradient-to-b from-[var(--card-bg)] to-transparent flex items-center justify-between px-4 md:px-8 border-b border-[var(--card-border)]/50 relative z-10">
                    {/* Left - Close & Title */}
                    <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                        <button
                            onClick={onClose}
                            className="flex-shrink-0 p-2 md:p-2.5 rounded-xl bg-[var(--input-bg)] hover:bg-[var(--dock-item-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300 border border-[var(--card-border)]"
                        >
                            <Icons.X className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span
                                    className="px-2 py-0.5 rounded-md text-[9px] md:text-[10px] font-bold uppercase tracking-wider"
                                    style={{
                                        backgroundColor: `${typeColor}20`,
                                        color: typeColor
                                    }}
                                >
                                    {typeLabel}
                                </span>
                                {category && (
                                    <>
                                        <span className="text-[var(--text-tertiary)] text-xs hidden sm:inline">•</span>
                                        <span className="text-[var(--text-secondary)] text-xs font-medium truncate hidden sm:inline max-w-[150px] md:max-w-[250px]">
                                            {category}
                                        </span>
                                    </>
                                )}
                            </div>
                            <h1 className="text-[var(--text-primary)] font-bold text-sm md:text-lg truncate max-w-[180px] sm:max-w-[300px] md:max-w-[500px] lg:max-w-[700px]">
                                {title}
                            </h1>
                        </div>
                    </div>

                    {/* Right - Info button */}
                    <button
                        onClick={() => setShowInfo(!showInfo)}
                        className={`flex-shrink-0 p-2 md:p-2.5 rounded-xl transition-all duration-300 border ${showInfo
                            ? 'bg-[var(--dock-item-bg)] text-[var(--text-primary)] border-[var(--card-border)]'
                            : 'bg-[var(--input-bg)] hover:bg-[var(--dock-item-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--card-border)]'
                            }`}
                        title="Toggle info panel"
                    >
                        <Icons.Info className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex min-h-0 relative">
                    {/* PDF Viewer */}
                    <div className={`flex-1 relative bg-[var(--bg-secondary)] transition-all duration-300 ${showInfo ? 'md:mr-[320px] lg:mr-[380px]' : ''}`}>
                        {/* Loading State */}
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-secondary)] z-10">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative">
                                        <div
                                            className="w-14 h-14 border-4 border-t-transparent rounded-full animate-spin"
                                            style={{ borderColor: `${typeColor} transparent ${typeColor}40 ${typeColor}40` }}
                                        />
                                        <div
                                            className="absolute inset-2 w-10 h-10 border-4 border-b-transparent rounded-full animate-spin"
                                            style={{
                                                borderColor: `transparent ${DYNAMIC_COLORS.raw.light.accent}40 transparent ${DYNAMIC_COLORS.raw.light.accent}`,
                                                animationDirection: 'reverse',
                                                animationDuration: '1.5s'
                                            }}
                                        />
                                    </div>
                                    <p className="text-[var(--text-secondary)] text-sm font-medium">{t.loading}</p>
                                </div>
                            </div>
                        )}

                        {/* PDF Viewer - Enhanced performance with PDF.js */}
                        <PDFViewer
                            url={pdfUrl}
                            onLoadSuccess={() => setIsLoading(false)}
                            className="bg-[var(--bg-secondary)]"
                            showZoomControls={true}
                        />
                    </div>

                    {/* Right Side Panel - Info */}
                    <div
                        className={`absolute right-0 top-0 bottom-0 w-full md:w-[320px] lg:w-[380px] bg-[var(--card-bg)] border-l border-[var(--card-border)] flex flex-col transform transition-all duration-300 ${showInfo
                            ? 'translate-x-0 opacity-100'
                            : 'translate-x-full opacity-0 pointer-events-none'
                            }`}
                    >
                        {/* Panel Header - Mobile close */}
                        <div className="md:hidden flex items-center justify-between p-4 border-b border-[var(--card-border)]/50">
                            <h2 className="text-[var(--text-primary)] font-bold">{t.docInfo}</h2>
                            <button
                                onClick={() => setShowInfo(false)}
                                className="p-2 rounded-lg bg-[var(--input-bg)] text-[var(--text-secondary)]"
                            >
                                <Icons.X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Panel Content */}
                        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                            {/* Document Icon */}
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
                                style={{
                                    background: `linear-gradient(135deg, ${typeColor}33 0%, ${typeColor}11 100%)`,
                                    border: `1px solid ${typeColor}33`
                                }}
                            >
                                {type === 'paper'
                                    ? <Icons.FileText className="w-7 h-7" style={{ color: typeColor }} />
                                    : <Icons.Presentation className="w-7 h-7" style={{ color: typeColor }} />
                                }
                            </div>

                            {/* Title */}
                            <h2 className="text-xl lg:text-2xl font-bold text-[var(--text-primary)] mb-3 leading-tight">
                                {title}
                            </h2>

                            {/* Category Badge */}
                            {category && (
                                <div className="flex flex-wrap gap-2 mb-5">
                                    <span
                                        className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border"
                                        style={{
                                            backgroundColor: `${typeColor}15`,
                                            color: typeColor,
                                            borderColor: `${typeColor}33`
                                        }}
                                    >
                                        {category}
                                    </span>
                                </div>
                            )}

                            {/* Divider */}
                            <div className="h-px bg-gradient-to-r from-transparent via-[var(--card-border)] to-transparent mb-5" />

                            {/* Description */}
                            {description && (
                                <div>
                                    <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <Icons.FileText className="w-4 h-4" style={{ color: typeColor }} />
                                        {t.summary}
                                    </h3>
                                    <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
                                        {description}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Panel Footer - Buttons */}
                        <div className="flex-shrink-0 p-4 md:p-6 border-t border-[var(--card-border)]/50 space-y-3">
                            <button
                                onClick={handleOpenInNewTab}
                                className="w-full px-5 py-3 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] bg-[var(--input-bg)] hover:bg-[var(--dock-item-bg)] text-[var(--text-primary)] border border-[var(--card-border)]"
                            >
                                <Icons.ExternalLink className="w-5 h-5" />
                                {t.openNewTab}
                            </button>
                            <button
                                onClick={handleDownload}
                                className="w-full px-5 py-3 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg transition-all duration-300 hover:scale-[1.02]"
                                style={{
                                    background: `linear-gradient(135deg, ${typeColor} 0%, ${DYNAMIC_COLORS.raw.light.accent} 100%)`,
                                    color: 'white'
                                }}
                            >
                                <Icons.Download className="w-5 h-5" />
                                {t.download}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
