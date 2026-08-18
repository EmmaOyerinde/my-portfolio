// js/app.js
// Enterprise Logic Layer: Map Initialization & Custom Intellisense Controls
import { fetchEnterpriseData } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    
    // ==========================================
    // 1. Theme Engine & Live Map Tile Swapper
    // ==========================================
    const rootHtml = document.documentElement;
    const themeBtn = document.getElementById('theme-toggle');
    const metaThemeColor = document.getElementById('meta-theme-color');

    if (rootHtml.getAttribute('data-theme') === 'light') {
        themeBtn.innerHTML = '🌙'; 
        themeBtn.setAttribute('title', 'Switch to Dark Mode');
    } else {
        themeBtn.innerHTML = '☀️'; 
        themeBtn.setAttribute('title', 'Switch to Light Mode');
    }

    themeBtn.addEventListener('click', () => {
        themeBtn.classList.add('rotate');
        setTimeout(() => themeBtn.classList.remove('rotate'), 400);

        const currentTheme = rootHtml.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        rootHtml.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', newTheme === 'light' ? '#f8fafc' : '#09090b');
        }
        
        themeBtn.innerHTML = newTheme === 'light' ? '🌙' : '☀️';
        themeBtn.setAttribute('title', newTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    });

    function createBasemaps() {
        return {
            "Dark Mode": L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; CARTO' }),
            "Light Mode": L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; CARTO' }),
            "Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, attribution: '&copy; Esri' }),
            "Street Map": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap' })
        };
    }

    function setupMapControls(mapInstance) {
        const baseMaps = createBasemaps();
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const defaultBasemap = isLight ? baseMaps["Light Mode"] : baseMaps["Dark Mode"];
        
        defaultBasemap.addTo(mapInstance);
        attachLocateControl(mapInstance);
        L.control.layers(baseMaps, null, { position: 'bottomright', collapsed: true }).addTo(mapInstance);
        attachCustomGeocoder(mapInstance);
    }

    function attachLocateControl(mapInstance) {
        let userLocationMarker;
        const LocateControl = L.Control.extend({
            options: { position: 'bottomright' },
            onAdd: function() {
                const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
                const button = L.DomUtil.create('a', 'leaflet-control-locate-btn', container);
                button.href = '#'; button.title = 'Show My Location'; button.role = 'button'; button.innerHTML = `🎯`;
                L.DomEvent.disableClickPropagation(button);
                L.DomEvent.on(button, 'click', function(e) {
                    L.DomEvent.stop(e);
                    mapInstance.locate({ setView: true, maxZoom: 12, enableHighAccuracy: true });
                });
                return container;
            }
        });
        mapInstance.addControl(new LocateControl());

        mapInstance.on('locationfound', function(e) {
            if (userLocationMarker) { mapInstance.removeLayer(userLocationMarker); }
            const userIcon = L.divIcon({ className: 'custom-pulse-icon', html: `<div style="width: 18px; height: 18px; background: #2563eb; border-radius: 50%; box-shadow: 0 0 15px #2563eb; border: 2px solid #ffffff;"></div>`, iconSize: [18, 18], iconAnchor: [9, 9] });
            userLocationMarker = L.marker(e.latlng, { icon: userIcon }).addTo(mapInstance);
            userLocationMarker.bindTooltip("<b>Your Location</b>", { className: 'dark-tooltip', direction: 'top' }).openTooltip();
        });
    }

    // ==========================================
    // CUSTOM CANADIAN INTELLISENSE SEARCH BAR
    // ==========================================
    function attachCustomGeocoder(mapInstance) {
        let geocodeMarker;

        const SearchControl = L.Control.extend({
            options: { position: 'topright' },
            onAdd: function() {
                const container = L.DomUtil.create('div', 'enterprise-search-container');
                container.innerHTML = `
                    <div class="search-input-wrapper">
                        <svg class="search-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <input type="text" class="enterprise-geocoder-input" placeholder="Search Canadian address..." autocomplete="off">
                        <button class="clear-search" style="display:none;">✕</button>
                    </div>
                    <div class="custom-intellisense-dropdown"></div>
                `;
                
                L.DomEvent.disableClickPropagation(container);
                
                const inputField = container.querySelector('.enterprise-geocoder-input');
                const resultsContainer = container.querySelector('.custom-intellisense-dropdown');
                const clearBtn = container.querySelector('.clear-search');

                let timeout = null;

                inputField.addEventListener('input', (e) => {
                    clearTimeout(timeout);
                    const query = e.target.value;
                    clearBtn.style.display = query.length > 0 ? 'block' : 'none';

                    if(query.length < 3) {
                        resultsContainer.innerHTML = '';
                        resultsContainer.style.display = 'none';
                        return;
                    }
                    
                    timeout = setTimeout(() => {
                        // Strict limitation to Canadian addresses using countrycode=ca
                        fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=6&countrycode=ca`)
                        .then(res => res.json())
                        .then(data => {
                            resultsContainer.innerHTML = '';
                            if(data.features && data.features.length > 0) {
                                resultsContainer.style.display = 'block';
                                
                                data.features.forEach(f => {
                                    const name = f.properties.name || ''; 
                                    const city = f.properties.city || f.properties.county || '';
                                    const state = f.properties.state || '';
                                    const postcode = f.properties.postcode || '';
                                    
                                    const labelArr = [name, city, state, postcode].filter(Boolean);
                                    const uniqueLabel = [...new Set(labelArr)].join(', ');
                                    
                                    const item = document.createElement('div');
                                    item.className = 'intellisense-item';
                                    
                                    // Assign relevant contextual icons
                                    let icon = '📍';
                                    if(f.properties.osm_value === 'city' || f.properties.osm_value === 'town' || f.properties.osm_value === 'village') icon = '🏙️';
                                    if(f.properties.osm_key === 'highway') icon = '🛣️';
                                    
                                    item.innerHTML = `<span class="item-icon">${icon}</span> <span class="item-text">${uniqueLabel}</span>`;
                                    
                                    item.addEventListener('click', () => {
                                        inputField.value = uniqueLabel;
                                        resultsContainer.style.display = 'none';
                                        
                                        const lng = f.geometry.coordinates[0];
                                        const lat = f.geometry.coordinates[1];
                                        
                                        mapInstance.flyTo([lat, lng], 13, { duration: 1.5 });
                                        
                                        if (geocodeMarker) mapInstance.removeLayer(geocodeMarker);
                                        
                                        const targetIcon = L.divIcon({
                                            className: 'custom-pulse-icon',
                                            html: `<div style="width: 16px; height: 16px; background: #06b6d4; border-radius: 50%; box-shadow: 0 0 15px #06b6d4; border: 2px solid #ffffff;"></div>`,
                                            iconSize: [16, 16],
                                            iconAnchor: [8, 8]
                                        });

                                        geocodeMarker = L.marker([lat, lng], { icon: targetIcon })
                                            .addTo(mapInstance)
                                            .bindTooltip(`<b>${uniqueLabel}</b>`, { className: 'dark-tooltip', direction: 'top' })
                                            .openTooltip();
                                    });
                                    
                                    resultsContainer.appendChild(item);
                                });
                            } else {
                                resultsContainer.style.display = 'block';
                                resultsContainer.innerHTML = `<div class="intellisense-empty">No Canadian addresses found</div>`;
                            }
                        }).catch(err => console.log("Intellisense error:", err));
                    }, 300); 
                });

                clearBtn.addEventListener('click', () => {
                    inputField.value = '';
                    resultsContainer.style.display = 'none';
                    clearBtn.style.display = 'none';
                    if(geocodeMarker) mapInstance.removeLayer(geocodeMarker);
                });

                document.addEventListener('click', (e) => {
                    if(!container.contains(e.target)) {
                        resultsContainer.style.display = 'none';
                    }
                });

                return container;
            }
        });

        mapInstance.addControl(new SearchControl());
    }

    // ==========================================
    // 2. UX Elevations (ScrollSpy, Progress, Top)
    // ==========================================
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY; const docHeight = document.body.scrollHeight - window.innerHeight;
        if(scrollProgress) scrollProgress.style.width = ((scrollTop / docHeight) * 100) + '%';
        if(scrollTop > 500) backToTop.classList.add('visible'); else backToTop.classList.remove('visible');
    });

    if(backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${entry.target.id}`) link.classList.add('active');
                });
            }
        });
    }, { root: null, rootMargin: '-20% 0px -70% 0px', threshold: 0 });
    sections.forEach(sec => observer.observe(sec));

    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', () => {
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Opening Mail Client...'; submitBtn.style.opacity = '0.7';
            setTimeout(() => { submitBtn.innerText = originalText; submitBtn.style.opacity = '1'; }, 3000);
        });
    }

    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('active'); observer.unobserve(entry.target); }
        });
    }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    const menuBtn = document.getElementById('menu-btn');
    const navLinksList = document.getElementById('nav-links');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            navLinksList.classList.toggle('active');
            menuBtn.innerHTML = navLinksList.classList.contains('active') ? '✕' : '☰';
        });
    }
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => { navLinksList.classList.remove('active'); if (menuBtn) menuBtn.innerHTML = '☰'; });
    });

    function parseCustomers(custStr) {
        if (!custStr) return 0;
        const s = custStr.toString().toLowerCase().trim();
        if (s.endsWith('m')) return parseFloat(s) * 1000000;
        if (s.endsWith('k')) return parseFloat(s) * 1000;
        return parseFloat(s) || 0;
    }

    // ==========================================
    // 4. Initialize Maps with API Data
    // ==========================================
    try {
        const db = await fetchEnterpriseData();
        
        let checkLeaflet = setInterval(() => {
            if (window.L) {
                clearInterval(checkLeaflet);
                
                initReliabilityMap(db.utilitiesGeoJSON); 
                initForecastMap(db.forecastRegions);
                initDeficitMap(db.deficitGrids);
                initOffGridMap(db.offgridZones, db.directoryData);
                initNewsFeed();
            }
        }, 100);
    } catch (err) {
        console.error("Failed to load Enterprise Data Layer", err);
    }

    // ==========================================
    // MAP INITIALIZATIONS (ALL UNIFIED TO CANADA EXTENT)
    // ==========================================
    function initReliabilityMap(utilitiesGeoJSON) {
        const mapEl = document.getElementById('leaflet-map');
        if (!mapEl) return;

        const map = L.map('leaflet-map', { 
            zoomControl: false, scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false, minZoom: 3 
        }).setView([58.0, -98.0], 3); 
        L.control.zoom({ position: 'bottomright' }).addTo(map);
        setTimeout(() => map.invalidateSize(), 500);

        map.createPane('provincialPane'); map.getPane('provincialPane').style.zIndex = 400;
        map.createPane('municipalPane'); map.getPane('municipalPane').style.zIndex = 500;
        map.createPane('labels'); map.getPane('labels').style.zIndex = 650; map.getPane('labels').style.pointerEvents = 'none';

        setupMapControls(map);

        const layerMap = {};
        function getColor(saidi) { return saidi < 1.0 ? '#10b981' : saidi <= 1.8 ? '#f59e0b' : '#ef4444'; }

        let geojsonLayer = L.geoJSON(utilitiesGeoJSON, { 
            smoothFactor: 1.5, 
            style: function(f) { 
                const isProv = f.properties.type_org === 'provincial';
                return { fillColor: getColor(f.properties.saidi), weight: isProv ? 1.5 : 2, opacity: isProv ? 0.4 : 1, color: getColor(f.properties.saidi), fillOpacity: isProv ? 0.05 : 0.45, lineJoin: 'round', lineCap: 'round' }; 
            }, 
            onEachFeature: function(f, layer) {
                layerMap[f.properties.id] = layer;
                layer.options.pane = f.properties.type_org === 'provincial' ? 'provincialPane' : 'municipalPane';
                
                layer.bindTooltip(`<div style="padding: 2px 4px;"><strong style="font-size: 0.85rem; display:block; color: var(--text-main);">${f.properties.utility}</strong><span style="color: var(--text-muted); font-size: 0.75rem;">${f.properties.region} &bull; ${f.properties.customers} Cust.</span></div>`, { className: 'dark-tooltip', sticky: true, direction: 'auto' });
                layer.bindPopup(`<div style="min-width: 260px; padding: 4px;"><div style="font-size: 0.75rem; text-transform: uppercase; color: var(--accent); font-weight: 800; margin-bottom: 4px;">${f.properties.region}</div><strong style="font-size: 1.15rem; color: var(--text-main); display: block; margin-bottom: 10px; border-bottom: 1px solid var(--border-main); padding-bottom: 6px;">${f.properties.utility}</strong><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;"><div style="background: var(--hover-overlay); padding: 8px; border-radius: 6px;"><span style="display:block; color: var(--text-muted); font-size: 0.7rem;">Customer Pop.</span><strong style="font-size: 0.9rem; color: var(--text-main);">${f.properties.customers}</strong></div><div style="background: var(--hover-overlay); padding: 8px; border-radius: 6px;"><span style="display:block; color: var(--text-muted); font-size: 0.7rem;">Route Length</span><strong style="font-size: 0.9rem; color: var(--text-main);">${f.properties.line_km} km</strong></div></div><div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.8rem;"><span style="color: var(--text-muted);">Grid Density:</span><strong style="color: #10b981;">${f.properties.density} /km</strong></div><div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.8rem; border-bottom: 1px solid var(--border-main); padding-bottom: 8px;"><span style="color: var(--text-muted);">Generation Mix:</span><strong style="text-align: right; color: var(--text-main);">${f.properties.mix}</strong></div><div style="display: flex; justify-content: space-between; align-items: flex-end;"><div><span style="display:block; color: var(--text-muted); font-size: 0.7rem;">OEB SAIDI</span><strong style="color: ${getColor(f.properties.saidi)}; font-size: 1.05rem;">${f.properties.saidi} hrs</strong></div><div style="text-align: right;"><span style="display:block; color: var(--text-muted); font-size: 0.7rem;">OEB SAIFI</span><strong style="color: ${getColor(f.properties.saidi)}; font-size: 1.05rem;">${f.properties.saifi}</strong></div></div></div>`);
                
                layer.on({ 
                    mouseover: (e) => { e.target.setStyle({ weight: 3, fillOpacity: 0.60 }); document.getElementById(`row-${f.properties.id}`)?.classList.add('active'); }, 
                    mouseout: (e) => { geojsonLayer.resetStyle(e.target); document.getElementById(`row-${f.properties.id}`)?.classList.remove('active'); }, 
                    click: () => selectUtility(f.properties.id) 
                });
            }
        }).addTo(map);

        const tableBody = document.getElementById('utility-table-body');
        let activeSortKey = 'customers'; let isAscending = false; 

        function buildTable(features) {
            if (!tableBody) return;
            tableBody.innerHTML = '';
            [...features].sort((a, b) => {
                let vA = a.properties[activeSortKey]; let vB = b.properties[activeSortKey];
                if (activeSortKey === 'customers') { vA = parseCustomers(vA); vB = parseCustomers(vB); }
                if (typeof vA === 'number' && typeof vB === 'number') return isAscending ? vA - vB : vB - vA;
                return isAscending ? String(vA).localeCompare(String(vB)) : String(vB).localeCompare(String(vA));
            }).forEach(f => {
                const p = f.properties;
                const row = document.createElement('tr'); row.className = 'utility-row'; row.id = `row-${p.id}`;
                row.innerHTML = `<td style="padding: 12px 16px;"><div style="display:flex; align-items:center; gap: 10px;"><span class="status-badge" style="background: ${getColor(p.saidi)}; width: 8px; height: 8px; border-radius: 50%;"></span><strong style="color: var(--text-main); font-size: 0.95rem;">${p.utility}</strong></div><div style="font-size: 0.75rem; color: var(--text-muted); margin-left: 18px; margin-top: 4px;">${p.customers} Pop &bull; ${p.line_km} km</div></td><td style="text-align: right; padding: 12px 16px;"><strong style="color: var(--text-main); font-size: 0.95rem;">${p.saidi}</strong><span style="font-size:0.75rem; color: var(--text-muted);"> hr</span></td><td style="text-align: right; padding: 12px 16px;"><strong style="color: var(--text-main); font-size: 0.95rem;">${p.saifi}</strong></td>`;
                row.addEventListener('click', () => selectUtility(p.id));
                row.addEventListener('mouseenter', () => layerMap[p.id]?.fire('mouseover'));
                row.addEventListener('mouseleave', () => layerMap[p.id]?.fire('mouseout'));
                tableBody.appendChild(row);
            });
        }
        buildTable(utilitiesGeoJSON.features);

        document.querySelectorAll('#utility-table thead th, .utility-table-header th').forEach((th, idx) => {
            th.addEventListener('click', () => {
                let key = ['utility', 'saidi', 'saifi'][idx];
                if (activeSortKey === key) isAscending = !isAscending; else { activeSortKey = key; isAscending = (key === 'utility'); }
                buildTable(utilitiesGeoJSON.features);
            });
        });

        function selectUtility(id) {
            const layer = layerMap[id]; if (!layer) return;
            map.fitBounds(layer.getBounds(), { padding: [30, 30], maxZoom: 10 }); layer.openPopup();
            document.querySelectorAll('.utility-row').forEach(r => r.classList.remove('active'));
            document.getElementById(`row-${id}`)?.classList.add('active');
            document.getElementById(`row-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        let searchTimeout;
        document.getElementById('search-input')?.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const query = e.target.value.toLowerCase();
                const filtered = utilitiesGeoJSON.features.filter(f => f.properties.utility.toLowerCase().includes(query) || f.properties.region.toLowerCase().includes(query));
                buildTable(filtered); geojsonLayer.clearLayers(); geojsonLayer.addData({ type: "FeatureCollection", features: filtered });
            }, 250);
        });
        window.addEventListener('resize', () => map.invalidateSize());
    }

    function initForecastMap(regions) {
        const mapEl = document.getElementById('forecast-map-premium'); if (!mapEl) return;
        const forecastMap = L.map('forecast-map-premium', { zoomControl: false, scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false, minZoom: 3 }).setView([58.0, -98.0], 3);
        L.control.zoom({ position: 'bottomright' }).addTo(forecastMap);
        
        setupMapControls(forecastMap);
        setTimeout(() => forecastMap.invalidateSize(), 500);

        const circleMarkers = {};
        regions.forEach(region => {
            const circle = L.circleMarker([region.lat, region.lng], { color: '#06b6d4', fillColor: '#06b6d4', fillOpacity: 0.5, weight: 2 }).addTo(forecastMap);
            circle.bindTooltip(`<b>${region.name}</b>`, { className: 'dark-tooltip', permanent: false });
            circleMarkers[region.id] = circle;
        });

        function updateForecast() {
            const currentYear = parseInt(document.getElementById('yearSliderPrem')?.value || 2025);
            const yearsElapsed = currentYear - 2025;
            let totalLoad = 17.0; 
            regions.forEach(r => {
                let mult = r.mults.base;
                if(document.getElementById('t-ev')?.checked) mult += (r.mults.ev - 1);
                if(document.getElementById('t-ai')?.checked) mult += (r.mults.ai - 1);
                if(document.getElementById('t-heat')?.checked) mult += (r.mults.heat - 1);
                if(document.getElementById('t-hydro')?.checked) mult += (r.mults.hydro - 1);
                const projected = r.baseLoad * Math.pow(mult, yearsElapsed); totalLoad += projected;
                const ratio = projected / r.baseLoad; let color = ratio > 5 ? '#f97316' : ratio > 3.5 ? '#d946ef' : ratio > 2.5 ? '#8b5cf6' : ratio > 1.5 ? '#3b82f6' : '#06b6d4';
                circleMarkers[r.id]?.setRadius(Math.max(10, Math.log(projected) * 11)).setStyle({ color: color, fillColor: color, fillOpacity: ratio > 3.5 ? 0.7 : 0.4 }).setTooltipContent(`<div style="text-align:center;"><strong style="font-size:1.1rem; color: var(--text-main);">${r.name}</strong><br><span style="color:var(--text-muted); font-size:0.8rem;">Est. ${currentYear} Load</span><br><strong style="color:${color}; font-size:1.3rem;">${projected.toFixed(1)} TWh</strong></div>`);
            });
            if(document.getElementById('yearLabelPrem')) document.getElementById('yearLabelPrem').innerText = currentYear;
            if(document.getElementById('totalLoadPrem')) document.getElementById('totalLoadPrem').innerHTML = `${totalLoad.toFixed(0)} <span>TWh</span>`;
            const pct = ((totalLoad - 393) / 393) * 100;
            if(document.getElementById('growthPercentPrem')) document.getElementById('growthPercentPrem').innerText = pct > 0 ? `+${pct.toFixed(0)}% Growth` : 'Baseline';
        }
        document.getElementById('yearSliderPrem')?.addEventListener('input', updateForecast);
        document.querySelectorAll('.scenario-group input').forEach(i => i.addEventListener('change', updateForecast));
        updateForecast(); window.addEventListener('resize', () => forecastMap.invalidateSize());
    }

    function initDeficitMap(gridData) {
        const mapEl = document.getElementById('deficit-leaflet-map'); if (!mapEl) return;
        const deficitMap = L.map('deficit-leaflet-map', { zoomControl: false, scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false, minZoom: 3 }).setView([58.0, -98.0], 3);
        L.control.zoom({ position: 'bottomright' }).addTo(deficitMap);
        
        setupMapControls(deficitMap);
        setTimeout(() => deficitMap.invalidateSize(), 500);

        gridData.forEach(grid => {
            const deficit = grid.demand - grid.capacity; const markerColor = deficit > 0 ? '#ef4444' : '#10b981';
            const pulseIcon = L.divIcon({ className: 'custom-pulse-icon', html: `<div style="width: 20px; height: 20px; background: ${markerColor}; border-radius: 50%; box-shadow: 0 0 15px ${markerColor}; border: 2px solid var(--bg-surface);"></div>`, iconSize: [20, 20], iconAnchor: [10, 10] });
            L.marker([grid.lat, grid.lng], { icon: pulseIcon }).addTo(deficitMap).bindPopup(`<div style="min-width: 240px; padding: 5px;"><strong style="font-size: 1.15rem; display: block; margin-bottom: 12px; border-bottom: 1px solid var(--border-main); padding-bottom: 8px; color: var(--text-main);">${grid.name}</strong><div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span style="color: var(--text-muted); font-size: 0.85rem;">2050 Demand</span><strong style="color: #3b82f6;">${grid.demand} ${grid.unit}</strong></div><div style="width: 100%; background: var(--border-main); height: 6px; border-radius: 3px; margin-bottom: 16px;"><div style="width: 100%; background: #3b82f6; height: 100%; border-radius: 3px;"></div></div><div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span style="color: var(--text-muted); font-size: 0.85rem;">Committed Capacity</span><strong style="color: #10b981;">${grid.capacity} ${grid.unit}</strong></div><div style="width: 100%; background: var(--border-main); height: 6px; border-radius: 3px; margin-bottom: 16px;"><div style="width: ${(grid.capacity / grid.demand) * 100}%; background: #10b981; height: 100%; border-radius: 3px;"></div></div><div style="background: ${deficit > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'}; border: 1px solid ${deficit > 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}; padding: 12px; border-radius: 8px; text-align: center;"><span style="display: block; color: ${markerColor}; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">${deficit > 0 ? 'Unserved Energy Deficit' : 'Capacity Surplus'}</span><strong style="color: ${markerColor}; font-size: 1.6rem; line-height: 1;">${Math.abs(deficit)} <span style="font-size: 1rem;">${grid.unit}</span></strong></div></div>`, { className: 'dark-tooltip' });
        });
    }

    function initOffGridMap(offgridZones, directoryData) {
        const mapEl = document.getElementById('offgrid-leaflet-map'); if (!mapEl) return;
        const offgridMap = L.map('offgrid-leaflet-map', { zoomControl: false, scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false, minZoom: 3 }).setView([58.0, -98.0], 3);
        L.control.zoom({ position: 'bottomright' }).addTo(offgridMap);
        
        setupMapControls(offgridMap);
        setTimeout(() => offgridMap.invalidateSize(), 500);

        const zoneLayers = {};
        let geojsonLayer = L.geoJSON(offgridZones, {
            style: () => ({ fillColor: '#f59e0b', weight: 2, color: '#fcd34d', dashArray: '5, 5', fillOpacity: 0.15 }),
            onEachFeature: (f, layer) => {
                zoneLayers[f.properties.id] = layer;
                layer.bindTooltip(`<b>${f.properties.name}</b><br/>${f.properties.count} Off-Grid Communities`, { className: 'dark-tooltip' });
                layer.on('click', () => mapFlyToZone(f.properties.id));
            }
        }).addTo(offgridMap);

        const listContainer = document.getElementById('offgrid-list-container');
        function renderDirectory(data) {
            if (!listContainer) return; listContainer.innerHTML = '';
            data.forEach(z => {
                const div = document.createElement('div'); div.className = 'offgrid-item'; div.id = `dir-${z.id}`;
                div.innerHTML = `<div class="offgrid-region-title">${z.region} <span class="offgrid-badge">${z.comms.length}</span></div><div class="offgrid-community-list">${z.comms.join(', ')}</div>`;
                div.addEventListener('click', () => mapFlyToZone(z.id)); listContainer.appendChild(div);
            });
        }
        renderDirectory(directoryData);

        function mapFlyToZone(id) {
            document.querySelectorAll('.offgrid-item').forEach(el => el.classList.remove('active'));
            document.getElementById(`dir-${id}`)?.classList.add('active');
            document.getElementById(`dir-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            geojsonLayer.eachLayer(l => geojsonLayer.resetStyle(l));
            if(zoneLayers[id]) { zoneLayers[id].setStyle({ fillColor: '#f59e0b', fillOpacity: 0.4, weight: 3 }); offgridMap.fitBounds(zoneLayers[id].getBounds(), { padding: [20, 20] }); }
        }
        document.getElementById('offgrid-search')?.addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase();
            renderDirectory(directoryData.filter(z => z.region.toLowerCase().includes(q) || z.comms.some(c => c.toLowerCase().includes(q))));
        });
    }

    // ==========================================
    // LIVE NEWS FEED
    // ==========================================
    function initNewsFeed() {
        const container = document.getElementById('news-feed-container'); if (!container) return;
        fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://news.google.com/rss/search?q=Canada+(utility+OR+"electric+utility"+OR+"natural+gas"+OR+"water+utility"+OR+hydro)+when:7d&hl=en-CA&gl=CA&ceid=CA:en')}&cb=${Date.now()}`)
            .then(r => r.json()).then(d => {
                const items = new DOMParser().parseFromString(d.contents, "text/xml").querySelectorAll("item");
                if (items.length > 0) {
                    container.innerHTML = '';
                    Array.from(items).slice(0, 6).forEach(i => {
                        let t = i.querySelector("title")?.textContent || ''; let src = 'Live Utility Wire';
                        if (t.includes(' - ')) { const p = t.split(' - '); src = p.pop(); t = p.join(' - '); }
                        const card = document.createElement('article'); card.className = 'news-card';
                        card.innerHTML = `<div><div class="news-card-header"><span class="news-source-badge">${src}</span><span class="news-date">${i.querySelector("pubDate")?.textContent ? new Date(i.querySelector("pubDate").textContent).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today'}</span></div><h3 class="news-title">${t}</h3></div><a href="${i.querySelector("link")?.textContent || '#'}" target="_blank" rel="noopener noreferrer" class="news-link">Read Coverage &rarr;</a>`;
                        container.appendChild(card);
                    });
                } else renderFallbackNews(container);
            }).catch(() => renderFallbackNews(container));
    }

    function renderFallbackNews(c) {
        c.innerHTML = '';
        [{ t: 'IESO Annual Planning Outlook Forecasts Surge in Demand', s: 'IESO Planning', d: 'Latest Update', l: 'https://www.ieso.ca', sn: 'Ontario grid operators project unprecedented load expansion driven by gigafactories.' },
         { t: 'Canadian Gas Utilities Advance RNG Frameworks', s: 'CGA Wire', d: 'Latest Update', l: 'https://www.cga.ca', sn: 'Gas utilities across Canada scale up blend mandates for renewable natural gas.' },
         { t: 'Municipal Water Utilities Invest in Resilient Upgrades', s: 'CWWA Report', d: 'Latest Update', l: 'https://www.cwwa.ca', sn: 'Distribution authorities deploy advanced spatial GIS to mitigate infrastructure challenges.' }].forEach(i => {
            const card = document.createElement('article'); card.className = 'news-card';
            card.innerHTML = `<div><div class="news-card-header"><span class="news-source-badge">${i.s}</span><span class="news-date">${i.d}</span></div><h3 class="news-title">${i.t}</h3><p class="news-snippet">${i.sn}</p></div><a href="${i.l}" target="_blank" rel="noopener noreferrer" class="news-link">Read Coverage &rarr;</a>`;
            c.appendChild(card);
        });
    }
});
