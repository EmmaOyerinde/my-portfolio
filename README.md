# Emmanuel Oyerinde | GitHub Pages edition

A complete static portfolio and infrastructure intelligence lab. Everything the visitor uses runs on GitHub Pages. GitHub Actions refreshes source files before publication. No Cloudflare account, Worker, server, paid data API, personal access token, or separate hosting service is required.

## Publish from GitHub

1. Extract `my-portfolio-main.zip`. Upload **the contents** of its `my-portfolio-main` folder to the root of your `emmaoyerinde/my-portfolio` repository. `index.html` and `package.json` belong at repository root, not inside another nested folder. Include `.github/workflows/pages.yml`, `.github/dependabot.yml`, and `.nojekyll` (your computer may hide dot-prefixed names). Keep an earlier ZIP or Git commit for rollback.
2. In the repository, select **Settings → Pages → Build and deployment → Source → GitHub Actions**. Use the default `main` or `master` branch. For a differently named default branch, change the `push.branches` list in `.github/workflows/pages.yml`.
3. Open **Actions → Publish portfolio and refresh evidence → Run workflow**, on the default branch. Enable workflows if GitHub asks. No secret values need to be entered.
4. Wait for `refresh`, `build`, and `deploy` to finish. The deployment links to the Pages URL. The normal project URL is `https://emmaoyerinde.github.io/my-portfolio/`.
5. In **Settings → Pages**, enable **Enforce HTTPS** if the setting is available. The default `github.io` domain supports HTTPS.

The workflow is included, **not activated in your GitHub account by this delivery**. The first manual run both refreshes and publishes. A normal push publishes your validated saved data without requesting every upstream source again. The daily schedule runs at 07:23 UTC; GitHub may delay or skip scheduled runs. If a repository is inactive, GitHub may disable its schedule after 60 days. Resume it from Actions. The site labels source checks overdue after 72 hours rather than claiming they still run.

Public repositories on GitHub Free can use Pages and standard GitHub-hosted Actions runners without purchasing another service. Private-repository availability and usage allowances depend on your GitHub plan. This project uses `ubuntu-latest`, not paid larger runners.

**If you only want an immediate static upload:** root `index.html` and its assets also work with Pages' “Deploy from a branch / root” setting. Maps, charts, saved evidence, and browser-based news work. For scheduled refreshes to become visible automatically, select **GitHub Actions** as above; bot commits alone do not trigger a Pages branch build.

## Project structure

The source is organized by responsibility. Browser code has no framework or runtime service dependency. Script order in `index.html` is explicit and covered by the integration suite.

| Area                              | Files and responsibility                                                                                                                                               |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page and design                   | `index.html`; `styles/tokens.css` owns both themes and typography; the other `styles/` files own page, map, evidence and interaction rules                             |
| Generated stylesheet              | `scripts/prepare-styles.mjs` combines the ordered style sources into one `styles.css`; no runtime imports or extra stylesheet requests                                 |
| Data contracts and delivery       | `js/evidence-core.js` validates each source; `js/data-client.js` handles verified files, cached evidence and refreshes; `js/source-status-ui.js` presents freshness    |
| Utility and reliability data      | `js/utility-profiles.js`, `js/reliability-core.js`, `js/reliability-data.js`; profile lookup and metric indexes are reused until the underlying publication changes    |
| Reliability interface             | `js/reliability-view.js` shares metric cards; `js/reliability-finder.js` owns national discovery; `js/reliability-ui.js` owns the selected utility and comparison      |
| Source explanations and shared UI | `js/source-reader.js` presents readable source and customer explanations; `js/ui-core.js` owns escaping, approved links, timezone-safe dates and protected CSV exports |
| Maps, page and motion             | `js/maps.js`, `js/map-geometry.js`, `js/app.js`, `js/experience.js`, `js/motion.js`                                                                                    |
| News                              | `js/news-core.mjs` validates live and saved headlines; `js/news.js` handles filtering, refreshes and per-publisher fallback                                            |
| Unattended publication            | `.github/workflows/pages.yml`, `scripts/adapters/`, `scripts/lib/`; no server, Worker or runtime secrets                                                               |
| Regression checks                 | `tests/` includes data, geometry, security, failure recovery and DOM integration tests                                                                                 |

All 93 original map features and all 5,221 original Ontario polygon parts are retained. Customer counts, all basemaps, dark launch defaults, reading controls and the national reporting directory are preserved. Shared typography and colour values have one source of truth; the component cascade remains unchanged.

## Published evidence and unattended updates

