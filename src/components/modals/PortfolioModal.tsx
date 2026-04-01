import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icons } from '../Icons';
import { PDFViewer } from '../ui/PDFViewer';
import { UI_TEXT } from '../../constants/ui-text';
import type { Language, PortfolioProject } from '../../types';
import { DYNAMIC_COLORS } from '../../constants/colors';
import { getEmbedUrl } from '../../utils/helpers';

/**
 * PortfolioModal Component
 * 
 * Modal for displaying detailed portfolio project information.
 * Includes screenshots, videos, PDFs, and technical details.
 */

interface PortfolioModalProps {
    project: PortfolioProject;
    onClose: () => void;
    lang: Language;
}

export const PortfolioModal = ({ project, onClose, lang }: PortfolioModalProps) => {
    const [activeScreenshot, setActiveScreenshot] = useState(0);
    const [currentPdf, setCurrentPdf] = useState<string | null>(project.presentationUrl || project.details?.documents?.[0]?.url || null);
    const t = UI_TEXT[lang].portfolio.modal;

    useEffect(() => {
        setActiveScreenshot(0);
        setCurrentPdf(project.presentationUrl || project.details?.documents?.[0]?.url || null);
    }, [project]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    if (!project || typeof document === 'undefined') return null;

    const images = project.screenshots && project.screenshots.length > 0 ? project.screenshots : [project.image];

    // Basic check for PDF files (local or remote)
    const isPdf = currentPdf?.toLowerCase().endsWith('.pdf');

    const pdfEmbedSrc = !isPdf && currentPdf ? getEmbedUrl(currentPdf) : null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 animate-fadeIn">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
            <div className="bg-[var(--card-bg)] backdrop-blur-3xl border border-[var(--card-border)] w-full max-w-6xl max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden relative flex flex-col landscape:flex-row md:flex-row animate-slide-up">
                <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-colors border border-white/10"><Icons.X className="w-6 h-6" /></button>
                <div className="w-full landscape:w-1/2 md:w-1/2 h-[40vh] landscape:h-auto md:h-auto bg-black relative flex flex-col">
                    <div className="flex-grow relative overflow-hidden group"><img src={images[activeScreenshot]} alt="Project Screenshot" className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-50"></div></div>
                    {images.length > 1 && (<div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 z-20">{images.map((img: string, idx: number) => (<button key={idx} onClick={() => setActiveScreenshot(idx)} className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${activeScreenshot === idx ? `scale-110` : 'border-white/30 opacity-70 hover:opacity-100'}`} style={activeScreenshot === idx ? { borderColor: DYNAMIC_COLORS.raw.light.primary } : {}}><img src={img} alt="thumb" className="w-full h-full object-cover" /></button>))}</div>)}
                </div>
                <div className="w-full landscape:w-1/2 md:w-1/2 p-6 md:p-10 overflow-y-auto custom-scrollbar flex flex-col flex-1 min-h-0">
                    <div className="mb-6"><span className="font-bold uppercase tracking-widest text-xs mb-2 block" style={{ color: DYNAMIC_COLORS.raw.light.primary }}>{t.caseStudy}</span><h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2 leading-tight">{project.title}</h2><div className="flex flex-wrap gap-2 mt-3">{project.tech.split(',').map((t: string, i: number) => (<span key={i} className="px-3 py-1 rounded-full bg-[var(--input-bg)] border border-[var(--card-border)] text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">{t.trim()}</span>))}</div></div>
                    <div className="space-y-8">
                        <div><h3 className="text-lg font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2"><Icons.Briefcase className="w-5 h-5" style={{ color: DYNAMIC_COLORS.raw.light.primary }} /> {t.overview}</h3><p className="text-[var(--text-secondary)] leading-relaxed text-sm md:text-base">{project.problem} {project.solution}</p></div>

                        {/* PDF Viewer Section */}
                        {currentPdf && (
                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                                    <Icons.Book className="w-5 h-5 text-indigo-500" /> {t.presentation}
                                </h3>
                                <div className="w-full h-[300px] md:h-[450px] rounded-xl overflow-hidden border border-[var(--card-border)] shadow-sm bg-[var(--card-bg)] relative">
                                    {isPdf ? (
                                        <PDFViewer url={currentPdf} showZoomControls={false} />
                                    ) : (
                                        <iframe src={pdfEmbedSrc!} title="Project Presentation" className="w-full h-full">
                                            <div className="flex flex-col items-center justify-center h-full">
                                                <p className="text-[var(--text-secondary)] mb-2">{t.pdfError}</p>
                                                <a href={currentPdf} target="_blank" rel="noreferrer" className="font-bold" style={{ color: DYNAMIC_COLORS.raw.light.primary }}>{t.downloadPdf}</a>
                                            </div>
                                        </iframe>
                                    )}
                                </div>
                                <div className="mt-2 text-right">
                                    <a href={currentPdf} target="_blank" rel="noopener noreferrer" className="text-xs font-bold hover:underline flex items-center justify-end gap-1" style={{ color: DYNAMIC_COLORS.raw.light.primary }}>
                                        {t.openTab} <Icons.ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        )}

                        {project.details?.documents && (<div><h3 className="text-lg font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2"><Icons.Book className="w-5 h-5 text-indigo-500" /> {t.documentation}</h3><ul className="grid grid-cols-1 md:grid-cols-2 gap-3">{project.details.documents.map((doc: any, i: number) => { const isActive = currentPdf && (currentPdf === doc.url || currentPdf.includes(doc.url) || doc.url.includes(currentPdf)); return (<li key={i}><button onClick={() => setCurrentPdf(doc.url)} className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all group h-full text-left ${isActive ? 'bg-indigo-500/10 border-indigo-500 shadow-md ring-1 ring-indigo-500/30' : 'bg-[var(--input-bg)] border-[var(--card-border)] hover:bg-[var(--glass-glow)]'}`}><div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-indigo-500 text-white' : 'bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white'}`}><Icons.Book className="w-4 h-4" /></div><span className={`text-sm font-medium leading-tight ${isActive ? 'text-[var(--text-primary)] font-bold' : 'text-[var(--text-primary)]'}`}>{doc.label}</span>{isActive && <div className="ml-auto w-2 h-2 rounded-full bg-indigo-500"></div>}</button></li>); })}</ul></div>)}

                        {project.videoUrl && (project.videoUrl.includes("embed") || project.videoUrl.includes("/preview")) && (<div className="mb-4"><h3 className="text-lg font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2"><Icons.Video className="w-5 h-5 text-red-500" /> {t.demoVideo}</h3><div className="relative w-full pt-[56.25%] rounded-xl overflow-hidden border border-[var(--card-border)] bg-black/50 shadow-lg group"><iframe src={project.videoUrl} title={project.title} className="absolute top-0 left-0 w-full h-full z-10" style={{ border: 0 }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe></div></div>)}
                        {project.videoUrl && !(project.videoUrl.includes("embed") || project.videoUrl.includes("/preview")) && (<div className="mb-6"><a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full p-4 rounded-xl bg-[var(--input-bg)] border border-[var(--card-border)] text-[var(--text-primary)] hover:border-red-500/50 hover:bg-red-500/5 transition-all group shadow-sm hover:shadow-md"><div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform"><Icons.Video className="w-5 h-5" /></div><div className="flex flex-col"><span className="text-sm font-bold">{t.watchDemo}</span><span className="text-xs text-[var(--text-secondary)]">{t.externalLink}</span></div><Icons.ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity ml-auto" /></a></div>)}
                        {project.details?.currentFeatures && (<div><h3 className="text-lg font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2"><Icons.Layers className="w-5 h-5 text-blue-500" /> {t.features}</h3><ul className="grid grid-cols-1 gap-2">{project.details.currentFeatures.map((f: string, i: number) => (<li key={i} className="flex items-start gap-3 text-sm text-[var(--text-secondary)] bg-[var(--input-bg)] p-3 rounded-xl border border-[var(--card-border)]"><Icons.CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: DYNAMIC_COLORS.raw.light.primary }} /><span>{f}</span></li>))}</ul></div>)}
                        {project.details?.techStack && (<div><h3 className="text-lg font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2"><Icons.Code className="w-5 h-5 text-orange-500" /> {t.techStack}</h3><ul className="grid grid-cols-1 gap-2">{project.details.techStack.map((f: string, i: number) => (<li key={i} className="flex items-start gap-3 text-sm text-[var(--text-secondary)] font-mono opacity-80"><span className="font-bold" style={{ color: DYNAMIC_COLORS.raw.light.primary }}>{'>'}</span><span>{f}</span></li>))}</ul></div>)}
                        {project.details?.upcomingFeatures && (<div><h3 className="text-lg font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2"><Icons.Rocket className="w-5 h-5 text-purple-500" /> {t.roadmap}</h3><ul className="space-y-2">{project.details.upcomingFeatures.map((f: string, i: number) => (<li key={i} className="flex items-start gap-3 text-sm text-[var(--text-secondary)] opacity-80"><div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div><span>{f}</span></li>))}</ul></div>)}
                        <div className="pt-4 border-t border-[var(--card-border)] flex flex-col gap-3">{project.repoUrl && (<a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--text-primary)] transition-colors group" style={{ color: 'var(--text-primary)' }} onMouseEnter={(e) => e.currentTarget.style.color = DYNAMIC_COLORS.raw.light.primary} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}><Icons.GitHub className="w-5 h-5" />{t.viewRepo}<Icons.ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" /></a>)}</div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
