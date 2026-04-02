# Bryan Vargas - Portfolio

Ultra-fast, secure personal portfolio built with **Astro** and deployed on **Vercel**.

## Tech Stack

- **Framework**: [Astro](https://astro.build) v5 (static output)
- **UI**: React 19 islands
- **Styling**: [Tailwind CSS](https://tailwindcss.com) v4 + CSS custom properties
- **Hosting**: [Vercel](https://vercel.com)
- **Package Manager**: [pnpm](https://pnpm.io)
- **Contact Form**: Formspree + reCAPTCHA v3
- **Analytics**: Vercel Analytics + Speed Insights

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)

### Installation

```bash
git clone https://github.com/bryanvrgsc/bryanvrgsc.website.git
cd bryanvrgsc.website
pnpm install
cp .env.example .env   # add Formspree and reCAPTCHA keys
```

### Development

```bash
pnpm dev        # http://localhost:4321
pnpm build      # type-check + production build
pnpm preview    # preview built output
```

## Environment Variables

```env
PUBLIC_FORMSPREE_ID=your_formspree_id
PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

**Formspree**: Create a form at [formspree.io](https://formspree.io) and copy the form ID.

**reCAPTCHA**: Register a v3 site at [Google reCAPTCHA](https://www.google.com/recaptcha/admin) and copy the site key.

## Deployment

Automatically deployed to Vercel on push to `main`. Configuration lives in `vercel.json`.

Manual deploy via Vercel CLI:
```bash
vercel --prod
```

## Security

Security headers are enforced at two layers:
- **Vercel edge**: `vercel.json` headers config
- **Astro middleware**: `src/middleware/index.ts`

Includes CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy.

## License

MIT