| Dataset                     | Source                                   | How it updates                                                                                         |
| --------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Ontario reliability         | OEB annual scorecards                    | Discovers the newest official annual XML link; checks scope, names, coverage and numeric values        |
| Official Ontario boundaries | OEB service-area archive                 | Discovers newest ZIP; bounded KMZ extraction; validates polygons, rings and coordinates                |
| Demand scenarios            | CER Canada's Energy Future               | Discovers current edition and CSV; verifies units, geography, pathways and historical cutoff           |
| Energy balance              | Statistics Canada 25-10-0016-01          | Requests latest 24 months of published observations and metadata                                       |
| Remote communities          | NRCan remote communities catalogue       | Discovers newest edition and ArcGIS layer; verifies the full ID inventory                              |
| Ontario demand context      | IESO Realtime Totals                     | Saves the latest available five-minute interval when the daily job runs; never labelled live telemetry |
| News                        | Four official Government of Canada feeds | Browser checks directly every ten minutes while relevant; daily job also saves backup headlines        |

The daily job is publication refresh, not a continuously running streaming service. The IESO sample may be hours or days old between successful jobs; its delivery date, hour ending, and interval stay visible. Open the IESO data directory for the continuously updated public report.

### OEB and other failure handling

- **401 / 403:** record a blocked check; do not retry the rejected request within the same run. Keep the exact previous verified dataset. Try again on the next scheduled/manual run.
- **429:** retain the previous data and defer until the next run rather than hammering a rate-limited publisher.
- **Network failure, timeout, 5xx:** up to three attempts with bounded backoff, then retain the previous data.
- **Changed schema, incomplete coverage, invalid units, unsafe XML, malformed ZIP or regressed reporting period:** reject the replacement, retain the previous publication, and record validation failure.
- **One source fails:** other validated sources still update. Publish the failure status alongside the saved evidence. The original successful-check timestamp is never replaced by the failed attempt time.
- **Corrupt or missing previous dataset plus a failed update:** stop the workflow instead of publishing a broken application.
- **Browser offline, failed JSON, hash mismatch, disabled local storage:** use validated bundled/device data, show the saved status, retain the current interaction, and offer another check.
- **Map tiles fail:** retain data layers and list views; offer the other basemaps. If detailed gzip geometry fails, retry the plain GeoJSON. If the official overlay fails, preserve original polygons and allow retry.
- **News partially fails:** keep the prior successful headlines from that source while other feeds refresh. Invalid/future/old entries are filtered. No matches and total feed failure have clear messages.
- **Workflow disabled, delayed or unable to publish:** the public site remains available. After 72 hours without a recorded check, its source state becomes overdue. The Actions log and job summary show the maintainer what failed.

There is no guarantee that OEB will permit requests from every GitHub runner. OEB worked in this delivery's local Node fetch, but an actual GitHub-hosted run has not been executed here. If it blocks GitHub, the site stays useful and accurately dated; neither IESO demand nor another utility's figures are silently substituted for an OEB reliability measure.

### Utility annual-report fallback

Five additional report excerpts were verified on **10 November 2026**: BC Hydro FY2025/26, SaskPower FY2025/26, Manitoba Hydro FY2025/26, Nova Scotia Power 2025, and Maritime Electric 2024 observations in its 2025 report. Their links, periods and measurement methods are retained in `js/utility-profiles.js`. Manitoba duration is converted from minutes to hours; missing frequency is not invented. These excerpts require human review of new report editions: they are **not automatically extracted from PDFs**. The interface flags them for review after 10 February 2027. It does not blend unlike methods into a national league table.

Every profile can additionally use the automatically refreshed Statistics Canada regional context. IESO is an Ontario system operator source; its demand report does not supply individual distributor SAIDI/SAIFI.

## Security that actually works on GitHub Pages

- CSP meta before all resources: self-hosted scripts/fonts; no inline JavaScript, eval, plugins, frames, forms, or arbitrary network connections. Inline styling is allowed for Leaflet and charts.
- HTTPS, `noopener noreferrer`, restricted referrer policy, escaped/text-only external content, source URL validation, and formula-safe CSV exports.
- Upstream fetching happens only in Actions using explicit HTTPS origins/paths, same-origin redirects, timeouts, response-size bounds and schema validation. No arbitrary URL proxy exists.
- Dataset SHA-256 hashes detect inconsistent deployments before new files replace an in-memory publication. They are consistency checks, not signatures against a compromised repository.
- Official Actions pinned to full commit SHAs, least-privilege job permissions, lockfile-pinned dependencies, `npm ci --ignore-scripts`, Dependabot update proposals, no pull-request-triggered write workflow, no personal token.
- No analytics, advertisements, account system, payment processing or contact-form database. Fonts are self-hosted. External tiles/news still receive ordinary requests. Preferences and successful evidence copies may be saved on the visitor's device.

