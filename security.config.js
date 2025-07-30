/**
 * Security configuration for production deployment
 * Use with your web server (nginx, Apache, etc.) or hosting provider
 */

export const securityHeaders = {
    // Content Security Policy - restrictive policy for CV site
    "Content-Security-Policy": [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'", // Allow inline styles for DOMPurify
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "frame-ancestors 'none'",
        "form-action 'none'",
        "upgrade-insecure-requests"
    ].join("; "),

    // Prevent MIME type sniffing
    "X-Content-Type-Options": "nosniff",

    // Enable XSS filtering
    "X-XSS-Protection": "1; mode=block",

    // Prevent clickjacking
    "X-Frame-Options": "DENY",

    // Force HTTPS
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",

    // Referrer policy
    "Referrer-Policy": "strict-origin-when-cross-origin",

    // Permissions policy
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()"
};

/**
 * Nginx configuration example:
 * 
 * server {
 *     # ... other config
 *     
 *     add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'none'; upgrade-insecure-requests" always;
 *     add_header X-Content-Type-Options "nosniff" always;
 *     add_header X-XSS-Protection "1; mode=block" always;
 *     add_header X-Frame-Options "DENY" always;
 *     add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
 *     add_header Referrer-Policy "strict-origin-when-cross-origin" always;
 *     add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;
 * }
 */

/**
 * Netlify _headers file example:
 * 
 * /*
 *   Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'none'; upgrade-insecure-requests
 *   X-Content-Type-Options: nosniff
 *   X-XSS-Protection: 1; mode=block
 *   X-Frame-Options: DENY
 *   Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
 *   Referrer-Policy: strict-origin-when-cross-origin
 *   Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
 */