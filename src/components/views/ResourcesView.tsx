import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { settings } from '../../store';
import { Icons } from '../Icons';
import { UI_TEXT } from '../../constants/ui-text';
import { DOCUMENTS } from '../../constants/resources';
import type { Document } from '../../constants/resources';
import { DYNAMIC_COLORS } from '../../constants/colors';
import { PDFPreviewModal } from '../common/PDFPreviewModal';
import { useMousePosition } from '../../utils/helpers';

/**
 * ResourcesView Component
 * 
 * Digital library displaying PDF documents with preview and download functionality.
 */

type FilterType = 'all' | 'paper' | 'slides';

export const ResourcesView = () => {
    const { lang } = useStore(settings);
    const handleMouseMove = useMousePosition();
    const t = UI_TEXT[lang].resources;
    const [filter, setFilter] = useState<FilterType>('all');
    const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
    const preloadedDocs = React.useRef<Set<string>>(new Set());

    const preloadPDF = async (url: string) => {
        if (preloadedDocs.current.has(url)) return;
        preloadedDocs.current.add(url);

        try {
            // Ensure worker is configured for preload too
            const pdfjsLib = await import('pdfjs-dist');
            const { default: workerUrl } = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
            pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

            const loadingTask = pdfjsLib.getDocument(url);
            await loadingTask.promise;
            console.log(`Preloaded: ${url}`);
        } catch (err) {
            console.warn(`Failed to preload: ${url}`, err);
            preloadedDocs.current.delete(url);
        }
    };

    const filteredDocs = filter === 'all'
        ? DOCUMENTS
        : DOCUMENTS.filter(doc => doc.type === filter);

    const getDocIcon = (type: Document['type']) => {
        return type === 'paper' ? Icons.FileText : Icons.Presentation;
    };

    const getTypeBadge = (type: Document['type']) => {
        return type === 'paper'
            ? { label: lang === 'en' ? 'Paper' : 'Artículo', color: DYNAMIC_COLORS.raw.light.primary }
            : { label: lang === 'en' ? 'Slides' : 'Presentación', color: '#8b5cf6' };
    };

    return (
        <>
            <div className="max-w-7xl mx-auto pt-24 md:pt-32 px-4 md:px-6 pb-32 md:pb-40 animate-slide-up">
                {/* Header */}
                <div className="mb-8 md:mb-12 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">{t.title}</h2>
                    <p className="text-[var(--text-secondary)] text-base md:text-lg">{t.subtitle}</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex justify-center gap-3 mb-8 md:mb-12">
                    {(['all', 'paper', 'slides'] as FilterType[]).map((filterType) => (
                        <button
                            key={filterType}
                            onClick={() => setFilter(filterType)}
                            className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 capitalize"
                            style={{
                                backgroundColor: filter === filterType
                                    ? DYNAMIC_COLORS.raw.light.primary
                                    : 'var(--input-bg)',
                                color: filter === filterType
                                    ? 'white'
                                    : 'var(--text-secondary)',
                                border: `1px solid ${filter === filterType
                                    ? DYNAMIC_COLORS.raw.light.primary
                                    : 'var(--card-border)'}`,
                                transform: filter === filterType ? 'scale(1.05)' : 'scale(1)',
                                boxShadow: filter === filterType
                                    ? `0 0 20px ${DYNAMIC_COLORS.raw.light.primary}33`
                                    : 'none'
                            }}
                        >
                            {filterType === 'all'
                                ? (lang === 'en' ? 'All Documents' : 'Todos')
                                : filterType === 'paper'
                                    ? (lang === 'en' ? 'Papers' : 'Artículos')
                                    : (lang === 'en' ? 'Slides' : 'Presentaciones')}
                        </button>
                    ))}
                </div>

                {/* Documents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {filteredDocs.map((doc) => {
                        const DocIcon = getDocIcon(doc.type);
                        const badge = getTypeBadge(doc.type);
                        const handleKeyDown = (e: React.KeyboardEvent) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setPreviewDoc(doc);
                            }
                        };

                        return (
                            <div
                                key={doc.id}
                                onMouseMove={handleMouseMove}
                                onMouseEnter={() => preloadPDF(doc.path)}
                                onClick={() => setPreviewDoc(doc)}
                                onKeyDown={handleKeyDown}
                                tabIndex={0}
                                role="button"
                                aria-label={`${doc.title[lang]} - ${lang === 'en' ? 'View Document' : 'Ver Documento'}`}
                                className="bento-card rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group p-0 border-0 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]"
                            >
                                {/* Background Preview - Image */}
                                <div className="h-[300px] md:h-[350px] overflow-hidden relative bg-[var(--input-bg)]">
                                    {/* Document Cover Image */}
                                    <div className="absolute inset-0 z-0">
                                        <img
                                            src={doc.image}
                                            alt={doc.title[lang]}
                                            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent z-10"></div>

                                    {/* Animated cursor pointer overlay */}
                                    <div className="absolute inset-0 bg-black/30 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 z-20 flex items-center justify-center animate-[fadeOut_3s_ease-in-out_2s_forwards] md:animate-none">
                                        <div className="relative">
                                            {/* Pulsing ring */}
                                            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
                                            {/* Pointer icon */}
                                            <div className="relative bg-white/90 backdrop-blur-sm rounded-full p-6 shadow-2xl">
                                                <svg className="w-12 h-12 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ color: badge.color }}>
                                                    <path d="M22 14a8 8 0 0 1-8 8" />
                                                    <path d="M18 11v-1a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                                                    <path d="M14 10V9a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1" />
                                                    <path d="M10 9.5V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v10" />
                                                    <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Type badge */}
                                    <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20 pointer-events-none">
                                        <span
                                            className="px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-widest backdrop-blur-xl shadow-xl border"
                                            style={{
                                                backgroundColor: `${badge.color}20`,
                                                color: badge.color,
                                                borderColor: `${badge.color}40`
                                            }}
                                        >
                                            {badge.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Content overlay */}
                                <div className="p-6 md:p-8 relative z-20 -mt-16 md:-mt-20 pointer-events-none">
                                    <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-2 drop-shadow-lg tracking-tight line-clamp-2">
                                        {doc.title[lang]}
                                    </h3>
                                    <p className="font-semibold mb-4 flex items-center gap-2 text-xs uppercase tracking-wider" style={{ color: badge.color }}>
                                        <DocIcon className="w-4 h-4" />
                                        {doc.category[lang]}
                                    </p>
                                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3 mb-4">
                                        {doc.description[lang]}
                                    </p>

                                    {/* "View Document" button */}
                                    <div className="pointer-events-auto md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                                        <div
                                            className="text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all duration-300"
                                            style={{
                                                background: `linear-gradient(135deg, ${badge.color} 0%, ${DYNAMIC_COLORS.raw.light.primary} 100%)`
                                            }}
                                        >
                                            <Icons.Eye className="w-5 h-5" />
                                            {lang === 'en' ? 'View Document' : 'Ver documento'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {filteredDocs.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-[var(--text-secondary)] text-lg">
                            {lang === 'en' ? 'No documents found' : 'No se encontraron documentos'}
                        </p>
                    </div>
                )}
            </div>

            {/* PDF Preview Modal */}
            {previewDoc && (
                <PDFPreviewModal
                    isOpen={!!previewDoc}
                    onClose={() => setPreviewDoc(null)}
                    pdfUrl={previewDoc.path}
                    title={previewDoc.title[lang]}
                    filename={previewDoc.filename}
                    description={previewDoc.detailedDescription[lang]}
                    category={previewDoc.category[lang]}
                    type={previewDoc.type}
                    lang={lang}
                />
            )}
        </>
    );
};
