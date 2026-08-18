# 🌍 Enterprise Utility & Grid Analytics Portfolio
**Emmanuel Oyerinde, MBA, PMP®**

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

> An interactive, enterprise-grade geospatial dashboard bridging complex operational technology, utility infrastructure data, and high-level business strategy. 

---

## 📋 Executive Summary

This repository houses my professional project management portfolio. Rather than a static resume, I built a high-performance web application to demonstrate my expertise in **Enterprise Systems, GIS Platform Integrations, and Strategic Delivery**. 

The dashboard processes and visualizes survey-grade service territories for **90+ Canadian utility operators**, providing interactive insights into grid reliability, capacity deficits, and long-term load forecasting.

## ✨ Key Features & Capabilities

* **🗺️ National Reliability Benchmark:** A high-fidelity, Canvas-rendered Leaflet map plotting exact municipal boundaries and provincial service territories. Features interactive data tables tracking OEB SAIDI and SAIFI metrics.
* **📈 50-Year Load Horizon:** An interactive forecasting engine simulating infrastructural choke points up to 2075. Users can toggle macroeconomic variables like EV adoption, Hyper-Scale AI computing, and green hydrogen scaling.
* **⚡ Capacity Deficit Analytics:** Geospatial visualization of projected 2050 unserved energy deficits across major North American balancing authorities.
* **🏔️ Off-Grid Infrastructure Directory:** Mapping 100+ isolated Canadian communities and coastal settlements that operate independently of the primary power grid.
* **📰 Live Intelligence Wire:** A fail-safe, automated REST feed (via RSS2JSON) pulling real-time regulatory and infrastructural utility news across Canada.
* **🔍 Enterprise UI/UX:** Features a custom-built, strict-bound Canadian Intellisense Geocoder, seamless Light/Dark mode state management, and optimized mobile-responsive safe areas.

---

## 🛠️ Technical Architecture

This application is engineered for maximum performance without the bloat of heavy front-end frameworks.

* **Frontend:** Vanilla HTML5, CSS3 (CSS Variables for Instant Theme Swapping).
* **Logic Layer:** Vanilla ES6+ JavaScript (Modular Architecture).
* **Geospatial Engine:** [Leaflet.js](https://leafletjs.com/) utilizing `preferCanvas: true` to handle tens of thousands of geographic vertices seamlessly on mobile GPUs.
* **APIs:** 
  * [Photon Geocoder](https://photon.komoot.io/) (Locked to `countrycode=ca` bounds).
  * [RSS2JSON](https://rss2json.com/) (Bypassing CORS for live XML parsing).

---

## 💻 Local Development Setup

Because this project utilizes modern ES6 JavaScript Modules (`import`/`export`), it must be run through a local web server to bypass browser CORS security policies.

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/EmmaOyerinde/my-portfolio.git](https://github.com/EmmaOyerinde/my-portfolio.git)
