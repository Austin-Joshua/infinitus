# Security Policy

## Supported Versions

Only the current production deployment and the `main` branch are actively supported with security fixes.

| Version / Branch | Supported |
| ---------------- | --------- |
| `main`           | :white_check_mark: |
| < 0.1.0          | :x: |

## Reporting a Vulnerability

The INFINITUS team takes the security of our website, data, and student community seriously.

If you believe you have discovered a security vulnerability or sensitive information exposure:

1. **Do not create a public GitHub issue.**
2. Send an email to **[infinitus@ritchennai.edu.in](mailto:infinitus@ritchennai.edu.in)** with the subject line:  
   `[SECURITY DISCLOSURE] Brief summary of vulnerability`
3. Include:
   - Type of issue (e.g. XSS, authentication bypass, header misconfiguration, sensitive data exposure)
   - Step-by-step reproduction instructions or proof-of-concept (POC)
   - Affected URLs, routes, or assets
   - Potential impact
4. You may also use GitHub's private vulnerability reporting feature directly on the repository if enabled.

We will acknowledge receipt within 48 hours and work with you to triage, patch, and deploy a resolution.

## Security Controls & Hardening

The INFINITUS website incorporates the following defensive controls:

- **Zero-Secret Client Builds:** All public client code executes with zero private credentials. Database queries rely exclusively on anonymous public keys (`SUPABASE_ANON_KEY`) or bundled zero-downtime static data.
- **Row Level Security (RLS):** All Supabase database tables (`members`, `events`, `event_images`) have Row Level Security enabled. Only active, sanitized records are readable by the public; all write and mutate permissions (`INSERT`, `UPDATE`, `DELETE`) are prohibited for anonymous and authenticated web roles.
- **Strict Content Security Policy (CSP):** Sourced from canonical hosts, disallowing object embeds, restricting form submissions to official Google Forms, and blocking framing (`frame-ancestors 'none'`).
- **HTTP Security Headers:**
  - `Strict-Transport-Security` (HSTS: 2 years, `includeSubDomains`, `preload`)
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Frame-Options: DENY`
  - `Cross-Origin-Opener-Policy: same-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`
- **API Defense-in-Depth:**
  - Strict method enforcement (405 on non-GET)
  - Query parameter allowlists
  - Sliding-window IP rate limiting
  - Generic errors (no stack trace or database error leaking)
- **URL Protocol Sanitization:** Prohibits `javascript:`, `data:`, `file:`, and protocol-relative `//` URLs across all events, social links, and external references.
