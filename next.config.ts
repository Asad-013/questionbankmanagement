import type { NextConfig } from "next";

const securityHeaders = [
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-DNS-Prefetch-Control", value: "on" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    {
        key: "Content-Security-Policy",
        value: [
            "default-src 'self'",
            // SECURITY FIX (VULN-14): Removed 'unsafe-eval'.
            // unsafe-eval enables eval()/new Function() which amplifies any XSS.
            // Next.js 14 production builds do not require unsafe-eval.
            // If you see errors after this change, check for third-party scripts using eval().
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob: https://*.supabase.co",
            "font-src 'self'",
            "connect-src 'self' https://*.supabase.co https://api.resend.com wss://*.supabase.co",
            "frame-ancestors 'none'",
            "form-action 'self'",
        ].join("; "),
    },
];

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**.supabase.co",
            },
        ],
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: securityHeaders,
            },
        ];
    },
};

export default nextConfig;
