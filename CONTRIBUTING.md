# Maintaining the portfolio

The published application is static HTML, CSS and JavaScript. Node is used for source refreshes, validation, tests and packaging. It is not a visitor-facing server.

## Setup and checks

Use Node 22 or newer. The GitHub workflow uses Node 24.

```sh
npm ci --ignore-scripts
npm run format
npm run prepare:styles
npm run prepare:data
npm run check
npm run build
```

`dist/` is the deployable website. Open it through a static web server when reviewing locally; browser modules and data requests do not work reliably through `file://` URLs. The source root also contains the generated stylesheet and data seed for branch-based Pages publishing.

## Where to make changes

- Edit page structure and copy in `index.html`.
- Edit typography and theme colours in `styles/tokens.css`. Component styles are in the other `styles/` files, in the order listed in `scripts/lib/styles.mjs`. Run `npm run prepare:styles` after a style change. Do not hand-edit generated `styles.css`.
- Keep browser data loading in `js/data-client.js` and status rendering in `js/source-status-ui.js`. The shared validators in `js/evidence-core.js` also run in GitHub Actions.
- Use `js/ui-core.js` for escaped markup, approved source links, publication dates and CSV exports.
- Keep metric definitions and compatible calculations separate from the reliability finder and utility interface. See the module map in the README.
- Add machine-readable publishers through `scripts/adapters/`. Preserve their units, coverage, reporting period and source link. Never convert a missing value into zero.
- Reviewed report excerpts belong in `data/reliability-reports.json` or `data/customer-reports.json`, with a source, scope, review date and review deadline. PDF excerpts are not automatically refreshed.

Run `npm run refresh:data` only when you intend to check upstream publishers. Regenerate the seed, run checks and inspect the data diff before publishing.

## Review requirements

Changes must preserve the original utility geometry and customer-count fallback hierarchy. Keep keyboard selection, dark launch defaults, all basemaps, reduced-motion support and readable source explanations working. Test GitHub project-path URLs, not just a domain root.

`npm test` covers data contracts, security boundaries, offline recovery and DOM interactions. It does not render CSS or canvas pixels. Review the finished page in a real browser at mobile, tablet and desktop widths when browser tooling is available. Report any uncompleted visual review honestly.

For an issue, include the affected view, utility or dataset, reproduction steps, browser, device width and expected behaviour. Report sensitive security issues through the portfolio's email contact rather than a public issue. Follow [SECURITY.md](SECURITY.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
