import withSerwist from "@serwist/next"

const withSerwistConfig = withSerwist({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV !== "production",
  manifestTransforms: [
    (entries) => ({
      manifest: entries.filter((e) => !/\.(woff2?|ttf|eot|otf)(\?.*)?$/.test(e.url)),
      warnings: [],
    }),
  ],
})

const isDev = process.env.NODE_ENV !== "production"

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws://localhost:* wss://localhost:*" : ""}`,
  "worker-src 'self'",
  "frame-ancestors 'none'",
].join("; ")

const securityHeaders = [
  { key: "Content-Security-Policy",  value: csp },
  { key: "X-DNS-Prefetch-Control",   value: "on" },
  { key: "X-Content-Type-Options",   value: "nosniff" },
  { key: "X-Frame-Options",          value: "SAMEORIGIN" },
  { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",       value: "camera=(), microphone=(), geolocation=()" },
  // Only safe once HTTPS is confirmed on the server
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.4.*"],
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }]
  },
}

export default withSerwistConfig(nextConfig)
