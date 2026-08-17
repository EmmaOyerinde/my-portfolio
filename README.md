# Emmanuel Oyerinde | Enterprise Project Manager Portfolio

[![Live Website](https://img.shields.io/badge/Live_Demo-View_Portfolio-2563eb?style=for-the-badge&logo=vercel)](https://[Your-GitHub-Username].github.io/[Your-Repo-Name])
[![PMP Certified](https://img.shields.io/badge/Certification-PMP®-f59e0b?style=for-the-badge&logo=pmi)](https://www.pmi.org/)
[![License](https://img.shields.io/badge/License-Copyright_2026-10b981?style=for-the-badge)](#)

A high-performance, enterprise-grade professional portfolio designed for executive stakeholders, recruiters, and technical teams. This platform bridges business strategy, IT infrastructure, and advanced spatial analytics (GIS) to showcase over a decade of leadership in utility infrastructure and digital transformation.

---

## 🎯 Core Objectives
* **Executive Presence:** Deliver a sleek, "Fortune-500" user experience utilizing modern glassmorphism, fluid animations, and a strict light/dark design system.
* **Technical Authority:** Demonstrate technical literacy through custom-built geographic information system (GIS) dashboards, live data fetching, and performance-optimized vanilla JavaScript.
* **Strategic Communication:** Present complex enterprise deployments (like grid reliability, load forecasting, and legacy asset retirement) in an easily digestible, interactive format.

---

## 🚀 Key Technical Features

### 1. Interactive Enterprise GIS (Leaflet.js)
Four distinct geographic analytics engines rendering complex utility data:
* **National Reliability Benchmark:** Interactive SAIDI/SAIFI tracking across Canadian LDCs.
* **50-Year Load Horizon:** A dynamic forecasting dashboard projecting grid demand up to 2075 based on adjustable macroeconomic inputs (EV supply chains, AI data centers, electrification).
* **Capacity Deficit Modeling:** Visualizing unserved energy projections and legacy asset retirements.
* **Off-Grid Infrastructure:** Directory and spatial visualization of remote coastal and northern microgrids.

### 2. Custom Spatial Controls & "Intellisense"
* **True Intellisense Geocoder:** A custom-built address search engine powered by the OpenStreetMap/Photon API, restricted to Canadian bounding boxes (`bbox`), featuring live predictive dropdowns without page reloads.
* **GPS Locator:** Integrated browser geolocation API with custom pulsing marker animations.
* **Dynamic Basemaps:** 4 distinct basemap layers (Dark, Light, Satellite, Street) accessible via a streamlined bottom-right UI control.

### 3. Asynchronous Live Intelligence Wire
* A live Google News RSS integration that fetches the latest strategic developments in the Canadian utility sector over a rolling 7-day window.
* Bypasses strict CORS restrictions using an automated allOrigins proxy proxy.
* Features a graceful, hardcoded fallback UI to ensure the portfolio never breaks behind strict corporate firewalls.

### 4. Advanced UX & Performance
* **Instant Theme Engine:** Persists user preference (Light/Dark) across sessions using `localStorage` and dynamically updates the mobile browser UI chrome (`theme-color`).
* **Mobile & iOS Optimization:** Fully responsive with `100dvh` support to perfectly accommodate dynamic Safari address bars and iPhone "Dynamic Island" safe areas.
* **Zero Dependencies:** Core logic written entirely in Vanilla JavaScript (ES6+), ensuring instantaneous load times and zero framework bloat.
* **Web Analytics:** Google Analytics 4 (GA4) integrated for deep dive traffic and engagement monitoring.

---

## 🛠️ Technology Stack

* **Frontend:** HTML5, CSS3 (CSS Variables, Flexbox/Grid, Glassmorphism UI)
* **Logic Layer:** Vanilla JavaScript (ES6 Modules, Intersection Observer API, Fetch API)
* **Geospatial Engine:** [Leaflet.js](https://leafletjs.com/)
* **Geocoding API:** [Photon (Komoot)](https://photon.komoot.io/)
* **Basemap Providers:** CARTO, Esri World Imagery, OpenStreetMap
* **Hosting:** GitHub Pages (Static Edge Delivery)
* **Analytics:** Google Analytics 4

---

## 📂 Project Structure

```text
/
├── index.html          # Main application UI and structural layout
├── styles.css          # Theme variables, responsive breakpoints, and animations
├── favicon.svg         # High-res vector E.O. monogram for tabs
├── logo-icon.svg       # Inline vector logo for navigation
├── headshot.jpg        # Professional avatar
├── UT (1).PNG          # Portfolio Grid visual
├── Magodo Bilateral 2022.PNG # Portfolio Grid visual
├── EFFECTS OF MINING ON FLOODING IN THE DONBAS REGION (Flooding rate 2).pdf # Embedded document
└── js/
    ├── app.js          # Core application logic, map initializers, and UI handlers
    └── api.js          # Simulated enterprise data layer (GeoJSON, arrays, mults)