GitHub Pages does not offer application-controlled custom response headers. `_headers`, `.htaccess`, CSP `frame-ancestors` in meta, custom HSTS, custom WAF rules and server API rate limiting would not enforce those protections here; they have been removed. GitHub manages the host's transport and platform protection. No CAPTCHA is needed for a site that accepts no submissions. Enable account 2FA/passkeys and review publishing permissions in GitHub; those account settings cannot be applied by uploading this ZIP.

## Local maintenance (optional)

Node 22+; the workflow uses Node 24.

```sh
npm ci --ignore-scripts
npm run format
npm run prepare:styles
npm run prepare:data
npm run check
npm run build
```

`npm run refresh:data` checks upstream publications when requested. A normal build uses the saved source files and does not invent fresh dates. `npm run format` formats authored files; it excludes generated seeds, snapshots, geometry and vendor assets.

`dist/` contains only public static assets. It excludes scripts, tests, package metadata and the redundant original Ontario geometry fixture. Source files remain at root for easy GitHub editing and branch-based static hosting. Never commit `node_modules/`.

`data/source-status.json` records actual source checks and hashes. The build does not invent fresh timestamps. `js/evidence-seed.js` is generated from those data files; do not hand-edit it. The source adapters live in `scripts/adapters/`; they run in Node during Actions, not on the visitor's device.

### If GitHub reports an error

- **Actions absent:** confirm `.github/workflows/pages.yml` was uploaded, and workflows are enabled.
- **Pages not configured:** choose GitHub Actions in Settings → Pages, then rerun.
- **Push denied:** the refresh job needs the included `contents: write` permission. Repository/org policy or protected-branch rules may require an explicit allowed publishing path; don't disable branch protection blindly. You can still publish existing snapshots with a normal permitted push.
- **Commit race:** a concurrent human push may make the scheduled commit fail safely. Rerun the workflow against the new default-branch head. There is no force push.
- **Dependency/install/build failure:** the previous deployment stays available. Inspect the failed step; resolve it before rerunning. Source failures alone are recorded as warnings and do not discard valid saved evidence.
- **Custom domain or repository renamed:** update the 404 page's home link. All normal application asset URLs are relative and support a project path.

## Verification

The data/security tests cover reporting-month consistency, source/hash generation consistency, timezone-safe review dates, formula-safe CSV exports, safe news links, null semantics, CSV parsing, complete original geometry, XML/entity rejection, source allowlists, redirect and size restrictions, preserved snapshots under 401/schema/timeout errors, bounded retries, regressed releases, overdue source states, IESO interval parsing, static CSP, and workflow permissions/pins.

The committed DOM integration suite loads scripts in their actual HTML order and covers all 93 populated utility profiles, metric discovery, named-utility navigation, all numeric profile observations, source dialogs, focus retention during background checks, dark basemaps, theme independence and offline/404/corrupt-file recovery with blocked storage. This is functional verification, not a rendered mobile/desktop visual review. The managed browser-preview environment was unavailable during this iteration.

## Source and platform references

