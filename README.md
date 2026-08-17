# [ E . O . ] — Strategic Infrastructure & Enterprise Systems

**Executive Portfolio & Geospatial Analytics Platform**  
*London, Ontario, Canada | v.2026*

> **Live Deployment:** [View the Interactive Dashboard](https://[emmaoyerinde.github.io/my-portfolio])

This repository houses the front-end architecture for an interactive executive briefing platform. Designed to bridge the gap between high-level business strategy and complex technical execution, this platform demonstrates over a decade of leadership in utility infrastructure, GIS integration, and enterprise IT deployments.

---

## 🏗️ System Architecture & Engineering Philosophy

This application was engineered with a strict **zero-dependency frontend philosophy** (excluding the Leaflet mapping engine). By avoiding heavy frameworks like React or Angular, the platform achieves near-instantaneous load times, seamless DOM manipulation, and pure Vanilla JavaScript performance.

| Component | Technology | Implementation Detail |
| :--- | :--- | :--- |
| **Presentation** | HTML5 / CSS3 | Glassmorphic UI, CSS Grid/Flexbox, `100dvh` iOS Safe-Area routing. |
| **Logic Layer** | Vanilla ES6+ JS | Asynchronous data fetching, Intersection Observers, Module imports. |
| **Geospatial** | Leaflet.js | Multi-pane rendering, custom bounding boxes, dynamic basemap swapping. |
| **Telemetry** | Photon API | Custom-built True Intellisense geocoding restricted to Canadian bounds. |
| **Analytics** | GA4 | Event tracking, real-time geographic user monitoring. |

---

## 🌐 Core Intelligence Modules

Rather than a static resume, this platform acts as a live analytics engine containing four bespoke GIS modules:

### I. Reliability & Asset Telemetry
An interactive spatial database tracking SAIDI (duration) and SAIFI (frequency) outage metrics across Canadian utility operators. Features include real-time tabular sorting, dynamically rendered GeoJSON polygons, and custom tooltip states.

### II. Predictive Load Forecasting (2025–2075)
A mathematical modeling dashboard allowing users to manipulate macroeconomic variables (EV adoption, AI data centers, industrial electrification) to project 50-year grid demand constraints across major North American regions.

### III. Capacity Deficit Visualization
Geospatial visualization contrasting 2050 localized demand against committed generation capacity, highlighting infrastructural choke points and unserved energy deficits using dynamic CSS-animated pulse markers.

### IV. Off-Grid Directory
A searchable, interactive directory mapping over 100 coastal and northern Canadian settlements that operate entirely independent of the North American power grid.

---

## ⚡ Technical Highlights & Custom Solutions

* **True Intellisense Geocoding:** Bypassed standard "press enter to search" limitations by writing a custom debounce engine that intercepts keystrokes, queries the open-source Photon API, and renders a live, autocomplete dropdown menu (locked strictly to Canadian coordinates).
* **Asynchronous Enterprise Wire:** A live Google News RSS integration fetching strategic utility developments over a 7-day rolling window. It utilizes an automated proxy to bypass enterprise CORS restrictions, complete with a hardcoded fallback UI to prevent failures behind corporate firewalls.
* **Instantaneous Theme Orchestration:** A JavaScript-driven Light/Dark mode engine that not only alters CSS variables but dynamically repaints the Leaflet base-tiles (CARTO Dark Matter vs. Positron) and updates the iOS Safari browser chrome (`theme-color`) in real-time.

