import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
    const sitemapURL = new URL('sitemap-index.xml', site ?? 'https://bryanvrgsc.com');
    const content = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapURL.href}`;

    return new Response(content, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    });
};
