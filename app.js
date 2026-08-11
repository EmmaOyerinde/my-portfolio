// Master Initialization
document.addEventListener('DOMContentLoaded', () => {
            
    // 1. SCROLL REVEAL
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

    // 2. MOBILE MENU
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

    // 3. MASTER LEAFLET INIT
    let checkLeaflet = setInterval(() => {
        if(window.L) {
            clearInterval(checkLeaflet);
            initReliabilityMap();
            initForecastMap();
            initDeficitMap();
            initOffGridMap(); 
        }
    }, 100);

    const naBounds = L.latLngBounds(L.latLng(15.0, -170.0), L.latLng(83.0, -50.0));

    // ==========================================
    // MAP 1: UTILITY RELIABILITY
    // ==========================================
    function initReliabilityMap() {
        const map = L.map('leaflet-map', { 
            scrollWheelZoom: false,
            maxBounds: naBounds,
            maxBoundsViscosity: 1.0,
            minZoom: 3
        }).setView([44.5, -79.0], 6);
        setTimeout(() => { map.invalidateSize(); }, 500);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; CARTO' }).addTo(map);

        const utilitiesGeoJSON = {
            "type": "FeatureCollection",
            "features": [
                { "type": "Feature", "properties": { "id": "hq", "type_org": "provincial", "utility": "Hydro-Québec", "region": "Quebec", "customers": "4.4M", "line_km": "118,000", "density": "37", "mix": "99% Hydroelectric", "saidi": 1.45, "saifi": 1.50 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.50, 51.50], [-79.50, 54.50], [-78.00, 62.50], [-72.00, 62.50], [-64.00, 60.50], [-64.00, 52.00], [-57.00, 51.50], [-64.00, 48.50], [-68.00, 47.00], [-71.00, 45.00], [-74.50, 45.00], [-76.00, 46.00], [-79.50, 51.50]]] } },
                { "type": "Feature", "properties": { "id": "bc", "type_org": "provincial", "utility": "BC Hydro", "region": "British Columbia", "customers": "2.1M", "line_km": "79,000", "density": "26", "mix": "95% Hydroelectric", "saidi": 1.02, "saifi": 0.98 }, "geometry": { "type": "Polygon", "coordinates": [[[-139.05, 60.00], [-120.00, 60.00], [-120.00, 54.00], [-120.00, 49.00], [-123.00, 49.00], [-123.30, 48.30], [-124.00, 48.30], [-125.00, 48.80], [-128.00, 50.80], [-128.50, 51.00], [-130.00, 52.00], [-131.00, 54.00], [-133.00, 54.50], [-139.05, 60.00]]] } },
                { "type": "Feature", "properties": { "id": "skp", "type_org": "provincial", "utility": "SaskPower", "region": "Saskatchewan", "customers": "540k", "line_km": "157,000", "density": "3.4", "mix": "Gas, Coal, Wind, Hydro", "saidi": 2.10, "saifi": 2.30 }, "geometry": { "type": "Polygon", "coordinates": [[[-110.00, 49.00], [-110.00, 60.00], [-102.00, 60.00], [-101.50, 49.00], [-110.00, 49.00]]] } },
                { "type": "Feature", "properties": { "id": "mh", "type_org": "provincial", "utility": "Manitoba Hydro", "region": "Manitoba", "customers": "608k", "line_km": "75,000", "density": "8.1", "mix": "97% Hydroelectric", "saidi": 1.60, "saifi": 1.40 }, "geometry": { "type": "Polygon", "coordinates": [[[-102.00, 49.00], [-102.00, 60.00], [-95.00, 60.00], [-89.00, 56.50], [-95.00, 51.50], [-95.00, 49.00], [-102.00, 49.00]]] } },
                { "type": "Feature", "properties": { "id": "ho", "type_org": "provincial", "utility": "Hydro One", "region": "Rural & Provincial Ontario", "customers": "1.5M", "line_km": "125,000", "density": "12", "mix": "Nuclear, Hydro, Gas, Wind", "saidi": 7.5, "saifi": 2.8 }, "geometry": { "type": "Polygon", "coordinates": [[[-95.1, 49.0], [-95.1, 53.0], [-89.0, 56.5], [-82.0, 55.5], [-79.5, 51.5], [-74.3, 45.5], [-76.0, 44.0], [-76.5, 43.8], [-79.0, 43.2], [-79.0, 42.8], [-81.0, 42.6], [-82.5, 41.8], [-83.1, 42.0], [-82.4, 43.0], [-82.0, 44.0], [-81.5, 45.0], [-84.0, 46.0], [-88.0, 48.5], [-90.0, 48.0], [-95.1, 49.0]]] } },
                { "type": "Feature", "properties": { "id": "fa", "type_org": "provincial", "utility": "FortisAlberta", "region": "Alberta (Rural/Suburban)", "customers": "580k", "line_km": "124,000", "density": "4.6", "mix": "Coal, Gas, Wind, Solar", "saidi": 1.85, "saifi": 1.40 }, "geometry": { "type": "Polygon", "coordinates": [[[-120.0, 54.0], [-120.0, 60.0], [-110.0, 60.0], [-110.0, 49.0], [-114.0, 49.0], [-114.5, 50.0], [-115.0, 51.0], [-117.0, 52.0], [-119.0, 53.0], [-120.0, 54.0]]] } },
                { "type": "Feature", "properties": { "id": "nsp", "type_org": "provincial", "utility": "Nova Scotia Power", "region": "Nova Scotia", "customers": "520k", "line_km": "32,000", "density": "16", "mix": "Coal, Gas, Wind, Hydro", "saidi": 2.30, "saifi": 2.10 }, "geometry": { "type": "Polygon", "coordinates": [[[-66.15, 43.85], [-64.80, 45.00], [-64.30, 45.90], [-63.80, 46.00], [-63.00, 47.00], [-59.80, 47.00], [-59.80, 46.00], [-61.00, 45.30], [-63.50, 44.50], [-65.50, 43.40], [-66.15, 43.85]]] } },
                { "type": "Feature", "properties": { "id": "nbp", "type_org": "provincial", "utility": "NB Power", "region": "New Brunswick", "customers": "400k", "line_km": "21,000", "density": "19", "mix": "Nuclear, Hydro, Fossil", "saidi": 2.50, "saifi": 2.00 }, "geometry": { "type": "Polygon", "coordinates": [[[-69.00, 47.30], [-68.00, 48.00], [-64.50, 48.00], [-64.00, 46.00], [-64.30, 45.90], [-66.15, 43.85], [-67.00, 45.00], [-67.80, 45.50], [-69.00, 47.30]]] } },
                { "type": "Feature", "properties": { "id": "nfp", "type_org": "provincial", "utility": "Newfoundland Power", "region": "Island of Newfoundland", "customers": "270k", "line_km": "12,000", "density": "22", "mix": "Hydroelectric", "saidi": 1.80, "saifi": 1.90 }, "geometry": { "type": "Polygon", "coordinates": [[[-59.50, 51.50], [-55.50, 51.50], [-52.50, 47.50], [-54.00, 46.60], [-59.50, 47.50], [-59.50, 51.50]]] } },
                { "type": "Feature", "properties": { "id": "me", "type_org": "provincial", "utility": "Maritime Electric", "region": "Prince Edward Island", "customers": "86k", "line_km": "6,000", "density": "14", "mix": "Wind, Imports via Cable", "saidi": 3.00, "saifi": 2.50 }, "geometry": { "type": "Polygon", "coordinates": [[[-64.50, 46.50], [-63.80, 46.50], [-62.00, 46.30], [-62.00, 46.00], [-63.50, 46.00], [-64.50, 46.50]]] } },
                
                { "type": "Feature", "properties": { "id": "th", "type_org": "municipal", "utility": "Toronto Hydro", "region": "Toronto, ON", "customers": "780k", "line_km": "15,000", "density": "52", "mix": "Urban Distribution", "saidi": 1.15, "saifi": 1.34 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.54, 43.58], [-79.62, 43.74], [-79.60, 43.76], [-79.17, 43.85], [-79.13, 43.80], [-79.15, 43.77], [-79.20, 43.72], [-79.25, 43.69], [-79.34, 43.66], [-79.38, 43.63], [-79.45, 43.62], [-79.54, 43.58]]] } },
                { "type": "Feature", "properties": { "id": "al", "type_org": "municipal", "utility": "Alectra Utilities", "region": "Mississauga / Hamilton / Vaughan", "customers": "1.1M", "line_km": "10,000", "density": "110", "mix": "Urban/Suburban Dist.", "saidi": 0.95, "saifi": 1.10 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.80, 43.20], [-80.00, 43.25], [-79.85, 43.45], [-79.80, 43.75], [-79.70, 44.40], [-79.60, 44.40], [-79.30, 43.95], [-79.20, 43.90], [-79.15, 43.85], [-79.17, 43.85], [-79.60, 43.76], [-79.62, 43.74], [-79.54, 43.58], [-79.65, 43.55], [-79.70, 43.40], [-79.75, 43.30], [-79.80, 43.20]]] } },
                { "type": "Feature", "properties": { "id": "enov", "type_org": "municipal", "utility": "Enova Power Corp", "region": "Waterloo / Kitchener / Wilmot", "customers": "165k", "line_km": "3,400", "density": "48", "mix": "Urban/Suburban Dist.", "saidi": 0.98, "saifi": 1.05 }, "geometry": { "type": "Polygon", "coordinates": [[[-80.70, 43.35], [-80.75, 43.50], [-80.65, 43.60], [-80.50, 43.65], [-80.40, 43.55], [-80.30, 43.45], [-80.40, 43.35], [-80.70, 43.35]]] } },
                { "type": "Feature", "properties": { "id": "fest", "type_org": "municipal", "utility": "Festival Hydro", "region": "Stratford / Perth County", "customers": "20k", "line_km": "1,200", "density": "40", "mix": "Urban/Rural Dist.", "saidi": 1.45, "saifi": 0.95 }, "geometry": { "type": "Polygon", "coordinates": [[[-81.00, 43.35], [-81.05, 43.42], [-80.90, 43.42], [-80.85, 43.35], [-81.00, 43.35]]] } },
                { "type": "Feature", "properties": { "id": "npei", "type_org": "municipal", "utility": "Niagara Peninsula Energy Inc.", "region": "Niagara Falls / Pelham / Lincoln", "customers": "45k", "line_km": "2,000", "density": "22", "mix": "Suburban/Tourism Corridor", "saidi": 1.65, "saifi": 1.05 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.15, 43.15], [-79.25, 43.20], [-79.35, 43.15], [-79.30, 43.00], [-79.15, 43.05], [-79.05, 43.10], [-79.15, 43.15]]] } },
                { "type": "Feature", "properties": { "id": "oak", "type_org": "municipal", "utility": "Oakville Hydro", "region": "Oakville, ON", "customers": "74k", "line_km": "1,800", "density": "41", "mix": "Urban Distribution", "saidi": 0.85, "saifi": 0.90 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.75, 43.40], [-79.80, 43.48], [-79.68, 43.52], [-79.62, 43.45], [-79.75, 43.40]]] } },
                { "type": "Feature", "properties": { "id": "king", "type_org": "municipal", "utility": "Kingston Hydro", "region": "Kingston, ON", "customers": "28k", "line_km": "800", "density": "35", "mix": "Urban Distribution", "saidi": 0.95, "saifi": 1.00 }, "geometry": { "type": "Polygon", "coordinates": [[[-76.55, 44.20], [-76.60, 44.30], [-76.45, 44.30], [-76.40, 44.25], [-76.55, 44.20]]] } },
                { "type": "Feature", "properties": { "id": "ent", "type_org": "municipal", "utility": "Entegrus Powerlines", "region": "Chatham-Kent / St. Thomas", "customers": "60k", "line_km": "2,200", "density": "27", "mix": "Rural/Urban Dist.", "saidi": 1.10, "saifi": 1.15 }, "geometry": { "type": "Polygon", "coordinates": [[[-82.20, 42.25], [-82.40, 42.60], [-81.90, 42.75], [-81.50, 42.85], [-81.20, 42.75], [-81.40, 42.50], [-82.20, 42.25]]] } },
                { "type": "Feature", "properties": { "id": "gb", "type_org": "municipal", "utility": "GrandBridge Energy", "region": "Cambridge / Brantford", "customers": "110k", "line_km": "2,800", "density": "39", "mix": "Suburban Dist.", "saidi": 1.05, "saifi": 1.10 }, "geometry": { "type": "Polygon", "coordinates": [[[-80.40, 43.40], [-80.50, 43.15], [-80.20, 43.15], [-80.10, 43.30], [-80.25, 43.45], [-80.40, 43.40]]] } },
                { "type": "Feature", "properties": { "id": "syn", "type_org": "municipal", "utility": "Synergy North", "region": "Thunder Bay / Kenora", "customers": "56k", "line_km": "1,400", "density": "40", "mix": "Urban Distribution", "saidi": 1.25, "saifi": 1.30 }, "geometry": { "type": "Polygon", "coordinates": [[[-89.40, 48.35], [-89.35, 48.45], [-89.20, 48.45], [-89.15, 48.35], [-89.25, 48.30], [-89.40, 48.35]]] } },
                { "type": "Feature", "properties": { "id": "bh", "type_org": "municipal", "utility": "Burlington Hydro", "region": "Burlington, ON", "customers": "69k", "line_km": "1,500", "density": "46", "mix": "Urban Distribution", "saidi": 1.25, "saifi": 1.15 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.85, 43.30], [-79.90, 43.45], [-79.75, 43.40], [-79.70, 43.30], [-79.85, 43.30]]] } },
                { "type": "Feature", "properties": { "id": "lh", "type_org": "municipal", "utility": "London Hydro", "region": "London, ON", "customers": "165k", "line_km": "3,000", "density": "55", "mix": "Urban Distribution", "saidi": 1.05, "saifi": 1.20 }, "geometry": { "type": "Polygon", "coordinates": [[[-81.35, 42.90], [-81.38, 42.95], [-81.33, 43.05], [-81.18, 43.05], [-81.15, 43.00], [-81.12, 42.92], [-81.20, 42.88], [-81.30, 42.88], [-81.35, 42.90]]] } },
                { "type": "Feature", "properties": { "id": "ew", "type_org": "municipal", "utility": "Enwin Utilities", "region": "Windsor, ON", "customers": "91k", "line_km": "1,100", "density": "82", "mix": "Urban Distribution", "saidi": 0.90, "saifi": 1.05 }, "geometry": { "type": "Polygon", "coordinates": [[[-83.10, 42.25], [-83.05, 42.35], [-82.90, 42.35], [-82.90, 42.25], [-83.10, 42.25]]] } },
                { "type": "Feature", "properties": { "id": "elx", "type_org": "municipal", "utility": "Elexicon Energy", "region": "Durham Region (Oshawa)", "customers": "173k", "line_km": "4,100", "density": "42", "mix": "Urban/Suburban Dist.", "saidi": 1.18, "saifi": 1.25 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.15, 43.82], [-79.10, 43.85], [-79.15, 44.05], [-78.80, 44.00], [-78.70, 43.85], [-79.15, 43.82]]] } },
                { "type": "Feature", "properties": { "id": "ho_ottawa", "type_org": "municipal", "utility": "Hydro Ottawa", "region": "Ottawa, ON", "customers": "350k", "line_km": "6,000", "density": "58", "mix": "Urban Distribution", "saidi": 1.28, "saifi": 1.45 }, "geometry": { "type": "Polygon", "coordinates": [[[-76.35, 45.45], [-76.25, 45.50], [-76.00, 45.40], [-75.80, 45.52], [-75.70, 45.45], [-75.40, 45.55], [-75.30, 45.55], [-75.25, 45.40], [-75.40, 45.10], [-75.80, 45.00], [-76.00, 45.10], [-76.35, 45.45]]] } },
                { "type": "Feature", "properties": { "id": "en", "type_org": "municipal", "utility": "ENMAX Power", "region": "Calgary, AB", "customers": "520k", "line_km": "8,500", "density": "61", "mix": "Urban Distribution", "saidi": 0.85, "saifi": 0.75 }, "geometry": { "type": "Polygon", "coordinates": [[[-114.25, 50.85], [-114.25, 51.18], [-113.90, 51.18], [-113.90, 50.85], [-114.25, 50.85]]] } },
                { "type": "Feature", "properties": { "id": "ep", "type_org": "municipal", "utility": "EPCOR Utilities", "region": "Edmonton, AB", "customers": "415k", "line_km": "6,000", "density": "69", "mix": "Urban Distribution", "saidi": 1.51, "saifi": 0.72 }, "geometry": { "type": "Polygon", "coordinates": [[[-113.70, 53.40], [-113.70, 53.65], [-113.30, 53.65], [-113.30, 53.40], [-113.70, 53.40]]] } }
            ]
        };

        const layerMap = {};
        function getColor(saidi) { return saidi < 1.0 ? '#10b981' : saidi <= 1.8 ? '#f59e0b' : '#ef4444'; }

        let geojsonLayer = L.geoJSON(utilitiesGeoJSON, { 
            style: function(f) { 
                const isProv = f.properties.type_org === 'provincial';
                return { 
                    fillColor: getColor(f.properties.saidi), 
                    weight: isProv ? 1.5 : 2.5, 
                    opacity: isProv ? 0.5 : 0.9, 
                    color: getColor(f.properties.saidi), 
                    fillOpacity: isProv ? 0.15 : 0.45 
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
                    mouseover: (e) => { 
                        e.target.setStyle({ weight: 3, color: '#ffffff', fillOpacity: isProv ? 0.3 : 0.7 }); 
                        if (!isProv) e.target.bringToFront(); 
                        const r = document.getElementById(`row-${f.properties.id}`); 
                        if(r) r.classList.add('active'); 
                    }, 
                    mouseout: (e) => { 
                        geojsonLayer.resetStyle(e.target); 
                        const r = document.getElementById(`row-${f.properties.id}`); 
                        if(r) r.classList.remove('active'); 
                    }, 
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
            const filtered = utilitiesGeoJSON.features.filter(f => 
                f.properties.utility.toLowerCase().includes(query) || f.properties.region.toLowerCase().includes(query)
            );
            buildTable(filtered);
            geojsonLayer.clearLayers();
            geojsonLayer.addData({ "type": "FeatureCollection", "features": filtered });
        });
        
        window.addEventListener('resize', () => { map.invalidateSize(); });
    }

    // ==========================================
    // MAP 2: 50-YEAR BESPOKE FORECAST
    // ==========================================
    function initForecastMap() {
        const forecastMap = L.map('forecast-map-premium', { 
            scrollWheelZoom: false, 
            zoomControl: false,
            maxBounds: naBounds,
            maxBoundsViscosity: 1.0,
            minZoom: 3
        }).setView([56.0, -96.0], 4);
        L.control.zoom({ position: 'topright' }).addTo(forecastMap);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', { attribution: '&copy; CARTO', subdomains: 'abcd', maxZoom: 19 }).addTo(forecastMap);
        setTimeout(() => { forecastMap.invalidateSize(); }, 500);

        const regions = [
            { id: 'vancouver', name: 'Metro Vancouver', lat: 49.2827, lng: -123.1207, baseLoad: 35.0, mults: { base: 1.007, ev: 1.012, ai: 1.020, heat: 1.018, hydro: 1.005 } }, 
            { id: 'alberta', name: 'Calgary-Edmonton Corridor', lat: 51.0447, lng: -114.0719, baseLoad: 45.0, mults: { base: 1.006, ev: 1.015, ai: 1.015, heat: 1.012, hydro: 1.035 } }, 
            { id: 'sask', name: 'Saskatchewan Industrial Hub', lat: 52.1332, lng: -106.6700, baseLoad: 25.0, mults: { base: 1.004, ev: 1.010, ai: 1.005, heat: 1.010, hydro: 1.030 } }, 
            { id: 'manitoba', name: 'Winnipeg & Southern MB', lat: 49.8951, lng: -97.1384, baseLoad: 22.0, mults: { base: 1.005, ev: 1.012, ai: 1.010, heat: 1.015, hydro: 1.010 } }, 
            { id: 'toronto', name: 'Greater Toronto Area', lat: 43.6532, lng: -79.3832, baseLoad: 48.0, mults: { base: 1.008, ev: 1.010, ai: 1.025, heat: 1.015, hydro: 1.00 } }, 
            { id: 'k-w', name: 'Kitchener-Waterloo Tech Triangle', lat: 43.4516, lng: -80.4925, baseLoad: 14.0, mults: { base: 1.008, ev: 1.012, ai: 1.035, heat: 1.015, hydro: 1.00 } }, 
            { id: 'halton', name: 'Halton-Burlington-Hamilton', lat: 43.3255, lng: -79.7990, baseLoad: 16.0, mults: { base: 1.006, ev: 1.015, ai: 1.010, heat: 1.015, hydro: 1.010 } }, 
            { id: 'london', name: 'London & Middlesex Urban Core', lat: 42.9849, lng: -81.2453, baseLoad: 12.0, mults: { base: 1.005, ev: 1.018, ai: 1.010, heat: 1.015, hydro: 1.010 } }, 
            { id: 'windsor', name: 'Windsor-Essex (Industrial/Battery)', lat: 42.3149, lng: -83.0364, baseLoad: 18.0, mults: { base: 1.005, ev: 1.045, ai: 1.005, heat: 1.010, hydro: 1.020 } }, 
            { id: 'stthomas', name: 'Chatham-Kent / St. Thomas (EV Gigafactory)', lat: 42.7788, lng: -81.1895, baseLoad: 6.0, mults: { base: 1.005, ev: 1.065, ai: 1.00, heat: 1.010, hydro: 1.010 } }, 
            { id: 'ottawa', name: 'Ottawa Tech & Capital Corridor', lat: 45.4215, lng: -75.6972, baseLoad: 20.0, mults: { base: 1.008, ev: 1.010, ai: 1.030, heat: 1.015, hydro: 1.00 } }, 
            { id: 'sudbury', name: 'Sudbury & Mining North', lat: 46.4917, lng: -80.9930, baseLoad: 10.0, mults: { base: 1.002, ev: 1.020, ai: 1.00, heat: 1.010, hydro: 1.030 } }, 
            { id: 'montreal', name: 'Greater Montreal & Southern QC', lat: 45.5017, lng: -73.5673, baseLoad: 75.0, mults: { base: 1.007, ev: 1.012, ai: 1.020, heat: 1.018, hydro: 1.025 } }, 
            { id: 'halifax', name: 'Halifax & Maritimes Hub', lat: 44.6488, lng: -63.5752, baseLoad: 18.0, mults: { base: 1.004, ev: 1.015, ai: 1.008, heat: 1.020, hydro: 1.045 } }, 
            { id: 'stjohns', name: 'St. John\'s & Eastern NL', lat: 47.5615, lng: -52.7126, baseLoad: 10.0, mults: { base: 1.003, ev: 1.010, ai: 1.005, heat: 1.015, hydro: 1.035 } }, 
            { id: 'north', name: 'Territories & Mining North', lat: 62.4540, lng: -114.3718, baseLoad: 8.0, mults: { base: 1.002, ev: 1.010, ai: 1.00, heat: 1.010, hydro: 1.020 } } 
        ];

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
            } else {
                pill.innerText = `Baseline`;
            }
        }

        document.getElementById('yearSliderPrem').addEventListener('input', updateForecast);
        document.querySelectorAll('.scenario-group input').forEach(input => { input.addEventListener('change', updateForecast); });
        updateForecast();
        window.addEventListener('resize', () => { forecastMap.invalidateSize(); });
    }

    // ==========================================
    // MAP 3: PROVINCIAL CAPACITY DEFICIT
    // ==========================================
    function initDeficitMap() {
        const deficitMap = L.map('deficit-leaflet-map', { 
            scrollWheelZoom: false,
            maxBounds: naBounds,
            maxBoundsViscosity: 1.0,
            minZoom: 3
        }).setView([56.0, -96.0], 4);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', { attribution: '&copy; CARTO', subdomains: 'abcd', maxZoom: 19 }).addTo(deficitMap);
        setTimeout(() => { deficitMap.invalidateSize(); }, 500);

        const gridData = [
            { id: 'bc', name: 'BC Hydro', lat: 53.0, lng: -125.0, demand: 85, capacity: 78, unit: 'TWh' },
            { id: 'ab', name: 'AESO (Alberta)', lat: 54.0, lng: -115.0, demand: 110, capacity: 85, unit: 'TWh' },
            { id: 'sk', name: 'SaskPower (Saskatchewan)', lat: 52.5, lng: -105.5, demand: 38, capacity: 28, unit: 'TWh' },
            { id: 'mb', name: 'Manitoba Hydro', lat: 51.5, lng: -97.5, demand: 42, capacity: 38, unit: 'TWh' },
            { id: 'on', name: 'IESO (Ontario)', lat: 50.0, lng: -85.0, demand: 250, capacity: 155, unit: 'TWh' },
            { id: 'qc', name: 'Hydro-Québec', lat: 53.0, lng: -70.0, demand: 280, capacity: 250, unit: 'TWh' },
            { id: 'ns', name: 'Nova Scotia Power', lat: 45.0, lng: -63.5, demand: 18, capacity: 11, unit: 'TWh' },
            { id: 'nb', name: 'NB Power', lat: 46.5, lng: -66.0, demand: 25, capacity: 20, unit: 'TWh' },
            { id: 'nl', name: 'NL Hydro (Surplus)', lat: 53.5, lng: -60.0, demand: 15, capacity: 18, unit: 'TWh' }
        ];

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
                        <span style="color: #a1a1aa; font-size: 0.85rem;">2050 Demand</span>
                        <strong style="color: #3b82f6;">${grid.demand} ${grid.unit}</strong>
                    </div>
                    <div style="width: 100%; background: #27272a; height: 6px; border-radius: 3px; margin-bottom: 16px;">
                        <div style="width: 100%; background: #3b82f6; height: 100%; border-radius: 3px;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span style="color: #a1a1aa; font-size: 0.85rem;">Committed Capacity</span>
                        <strong style="color: #10b981;">${grid.capacity} ${grid.unit}</strong>
                    </div>
                    <div style="width: 100%; background: #27272a; height: 6px; border-radius: 3px; margin-bottom: 16px;">
                        <div style="width: ${(grid.capacity / grid.demand) * 100}%; background: #10b981; height: 100%; border-radius: 3px;"></div>
                    </div>
                    <div style="background: ${deficit > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'}; border: 1px solid ${deficit > 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}; padding: 12px; border-radius: 8px; text-align: center;">
                        <span style="display: block; color: ${markerColor}; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">${statusText}</span>
                        <strong style="color: ${markerColor}; font-size: 1.6rem; line-height: 1;">${Math.abs(deficit)} <span style="font-size: 1rem;">${grid.unit}</span></strong>
                    </div>
                </div>
            `;
            marker.bindPopup(popupHTML, { className: 'dark-tooltip', minWidth: 260 });
        });
        
        window.addEventListener('resize', () => { deficitMap.invalidateSize(); });
    }

    // ==========================================
    // MAP 4: OFF-GRID MICROGRIDS
    // ==========================================
    function initOffGridMap() {
        const offgridMap = L.map('offgrid-leaflet-map', { 
            scrollWheelZoom: false,
            maxBounds: naBounds,
            maxBoundsViscosity: 1.0,
            minZoom: 3
        }).setView([58.0, -90.0], 4);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', { attribution: '&copy; CARTO', maxZoom: 18 }).addTo(offgridMap);
        setTimeout(() => { offgridMap.invalidateSize(); }, 500);

        const offgridZones = {
            "type": "FeatureCollection",
            "features": [
                { "type": "Feature", "properties": { "id": "nu", "name": "Nunavut", "count": 25 }, "geometry": { "type": "Polygon", "coordinates": [[[-120.0, 60.0], [-102.0, 60.0], [-95.0, 60.0], [-80.0, 62.0], [-70.0, 62.0], [-60.0, 65.0], [-60.0, 83.0], [-120.0, 83.0], [-120.0, 60.0]]] } },
                { "type": "Feature", "properties": { "id": "nwt", "name": "Northwest Territories", "count": 16 }, "geometry": { "type": "Polygon", "coordinates": [[[-136.0, 60.0], [-120.0, 60.0], [-120.0, 75.0], [-136.0, 75.0], [-136.0, 60.0]]] } },
                { "type": "Feature", "properties": { "id": "on", "name": "Northern Ontario", "count": 21 }, "geometry": { "type": "Polygon", "coordinates": [[[-95.0, 51.5], [-85.0, 50.0], [-79.5, 51.5], [-82.0, 55.0], [-89.0, 56.0], [-95.0, 55.0], [-95.0, 51.5]]] } },
                { "type": "Feature", "properties": { "id": "qc", "name": "Nunavik (Quebec)", "count": 14 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.5, 55.0], [-70.0, 55.0], [-64.0, 60.5], [-72.0, 62.5], [-78.0, 62.5], [-79.5, 55.0]]] } },
                { "type": "Feature", "properties": { "id": "bc", "name": "Coastal & North BC", "count": 13 }, "geometry": { "type": "Polygon", "coordinates": [[[-139.0, 60.0], [-125.0, 60.0], [-120.0, 54.0], [-123.0, 49.0], [-128.0, 51.0], [-133.0, 54.5], [-139.0, 60.0]]] } },
                { "type": "Feature", "properties": { "id": "nl", "name": "Labrador Coast", "count": 11 }, "geometry": { "type": "Polygon", "coordinates": [[[-60.0, 51.5], [-55.0, 52.0], [-60.0, 60.0], [-64.0, 60.0], [-60.0, 51.5]]] } },
                { "type": "Feature", "properties": { "id": "mb", "name": "Northern Manitoba", "count": 4 }, "geometry": { "type": "Polygon", "coordinates": [[[-102.0, 56.0], [-90.0, 56.0], [-94.0, 60.0], [-102.0, 60.0], [-102.0, 56.0]]] } },
                { "type": "Feature", "properties": { "id": "yk", "name": "Yukon", "count": 4 }, "geometry": { "type": "Polygon", "coordinates": [[[-141.0, 60.0], [-136.0, 60.0], [-136.0, 70.0], [-141.0, 70.0], [-141.0, 60.0]]] } }
            ]
        };

        const zoneLayers = {};
        let geojsonLayer = L.geoJSON(offgridZones, {
            style: function(f) { return { fillColor: '#f59e0b', weight: 2, color: '#fcd34d', dashArray: '5, 5', fillOpacity: 0.15 }; },
            onEachFeature: function(f, layer) {
                zoneLayers[f.properties.id] = layer;
                layer.bindTooltip(`<b>${f.properties.name}</b><br/>${f.properties.count} Off-Grid Communities`, { className: 'dark-tooltip', direction: 'center' });
                layer.on('click', () => { mapFlyToZone(f.properties.id); });
            }
        }).addTo(offgridMap);

        const directoryData = [
            { id: 'nu', region: 'Nunavut', comms: ['Arctic Bay', 'Arviat', 'Baker Lake', 'Cambridge Bay', 'Cape Dorset', 'Chesterfield Inlet', 'Clyde River', 'Coral Harbour', 'Gjoa Haven', 'Grise Fiord', 'Hall Beach', 'Igloolik', 'Iqaluit', 'Kimmirut', 'Kugaaruk', 'Kugluktuk', 'Naujaat', 'Pangnirtung', 'Pond Inlet', 'Qikiqtarjuaq', 'Rankin Inlet', 'Resolute', 'Sanikiluaq', 'Taloyoak', 'Whale Cove'] },
            { id: 'nl', region: 'Labrador Coast (NL)', comms: ['Black Tickle', 'Cartwright', 'Charlottetown', 'Mary\'s Harbour', 'Norman Bay', 'Paradise River', 'Port Hope Simpson', 'Rigolet', 'Postville', 'Makkovik', 'Hopedale', 'Nain'] },
            { id: 'on', region: 'Northern Ontario', comms: ['Bearskin Lake', 'Cat Lake', 'Eabametoong', 'Kasabonika Lake', 'Keewaywin', 'Kingfisher Lake', 'Kitchenuhmaykoosib Inninuwug', 'Marten Falls', 'Muskrat Dam Lake', 'Neskantaga', 'Nibinamik', 'North Caribou Lake', 'North Spirit Lake', 'Peawanuck', 'Pikangikum', 'Poplar Hill', 'Sachigo Lake', 'Sandy Lake', 'Wapekeka', 'Wawakapewin', 'Webequie', 'Weenusk', 'Winisk'] },
            { id: 'nwt', region: 'Northwest Territories', comms: ['Aklavik', 'Colville Lake', 'Fort Good Hope', 'Fort Liard', 'Fort McPherson', 'Gamètì', 'Jean Marie River', 'Kakisa', 'Lutsel K\'e', 'Nahanni Butte', 'Norman Wells', 'Paulatuk', 'Sachs Harbour', 'Sambaa K\'e', 'Tsiigehtchic', 'Tuktoyaktuk', 'Ulukhaktok', 'Wekweètì', 'Whatì', 'Wrigley'] },
            { id: 'qc', region: 'Nunavik (Quebec)', comms: ['Aupaluk', 'Inukjuak', 'Ivujivik', 'Kangiqsualujjuaq', 'Kangiqsujuaq', 'Kangirsuk', 'Kuujjuaq', 'Kuujjuarapik', 'Puvirnituq', 'Quaqtaq', 'Salluit', 'Tasiujaq', 'Umiujaq'] },
            { id: 'bc', region: 'Coastal & North BC', comms: ['Anahim Lake', 'Atlin', 'Bella Bella', 'Dease Lake', 'Eddontenajon', 'Good Hope Lake', 'Hartley Bay', 'Kwadacha', 'Telegraph Creek', 'Tsay Keh Dene', 'Iskut', 'Ahousaht', 'Hot Springs Cove', 'Kingcome Inlet', 'Klemtu', 'Ocean Falls', 'Rivers Inlet'] },
            { id: 'mb', region: 'Northern Manitoba', comms: ['Brochet', 'Lac Brochet', 'Shamattawa', 'Tadoule Lake'] },
            { id: 'yk', region: 'Yukon', comms: ['Old Crow', 'Burwash Landing', 'Destruction Bay', 'Beaver Creek'] }
        ];

        const listContainer = document.getElementById('offgrid-list-container');

        function renderDirectory(data) {
            listContainer.innerHTML = '';
            data.forEach(zone => {
                const div = document.createElement('div');
                div.className = 'offgrid-item';
                div.id = `dir-${zone.id}`;
                div.innerHTML = `
                    <div class="offgrid-region-title">${zone.region} <span class="offgrid-badge">${zone.comms.length}</span></div>
                    <div class="offgrid-community-list">${zone.comms.slice(0, 8).join(', ')}${zone.comms.length > 8 ? '...' : ''}</div>
                `;
                div.addEventListener('click', () => { mapFlyToZone(zone.id); });
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
            geojsonLayer.eachLayer(layer => { geojsonLayer.resetStyle(layer); });
            const targetLayer = zoneLayers[id];
            if (targetLayer) {
                targetLayer.setStyle({ fillColor: '#f59e0b', fillOpacity: 0.4, weight: 3 });
                offgridMap.fitBounds(targetLayer.getBounds(), { padding: [20, 20] });
            }
        }

        document.getElementById('offgrid-search').addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = directoryData.filter(zone => {
                const matchRegion = zone.region.toLowerCase().includes(query);
                const matchComms = zone.comms.some(c => c.toLowerCase().includes(query));
                return matchRegion || matchComms;
            });
            renderDirectory(filtered);
        });

        window.addEventListener('resize', () => { offgridMap.invalidateSize(); });
    }

});

// Anti-Snooping Script (Deterrent for casual inspection)
document.addEventListener('contextmenu', event => event.preventDefault());

document.onkeydown = function (e) {
    if (e.keyCode === 123) { return false; } // F12
    if (e.ctrlKey && e.shiftKey && e.keyCode === 'I'.charCodeAt(0)) { return false; } // Ctrl+Shift+I
    if (e.ctrlKey && e.shiftKey && e.keyCode === 'J'.charCodeAt(0)) { return false; } // Ctrl+Shift+J
    if (e.ctrlKey && e.keyCode === 'U'.charCodeAt(0)) { return false; } // Ctrl+U
    if (e.ctrlKey && e.shiftKey && e.keyCode === 'C'.charCodeAt(0)) { return false; } // Ctrl+Shift+C
};
