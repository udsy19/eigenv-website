import type { NextConfig } from 'next';

/**
 * Content Security Policy.
 *
 * `unsafe-inline` on script/style is required for Next's hydration bootstrap and
 * injected styles on a statically prerendered route (there is no nonce without a
 * dynamic server). Everything else is locked to self plus the two origins the
 * page legitimately talks to: the same-origin API route (form submit)
 * and Vercel's analytics beacons.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  // 'unsafe-eval' only in dev — React uses eval for debugging in development and
  // never in production, so the deployed CSP stays strict.
  `script-src 'self' 'unsafe-inline' ${process.env.NODE_ENV !== 'production' ? "'unsafe-eval'" : ''} https://va.vercel-scripts.com`.replace(/\s+/g, ' '),
  "connect-src 'self' https://va.vercel-scripts.com",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
