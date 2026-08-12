// js/app.js
// Enterprise Logic Layer: Decoupled and Modular

import { fetchEnterpriseData } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. UI Interactions (Scroll Reveal & Mobile Menu)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); 
            }
        });
    }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.getElementById('nav-links');
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuBtn.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuBtn.innerHTML = '☰';
        });
    });

    // Anti-Snooping Script
    document.addEventListener('contextmenu', event => event.preventDefault());
    document.onkeydown = function (e) {
        if (e.keyCode === 123) return false;
        if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) return false; 
        if (e.ctrlKey && e.keyCode === 85) return false; 
    };

    // 2. Fetch Decoupled Data via Simulated API
    try {
        const db = await fetchEnterpriseData();
        
        let checkLeaflet = setInterval(() => {
            if(window.L) {
                clearInterval(checkLeaflet);
                const naBounds = L.latLngBounds(L.latLng(15.0, -170.0), L.latLng(83.0, -50.0));
                
                initReliabilityMap(db.utilitiesGeoJSON, naBounds);
                initForecastMap(db.forecastRegions, naBounds);
                initDeficitMap(db.deficitGrids, naBounds);
                initOffGridMap(db.offgridZones, db.directoryData, naBounds);
                initNewsFeed();
            }
        }, 100);
    } catch(err) {
        console.error("Failed to load Enterprise Data Layer", err);
    }

    // ==========================================
    // MAP COMPONENTS
    // ==========================================
    function initReliabilityMap(utilitiesGeoJSON, naBounds) {
        const map = L.map('leaflet-map', { scrollWheelZoom: false, maxBounds: naBounds, maxBoundsViscosity: 1.0, minZoom: 3 }).setView([44.5, -79.0], 6);
        setTimeout(() => map.invalidateSize(), 500);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; CARTO' }).addTo(map);

        const layerMap = {};
        function getColor(saidi) { return saidi < 1.0 ? '#10b981' : saidi <= 1.8 ? '#f59e0b' : '#ef4444'; }

        let geojsonLayer = L.geoJSON(utilitiesGeoJSON, { 
            smoothFactor: 1.5, // Smooths out jagged polygon points
            style: function(f) { 
                const isProv = f.properties.type_org === 'provincial';
                return { 
                    fillColor: getColor(f.properties.saidi), 
                    weight: isProv ? 1 : 2, // Thinner lines for a cleaner look
                    opacity: isProv ? 0.4 : 0.8, 
                    color: getColor(f.properties.saidi), 
                    fillOpacity: isProv ? 0.1 : 0.35,
                    lineJoin: 'round', // Rounds the corners of the polygons
                    lineCap: 'round'
                }; 
            }, 
            onEachFeature: function(f, layer) {
                layerMap[f.properties.id] = layer;
                const isProv = f.properties.type_org === 'provincial';
                
                const popupHTML = `
                    <div style="font-family:'Plus Jakarta Sans',sans-serif; min-width: 280px; padding: 5px;">
                        <div style="font-size: 0.75rem; text-transform: uppercase; color: #3b82f6; font-weight: 800; letter-spacing: 1px; margin-bottom: 4px;">${f.properties.region}</div>
                        <strong style="font-size: 1.25rem; color: #fff; display: block; margin-bottom: 12px; border-bottom: 1px solid #3f3f46; padding-bottom: 8px;">${f.properties.utility}</strong>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
                            <div style="background: rgba(255,255,255,0.05); padding: 8px; border-radius: 6px;">
                                <span style="display:block; color: #a1a1aa; font-size: 0.7rem;">Customers</span>
                                <strong style="color: #e4e4e7; font-size: 0.95rem;">${f.properties.customers}</strong>
                            </div>
                            <div style="background: rgba(255,255,255,0.05); padding: 8px; border-radius: 6px;">
                                <span style="display:block; color: #a1a1aa; font-size: 0.7rem;">Circuit Line (km)</span>
                                <strong style="color: #e4e4e7; font-size: 0.95rem;">${f.properties.line_km}</strong>
                            </div>
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.85rem;">
                            <span style="color: #a1a1aa;">Grid Density:</span>
                            <strong style="color: #10b981;">${f.properties.density} /km</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 0.85rem; border-bottom: 1px solid #3f3f46; padding-bottom: 12px;">
                            <span style="color: #a1a1aa;">Generation:</span>
                            <strong style="color: #e4e4e7; text-align: right; max-width: 140px;">${f.properties.mix}</strong>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                            <div>
                                <span style="display:block; color: #a1a1aa; font-size: 0.7rem;">SAIDI (Duration)</span>
                                <strong style="color: ${getColor(f.properties.saidi)}; font-size: 1.1rem;">${f.properties.saidi} hrs</strong>
                            </div>
                            <div style="text-align: right;">
                                <span style="display:block; color: #a1a1aa; font-size: 0.7rem;">SAIFI (Freq.)</span>
                                <strong style="color: ${getColor(f.properties.saidi)}; font-size: 1.1rem;">${f.properties.saifi}</strong>
                            </div>
                        </div>
                    </div>
                `;
                layer.bindPopup(popupHTML);
                layer.on({ 
                    mouseover: (e) => { e.target.setStyle({ weight: 3, color: '#ffffff', fillOpacity: isProv ? 0.3 : 0.7 }); if (!isProv) e.target.bringToFront(); const r = document.getElementById(`row-${f.properties.id}`); if(r) r.classList.add('active'); }, 
                    mouseout: (e) => { geojsonLayer.resetStyle(e.target); const r = document.getElementById(`row-${f.properties.id}`); if(r) r.classList.remove('active'); }, 
                    click: () => selectUtility(f.properties.id) 
                });
            }
        }).addTo(map);

        const tableBody = document.getElementById('utility-table-body');
        function buildTable(features) {
            tableBody.innerHTML = '';
            features.forEach(f => {
                const p = f.properties;
                const row = document.createElement('tr');
                row.className = 'utility-row';
                row.id = `row-${p.id}`;
                row.innerHTML = `
                    <td>
                        <div style="display:flex; align-items:center;">
                            <span class="status-badge" style="background: ${getColor(p.saidi)};"></span>
                            <strong style="color: #f4f4f5;">${p.utility}</strong>
                        </div>
                        <div style="font-size: 0.75rem; color: #a1a1aa; margin-left: 22px; margin-top: 2px;">${p.region}</div>
                    </td>
                    <td><strong style="color: #f4f4f5;">${p.saidi}</strong> hr</td>
                    <td><strong style="color: #f4f4f5;">${p.saifi}</strong></td>
                `;
                row.addEventListener('click', () => selectUtility(p.id));
                row.addEventListener('mouseenter', () => { if(layerMap[p.id]) layerMap[p.id].fire('mouseover'); });
                row.addEventListener('mouseleave', () => { if(layerMap[p.id]) layerMap[p.id].fire('mouseout'); });
                tableBody.appendChild(row);
            });
        }
        buildTable(utilitiesGeoJSON.features);

        function selectUtility(id) {
            const layer = layerMap[id];
            if (!layer) return;
            map.fitBounds(layer.getBounds(), { padding: [20, 20], maxZoom: 9 });
            layer.openPopup();
            document.querySelectorAll('.utility-row').forEach(r => r.classList.remove('active'));
            const activeRow = document.getElementById(`row-${id}`);
            if (activeRow) {
                activeRow.classList.add('active');
                activeRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }

        document.getElementById('search-input').addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = utilitiesGeoJSON.features.filter(f => f.properties.utility.toLowerCase().includes(query) || f.properties.region.toLowerCase().includes(query));
            buildTable(filtered);
            geojsonLayer.clearLayers();
            geojsonLayer.addData({ "type": "FeatureCollection", "features": filtered });
        });
        window.addEventListener('resize', () => map.invalidateSize());
    }

    function initForecastMap(regions, naBounds) {
        const forecastMap = L.map('forecast-map-premium', { scrollWheelZoom: false, zoomControl: false, maxBounds: naBounds, maxBoundsViscosity: 1.0, minZoom: 3 }).setView([56.0, -96.0], 4);
        L.control.zoom({ position: 'topright' }).addTo(forecastMap);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', { attribution: '&copy; CARTO', subdomains: 'abcd', maxZoom: 19 }).addTo(forecastMap);
        setTimeout(() => forecastMap.invalidateSize(), 500);

        const circleMarkers = {};
        regions.forEach(region => {
            const circle = L.circleMarker([region.lat, region.lng], { color: '#06b6d4', fillColor: '#06b6d4', fillOpacity: 0.5, weight: 2 }).addTo(forecastMap);
            circle.bindTooltip(`<b>${region.name}</b>`, { className: 'dark-tooltip', permanent: false });
            circleMarkers[region.id] = circle;
        });

        function updateForecast() {
            const currentYear = parseInt(document.getElementById('yearSliderPrem').value);
            const yearsElapsed = currentYear - 2025;
            const stEV = document.getElementById('t-ev').checked;
            const stAI = document.getElementById('t-ai').checked;
            const stHeat = document.getElementById('t-heat').checked;
            const stHydro = document.getElementById('t-hydro').checked;

            let totalMacroLoad = 17.0; 
            regions.forEach(region => {
                let annualGrowthRate = region.mults.base;
                if (stEV) annualGrowthRate += (region.mults.ev - 1);
                if (stAI) annualGrowthRate += (region.mults.ai - 1);
                if (stHeat) annualGrowthRate += (region.mults.heat - 1);
                if (stHydro) annualGrowthRate += (region.mults.hydro - 1);

                const projectedLoad = region.baseLoad * Math.pow(annualGrowthRate, yearsElapsed);
                totalMacroLoad += projectedLoad;

                const radius = Math.max(10, Math.log(projectedLoad) * 11);
                const ratio = projectedLoad / region.baseLoad;
                let color = '#06b6d4'; 
                if (ratio > 1.5) color = '#3b82f6'; 
                if (ratio > 2.5) color = '#8b5cf6'; 
                if (ratio > 3.5) color = '#d946ef'; 
                if (ratio > 5.0) color = '#f97316'; 

                const marker = circleMarkers[region.id];
                marker.setRadius(radius);
                marker.setStyle({ color: color, fillColor: color, fillOpacity: ratio > 3.5 ? 0.7 : 0.4 });
                marker.setTooltipContent(`
                    <div style="font-family:'Plus Jakarta Sans',sans-serif; text-align:center;">
                        <strong style="font-size:1.1rem; color:#fff;">${region.name}</strong><br>
                        <span style="color:#a1a1aa; font-size:0.8rem;">Est. ${currentYear} Load</span><br>
                        <strong style="color:${color}; font-size:1.3rem;">${projectedLoad.toFixed(1)} TWh</strong>
                    </div>
                `);
            });

            document.getElementById('yearLabelPrem').innerText = currentYear;
            document.getElementById('totalLoadPrem').innerHTML = `${totalMacroLoad.toFixed(0)} <span>TWh</span>`;
            
            const startingTotal = 393.0; 
            const percentGrowth = ((totalMacroLoad - startingTotal) / startingTotal) * 100;
            const pill = document.getElementById('growthPercentPrem');
            
            if (percentGrowth > 0) {
                pill.innerText = `+${percentGrowth.toFixed(0)}% Growth`;
                pill.style.background = percentGrowth > 100 ? 'rgba(217, 70, 239, 0.1)' : 'rgba(16, 185, 129, 0.1)';
                pill.style.color = percentGrowth > 100 ? '#d946ef' : '#10b981';
                pill.style.borderColor = percentGrowth > 100 ? 'rgba(217, 70, 239, 0.3)' : 'rgba(16, 185, 129, 0.2)';
            } else { pill.innerText = `Baseline`; }
        }

        document.getElementById('yearSliderPrem').addEventListener('input', updateForecast);
        document.querySelectorAll('.scenario-group input').forEach(input => input.addEventListener('change', updateForecast));
        updateForecast();
        window.addEventListener('resize', () => forecastMap.invalidateSize());
    }

    function initDeficitMap(gridData, naBounds) {
        const deficitMap = L.map('deficit-leaflet-map', { scrollWheelZoom: false, maxBounds: naBounds, maxBoundsViscosity: 1.0, minZoom: 3 }).setView([56.0, -96.0], 4);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', { attribution: '&copy; CARTO', subdomains: 'abcd', maxZoom: 19 }).addTo(deficitMap);
        setTimeout(() => deficitMap.invalidateSize(), 500);

        gridData.forEach(grid => {
            const deficit = grid.demand - grid.capacity;
            const markerColor = deficit > 0 ? '#ef4444' : '#10b981'; 
            const statusText = deficit > 0 ? 'Unserved Energy Deficit' : 'Capacity Surplus';

            const pulseIcon = L.divIcon({
                className: 'custom-pulse-icon',
                html: `<div style="width: 20px; height: 20px; background: ${markerColor}; border-radius: 50%; box-shadow: 0 0 15px ${markerColor}; border: 2px solid #fff;"></div>`,
                iconSize: [20, 20], iconAnchor: [10, 10]
            });

            const marker = L.marker([grid.lat, grid.lng], { icon: pulseIcon }).addTo(deficitMap);
            const popupHTML = `
                <div style="font-family:'Plus Jakarta Sans',sans-serif; min-width: 240px; padding: 5px;">
                    <strong style="font-size: 1.15rem; color: #fff; display: block; margin-bottom: 12px; border-bottom: 1px solid #3f3f46; padding-bottom: 8px;">${grid.name}</strong>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span style="color: #a1a1aa; font-size: 0.85rem;">2050 Demand</span><strong style="color: #3b82f6;">${grid.demand} ${grid.unit}</strong>
                    </div>
                    <div style="width: 100%; background: #27272a; height: 6px; border-radius: 3px; margin-bottom: 16px;"><div style="width: 100%; background: #3b82f6; height: 100%; border-radius: 3px;"></div></div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span style="color: #a1a1aa; font-size: 0.85rem;">Committed Capacity</span><strong style="color: #10b981;">${grid.capacity} ${grid.unit}</strong>
                    </div>
                    <div style="width: 100%; background: #27272a; height: 6px; border-radius: 3px; margin-bottom: 16px;"><div style="width: ${(grid.capacity / grid.demand) * 100}%; background: #10b981; height: 100%; border-radius: 3px;"></div></div>
                    <div style="background: ${deficit > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'}; border: 1px solid ${deficit > 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}; padding: 12px; border-radius: 8px; text-align: center;">
                        <span style="display: block; color: ${markerColor}; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">${statusText}</span>
                        <strong style="color: ${markerColor}; font-size: 1.6rem; line-height: 1;">${Math.abs(deficit)} <span style="font-size: 1rem;">${grid.unit}</span></strong>
                    </div>
                </div>`;
            marker.bindPopup(popupHTML, { className: 'dark-tooltip', minWidth: 260 });
        });
        window.addEventListener('resize', () => deficitMap.invalidateSize());
    }

    function initOffGridMap(offgridZones, directoryData, naBounds) {
        const offgridMap = L.map('offgrid-leaflet-map', { scrollWheelZoom: false, maxBounds: naBounds, maxBoundsViscosity: 1.0, minZoom: 3 }).setView([58.0, -90.0], 4);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', { attribution: '&copy; CARTO', maxZoom: 18 }).addTo(offgridMap);
        setTimeout(() => offgridMap.invalidateSize(), 500);

        const zoneLayers = {};
        let geojsonLayer = L.geoJSON(offgridZones, {
            style: function() { return { fillColor: '#f59e0b', weight: 2, color: '#fcd34d', dashArray: '5, 5', fillOpacity: 0.15 }; },
            onEachFeature: function(f, layer) {
                zoneLayers[f.properties.id] = layer;
                layer.bindTooltip(`<b>${f.properties.name}</b><br/>${f.properties.count} Off-Grid Communities`, { className: 'dark-tooltip', direction: 'center' });
                layer.on('click', () => mapFlyToZone(f.properties.id));
            }
        }).addTo(offgridMap);

        const listContainer = document.getElementById('offgrid-list-container');
        function renderDirectory(data) {
            listContainer.innerHTML = '';
            data.forEach(zone => {
                const div = document.createElement('div');
                div.className = 'offgrid-item';
                div.id = `dir-${zone.id}`;
                div.innerHTML = `
                    <div class="offgrid-region-title">
                        ${zone.region} <span class="offgrid-badge">${zone.comms.length}</span>
                    </div>
                    <div class="offgrid-community-list">
                        ${zone.comms.join(', ')}
                    </div>
                `;
                div.addEventListener('click', () => mapFlyToZone(zone.id));
                listContainer.appendChild(div);
            });
        }
        renderDirectory(directoryData);

        function mapFlyToZone(id) {
            document.querySelectorAll('.offgrid-item').forEach(el => el.classList.remove('active'));
            const activeDir = document.getElementById(`dir-${id}`);
            if (activeDir) {
                activeDir.classList.add('active');
                activeDir.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            geojsonLayer.eachLayer(layer => geojsonLayer.resetStyle(layer));
            const targetLayer = zoneLayers[id];
            if (targetLayer) {
                targetLayer.setStyle({ fillColor: '#f59e0b', fillOpacity: 0.4, weight: 3 });
                offgridMap.fitBounds(targetLayer.getBounds(), { padding: [20, 20] });
            }
        }

        document.getElementById('offgrid-search').addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = directoryData.filter(zone => zone.region.toLowerCase().includes(query) || zone.comms.some(c => c.toLowerCase().includes(query)));
            renderDirectory(filtered);
        });
        window.addEventListener('resize', () => offgridMap.invalidateSize());
    }

    // ==========================================
    // LIVE UTILITY NEWS FEED ENGINE
    // ==========================================
    function initNewsFeed() {
        const container = document.getElementById('news-feed-container');
        if (!container) return;

        // Google News RSS targeting Canadian Electric, Gas, and Water Utility sectors
        const rssUrl = 'https://news.google.com/rss/search?q=Canada+(utility+OR+"electric+utility"+OR+"natural+gas"+OR+"water+utility"+OR+hydro)&hl=en-CA&gl=CA&ceid=CA:en';
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'ok' && data.items && data.items.length > 0) {
                    container.innerHTML = '';
                    // Render top 6 headlines
                    data.items.slice(0, 6).forEach(item => {
                        const date = new Date(item.pubDate).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
                        
                        let title = item.title || '';
                        let source = 'Canada Utility Wire';
                        if (title.includes(' - ')) {
                            const parts = title.split(' - ');
                            source = parts.pop();
                            title = parts.join(' - ');
                        }

                        let snippet = item.description || '';
                        snippet = snippet.replace(/<[^>]*>?/gm, ''); // Strip raw HTML tags
                        if (snippet.length > 130) {
                            snippet = snippet.substring(0, 127) + '...';
                        }

                        const card = document.createElement('article');
                        card.className = 'news-card';
                        card.innerHTML = `
                            <div>
                                <div class="news-card-header">
                                    <span class="news-source-badge">${source}</span>
                                    <span class="news-date">${date}</span>
                                </div>
                                <h3 class="news-title">${title}</h3>
                                <p class="news-snippet">${snippet || 'Latest sector updates and regulatory developments across Canadian distribution networks.'}</p>
                            </div>
                            <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="news-link">
                                Read Coverage &rarr;
                            </a>
                        `;
                        container.appendChild(card);
                    });
                } else {
                    renderFallbackNews(container);
                }
            })
            .catch(() => {
                renderFallbackNews(container);
            });
    }

    function renderFallbackNews(container) {
        const fallbacks = [
            { title: 'IESO Annual Planning Outlook Forecasts Surge in Industrial Demand', source: 'IESO Planning', date: 'Latest Update', link: 'https://www.ieso.ca', snippet: 'Ontario grid operators project unprecedented load expansion driven by EV supply chain gigafactories and hyper-scale data centers.' },
            { title: 'Canadian Gas Utilities Advance Renewable Natural Gas & Hydrogen Frameworks', source: 'CGA Wire', date: 'Latest Update', link: 'https://www.cga.ca', snippet: 'Gas utilities across Canada scale up blend mandates for renewable natural gas (RNG) into existing distribution networks.' },
            { title: 'Municipal Water Utilities Invest in Climate-Resilient Infrastructure Upgrades', source: 'CWWA Report', date: 'Latest Update', link: 'https://www.cwwa.ca', snippet: 'Water distribution authorities deploy advanced spatial GIS and smart metering to mitigate aging infrastructure challenges.' }
        ];

        container.innerHTML = '';
        fallbacks.forEach(item => {
            const card = document.createElement('article');
            card.className = 'news-card';
            card.innerHTML = `
                <div>
                    <div class="news-card-header">
                        <span class="news-source-badge">${item.source}</span>
                        <span class="news-date">${item.date}</span>
                    </div>
                    <h3 class="news-title">${item.title}</h3>
                    <p class="news-snippet">${item.snippet}</p>
                </div>
                <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="news-link">
                    Read Coverage &rarr;
                </a>
            `;
            container.appendChild(card);
        });
    }
});
