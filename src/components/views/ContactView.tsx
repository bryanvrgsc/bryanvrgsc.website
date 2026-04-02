import React, { useState, useEffect } from 'react';
import { Icons } from '../Icons';
import { LiquidButton, PhoneInput, BudgetInput } from '../common';
import { UI_TEXT } from '../../constants/ui-text';
import { SOCIAL_COLORS, DYNAMIC_COLORS, getDynamicButtonStyles } from '../../constants/colors';
import { useMousePosition } from '../../utils/helpers';
import type { Language } from '../../types';

/**
 * ContactView Component
 * 
 * Enhanced contact form with validation and social media links.
 * Includes international phone input and budget input with currency selector.
 * Integrates with Formspree for form submission.
 */

interface ContactViewProps {
    lang?: Language;
}

export const ContactView = ({ lang = 'es' }: ContactViewProps) => {
    const handleMouseMove = useMousePosition();
    const t = UI_TEXT[lang].contact;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        phoneCountry: lang === 'es' ? 'MX' : 'US',
        message: '',
        budget: '',
        budgetCurrency: lang === 'es' ? 'MXN' : 'USD'
    });

    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [fieldErrors, setFieldErrors] = useState<{
        name?: string;
        email?: string;
        message?: string;
    }>({});
    const [touched, setTouched] = useState<{
        name?: boolean;
        email?: boolean;
        message?: boolean;
    }>({});

    useEffect(() => {
        setFieldErrors({});
        setTouched({});

        // Update phone country and currency based on language
        const newPhoneCountry = lang === 'es' ? 'MX' : 'US';
        const newCurrency = lang === 'es' ? 'MXN' : 'USD';

        setFormData(prev => ({
            ...prev,
            phoneCountry: newPhoneCountry,
            budgetCurrency: newCurrency
        }));
    }, [lang]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const fieldName = e.target.id as 'name' | 'email' | 'message';
        setFormData(prev => ({ ...prev, [fieldName]: e.target.value }));

        // Clear field error when user starts typing
        if (fieldErrors[fieldName]) {
            setFieldErrors(prev => ({ ...prev, [fieldName]: undefined }));
        }
    };

    const handleBlur = (fieldName: 'name' | 'email' | 'message') => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));
        validateField(fieldName);
    };

    const validateField = (fieldName: 'name' | 'email' | 'message') => {
        let error: string | undefined;

        if (fieldName === 'name' && !formData.name.trim()) {
            error = t.errors.name;
        } else if (fieldName === 'email') {
            if (!formData.email.trim()) {
                error = t.errors.email;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                error = t.errors.email;
            }
        } else if (fieldName === 'message' && !formData.message.trim()) {
            error = t.errors.message;
        }

        setFieldErrors(prev => ({ ...prev, [fieldName]: error }));
        return !error;
    };

    const handlePhoneChange = (value: string, countryCode: string) => {
        setFormData(prev => ({ ...prev, phone: value, phoneCountry: countryCode }));
    };

    const handleBudgetChange = (value: string, currency: string) => {
        setFormData(prev => ({ ...prev, budget: value, budgetCurrency: currency }));
    };

    const validateAll = () => {
        const nameValid = validateField('name');
        const emailValid = validateField('email');
        const messageValid = validateField('message');

        setTouched({ name: true, email: true, message: true });

        return nameValid && emailValid && messageValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateAll()) {
            return;
        }
        setStatus('submitting');
        setFieldErrors({});
        try {
            const response = await fetch("https://formspree.io/f/xzzwknze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    phone: formData.phone ? `+${formData.phoneCountry} ${formData.phone}` : '',
                    budget: formData.budget ? `${formData.budgetCurrency} ${formData.budget}` : ''
                })
            });
            if (response.ok) setStatus('success');
            else {
                setStatus('error');
                setFieldErrors({ message: t.errors.generic });
            }
        } catch (error) {
            setStatus('error');
            setFieldErrors({ message: t.errors.network });
        }
    };

    const handleReset = () => {
        setStatus('idle');
        setFormData({
            name: '',
            email: '',
            phone: '',
            phoneCountry: '',
            message: '',
            budget: '',
            budgetCurrency: lang === 'es' ? 'MXN' : 'USD'
        });
        setFieldErrors({});
        setTouched({});
    };

    const socialLinks = [
        { icon: Icons.LinkedIn, url: "https://www.linkedin.com/in/bryanvrgsc", label: "LinkedIn", color: SOCIAL_COLORS.linkedin.hover },
        { icon: Icons.GitHub, url: "https://github.com/bryanvrgsc", label: "GitHub", color: SOCIAL_COLORS.github.hover },
        { icon: Icons.WhatsApp, url: "https://api.whatsapp.com/send?phone=12533687369", label: "WhatsApp", color: SOCIAL_COLORS.whatsapp.hover },
        { icon: Icons.Instagram, url: "https://www.instagram.com/bryanvrgsc/", label: "Instagram", color: SOCIAL_COLORS.instagram.hover },
        { icon: Icons.Mail, url: "mailto:bryanvrgsc@gmail.com", label: "Email", color: "hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30" }
    ];

    if (status === 'success') {
        return (
            <div className="max-w-3xl mx-auto pt-24 md:pt-32 px-4 md:px-6 pb-32 md:pb-40 animate-slide-up" aria-live="polite">
                <div onMouseMove={handleMouseMove} className="bento-card p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px]">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b pointer-events-none" style={{ backgroundImage: `linear-gradient(to bottom, ${DYNAMIC_COLORS.raw.light.primary}0D, transparent)` }}></div>
                    <div
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-6 animate-pulse"
                        style={{
                            background: `linear-gradient(to bottom right, ${DYNAMIC_COLORS.raw.light.accent}, ${DYNAMIC_COLORS.raw.light.primary})`,
                            boxShadow: `0 0 40px rgba(${DYNAMIC_COLORS.raw.light.rgb.r}, ${DYNAMIC_COLORS.raw.light.rgb.g}, ${DYNAMIC_COLORS.raw.light.rgb.b}, 0.5)`
                        }}
                    >
                        <Icons.CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-white" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4 tracking-tight">{t.successTitle}</h2>
                    <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 max-w-md">{t.successMessage.replace('{name}', formData.name)}</p>
                    <LiquidButton
                        onClick={handleReset}
                        className="px-8 py-4 md:px-8 md:py-4 text-base md:text-lg rounded-full"
                        style={getDynamicButtonStyles().light as React.CSSProperties}
                    >
                        {t.sendAnother}
                    </LiquidButton>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pt-24 md:pt-32 px-4 md:px-6 pb-32 md:pb-40 animate-slide-up">
            <div className="flex flex-col-reverse md:flex-row gap-6 items-stretch">
                {/* Social Links */}
                <div className="flex md:flex-col gap-3 justify-center md:justify-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {socialLinks.map((social, idx) => (
                        <a
                            key={idx}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-5 md:p-6 rounded-2xl md:rounded-3xl bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] text-[var(--text-secondary)] transition-all duration-300 transform hover:scale-110 shadow-sm ${social.color} flex items-center justify-center`}
                            aria-label={social.label}
                        >
                            <social.icon className="w-5 h-5 md:w-6 md:h-6" />
                        </a>
                    ))}
                </div>

                {/* Contact Form */}
                <div onMouseMove={handleMouseMove} className="bento-card p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] text-center relative overflow-hidden flex-grow">
                    <div
                        className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] mx-auto mb-6 md:mb-10 flex items-center justify-center relative z-10 transform -rotate-6 group-hover:rotate-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{
                            background: `linear-gradient(to bottom right, #3b82f6, ${DYNAMIC_COLORS.raw.light.primary})`,
                            boxShadow: `0 20px 50px -10px rgba(${DYNAMIC_COLORS.raw.light.rgb.r}, ${DYNAMIC_COLORS.raw.light.rgb.g}, ${DYNAMIC_COLORS.raw.light.rgb.b}, 0.5)`
                        }}
                    >
                        <Icons.Talk className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4 md:mb-6 relative z-10 tracking-tight">{t.title}</h2>
                    <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-8 md:mb-12 leading-relaxed relative z-10 max-w-xl mx-auto font-light">{t.subtitle}</p>

                    <form className="space-y-4 md:space-y-5 text-left mb-8 md:mb-12 relative z-10 max-w-lg mx-auto" onSubmit={handleSubmit}>
                        {/* Row 1: Name/Company | Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                            <div className="relative group">
                                <input
                                    id="name"
                                    type="text"
                                    placeholder={t.placeholders.name}
                                    value={formData.name}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('name')}
                                    disabled={status === 'submitting'}
                                    required
                                    aria-invalid={touched.name && !!fieldErrors.name}
                                    aria-describedby={touched.name && fieldErrors.name ? 'name-error' : undefined}
                                    className={`w-full bg-[var(--input-bg)] border rounded-2xl px-5 py-5 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none transition-all text-sm focus:ring-1 disabled:opacity-50 ${touched.name && fieldErrors.name
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                                        : `border-[var(--input-border)] ${DYNAMIC_COLORS.focusBorder} focus:bg-[var(--glass-glow)] ${DYNAMIC_COLORS.focusRing}`
                                        }`}
                                />
                                {touched.name && fieldErrors.name && (
                                    <p id="name-error" className="absolute -bottom-6 left-0 text-xs text-red-500 font-medium" role="alert">{fieldErrors.name}</p>
                                )}
                            </div>
                            <div className="relative group">
                                <input
                                    id="email"
                                    type="email"
                                    placeholder={t.placeholders.email}
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('email')}
                                    disabled={status === 'submitting'}
                                    required
                                    aria-invalid={touched.email && !!fieldErrors.email}
                                    aria-describedby={touched.email && fieldErrors.email ? 'email-error' : undefined}
                                    className={`w-full bg-[var(--input-bg)] border rounded-2xl px-5 py-5 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none transition-all text-sm focus:ring-1 disabled:opacity-50 ${touched.email && fieldErrors.email
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                                        : `border-[var(--input-border)] ${DYNAMIC_COLORS.focusBorder} focus:bg-[var(--glass-glow)] ${DYNAMIC_COLORS.focusRing}`
                                        }`}
                                />
                                {touched.email && fieldErrors.email && (
                                    <p id="email-error" className="absolute -bottom-6 left-0 text-xs text-red-500 font-medium" role="alert">{fieldErrors.email}</p>
                                )}
                            </div>
                        </div>

                        {/* Row 2: Phone (Optional) */}
                        <PhoneInput
                            value={formData.phone}
                            countryCode={formData.phoneCountry}
                            onChange={handlePhoneChange}
                            placeholder={`${t.placeholders.phone} (${lang === 'es' ? 'Opcional' : 'Optional'})`}
                            disabled={status === 'submitting'}
                        />

                        {/* Row 3: Message */}
                        <div className="relative group">
                            <textarea
                                id="message"
                                placeholder={t.placeholders.message}
                                rows={4}
                                value={formData.message}
                                onChange={handleChange}
                                onBlur={() => handleBlur('message')}
                                disabled={status === 'submitting'}
                                required
                                aria-invalid={touched.message && !!fieldErrors.message}
                                aria-describedby={touched.message && fieldErrors.message ? 'message-error' : undefined}
                                className={`w-full bg-[var(--input-bg)] border rounded-2xl px-5 py-5 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none transition-all resize-none text-sm focus:ring-1 disabled:opacity-50 ${touched.message && fieldErrors.message
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                                    : `border-[var(--input-border)] ${DYNAMIC_COLORS.focusBorder} focus:bg-[var(--glass-glow)] ${DYNAMIC_COLORS.focusRing}`
                                    }`}
                            ></textarea>
                            {touched.message && fieldErrors.message && (
                                <p id="message-error" className="absolute -bottom-6 left-0 text-xs text-red-500 font-medium" role="alert">{fieldErrors.message}</p>
                            )}
                        </div>

                        {/* Row 4: Budget (Optional) */}
                        <BudgetInput
                            value={formData.budget}
                            currency={formData.budgetCurrency}
                            onChange={handleBudgetChange}
                            placeholder={`${t.placeholders.budget} (${lang === 'es' ? 'Opcional' : 'Optional'})`}
                            disabled={status === 'submitting'}
                        />



                        {/* Submit Button */}
                        <LiquidButton
                            type="submit"
                            className="w-full py-5 md:py-6 text-lg md:text-xl font-bold tracking-wide rounded-full"
                            style={getDynamicButtonStyles().light as React.CSSProperties}
                        >
                            {status === 'submitting' ? t.button.sending : t.button.default}
                        </LiquidButton>
                    </form>

                    <p className="mt-6 md:mt-8 text-xs text-[var(--text-tertiary)] relative z-10 font-medium uppercase tracking-widest">{t.responseTime}</p>
                </div>
            </div>
        </div>
    );
};
