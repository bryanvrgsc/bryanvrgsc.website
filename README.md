<div align="center">

<img src="public/assets/firma-header.gif" alt="Bryan Vargas" width="480" />

# Bryan Vargas — Portfolio

Ultra-fast, secure personal portfolio built with **Astro** and deployed on **Vercel**.

[![Deploy](https://img.shields.io/badge/Vercel-deployed-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com)
[![Astro](https://img.shields.io/badge/Astro-6-FF5D01?style=flat&logo=astro&logoColor=white)](https://astro.build)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/license-MIT-green?style=flat)](LICENSE)

</div>

## Tech Stack

| | Tool | Purpose |
|---|---|---|
| ![Astro](https://img.shields.io/badge/-Astro-FF5D01?style=flat&logo=astro&logoColor=white) | [Astro v6](https://astro.build) | Framework — `output: 'static'` |
| ![React](https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=black) | [React 19](https://react.dev) | UI islands |
| ![Tailwind](https://img.shields.io/badge/-Tailwind-06B6D4?style=flat&logo=tailwindcss&logoColor=white) | [Tailwind CSS v4](https://tailwindcss.com) | Styling + CSS custom properties |
| ![Vercel](https://img.shields.io/badge/-Vercel-000000?style=flat&logo=vercel&logoColor=white) | [Vercel](https://vercel.com) | Hosting + Analytics + Speed Insights |
| ![pnpm](https://img.shields.io/badge/-pnpm-F69220?style=flat&logo=pnpm&logoColor=white) | [pnpm](https://pnpm.io) | Package manager |
| ![Formspree](https://img.shields.io/badge/-Formspree-E44332?style=flat&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0yMCA0SDRjLTEuMSAwLTIgLjktMiAydjEyYzAgMS4xLjkgMiAyIDJoMTZjMS4xIDAgMi0uOSAyLTJWNmMwLTEuMS0uOS0yLTItMnptMCAydjEuNWwtOCA1LTgtNVY2aDE2em0wIDEySDRWOWw4IDUgOC01djlheiIvPjwvc3ZnPg==&logoColor=white) | Formspree + reCAPTCHA v3 | Contact form |

## Getting Started

### Prerequisites

- ![Node.js](https://img.shields.io/badge/-Node.js_18+-339933?style=flat&logo=nodedotjs&logoColor=white)
- ![pnpm](https://img.shields.io/badge/-pnpm-F69220?style=flat&logo=pnpm&logoColor=white) (`npm install -g pnpm`)

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

![Security Headers](https://img.shields.io/badge/security_headers-A%2B-brightgreen?style=flat&logo=shield&logoColor=white)

Security headers enforced at two layers:
- ![Vercel](https://img.shields.io/badge/-Vercel_edge-000000?style=flat&logo=vercel&logoColor=white) `vercel.json` headers config
- ![Astro](https://img.shields.io/badge/-Astro_middleware-FF5D01?style=flat&logo=astro&logoColor=white) `src/middleware/index.ts`

Includes CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.

## License

MIT
