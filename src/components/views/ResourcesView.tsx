import React, { useState } from 'react';
import { Icons } from '../Icons';
import { UI_TEXT } from '../../constants/ui-text';
import { DOCUMENTS } from '../../constants/resources';
import type { Document } from '../../constants/resources';
import { DYNAMIC_COLORS } from '../../constants/colors';
import { PDFPreviewModal } from '../common/PDFPreviewModal';
import { useMousePosition } from '../../utils/helpers';
import { LiquidButton } from '../common/LiquidButton';
import { normalizePublicAssetUrl } from '../../utils/pdf-utils';
import type { Language } from '../../types';

/**
 * ResourcesView Component
 * 
 * Digital library displaying PDF documents with preview and download functionality.
 */

type FilterType = 'all' | 'paper' | 'slides';

interface ResourcesViewProps {
    lang?: Language;
}

export const ResourcesView = ({ lang = 'es' }: ResourcesViewProps) => {
    const handleMouseMove = useMousePosition();
    const t = UI_TEXT[lang].resources;
    const [filter, setFilter] = useState<FilterType>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
    const preloadedDocs = React.useRef<Set<string>>(new Set());

    const categories = ['all', ...Array.from(new Set(DOCUMENTS.map(doc => doc.category[lang])))];

    const preloadPDF = async (url: string) => {
        const normalizedUrl = normalizePublicAssetUrl(url);
        if (preloadedDocs.current.has(normalizedUrl)) return;
        preloadedDocs.current.add(normalizedUrl);

        try {
            const pdfjsLib = await import('pdfjs-dist');
            const { default: workerUrl } = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
            pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

            const loadingTask = pdfjsLib.getDocument(normalizedUrl);
            await loadingTask.promise;
        } catch (err) {
            console.warn(`Failed to preload: ${normalizedUrl}`, err);
            preloadedDocs.current.delete(normalizedUrl);
        }
    };

    const filteredDocs = DOCUMENTS.filter(doc => {
        const matchesType = filter === 'all' || doc.type === filter;
        const matchesCategory = activeCategory === 'all' || doc.category[lang] === activeCategory;
        const matchesSearch = searchTerm === '' ||
            doc.title[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.description[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.category[lang].toLowerCase().includes(searchTerm.toLowerCase());

        return matchesType && matchesCategory && matchesSearch;
    });

    const getDocIcon = (type: Document['type']) => {
        return type === 'paper' ? Icons.FileText : Icons.Presentation;
    };

    const getTypeBadge = (type: Document['type']) => {
        return type === 'paper'
            ? { label: t.papers, color: DYNAMIC_COLORS.raw.light.primary }
            : { label: t.slides, color: '#8b5cf6' };
    };

    return (
        <>
            <div className="max-w-7xl mx-auto pt-24 md:pt-32 px-4 md:px-6 pb-32 md:pb-40 animate-slide-up">
                {/* Header */}
                <div className="mb-8 md:mb-12 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">{t.title}</h2>
                    <p className="text-[var(--text-secondary)] text-base md:text-lg">{t.subtitle}</p>
                </div>

                <div className="flex flex-col gap-8 mb-12">
                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto w-full group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-[var(--text-secondary)] group-focus-within:text-[var(--primary-color)] transition-colors">
                            <Icons.Search className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder={t.searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            aria-label={lang === 'en' ? 'Search resources' : 'Buscar recursos'}
                            className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] text-[var(--text-primary)] rounded-[1.5rem] py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/30 focus:border-[var(--primary-color)] transition-all placeholder:text-[var(--text-secondary)]/50 shadow-sm hover:shadow-md"
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => setSearchTerm('')}
                                aria-label={lang === 'en' ? 'Clear search' : 'Limpiar búsqueda'}
                                className="absolute inset-y-0 right-5 flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                            >
                                <Icons.X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        {/* Type Tabs */}
                        <div className="flex bg-[var(--input-bg)] p-1.5 rounded-2xl border border-[var(--card-border)] shadow-sm">
                            {(['all', 'paper', 'slides'] as FilterType[]).map((filterType) => (
                                <button
                                    type="button"
                                    key={filterType}
                                    onClick={() => setFilter(filterType)}
                                    className="px-6 py-2 rounded-xl font-semibold text-sm transition-all duration-300"
                                    style={{
                                        backgroundColor: filter === filterType ? 'var(--bg-primary)' : 'transparent',
                                        color: filter === filterType ? 'var(--primary-color)' : 'var(--text-secondary)',
                                        boxShadow: filter === filterType ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                                    }}
                                >
                                    {filterType === 'all' ? t.allDocuments : filterType === 'paper' ? t.papers : t.slides}
                                </button>
                            ))}
                        </div>

                        {/* Category Selector */}
                        <div className="flex flex-wrap justify-center gap-2 max-w-3xl">
                            {categories.map((cat) => (
                                <button
                                    type="button"
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border"
                                    style={{
                                        backgroundColor: activeCategory === cat ? `${DYNAMIC_COLORS.raw.light.primary}20` : 'var(--input-bg)',
                                        color: activeCategory === cat ? DYNAMIC_COLORS.raw.light.primary : 'var(--text-secondary)',
                                        borderColor: activeCategory === cat ? DYNAMIC_COLORS.raw.light.primary : 'var(--card-border)',
                                        transform: activeCategory === cat ? 'scale(1.05)' : 'scale(1)'
                                    }}
                                >
                                    {cat === 'all' ? t.allCategories : cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Documents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 min-h-[400px]" aria-live="polite">
                    {filteredDocs.map((doc) => {
                        const DocIcon = getDocIcon(doc.type);
                        const badge = getTypeBadge(doc.type);
                        // ... rest of the card content (same as before)
                        return (
                            <button
                                type="button"
                                key={doc.id}
                                onMouseMove={handleMouseMove}
                                onMouseEnter={() => preloadPDF(doc.path)}
                                onClick={() => setPreviewDoc(doc)}
                                aria-label={`${doc.title[lang]} - ${lang === 'en' ? 'View document details' : 'Ver detalle del documento'}`}
                                className="bento-card w-full text-left rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group p-0 border-0 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]"
                            >
                                <div className="h-[300px] md:h-[350px] overflow-hidden relative bg-[var(--input-bg)]">
                                    <div className="absolute inset-0 z-0">
                                        <img
                                            src={doc.image}
                                            alt={doc.title[lang]}
                                            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent z-10"></div>
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
                            </button>
                        );
                    })}
                </div>

                {/* Empty State */}
                {filteredDocs.length === 0 && (
                    <div className="text-center py-16 animate-in fade-in zoom-in duration-300">
                        <Icons.FileSearch className="w-16 h-16 mx-auto mb-4 text-[var(--text-secondary)] opacity-20" />
                        <p className="text-[var(--text-secondary)] text-lg">
                            {t.noResults}
                        </p>
                    </div>
                )}

                {/* CTA Button to Contact */}
                <div className="flex justify-center mt-12 md:mt-20">
                    <LiquidButton
                        href={`/${lang}/contact`}
                        className="px-8 py-4 md:px-12 md:py-6 text-sm md:text-lg rounded-full backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 group/btn"
                    >
                        <span className="flex items-center gap-3 text-[var(--text-primary)]">
                            {UI_TEXT[lang].nav.contact}
                            <Icons.ArrowUp className="w-4 h-4 md:w-5 md:h-5 rotate-90 transition-transform group-hover/btn:translate-x-1" />
                        </span>
                    </LiquidButton>
                </div>
            </div>

            {/* PDF Preview Modal */}
            {previewDoc && (
                <PDFPreviewModal
                    isOpen={!!previewDoc}
                    onClose={() => setPreviewDoc(null)}
                    pdfUrl={normalizePublicAssetUrl(previewDoc.path)}
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
