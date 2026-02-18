import React from 'react';

export const Icons = {
  // Navigation Icons (Modern Outlined)
  Home: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
  ),
  Layers: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
  ),
  Briefcase: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
  ),
  Book: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
  ),

  // Feature Icons
  Smartphone: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
  ),
  Cpu: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="16" height="16" x="4" y="4" rx="2" /><rect width="6" height="6" x="9" y="9" rx="1" /><path d="M9 2v2" /><path d="M15 2v2" /><path d="M22 9h-2" /><path d="M22 15h-2" /><path d="M9 20v2" /><path d="M15 20v2" /><path d="M4 9H2" /><path d="M4 15H2" /></svg>
  ),
  ChartBar: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></svg>
  ),
  ShieldCheck: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
  ),
  Cloud: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17.5 19c2.5 0 4.5-2 4.5-4.5S20 10 17.5 10c-.5 0-.9.1-1.3.2A7 7 0 0 0 5 10c0 .3 0 .7.1 1A4.5 4.5 0 0 0 4.5 19h13z" /></svg>
  ),
  Wifi: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></svg>
  ),
  CheckCircle: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
  ),
  ArrowRight: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
  ),
  ArrowUp: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>
  ),
  ArrowBack: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
  ),
  Info: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
  ),
  Code: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
  ),
  Rocket: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>
  ),
  Talk: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
  ),
  Sun: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
  ),
  Moon: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
  ),
  Monitor: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
  ),
  Search: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
  ),
  FileSearch: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><circle cx="11.5" cy="14.5" r="2.5" /><line x1="16.5" y1="19.5" x2="13.25" y2="16.25" /></svg>
  ),
  X: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
  ),
  Video: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
  ),
  ExternalLink: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
  ),
  FlagUS: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" {...props}>
      <path fill="#bd3d44" d="M0 0h640v480H0" />
      <path stroke="#fff" strokeWidth="37" d="M0 55.3h640M0 129h640M0 202.8h640M0 276.5h640M0 350.2h640M0 423.9h640" />
      <path fill="#192f5d" d="M0 0h296.2v240H0" />
      <path fill="#fff" d="M14 22h27m15 0h27m15 0h27m15 0h27m15 0h27m-256 24h27m15 0h27m15 0h27m15 0h27m-256 24h27m15 0h27m15 0h27m15 0h27" />
    </svg>
  ),
  FlagMX: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" {...props}>
      <path fill="#006341" d="M0 0h213.3v480H0z" />
      <path fill="#fff" d="M213.3 0h213.4v480H213.3z" />
      <path fill="#ce1126" d="M426.7 0H640v480H426.7z" />
      <circle cx="320" cy="240" r="40" fill="#a05d21" />
    </svg>
  ),
  LinkedIn: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
  ),
  GitHub: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
  ),
  WhatsApp: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
  ),
  Instagram: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
  ),
  Mail: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
  ),
  Palette: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg>
  ),
  Menu: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
  ),

  // OS Icons
  Windows: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="857 298 301 301" {...props}>
      <rect x="857" y="298" width="144" height="144" fill="#f15022" />
      <rect x="857" y="456" width="144" height="143" fill="#00a3ee" />
      <rect x="1015" y="298" width="143" height="144" fill="#7fb900" />
      <rect x="1015" y="456" width="143" height="143" fill="#feb800" />
    </svg>
  ),
  Android: (props: React.ComponentProps<'svg'>) => (
    <svg viewBox="0 0 169.6 103.78" {...props}>
      <defs>
        <linearGradient id="android-3d-lg-1" x1="31.05" y1="259.47" x2="34.99" y2="261.64" gradientTransform="translate(-71.16 888.16) scale(3.32 -3.32)" gradientUnits="userSpaceOnUse">
          <stop offset=".08" stopColor="#3b9261" />
          <stop offset=".25" stopColor="#229a4e" />
          <stop offset=".5" stopColor="#44a560" />
          <stop offset=".75" stopColor="#42a95f" />
          <stop offset="1" stopColor="#44ac66" />
        </linearGradient>
        <linearGradient id="android-3d-lg-2" x1="31.05" y1="259.47" x2="34.99" y2="261.64" gradientTransform="translate(-71.16 888.16) scale(3.32 -3.32)" gradientUnits="userSpaceOnUse">
          <stop offset=".08" stopColor="#3b9261" />
          <stop offset=".25" stopColor="#229a4e" />
          <stop offset=".5" stopColor="#44a560" />
          <stop offset=".75" stopColor="#42a95f" />
          <stop offset="1" stopColor="#44ac66" />
        </linearGradient>
        <linearGradient id="android-3d-lg-3" x1="325.48" y1="259.47" x2="329.42" y2="261.64" gradientTransform="translate(1218.32 888.16) rotate(-180) scale(3.32)" gradientUnits="userSpaceOnUse">
          <stop offset=".08" stopColor="#3b9261" />
          <stop offset=".25" stopColor="#229a4e" />
          <stop offset=".5" stopColor="#44a560" />
          <stop offset=".75" stopColor="#42a95f" />
          <stop offset="1" stopColor="#44ac66" />
        </linearGradient>
        <linearGradient id="android-3d-lg-4" x1="325.48" y1="259.47" x2="329.42" y2="261.64" gradientTransform="translate(1218.32 888.16) rotate(-180) scale(3.32)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4f9765" />
          <stop offset=".12" stopColor="#449a5f" />
          <stop offset=".25" stopColor="#229a4e" />
          <stop offset=".5" stopColor="#44a560" />
          <stop offset=".75" stopColor="#42a95f" />
          <stop offset="1" stopColor="#44ac66" />
        </linearGradient>
        <radialGradient id="android-3d-rg-1" cx="53.16" cy="209.87" fx="53.16" fy="209.87" r="25.53" gradientTransform="translate(-99.5 731.41) scale(3.47 -2.99)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#51aa63" />
          <stop offset=".29" stopColor="#44aa59" />
          <stop offset=".76" stopColor="#4daf60" />
          <stop offset=".85" stopColor="#61a76a" />
          <stop offset="1" stopColor="#7fa186" />
        </radialGradient>
        <linearGradient id="android-3d-lg-5" x1="22.73" y1="242.88" x2="26.02" y2="240.6" gradientTransform="translate(346.49 863.43) rotate(-180) scale(3.32 3.27) skewX(10)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0e2010" />
          <stop offset=".41" stopColor="#050208" />
          <stop offset=".76" stopColor="#0c090e" />
          <stop offset="1" stopColor="#001406" />
        </linearGradient>
        <clipPath id="android-3d-cp-1">
          <path d="M84.74,27.43C41.12,27.46,4.56,60.4,0,103.78h169.53c-4.56-43.4-41.16-76.35-84.79-76.35h0Z" />
        </clipPath>
        <filter id="android-3d-f-1" x="-0.18752626" y="-0.73417565" width="1.3750525" height="2.4683513">
          <feGaussianBlur stdDeviation="3.340793" />
        </filter>
        <linearGradient id="android-3d-lg-6" x1="46.88" y1="258.56" x2="46.88" y2="248.14" gradientTransform="translate(-71.16 888.16) scale(3.32 -3.32)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a7d4aa" />
          <stop offset=".53" stopColor="#9acfa1" />
          <stop offset="1" stopColor="#89c98f" />
        </linearGradient>
        <radialGradient id="android-3d-rg-2" cx="74.55" cy="253.52" fx="74.55" fy="253.52" r="2.45" gradientTransform="translate(-394.5 989.49) scale(3.32 -3.61) skewX(12.89)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#010001" />
          <stop offset=".5" stopColor="#010203" />
          <stop offset="1" stopColor="#001000" />
        </radialGradient>
        <clipPath id="android-3d-cp-2">
          <path d="M84.74,27.43C41.12,27.46,4.56,60.4,0,103.78h169.53c-4.56-43.4-41.16-76.35-84.79-76.35Z" />
        </clipPath>
        <filter id="android-3d-f-2" x="-0.13333943" y="-0.55206027" width="1.2666789" height="2.1041205">
          <feGaussianBlur stdDeviation="2.3970479" />
        </filter>
        <linearGradient id="android-3d-lg-7" x1="22.73" y1="242.88" x2="26.02" y2="240.6" gradientTransform="translate(346.49 863.43) rotate(-180) scale(3.32 3.27) skewX(10)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0e2010" />
          <stop offset=".41" stopColor="#050208" />
          <stop offset=".76" stopColor="#0c090e" />
          <stop offset="1" stopColor="#001406" />
        </linearGradient>
      </defs>
      <g>
        <g>
          <g>
            <g>
              <path fill="url(#android-3d-lg-1)" d="M32.22,5.26c-4.06,0-7.36,3.29-7.36,7.36,0,1.16.28,2.3.81,3.34l14.13,24.32,10.09-1.2,3.46-5.62-15.11-25.04c-1.38-1.97-3.63-3.14-6.03-3.14Z" />
              <path fill="url(#android-3d-lg-2)" d="M32.22,5.26c-4.06,0-7.36,3.29-7.36,7.36,0,1.16.28,2.3.81,3.34l14.13,24.32,10.09-1.2,3.46-5.62-15.11-25.04c-1.38-1.97-3.63-3.14-6.03-3.14Z" />
            </g>
            <g>
              <path fill="url(#android-3d-lg-3)" d="M137.37,5.26c4.06,0,7.36,3.29,7.36,7.36,0,1.16-.28,2.3-.81,3.34l-14.13,24.32-10.09-1.2-3.46-5.62,15.11-25.04c1.38-1.97,3.63-3.14,6.03-3.14Z" />
              <path fill="url(#android-3d-lg-4)" d="M137.37,5.26c4.06,0,7.36,3.29,7.36,7.36,0,1.16-.28,2.3-.81,3.34l-14.13,24.32-10.09-1.2-3.46-5.62,15.11-25.04c1.38-1.97,3.63-3.14,6.03-3.14Z" />
            </g>
            <path fill="url(#android-3d-rg-1)" d="M84.74,27.43C41.12,27.46,4.56,60.4,0,103.78h169.53c-4.56-43.4-41.16-76.35-84.79-76.35h0Z" />
            <path fill="url(#android-3d-lg-5)" d="M122.78,64.28c-4.49,0-7.42,3.96-6.55,8.85s5.23,8.85,9.72,8.85,7.42-3.96,6.55-8.85-5.23-8.85-9.72-8.85Z" />
            <g clipPath="url(#android-3d-cp-1)">
              <g filter="url(#android-3d-f-1)">
                <path fill="url(#android-3d-lg-6)" d="M13.49,65.94h24.97c8.02-9.14,21.38-10.58,40.54-10.58,31.22,0,41.36-4.59,50.11,10.58h26.33c-5.62-20.96-38.97-36.26-70.72-36.26-34.03.5-66.34,17.96-71.24,36.26Z" />
              </g>
            </g>
            <path fill="url(#android-3d-rg-2)" d="M47.45,64.28c4.49,0,7.3,3.96,6.27,8.85s-5.5,8.85-9.99,8.85-7.3-3.96-6.27-8.85,5.5-8.85,9.99-8.85Z" />
            <g clipPath="url(#android-3d-cp-2)">
              <g filter="url(#android-3d-f-2)">
                <path fill="#a7d5aa" d="M33.77,54.17h17.84c5.73-6.53,18.83-6.31,30.26-6.31,18.64,0,28.24-4.52,34.5,6.31h18.81c-4.01-14.98-27.86-24.5-50.34-24.5-24.1.36-47.58,11.42-51.09,24.5Z" />
              </g>
            </g>
            <path fill="url(#android-3d-lg-7)" d="M122.78,64.28c-4.49,0-7.42,3.96-6.55,8.85s5.23,8.85,9.72,8.85,7.42-3.96,6.55-8.85-5.23-8.85-9.72-8.85Z" />
            <path fill="#afb4ad" d="M125.83,66.6s-.1,0-.15.01c-.17.04-.32.14-.42.28-.2.3-.12.72.18.92,1.11.74,1.75,1.52,2.27,2.25.21.3.63.36.93.15.29-.21.36-.62.16-.92-.56-.78-1.34-1.73-2.61-2.58-.1-.07-.23-.11-.35-.11h0ZM43.71,66.79c-.13,0-.25.04-.35.11-1.27.85-2.05,1.8-2.61,2.58-.22.3-.15.71.15.93.3.22.71.15.93-.15.52-.73,1.17-1.51,2.28-2.25.3-.2.39-.62.18-.92-.1-.15-.25-.25-.42-.28h0s-.1-.01-.15-.01h0ZM50.01,75.65c.12-.12-.35.07-.47.2-.57.56-1.13.91-1.75,1.28-.31.19-.42.59-.23.91.19.32.6.42.91.23.63-.37,1.32-.79,2.01-1.48.26-.26.26-.68,0-.94-.12-.13-.59-.07-.47-.2h0ZM119.71,75.62c-.18,0-.35.07-.47.2-.26.26-.26.68,0,.94.69.69,1.39,1.1,2.02,1.48.32.19.72.08.91-.23.19-.32.08-.72-.23-.91-.63-.37-1.18-.71-1.75-1.28-.12-.13-.29-.2-.47-.2h0Z" />
          </g>
        </g>
      </g>
    </svg>
  ),
  Apple: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" {...props}>
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-54.5-124.3-51.7-147.2zM221.3 73.8c16.1-21.5 34.4-45 30.4-68.7-34.3 2.5-62.8 22.7-79.5 48-26.7 38.8-18.6 74.9-18.6 74.9 33 .3 49.3-32.9 67.7-54.2z" />
    </svg>
  ),
  Linux: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 216 256" {...props}>
      <defs>
        <linearGradient id="m">
          <stop offset="0" />
          <stop offset="1" stopOpacity=".3" />
        </linearGradient>
        <linearGradient id="n">
          <stop offset="0" stopColor="#110800" />
          <stop offset=".6" stopColor="#a65a00" stopOpacity=".8" />
          <stop offset="1" stopColor="#ff921e" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="o">
          <stop offset="0" stopColor="#7c7c7c" />
          <stop offset="1" stopColor="#7c7c7c" stopOpacity=".3" />
        </linearGradient>
        <linearGradient id="f">
          <stop offset="0" stopColor="#7c7c7c" />
          <stop offset="1" stopColor="#7c7c7c" stopOpacity=".3" />
        </linearGradient>
        <linearGradient id="a">
          <stop offset="0" stopColor="#b98309" />
          <stop offset="1" stopColor="#382605" />
        </linearGradient>
        <linearGradient id="b">
          <stop offset="0" stopColor="#ebc40c" />
          <stop offset="1" stopColor="#ebc40c" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="c">
          <stop offset="0" />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="d">
          <stop offset="0" stopColor="#3e2a06" />
          <stop offset="1" stopColor="#ad780a" />
        </linearGradient>
        <linearGradient id="e">
          <stop offset="0" stopColor="#f3cd0c" />
          <stop offset="1" stopColor="#f3cd0c" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="p">
          <stop offset="0" stopColor="#fefefc" />
          <stop offset=".8" stopColor="#fefefc" />
          <stop offset="1" stopColor="#d4d4d4" />
        </linearGradient>
        <linearGradient id="g">
          <stop offset="0" stopColor="#757574" stopOpacity="0" />
          <stop offset=".3" stopColor="#757574" />
          <stop offset=".5" stopColor="#757574" />
          <stop offset="1" stopColor="#757574" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="i">
          <stop offset="0" stopColor="#949494" stopOpacity=".4" />
          <stop offset=".5" stopColor="#949494" />
          <stop offset="1" stopColor="#949494" stopOpacity=".4" />
        </linearGradient>
        <linearGradient id="q">
          <stop offset="0" stopColor="#c8c8c8" />
          <stop offset="1" stopColor="#797978" />
        </linearGradient>
        <linearGradient id="j">
          <stop offset="0" stopColor="#747474" />
          <stop offset=".1" stopColor="#8c8c8c" />
          <stop offset=".3" stopColor="#a4a4a4" />
          <stop offset=".5" stopColor="#d4d4d4" />
          <stop offset=".6" stopColor="#d4d4d4" />
          <stop offset="1" stopColor="#7c7c7c" />
        </linearGradient>
        <linearGradient id="h">
          <stop offset="0" stopColor="#646464" stopOpacity="0" />
          <stop offset=".3" stopColor="#646464" stopOpacity=".6" />
          <stop offset=".5" stopColor="#646464" />
          <stop offset=".7" stopColor="#646464" stopOpacity=".3" />
          <stop offset="1" stopColor="#646464" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="r">
          <stop offset="0" stopColor="#020204" />
          <stop offset=".7" stopColor="#020204" />
          <stop offset="1" stopColor="#5c5c5c" />
        </linearGradient>
        <linearGradient id="s">
          <stop offset="0" stopColor="#d2940a" />
          <stop offset=".8" stopColor="#d89c08" />
          <stop offset=".9" stopColor="#b67e07" />
          <stop offset="1" stopColor="#946106" />
        </linearGradient>
        <linearGradient id="k">
          <stop offset="0" stopColor="#ad780a" />
          <stop offset=".1" stopColor="#d89e08" />
          <stop offset=".3" stopColor="#edb80b" />
          <stop offset=".4" stopColor="#ebc80d" />
          <stop offset=".5" stopColor="#f5d838" />
          <stop offset=".8" stopColor="#f6d811" />
          <stop offset="1" stopColor="#f5cd31" />
        </linearGradient>
        <linearGradient id="t">
          <stop offset="0" stopColor="#3a2903" />
          <stop offset=".6" stopColor="#735208" />
          <stop offset="1" stopColor="#ac8c04" />
        </linearGradient>
        <linearGradient id="l">
          <stop offset="0" stopColor="#f5ce2d" />
          <stop offset="1" stopColor="#d79b08" />
        </linearGradient>
        <linearGradient xlinkHref="#a" id="V" x1="23.2" x2="64.3" y1="193" y2="262" gradientUnits="userSpaceOnUse" />
        <linearGradient xlinkHref="#b" id="Z" x1="64.5" x2="77.4" y1="210.8" y2="235.2" gradientUnits="userSpaceOnUse" />
        <linearGradient xlinkHref="#c" id="ab" x1="146.9" x2="150.2" y1="212" y2="235.7" gradientUnits="userSpaceOnUse" />
        <linearGradient xlinkHref="#d" id="ad" x1="151.5" x2="192.9" y1="253" y2="185.8" gradientUnits="userSpaceOnUse" />
        <linearGradient xlinkHref="#e" id="ah" x1="162.8" x2="161.6" y1="180.7" y2="191.6" gradientUnits="userSpaceOnUse" />
        <linearGradient xlinkHref="#f" id="ar" x1="165.7" x2="168.3" y1="173.6" y2="173.5" gradientUnits="userSpaceOnUse" />
        <linearGradient xlinkHref="#g" id="at" x1="84.3" x2="89.3" y1="46.6" y2="55.6" gradientUnits="userSpaceOnUse" />
        <linearGradient xlinkHref="#h" id="ay" x1="83.6" x2="94.5" y1="32.5" y2="43.6" gradientUnits="userSpaceOnUse" />
        <linearGradient xlinkHref="#i" id="aB" x1="117.9" x2="123.7" y1="47.3" y2="54.1" gradientUnits="userSpaceOnUse" />
        <linearGradient xlinkHref="#j" id="aE" x1="112.9" x2="131.3" y1="36.2" y2="47" gradientUnits="userSpaceOnUse" />
        <linearGradient xlinkHref="#h" id="aG" x1="119.2" x2="131.4" y1="31.6" y2="43.1" gradientUnits="userSpaceOnUse" />
        <linearGradient xlinkHref="#k" id="aP" x1="78.1" x2="126.8" y1="69.3" y2="68.9" gradientUnits="userSpaceOnUse" />
        <linearGradient xlinkHref="#l" id="aW" x1="126.7" x2="126.7" y1="67.5" y2="71.1" gradientUnits="userSpaceOnUse" />
        <filter id="I">
          <feGaussianBlur stdDeviation="0.64 0.55" />
        </filter>
        <filter id="K">
          <feGaussianBlur stdDeviation="1" />
        </filter>
        <filter id="M">
          <feGaussianBlur stdDeviation=".7" />
        </filter>
        <filter id="N" width="2.6" height="1.4" x="-.8" y="-.2">
          <feGaussianBlur stdDeviation="1.3" />
        </filter>
        <filter id="O" width="2.6" height="2" x="-.8" y="-.5">
          <feGaussianBlur stdDeviation="1.78 2.19" />
        </filter>
        <filter id="P" width="1.6" height="1.6" x="-.3" y="-.3">
          <feGaussianBlur stdDeviation="1.7" />
        </filter>
        <filter id="Q" width="1.4" height="1.4" x="-.2" y="-.2">
          <feGaussianBlur stdDeviation=".8" />
        </filter>
        <filter id="S" width="1.4" height="1.4" x="-.2" y="-.2">
          <feGaussianBlur stdDeviation="1" />
        </filter>
        <filter id="U" width="1.4" height="1.4" x="-.2" y="-.2">
          <feGaussianBlur stdDeviation="1.19 1.17" />
        </filter>
        <filter id="X" width="1.4" height="1.4" x="-.2" y="-.2">
          <feGaussianBlur stdDeviation="3.4" />
        </filter>
        <filter id="Y">
          <feGaussianBlur stdDeviation="2.1 2.06" />
        </filter>
        <filter id="aa">
          <feGaussianBlur stdDeviation=".3" />
        </filter>
        <filter id="ac">
          <feGaussianBlur stdDeviation="1.95 1.9" />
        </filter>
        <filter id="af" width="1.4" height="1.4" x="-.2" y="-.2">
          <feGaussianBlur stdDeviation="4.1" />
        </filter>
        <filter id="ag" width="1.4" height="1.4" x="-.2" y="-.2">
          <feGaussianBlur stdDeviation="3.12 3.37" />
        </filter>
        <filter id="ai" width="1.4" height="1.4" x="-.2" y="-.2">
          <feGaussianBlur stdDeviation=".4" />
        </filter>
        <filter id="ak" width="1.6" height="1.6" x="-.3" y="-.3">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
        <filter id="am" width="1.4" height="1.4" x="-.2" y="-.2">
          <feGaussianBlur stdDeviation="1.12 0.81" />
        </filter>
        <filter id="aq" width="1.4" height="1.4" x="-.2" y="-.2">
          <feGaussianBlur stdDeviation=".9" />
        </filter>
        <filter id="av" width="1.6" height="1.6" x="-.3" y="-.3">
          <feGaussianBlur stdDeviation=".4" />
        </filter>
        <filter id="az">
          <feGaussianBlur stdDeviation=".1" />
        </filter>
        <filter id="aD" width="1.4" height="1.4" x="-.2" y="-.2">
          <feGaussianBlur stdDeviation=".5" />
        </filter>
        <filter id="aH">
          <feGaussianBlur stdDeviation=".1" />
        </filter>
        <filter id="aI" width="1.4" height="1.4" x="-.2" y="-.2">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
        <filter id="aJ">
          <feGaussianBlur stdDeviation="0.8 0.74" />
        </filter>
        <filter id="aN" width="1.4" height="1.4" x="-.2" y="-.2">
          <feGaussianBlur stdDeviation=".8" />
        </filter>
        <filter id="aO">
          <feGaussianBlur stdDeviation=".7" />
        </filter>
        <filter id="aR" width="1.4" height="1.4" x="-.2" y="-.2">
          <feGaussianBlur stdDeviation=".7" />
        </filter>
        <filter id="aT" width="1.4" height="1.4" x="-.2" y="-.2">
          <feGaussianBlur stdDeviation=".1" />
        </filter>
        <filter id="aV">
          <feGaussianBlur stdDeviation=".1" />
        </filter>
        <filter id="aY" width="1.4" height="1.4" x="-.2" y="-.2">
          <feGaussianBlur stdDeviation=".2" />
        </filter>
        <radialGradient xlinkHref="#m" id="G" cx="0" cy="0" r="1" gradientTransform="matrix(19 0 0 18 61 121)" gradientUnits="userSpaceOnUse" />
        <radialGradient xlinkHref="#m" id="J" cx="0" cy="0" r="1" gradientTransform="matrix(24 0 0 18 126 132)" gradientUnits="userSpaceOnUse" />
        <radialGradient xlinkHref="#m" id="L" cx="0" cy="0" r="1" gradientTransform="matrix(9 0 0 10 94 127)" gradientUnits="userSpaceOnUse" />
        <radialGradient xlinkHref="#n" id="aj" cx="0" cy="0" r="1" gradientTransform="matrix(19 5 -5 20 170 195)" gradientUnits="userSpaceOnUse" />
        <radialGradient xlinkHref="#n" id="al" cx="0" cy="0" r="1" gradientTransform="matrix(20 -1 1 15 170 190)" gradientUnits="userSpaceOnUse" />
        <radialGradient xlinkHref="#o" id="ao" cx="0" cy="0" r="1" gradientTransform="matrix(6 3 -1 3 185 177)" gradientUnits="userSpaceOnUse" />
        <radialGradient xlinkHref="#p" id="as" cx="0" cy="0" r="1" gradientTransform="matrix(10 0 0 16 86 51)" gradientUnits="userSpaceOnUse" />
        <radialGradient xlinkHref="#q" id="aw" cx="0" cy="0" r="1" gradientTransform="matrix(6 -1 1 6 85 44)" gradientUnits="userSpaceOnUse" />
        <radialGradient xlinkHref="#p" id="aA" cx="0" cy="0" r="1" gradientTransform="matrix(14 0 0 16 118 51)" gradientUnits="userSpaceOnUse" />
        <radialGradient xlinkHref="#r" id="aK" cx="0" cy="0" r="1" gradientTransform="matrix(9 -7 6 8 98 60)" gradientUnits="userSpaceOnUse" />
        <radialGradient xlinkHref="#s" id="aL" cx="0" cy="0" r="1" gradientTransform="matrix(25 -10 7 18 110 71)" gradientUnits="userSpaceOnUse" />
        <radialGradient xlinkHref="#t" id="aS" cx="0" cy="0" r="1" gradientTransform="translate(92 60)" gradientUnits="userSpaceOnUse" />
        <radialGradient xlinkHref="#t" id="aU" cx="0" cy="0" r="1" gradientTransform="matrix(3 0 0 2 105 60)" gradientUnits="userSpaceOnUse" />
        <clipPath id="H">
          <use xlinkHref="#u" />
        </clipPath>
        <clipPath id="R">
          <use xlinkHref="#v" />
        </clipPath>
        <clipPath id="T">
          <use xlinkHref="#w" />
        </clipPath>
        <clipPath id="W">
          <use xlinkHref="#x" />
        </clipPath>
        <clipPath id="ae">
          <use xlinkHref="#y" />
        </clipPath>
        <clipPath id="ap">
          <use xlinkHref="#z" />
        </clipPath>
        <clipPath id="ax">
          <use xlinkHref="#A" />
        </clipPath>
        <clipPath id="au">
          <use xlinkHref="#B" />
        </clipPath>
        <clipPath id="aF">
          <use xlinkHref="#C" />
        </clipPath>
        <clipPath id="aC">
          <use xlinkHref="#D" />
        </clipPath>
        <clipPath id="aM">
          <use xlinkHref="#E" />
        </clipPath>
        <clipPath id="aQ">
          <use xlinkHref="#F" />
        </clipPath>
        <clipPath id="aX">
          <use xlinkHref="#E" />
          <use xlinkHref="#F" />
        </clipPath>
      </defs>
      <path id="u" fill="#020204" d="M107 0c-6 0-12 1-18 4-5 3-10 8-13 14s-4 12-4 19c-1 13 0 27 1 40v10c-1 8-9 13-12 21-5 8-6 17-10 25l-10 23c-3 11-5 23-2 35 2 8 6 16 12 23l-3 5c-2 4-6 8-7 13l-1 8c1 2 2 5 4 6l5 3h5c6 0 12-2 18-4l11-2a120 120 0 0 1 53 2c6 2 12 4 19 4h5l5-3c2-1 3-4 4-6l-1-8-7-13-3-6c8-8 14-19 18-30 4-12 4-25 3-38-2-13-6-26-11-37-7-15-13-20-17-33-4-14-1-31-4-44a44 44 0 0 0-16-23c-7-5-15-8-24-8z" />
      <path fill="#fdfdfb" d="m83 74-2 4v4l-1 9-4 8c-4 4-7 9-8 14l-1 9a103 103 0 0 0-16 44c-1 11 0 23 5 33a55 55 0 0 0 24 27c13 7 30 7 43 0l17-14 10-11c4-7 6-16 7-25 2-15 2-31-5-45-2-5-5-9-9-13-1-7-3-14-6-20l-6-13-2-5-4-5c-1-2-3-3-5-3l-6-2-12 1-10-1-5 1-4 3z" />
      <path fill="url(#G)" d="M69 115c1 1-1 6 20 3l-8 1-14 7-9 9 7-13v-7l4-9s-2 7 0 9z" clipPath="url(#H)" filter="url(#I)" opacity=".3" />
      <path fill="url(#J)" d="M134 114c-4 3-6 3-11 3h-19l6 1 19 4 10 4 11 10-1-7c-2-3-6-7-8-12l-2-13s-1 7-5 10z" clipPath="url(#H)" filter="url(#K)" opacity=".4" />
      <path fill="url(#L)" d="M95 108a59 59 0 0 1-1 5l-1 2-1 1-6 1 2 1h2l1 1 1 1 1 3v5a14 14 0 0 1 3-8l2-1 6-2c-2 0-4 0-6-2l-2-2-1-5z" clipPath="url(#H)" filter="url(#M)" opacity=".2" />
      <path d="m90 137-2 12-1 18v15l2 7 1-3-1-12 1-21v-16z" clipPath="url(#H)" filter="url(#N)" opacity=".1" />
      <path fill="#7c7c7c" d="M160 131c1 0 7 5 7 7-1 2-3 1-4 1s-4 2-5 1l2-5v-4z" clipPath="url(#H)" filter="url(#O)" opacity=".8" />
      <path fill="#7c7c7c" d="M122 11c-3 2-2 4-1 6s-2 7-2 7l8-4c2-3 7 3 6 2 0-2-9-12-11-11z" clipPath="url(#H)" filter="url(#P)" />
      <path fill="#838384" d="M138 77c-2 1 1 4 2 7 1 2 3 4 6 4l2-4c0-4-3-4-5-5-1-1-3-4-5-2z" clipPath="url(#H)" filter="url(#Q)" />
      <path id="v" fill="#020204" d="M64 101c-6 7-12 14-16 21l-4 12-5 13-6 12-3 9v7l3 7a69 69 0 0 0 34 32l7 2 4-1 3-3 1-4-2-5-8-8a283 283 0 0 1-24-22c-2-2-2-4-3-7-1-6-1-13 2-19l3-7c1-4 3-8 6-11l9-13 4-14 2-10-7 9z" />
      <path fill="#7c7c7c" d="m57 126-5 6-6 13-2 9v5l-1 5-3 3 4 3 3 5 2 3 4 1 5-1c-2-16 0-32 4-47l1-3-1-3a3 3 0 0 0-3-1 3 3 0 0 0-2 2z" clipPath="url(#R)" filter="url(#S)" opacity=".9" />
      <path id="w" fill="#020204" d="M163 127c5 4 8 11 9 17s1 11-1 16l-4 15-2 6 1 6c1 2 3 4 5 4h7l9-2c4-4 5-10 7-16 1-6 0-12-1-18a121 121 0 0 0-15-40l-12-13-3-5-4-5c-1-2-3-3-5-3l-6-1c-3 1-5 3-6 5l-1 8 4 10 8 9 10 7z" />
      <path fill="#838384" d="m150 119 2 1 8 8c5 5 11 12 12 18s-1 9-2 15-5 14-7 20c-1 3 2 2 1 4v4-1l3-10 6-18c2-6 2-11 1-16-1-7-5-13-11-18l-13-7z" clipPath="url(#T)" filter="url(#U)" />
      <path id="x" fill="url(#V)" d="M35 175h4l4 2c3 1 5 4 7 6l11 17c3 5 5 10 9 14l6 9c3 3 4 6 5 10 2 4 1 9-1 13-1 3-4 6-7 8l-9 2c-5 0-10-3-15-5-10-4-21-5-31-8l-10-3-4-1-3-3-1-3 1-4 3-6 1-11-1-11v-5l2-4 4-2h9l5-2 3-3 2-3 3-4 3-3z" />
      <path fill="#d99a03" d="m37 178 4-1 4 2 5 6 10 17 7 13 7 8 4 8c1 4 1 9-1 12l-6 7-9 2c-5 0-9-3-14-4l-27-6-9-3-5-1-3-3-1-3 1-3 3-6 1-10-1-10v-4l2-4 4-2h10l4-1c2-1 3-2 3-4l2-4 2-4 3-2z" clipPath="url(#W)" filter="url(#X)" />
      <path fill="#f5bd0c" d="m36 175 4-1 4 2 4 6 9 17 8 11c3 5 6 10 7 16 1 4 1 8-1 12-1 2-3 4-6 5-2 2-5 2-8 2-4 0-8-3-12-4-7-3-15-3-22-5l-9-3-4-1-4-2v-3l1-3 2-5v-9l-2-8v-4l2-3c1-2 3-2 5-2h10l4-1 3-4 1-5 1-5 3-3z" clipPath="url(#W)" filter="url(#Y)" />
      <path fill="url(#Z)" d="m51 188 6 13 7 11c0 2 3 4 5 8l5 9-4-10-4-7-6-10-9-14z" clipPath="url(#W)" filter="url(#aa)" />
      <path fill="url(#ab)" d="m199 216-2 3-7 7-13 9-7 8-6 7-8 5h-11l-6-4-2-7 1-13 1-11-1-20v-4l1-3 3-1 3-1h7l5 1 7-1 8-2h4l3 1 1 2 1 3 1 4c0 2 1 3 3 4l4 4 5 2 2 2 2 1 1 4z" clipPath="url(#H)" filter="url(#ac)" opacity=".2" />
      <path id="y" fill="url(#ad)" d="M213 223c-2 3-5 4-8 6l-16 8-9 8-8 7a22 22 0 0 1-12 4l-10-2-7-5-1-9 1-16 2-12 1-24v-4l1-4 4-1h3l9 2 5 1c3 1 6 2 9 1l10-1h4l3 2 2 3 1 5v4l3 6 5 4 6 5 2 1 2 3a5 5 0 0 1 1 4l-3 4z" />
      <path fill="#cd8907" d="m213 216-2 4-8 5-14 8-9 7-7 6c-2 2-5 3-8 3-4 1-8 0-12-1l-6-5-2-8 2-14 2-11v-25c0-2 1-3 2-3l3-2 3 1 8 1 5 1c2 1 5 2 8 1l9-1h3l4 2 1 3 1 4v4l1 3 2 3 5 5 7 4 2 1v4z" clipPath="url(#ae)" filter="url(#af)" />
      <path fill="#f5c021" d="m213 215-2 3c-2 3-5 5-8 6l-16 4-8 5-7 4a35 35 0 0 1-14 3l-5-2c-1 0-3-1-3-3l-1-5 1-13-1-12v-22l-1-4v-2l1-1 2-1h1l3 1 8 1 5 2 8 1 9-2 4 1 3 2 2 2 1 4v5l1 1 1 2 3 5 4 5 7 4 1 2a4 4 0 0 1 1 4z" clipPath="url(#ae)" filter="url(#ag)" />
      <path fill="url(#ah)" d="M148 182c3-1 5 1 7 3h5l8 1 16-2c3-1 5-1 8 1 1 0 2 3 3 2-1-3-3-5-5-6h-7l-19-1h-13c-2-1-3 1-4 1l1 1z" clipPath="url(#ae)" filter="url(#ai)" />
      <path fill="url(#aj)" d="m185 188-2-2-3-1h-6l-6-1h-5l-5 4-1 4v9l2 4 4 3h9a24 24 0 0 0 14-16v-2l-1-2z" clipPath="url(#ae)" filter="url(#ak)" opacity=".3" />
      <path fill="url(#al)" d="m185 185-2-2h-9l-6-1h-5l-5 3-1 3v7l2 2 4 3h9c5-2 9-5 12-8l2-4v-2l-1-1z" clipPath="url(#ae)" filter="url(#am)" opacity=".3" />
      <path id="z" fill="#020204" d="m190 179-2-3-3-1-6-2-5-1h-6l-5 2-3 5-1 9 2 6 5 3h9c5-2 10-5 13-10l2-4v-4z" />
      <defs>
        <path id="an" d="M169 171h-2l-7 5-1 6 1-4c1-2 3-4 6-4h5l4 1 7 2 1 1v4l-1 2-2 1 6-2 2-2 1-3-1-2-2-1-7-3a91 91 0 0 0-10-1z" />
      </defs>
      <use xlinkHref="#an" fill="url(#ao)" clipPath="url(#ap)" filter="url(#aq)" />
      <use xlinkHref="#an" fill="url(#ar)" clipPath="url(#ap)" filter="url(#aq)" />
      <path id="A" fill="url(#as)" d="m84 38-4 2-2 4-1 9 2 8 2 4 4 2h3l4-2 3-5v-6l-1-7-3-6-3-2-4-1z" />
      <path id="B" fill="#020204" d="M81 51v6l2 3 2 2h3l2-1 1-2-1-7-2-4-2-2-3 1-1 1-1 3z" />
      <path fill="url(#at)" d="m85 50 1 1 1 1 1 3h1v-4l-2-2h-2v1z" clipPath="url(#au)" filter="url(#av)" />
      <path fill="url(#aw)" d="m81 44 8-1 8 2 5 2c2 0 4 2 5 3v1l1 1h2v-1l-4-7-2-4c-2-4-6-8-11-10l-14-4a75 75 0 0 0-25 4l-3 2-2 4 1 3 2 4 5 5 6 4 3 2h4l3-2 3-2 5-6z" clipPath="url(#ax)" />
      <path fill="url(#ay)" d="m91 37 5 7c-1-3-2-6-4-7l-3-3-4-1h-1s-1 0 0 0l3 1 4 3z" filter="url(#az)" />
      <path id="C" fill="url(#aA)" d="M112 38c-3 2-5 4-6 7s-1 7 1 11c1 3 3 7 6 9l5 2 6-1 4-5 2-7-1-8c-1-3-3-6-6-8l-4-2a9 9 0 0 0-7 2z" />
      <path id="D" fill="#020204" d="M117 46h-2l-2 2-2 5 1 4 2 4 4 1a6 6 0 0 0 6-3l1-4-1-5-4-4h-3z" />
      <path fill="url(#aB)" d="M123 53c1-1-1-3-2-4l-4-1 2 3c1 1 3 3 4 2z" clipPath="url(#aC)" filter="url(#aD)" />
      <path fill="url(#aE)" d="m103 47 7-4c5-1 11-1 15 2l5 4 5 3h3l2-1 2-2c1-2 2-4 1-5 0-4-2-7-4-11l-2-3c-2-3-5-4-8-6l-11-2h-4l-6 2h-2l-2 1-2 4v3l1 8-1 5 1 2z" clipPath="url(#aF)" />
      <path fill="url(#aG)" d="m120 31-1 2 5 2 7 8 1-1c-2-3-4-7-7-9l-5-2z" filter="url(#aH)" />
      <path fillOpacity=".3" d="M81 89a24 24 0 0 0 12 13l4 1 4-1 4-2 7-4 7-5 3-3 4-1h3l2 1 1-1 1-2-1-2-2-3v-3l-1-4-1-2h-15l-8 1H95l-4 1H80l-2 2-1 1 1 1 1 3 2 9z" clipPath="url(#H)" filter="url(#aI)" />
      <path d="m77 77 8 7 6 6 6 2 8-1 7-2c4-3 7-6 11-7l3-1 2-2 1-3 1-3-1-2-1-2-3-1-5 1h-7l-8 1-10-1h-4l-4 2-3 2-2 1-2 1h-1l-2 1v1z" clipPath="url(#H)" filter="url(#aJ)" opacity=".3" />
      <path fill="url(#aK)" d="m92 59 4-6 2-2 4-1 3 2 2 3 2 3 3 2 1 2 1 1v2l-1 2-4 2-8-1-8 1-3-1-2-1v-4l1-2 3-2z" />
      <path id="E" fill="url(#aL)" d="M77 75v1l1 1h1l6 5c2 3 3 6 6 8l6 2 8-1 7-3 11-8 3-1 2-2 1-3 1-3-1-3-1-2h-15l-8 1H91l-4 1-3 3-2 1-2 1h-2v1l-1 1z" />
      <path fill="#d9b30d" d="M90 79a6 6 0 0 0 4 6h5l2-2 1-2v-1l-1-2h-2l-4-1c-2 0-5 0-5 2z" clipPath="url(#aM)" filter="url(#aN)" />
      <path fill="#604405" d="m84 68-3 2-1 2-1 1v3l1 1h1l2 1 2 3 8 2 9-1 6-2 9-5 3-3 4-2h1v-1l-1-1-5-2h-5l-4-1-5-1a31 31 0 0 0-21 4z" clipPath="url(#aM)" filter="url(#aO)" />
      <path id="F" fill="url(#aP)" d="m84 64-4 4-2 3-1 3v2h2l3 1 3 3 8 2 9-1 6-2a38 38 0 0 0 12-8l2-1 1-1h6v-2l-2-2-3-1-10-3-4-3-5-2c-3-1-7 0-11 1s-7 4-10 7z" />
      <path fill="#f6da4a" d="M109 65v-1h-1l-2 1-4 4-3 6v2l1 1h1l2-2c3-2 6-5 7-9v-1l-1-1z" clipPath="url(#aQ)" filter="url(#aR)" />
      <path fill="url(#aS)" d="m93 59-2 2h1l1-1v-1z" filter="url(#aT)" opacity=".8" />
      <path fill="url(#aU)" d="m103 59 1 1 2 1 1-1-1-1h-3z" filter="url(#aV)" opacity=".8" />
      <path fill="url(#aW)" d="M129 69a2 3 17 0 1-3 3 2 3 17 0 1-2-3 2 3 17 0 1 2 3z" clipPath="url(#aX)" filter="url(#aY)" />
    </svg>
  ),

  // OS Icons
  Gauge: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></svg>
  ),
  Server: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="8" x="2" y="2" rx="2" ry="2" /><rect width="20" height="8" x="2" y="14" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>
  ),
  Globe: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
  ),

  // Document Icons
  FileText: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>
  ),
  Presentation: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h20" /><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" /><path d="m7 21 5-5 5 5" /></svg>
  ),
  Eye: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
  ),
  Download: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
  ),
  Maximize: (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" /></svg>
  ),
};
