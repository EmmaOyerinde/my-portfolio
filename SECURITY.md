# Security notes

This is a static GitHub Pages site. There is no server API, database, login, payment flow or form submission. Do not put credentials in the repository, HTML, client scripts, workflow inputs or public data files.

## Enforced application controls

- CSP meta is placed before all resource loading in public HTML.
- Scripts/fonts are self-hosted; no inline JavaScript or eval.
- Source fetching is restricted to approved HTTPS origins and paths, bounded response sizes, timeouts and same-origin redirects.
- External source text is escaped or assigned as text; links are constrained and use `noopener noreferrer`.
- Spreadsheet formula-leading strings are escaped in CSV exports.
- Bad data cannot replace a verified snapshot. SHA-256 detects mixed publication files; it does not authenticate a compromised repository.
- Workflow Actions are pinned to full SHAs, package dependencies are locked, and jobs use scoped permissions. Dependabot proposes updates; it does not automatically merge them.

## Hosting boundary

Enable Enforce HTTPS in GitHub Pages. GitHub controls response headers and infrastructure protection. CSP `frame-ancestors`, custom HSTS and custom Permissions-Policy cannot be enforced by adding a meta tag or `_headers` file on Pages. This package does not claim those controls are active. No server rate limiter or custom WAF is installed.

Keep your GitHub account protected with 2FA/passkeys. Review changes to `.github/workflows/` and the source adapters. Restrict repository write access and preserve appropriate branch protection. No personal access token is needed for the included workflow.

## Failure and disclosure

A failed source check retains the previous successful data and date. A failed build/deployment retains the previous published site. Do not conceal failed checks by changing timestamps manually.

Report a security issue privately to the portfolio owner using the site's email link. Do not post credentials or exploit details containing personal data in a public issue.

The dependency audit found no known vulnerabilities at delivery. This is not a penetration test or a guarantee against future vulnerabilities.
