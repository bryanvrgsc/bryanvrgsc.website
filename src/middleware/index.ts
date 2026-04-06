import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (_context, next) => {
    const response = await next();

    // Security Headers
    const headers = {
        // Content Security Policy
        // NOTE: 'unsafe-inline' is required for:
        //   script-src: Astro View Transitions + inline FOUC-prevention script (no nonce support in static mode)
        //   style-src: Tailwind dynamic classes, theme system inline styles, Google Fonts
        'Content-Security-Policy': [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'strict-dynamic' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://formspree.io https://va.vercel-scripts.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: https:",
            "connect-src 'self' https://formspree.io https://unpkg.com https://vitals.vercel-insights.com",
            "frame-src 'self' blob: https://www.google.com/recaptcha/ https://bryanvrgsc.vercel.app https://bryanvrgsc-github-io.vercel.app https://*.vercel.app",
            "base-uri 'self'",
            "form-action 'self' https://formspree.io",
            "frame-ancestors 'self'",
            "require-trusted-types-for 'script'",
            "trusted-types default 'allow-duplicates'",
            "upgrade-insecure-requests"
        ].join('; '),

        // Cross-Origin Opener Policy — same-origin-allow-popups required for reCAPTCHA popup
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',

        // HTTP Strict Transport Security
        'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',

        // Prevent clickjacking
        'X-Frame-Options': 'DENY',

        // Prevent MIME type sniffing
        'X-Content-Type-Options': 'nosniff',

        // Referrer Policy
        'Referrer-Policy': 'strict-origin-when-cross-origin',

        // Permissions Policy
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',

        // XSS Protection (legacy but still useful)
        'X-XSS-Protection': '1; mode=block'
    };

    // Apply headers to response
    Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    return response;
};