- [OEB scorecards](https://www.oeb.ca/open-data/electricity-distributor-performance-scorecard)
- [OEB service-area archives](https://www.oeb.ca/open-data/electricity-and-natural-gas-distributors-service-areas-mapping-data)
- [IESO data directory](https://www.ieso.ca/en/Power-Data/Data-Directory)
- [CER Energy Futures](https://www.cer-rec.gc.ca/en/data-analysis/canada-energy-future/)
- [Statistics Canada electricity supply/disposition](https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=2510001601)
- [NRCan remote communities catalogue](https://open.canada.ca/data/en/dataset/1d912ea1-919b-449d-8e8b-eb6a2313a401)
- [GitHub Pages workflow deployment](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GITHUB_TOKEN triggering limits](https://docs.github.com/en/actions/concepts/security/github_token)
- [Scheduled workflow limits](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)
- [GitHub HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- [GitHub workflow security](https://docs.github.com/en/actions/reference/security/secure-use)
- [CSP meta limitations](https://www.w3.org/TR/CSP3/#meta-element)

Portrait, project images and PDFs come from the supplied portfolio. NASA imagery is a credited 2012 composite. Leaflet and self-hosted fonts retain their licences. Map tiles keep provider attribution. Government and utility data retain their source links. This independent portfolio does not imply publisher endorsement.

## Interaction and reading updates

The globe is a local Canvas orthographic illustration using public-domain Natural Earth 110m land geometry (https://www.naturalearthdata.com/about/terms-of-use/). It is not satellite telemetry. The shared pause controls stop globe rotation, the smoothly scrolling news banner, and decorative energy-balance pulses. News also pauses on hover, keyboard focus, and touch interaction. The previous/next controls move directly between headlines. The solid data-circle sizes remain unchanged; only a separate, non-interactive ring pulses. System and site reduced-motion settings take precedence. Animation stops when offscreen or when the page is hidden.

Selecting a utility in the left directory automatically fits the map to its polygon. Clicking a footprint on the map keeps the camera in place; Zoom to area is also available in the inspector. Exact polygon hit testing preserves holes and selects the smallest containing part; overlapping utility footprints remain selectable. The inspector stays outside the map and works in expanded view. The directory remains the keyboard alternative.

Explore source opens a plain-language explanation. Readable publisher pages are the primary external destination; XML, JSON and other technical formats sit under an analyst disclosure. No external script, secret, server, or paid service was added.

## Launch and navigation

A fresh page load starts in dark mode before rendering, including when a previous visit used day mode. Reading-size and reduced-motion preferences remain saved. Day mode is available during the current visit. Each map starts with the dark basemap; an explicit shared-view basemap applies only to its linked category. Page theme changes do not change map backgrounds.

The main navigation highlights the section currently in view and exposes `aria-current="location"`. It updates after scrolling, resizing, anchor navigation, and section-size changes. The Ikeja project uses a flat dashboard crop and a case-study button, without perspective or hover zoom. Map toolbars contain map controls; decorative motion remains controllable from the persistent reading-preferences button and the global motion controls.

## National customer and reliability desk

All 93 utility profiles retain customer counts. Source precedence is OEB customer-account data, reviewed utility publications, then the supplied portfolio reference. Reference estimates carry that label and are not presented as current regulator observations. Customer accounts are service relationships, not population counts. Lighting and connection-only OEB classes are excluded from the customer total. A company can cover multiple mapped footprints; Elexicon's company total must not be added twice.

`data/customers.json` is refreshed automatically from the latest recognized RRR 2.1.2 release linked by the OEB catalogue. Parsing checks years, required customer classes, duplicate rows, integer values and company coverage. Failures preserve the last verified file and report the check status. `data/customer-reports.json` holds 11 separately reviewed non-Ontario customer observations, and `data/customer-references.json` preserves original estimates.

`data/reliability-reports.json` contains 35 reviewed observations and a directory spanning all 13 provinces and territories. The UI covers SAIDI, SAIFI, CAIDI, CAIFI, MAIFI, ASAI, CEMI thresholds, CELID thresholds, ENS and AENS, plus transmission SARI and DPUI where published. Some requested indices have definitions and reporting requirements but no numeric observation in the imported reports. This is explicit; no regional averages or zero values are used to fill an outage metric.

- Published figures keep their reporting period, units, event exclusions, population scope and source.
- CAIDI may be calculated from a compatible SAIDI/SAIFI pair. The denominator must be positive. Rolling corporate KPIs and mismatched scopes are excluded from that calculation.
- Availability is published evidence, not a percentage inferred from adjusted SAIDI. No ENS is inferred from imports, supply balance or capacity.
- CEMI and CELID thresholds retain their publisher's at-least/greater-than and cumulative/single-event rules.
- Customer-level histories are required for CAIFI, CEMI and CELID. Averages cannot reconstruct those histories.
- Provincial sources do not imply that a provincial utility's observation applies to every municipal utility.
- The added PDFs are reviewed excerpts, not unattended PDF extraction. Review date: 10 November 2026; next review due: 10 February 2027. Daily checks apply to the seven machine-readable datasets and news, not these manually reviewed excerpts.

The default map shows customer scale across Canada. OEB SAIDI and SAIFI colour views remain available as a compatible comparison set; national report observations are in the reliability desk. The province/territory filter defaults to all of Canada. Every profile has a customer base, regional energy context and a jurisdiction-specific reporting route. There is no claim to have imported every regulator document.

### Finding numeric reliability values

A metric-first panel sits above the map. Select CAIDI, CAIFI, MAIFI, ASAI, CEMIₙ, CELID, ENS or AENS to see named utility observations across Canada. It shows published and calculated counts separately, deduplicates a company's result across overlapping footprints, exports the selected metric, and opens the matching utility profile. Utility cards show all numeric observations.

The reviewed report dataset includes Hydro One 2024 normalized energy-not-supplied (8.2 system minutes), and two explicitly historical Newfoundland and Labrador Hydro records from 2019 in MW-min. The latter are an under-frequency load-shedding subset and one transmission event, not a complete annual utility total. Newfoundland and Labrador Hydro has its own identity in the numeric index and is never substituted for the mapped Newfoundland Power profile.

Six requested metric families have numeric evidence. Customer-affected CAIFI and annual AENS remain unverified in the reviewed Canadian publications; the UI explains the missing inputs and links the source-review notes. A definition is not counted as a numeric observation. ENS-N is normalized transmission performance, not MWh; an unmatched distribution customer count cannot turn it into AENS. All report observations remain dated reviewed excerpts, not a live API.
