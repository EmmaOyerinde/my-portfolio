// js/app.js
// Enterprise Logic Layer: Map Initialization, Custom Intellisense Controls & Complete National Database (93 Utilities)

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // COMPLETE & UNABRIDGED NATIONAL UTILITY DATABASE (93 ENTITIES)
    // ==========================================
    const db = {
        utilitiesGeoJSON: {
            "type": "FeatureCollection",
            "features": [
                /* --- 1. PROVINCIAL & TERRITORIAL CROWN CORPS --- */
                { "type": "Feature", "properties": { "id": "hq", "type_org": "provincial", "utility": "Hydro-Québec", "region": "Quebec", "customers": "4.4M", "line_km": "118,000", "density": "37", "mix": "99% Hydro", "saidi": 1.45, "saifi": 1.50 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.50, 51.50], [-79.50, 54.50], [-78.00, 62.50], [-72.00, 62.50], [-64.00, 60.50], [-64.00, 52.00], [-57.00, 51.50], [-64.00, 48.50], [-68.00, 47.00], [-71.00, 45.00], [-74.50, 45.00], [-76.00, 46.00], [-79.50, 51.50]]] } },
                { "type": "Feature", "properties": { "id": "bc", "type_org": "provincial", "utility": "BC Hydro", "region": "British Columbia", "customers": "2.1M", "line_km": "79,000", "density": "26", "mix": "98% Hydro", "saidi": 1.02, "saifi": 0.98 }, "geometry": { "type": "Polygon", "coordinates": [[[-139.05, 60.00], [-120.00, 60.00], [-120.00, 54.00], [-120.00, 49.00], [-123.00, 49.00], [-123.30, 48.30], [-124.00, 48.30], [-125.00, 48.80], [-128.00, 50.80], [-128.50, 51.00], [-130.00, 52.00], [-131.00, 54.00], [-133.00, 54.50], [-139.05, 60.00]]] } },
                { "type": "Feature", "properties": { "id": "ho", "type_org": "provincial", "utility": "Hydro One", "region": "Rural Ontario", "customers": "1.5M", "line_km": "125,000", "density": "12", "mix": "Nuclear/Hydro", "saidi": 2.50, "saifi": 1.80 }, "geometry": { "type": "MultiPolygon", "coordinates": [[[[-95.1, 49.0], [-95.1, 53.0], [-89.0, 56.5], [-82.0, 55.5], [-79.5, 51.5], [-74.3, 45.5], [-76.0, 44.0], [-76.5, 43.8], [-79.0, 44.2], [-80.5, 44.2], [-81.5, 43.8], [-82.5, 43.0], [-83.1, 42.0], [-82.4, 43.0], [-82.0, 44.0], [-81.5, 45.0], [-84.0, 46.0], [-88.0, 48.5], [-90.0, 48.0], [-95.1, 49.0]]], [[[-78.5, 44.0], [-76.5, 44.0], [-76.5, 45.0], [-78.5, 45.0], [-78.5, 44.0]]]] } },
                { "type": "Feature", "properties": { "id": "mh", "type_org": "provincial", "utility": "Manitoba Hydro", "region": "Manitoba", "customers": "608k", "line_km": "75,000", "density": "8.1", "mix": "97% Hydro", "saidi": 1.60, "saifi": 1.40 }, "geometry": { "type": "Polygon", "coordinates": [[[-102.00, 49.00], [-102.00, 60.00], [-95.00, 60.00], [-89.00, 56.50], [-95.00, 51.50], [-95.00, 49.00], [-102.00, 49.00]]] } },
                { "type": "Feature", "properties": { "id": "fa", "type_org": "provincial", "utility": "FortisAlberta", "region": "Alberta", "customers": "580k", "line_km": "124,000", "density": "4.6", "mix": "Gas/Wind/Solar", "saidi": 1.85, "saifi": 1.40 }, "geometry": { "type": "Polygon", "coordinates": [[[-120.0, 54.0], [-120.0, 60.0], [-110.0, 60.0], [-110.0, 49.0], [-114.0, 49.0], [-114.5, 50.0], [-115.0, 51.0], [-117.0, 52.0], [-119.0, 53.0], [-120.0, 54.0]]] } },
                { "type": "Feature", "properties": { "id": "skp", "type_org": "provincial", "utility": "SaskPower", "region": "Saskatchewan", "customers": "540k", "line_km": "157,000", "density": "3.4", "mix": "Gas/Wind/Hydro", "saidi": 2.10, "saifi": 2.30 }, "geometry": { "type": "Polygon", "coordinates": [[[-110.00, 49.00], [-110.00, 60.00], [-102.00, 60.00], [-101.50, 49.00], [-110.00, 49.00]]] } },
                { "type": "Feature", "properties": { "id": "nsp", "type_org": "provincial", "utility": "Nova Scotia Power", "region": "Nova Scotia", "customers": "520k", "line_km": "32,000", "density": "16", "mix": "Coal/Wind/Hydro", "saidi": 2.30, "saifi": 2.10 }, "geometry": { "type": "Polygon", "coordinates": [[[-66.15, 43.85], [-64.80, 45.00], [-64.30, 45.90], [-63.80, 46.00], [-63.00, 47.00], [-59.80, 47.00], [-59.80, 46.00], [-61.00, 45.30], [-63.50, 44.50], [-65.50, 43.40], [-66.15, 43.85]]] } },
                { "type": "Feature", "properties": { "id": "nbp", "type_org": "provincial", "utility": "NB Power", "region": "New Brunswick", "customers": "400k", "line_km": "21,000", "density": "19", "mix": "Nuclear/Hydro", "saidi": 2.50, "saifi": 2.00 }, "geometry": { "type": "Polygon", "coordinates": [[[-69.00, 47.30], [-68.00, 48.00], [-64.50, 48.00], [-64.00, 46.00], [-64.30, 45.90], [-66.15, 43.85], [-67.00, 45.00], [-67.80, 45.50], [-69.00, 47.30]]] } },
                { "type": "Feature", "properties": { "id": "nfp", "type_org": "provincial", "utility": "Newfoundland Power", "region": "Newfoundland", "customers": "270k", "line_km": "12,000", "density": "22", "mix": "Hydro", "saidi": 1.80, "saifi": 1.90 }, "geometry": { "type": "Polygon", "coordinates": [[[-59.50, 51.50], [-55.50, 51.50], [-52.50, 47.50], [-54.00, 46.60], [-59.50, 47.50], [-59.50, 51.50]]] } },
                { "type": "Feature", "properties": { "id": "me", "type_org": "provincial", "utility": "Maritime Electric", "region": "PEI", "customers": "86k", "line_km": "6,000", "density": "14", "mix": "Wind/Cable Import", "saidi": 3.00, "saifi": 2.50 }, "geometry": { "type": "Polygon", "coordinates": [[[-64.50, 46.50], [-63.80, 46.50], [-62.00, 46.30], [-62.00, 46.00], [-63.50, 46.00], [-64.50, 46.50]]] } },
                { "type": "Feature", "properties": { "id": "ntpc", "type_org": "provincial", "utility": "NWT Power Corp", "region": "Northwest Territories", "customers": "22k", "line_km": "2,500", "density": "9", "mix": "Hydro/Diesel", "saidi": 3.50, "saifi": 2.90 }, "geometry": { "type": "Polygon", "coordinates": [[[-136.0, 60.0], [-120.0, 60.0], [-120.0, 75.0], [-136.0, 75.0], [-136.0, 60.0]]] } },
                { "type": "Feature", "properties": { "id": "ye", "type_org": "provincial", "utility": "Yukon Energy", "region": "Yukon Territory", "customers": "18k", "line_km": "1,200", "density": "15", "mix": "Hydro/Diesel", "saidi": 2.80, "saifi": 2.20 }, "geometry": { "type": "Polygon", "coordinates": [[[-141.0, 60.0], [-136.0, 60.0], [-136.0, 70.0], [-141.0, 70.0], [-141.0, 60.0]]] } },
                { "type": "Feature", "properties": { "id": "qec", "type_org": "provincial", "utility": "Qulliq Energy Corp", "region": "Nunavut Territory", "customers": "15k", "line_km": "600", "density": "25", "mix": "100% Diesel", "saidi": 4.10, "saifi": 3.20 }, "geometry": { "type": "Polygon", "coordinates": [[[-120.0, 60.0], [-102.0, 60.0], [-95.0, 60.0], [-80.0, 62.0], [-70.0, 62.0], [-60.0, 65.0], [-60.0, 83.0], [-120.0, 83.0], [-120.0, 60.0]]] } },
                { "type": "Feature", "properties": { "id": "hydro-one-remote", "type_org": "provincial", "utility": "Hydro One Remote", "region": "Remote Ontario", "customers": "4K", "line_km": "1,200", "density": "3.3", "mix": "Diesel Microgrids", "saidi": 5.5, "saifi": 4.1 }, "geometry": { "type": "Polygon", "coordinates": [[[-94.00, 53.00], [-88.00, 56.00], [-80.00, 55.00], [-80.00, 52.00], [-88.00, 51.00], [-94.00, 53.00]]] } },

                /* --- 2. OUT OF PROVINCE MUNICIPAL & MINOR LDCs --- */
                { "type": "Feature", "properties": { "id": "enmax", "type_org": "municipal", "utility": "ENMAX Power", "region": "Calgary, AB", "customers": "520K", "line_km": "8,500", "density": "61", "mix": "Grid", "saidi": 0.85, "saifi": 0.75 }, "geometry": { "type": "Polygon", "coordinates": [[[-114.25, 50.85], [-114.25, 51.18], [-113.90, 51.18], [-113.90, 50.85], [-114.25, 50.85]]] } },
                { "type": "Feature", "properties": { "id": "epcor", "type_org": "municipal", "utility": "EPCOR Utilities", "region": "Edmonton, AB", "customers": "415K", "line_km": "6,000", "density": "69", "mix": "Grid", "saidi": 1.51, "saifi": 0.72 }, "geometry": { "type": "Polygon", "coordinates": [[[-113.70, 53.40], [-113.70, 53.65], [-113.30, 53.65], [-113.30, 53.40], [-113.70, 53.40]]] } },
                { "type": "Feature", "properties": { "id": "slp", "type_org": "municipal", "utility": "Saskatoon Light & Power", "region": "Saskatoon, SK", "customers": "112K", "line_km": "1,600", "density": "70", "mix": "Grid", "saidi": 0.95, "saifi": 0.85 }, "geometry": { "type": "Polygon", "coordinates": [[[-106.75, 52.05], [-106.75, 52.20], [-106.55, 52.20], [-106.55, 52.05], [-106.75, 52.05]]] } },
                { "type": "Feature", "properties": { "id": "sje", "type_org": "municipal", "utility": "Saint John Energy", "region": "Saint John, NB", "customers": "36K", "line_km": "900", "density": "40", "mix": "Grid", "saidi": 1.05, "saifi": 0.95 }, "geometry": { "type": "Polygon", "coordinates": [[[-66.15, 45.20], [-66.15, 45.35], [-65.95, 45.35], [-65.95, 45.20], [-66.15, 45.20]]] } },
                { "type": "Feature", "properties": { "id": "fortisbc", "type_org": "provincial", "utility": "FortisBC", "region": "Interior BC", "customers": "180K", "line_km": "7,350", "density": "24", "mix": "Hydro", "saidi": 1.15, "saifi": 1.25 }, "geometry": { "type": "Polygon", "coordinates": [[[-120.0, 49.0], [-119.0, 49.0], [-119.0, 50.0], [-120.0, 50.0], [-120.0, 49.0]]] } },
                { "type": "Feature", "properties": { "id": "lethbridge", "type_org": "municipal", "utility": "Lethbridge Electric", "region": "Lethbridge, AB", "customers": "40K", "line_km": "600", "density": "66", "mix": "Grid", "saidi": 0.85, "saifi": 0.95 }, "geometry": { "type": "Polygon", "coordinates": [[[-112.85, 49.68], [-112.75, 49.68], [-112.75, 49.75], [-112.85, 49.75], [-112.85, 49.68]]] } },
                { "type": "Feature", "properties": { "id": "medicine-hat", "type_org": "municipal", "utility": "Medicine Hat Electric", "region": "Medicine Hat, AB", "customers": "35K", "line_km": "550", "density": "63", "mix": "Gas", "saidi": 0.90, "saifi": 1.00 }, "geometry": { "type": "Polygon", "coordinates": [[[-110.75, 49.98], [-110.65, 49.98], [-110.65, 50.08], [-110.75, 50.08], [-110.75, 49.98]]] } },
                { "type": "Feature", "properties": { "id": "red-deer", "type_org": "municipal", "utility": "Red Deer Electric", "region": "Red Deer, AB", "customers": "42K", "line_km": "620", "density": "67", "mix": "Grid", "saidi": 0.88, "saifi": 0.96 }, "geometry": { "type": "Polygon", "coordinates": [[[-113.85, 52.25], [-113.75, 52.25], [-113.75, 52.32], [-113.85, 52.32], [-113.85, 52.25]]] } },
                { "type": "Feature", "properties": { "id": "nelson", "type_org": "municipal", "utility": "Nelson Hydro", "region": "Nelson, BC", "customers": "10K", "line_km": "200", "density": "50", "mix": "Hydro", "saidi": 1.05, "saifi": 1.15 }, "geometry": { "type": "Polygon", "coordinates": [[[-117.32, 49.48], [-117.25, 49.48], [-117.25, 49.52], [-117.32, 49.52], [-117.32, 49.48]]] } },
                { "type": "Feature", "properties": { "id": "penticton", "type_org": "municipal", "utility": "City of Penticton", "region": "Penticton, BC", "customers": "18K", "line_km": "250", "density": "72", "mix": "Grid", "saidi": 0.95, "saifi": 1.00 }, "geometry": { "type": "Polygon", "coordinates": [[[-119.62, 49.47], [-119.55, 49.47], [-119.55, 49.52], [-119.62, 49.52], [-119.62, 49.47]]] } },
                { "type": "Feature", "properties": { "id": "summerland", "type_org": "municipal", "utility": "District of Summerland", "region": "Summerland, BC", "customers": "6K", "line_km": "150", "density": "40", "mix": "Grid", "saidi": 1.10, "saifi": 1.20 }, "geometry": { "type": "Polygon", "coordinates": [[[-119.68, 49.58], [-119.62, 49.58], [-119.62, 49.62], [-119.68, 49.62], [-119.68, 49.58]]] } },
                { "type": "Feature", "properties": { "id": "new-west", "type_org": "municipal", "utility": "City of New Westminster", "region": "New West, BC", "customers": "35K", "line_km": "320", "density": "109", "mix": "Grid", "saidi": 0.70, "saifi": 0.85 }, "geometry": { "type": "Polygon", "coordinates": [[[-122.95, 49.18], [-122.88, 49.18], [-122.88, 49.23], [-122.95, 49.23], [-122.95, 49.18]]] } },
                { "type": "Feature", "properties": { "id": "sherbrooke", "type_org": "municipal", "utility": "Hydro-Sherbrooke", "region": "Sherbrooke, QC", "customers": "80K", "line_km": "1,200", "density": "66", "mix": "Hydro", "saidi": 0.88, "saifi": 0.98 }, "geometry": { "type": "Polygon", "coordinates": [[[-71.95, 45.38], [-71.85, 45.38], [-71.85, 45.45], [-71.95, 45.45], [-71.95, 45.38]]] } },
                { "type": "Feature", "properties": { "id": "magog", "type_org": "municipal", "utility": "Hydro-Magog", "region": "Magog, QC", "customers": "15K", "line_km": "220", "density": "68", "mix": "Hydro", "saidi": 0.95, "saifi": 1.05 }, "geometry": { "type": "Polygon", "coordinates": [[[-72.18, 45.25], [-72.10, 45.25], [-72.10, 45.30], [-72.18, 45.30], [-72.18, 45.25]]] } },
                { "type": "Feature", "properties": { "id": "alma", "type_org": "municipal", "utility": "Ville d'Alma", "region": "Alma, QC", "customers": "14K", "line_km": "200", "density": "70", "mix": "Hydro", "saidi": 0.92, "saifi": 1.02 }, "geometry": { "type": "Polygon", "coordinates": [[[-71.68, 48.53], [-71.60, 48.53], [-71.60, 48.60], [-71.68, 48.60], [-71.68, 48.53]]] } },
                { "type": "Feature", "properties": { "id": "baie-comeau", "type_org": "municipal", "utility": "Ville de Baie-Comeau", "region": "Baie-Comeau, QC", "customers": "10K", "line_km": "180", "density": "55", "mix": "Hydro", "saidi": 1.00, "saifi": 1.10 }, "geometry": { "type": "Polygon", "coordinates": [[[-68.20, 49.18], [-68.10, 49.18], [-68.10, 49.25], [-68.20, 49.25], [-68.20, 49.18]]] } },
                { "type": "Feature", "properties": { "id": "coaticook", "type_org": "municipal", "utility": "Ville de Coaticook", "region": "Coaticook, QC", "customers": "4K", "line_km": "100", "density": "40", "mix": "Hydro", "saidi": 1.15, "saifi": 1.25 }, "geometry": { "type": "Polygon", "coordinates": [[[-71.82, 45.12], [-71.78, 45.12], [-71.78, 45.16], [-71.82, 45.16], [-71.82, 45.12]]] } },
                { "type": "Feature", "properties": { "id": "joliette", "type_org": "municipal", "utility": "Ville de Joliette", "region": "Joliette, QC", "customers": "11K", "line_km": "160", "density": "68", "mix": "Hydro", "saidi": 0.90, "saifi": 1.00 }, "geometry": { "type": "Polygon", "coordinates": [[[-73.48, 46.00], [-73.42, 46.00], [-73.42, 46.05], [-73.48, 46.05], [-73.48, 46.00]]] } },
                { "type": "Feature", "properties": { "id": "summerside", "type_org": "municipal", "utility": "Summerside Electric", "region": "Summerside, PEI", "customers": "7K", "line_km": "120", "density": "58", "mix": "Wind/Grid", "saidi": 0.95, "saifi": 1.05 }, "geometry": { "type": "Polygon", "coordinates": [[[-63.82, 46.38], [-63.75, 46.38], [-63.75, 46.42], [-63.82, 46.42], [-63.82, 46.38]]] } },
                { "type": "Feature", "properties": { "id": "edmundston", "type_org": "municipal", "utility": "Edmundston Energy", "region": "Edmundston, NB", "customers": "8K", "line_km": "140", "density": "57", "mix": "Hydro/Grid", "saidi": 1.00, "saifi": 1.10 }, "geometry": { "type": "Polygon", "coordinates": [[[-68.35, 47.34], [-68.28, 47.34], [-68.28, 47.38], [-68.35, 47.38], [-68.35, 47.34]]] } },
                { "type": "Feature", "properties": { "id": "berwick", "type_org": "municipal", "utility": "Berwick Electric", "region": "Berwick, NS", "customers": "1.5K", "line_km": "40", "density": "37", "mix": "Hydro/Grid", "saidi": 1.10, "saifi": 1.20 }, "geometry": { "type": "Polygon", "coordinates": [[[-64.75, 45.02], [-64.72, 45.02], [-64.72, 45.05], [-64.75, 45.05], [-64.75, 45.02]]] } },
                { "type": "Feature", "properties": { "id": "mahone-bay", "type_org": "municipal", "utility": "Mahone Bay Electric", "region": "Mahone Bay, NS", "customers": "1K", "line_km": "30", "density": "33", "mix": "Wind/Grid", "saidi": 1.15, "saifi": 1.25 }, "geometry": { "type": "Polygon", "coordinates": [[[-64.39, 44.43], [-64.36, 44.43], [-64.36, 44.46], [-64.39, 44.46], [-64.39, 44.43]]] } },
                { "type": "Feature", "properties": { "id": "antigonish", "type_org": "municipal", "utility": "Antigonish Electric", "region": "Antigonish, NS", "customers": "2.5K", "line_km": "60", "density": "41", "mix": "Grid", "saidi": 1.05, "saifi": 1.15 }, "geometry": { "type": "Polygon", "coordinates": [[[-62.01, 45.60], [-61.97, 45.60], [-61.97, 45.64], [-62.01, 45.64], [-62.01, 45.60]]] } },
                { "type": "Feature", "properties": { "id": "northland", "type_org": "provincial", "utility": "Northland Utilities", "region": "NWT", "customers": "11K", "line_km": "350", "density": "31", "mix": "Hydro/Diesel", "saidi": 2.10, "saifi": 2.20 }, "geometry": { "type": "Polygon", "coordinates": [[[-114.40, 62.42], [-114.30, 62.42], [-114.30, 62.48], [-114.40, 62.48], [-114.40, 62.42]]] } },
                { "type": "Feature", "properties": { "id": "atco-yukon", "type_org": "provincial", "utility": "ATCO Electric Yukon", "region": "Yukon", "customers": "19K", "line_km": "450", "density": "42", "mix": "Hydro/Diesel", "saidi": 1.95, "saifi": 2.05 }, "geometry": { "type": "Polygon", "coordinates": [[[-135.10, 60.70], [-135.00, 60.70], [-135.00, 60.75], [-135.10, 60.75], [-135.10, 60.70]]] } },

                /* --- 3. ONTARIO LDCs (COMPLETE MUNICIPAL LIST) --- */
                { "type": "Feature", "properties": { "id": "alectra", "type_org": "municipal", "utility": "Alectra Utilities", "region": "GTA/Hamilton/Guelph", "customers": "1.1M", "line_km": "18,500", "density": "60", "mix": "Grid", "saidi": 0.85, "saifi": 1.05 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.90, 43.20], [-79.50, 43.50], [-79.40, 43.80], [-79.60, 44.00], [-80.10, 43.90], [-80.30, 43.50], [-79.90, 43.20]]] } },
                { "type": "Feature", "properties": { "id": "toronto-hydro", "type_org": "municipal", "utility": "Toronto Hydro", "region": "Toronto", "customers": "786K", "line_km": "16,000", "density": "49", "mix": "Grid", "saidi": 0.75, "saifi": 0.95 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.63, 43.58], [-79.55, 43.75], [-79.16, 43.82], [-79.12, 43.78], [-79.30, 43.66], [-79.54, 43.58], [-79.63, 43.58]]] } },
                { "type": "Feature", "properties": { "id": "hydro-ottawa", "type_org": "municipal", "utility": "Hydro Ottawa", "region": "Ottawa", "customers": "350K", "line_km": "5,800", "density": "60", "mix": "Grid", "saidi": 1.10, "saifi": 1.25 }, "geometry": {"type":"MultiPolygon","coordinates":[[[[-75.596496,45.470761],[-75.602103,45.469913],[-75.603915,45.469453],[-75.608137,45.469485],[-75.613454,45.469078],[-75.614302,45.469398],[-75.619652,45.468505],[-75.624336,45.467480],[-75.622421,45.466617],[-75.616819,45.466720],[-75.610174,45.467359],[-75.610527,45.468077],[-75.606898,45.468447],[-75.599619,45.469692],[-75.596496,45.470761]]],[[[-75.755568,45.409637],[-75.757064,45.409672],[-75.758143,45.408207],[-75.757280,45.407672],[-75.754158,45.409286],[-75.755568,45.409637]]],[[[-75.730607,45.416325],[-75.731928,45.415714],[-75.731298,45.414413],[-75.728476,45.413602],[-75.726627,45.413929],[-75.728130,45.416512],[-75.730607,45.416325]]],[[[-75.709380,45.422615],[-75.711181,45.422541],[-75.714453,45.421468],[-75.716625,45.419393],[-75.713694,45.419052],[-75.712978,45.420019],[-75.710136,45.421693],[-75.709380,45.422615]]],[[[-76.260339,45.464717],[-76.261003,45.463504],[-76.259713,45.463032],[-76.257059,45.464474],[-76.260339,45.464717]]],[[[-75.586399,45.471705],[-75.586828,45.471100],[-75.591971,45.469831],[-75.594666,45.470681],[-75.596537,45.468583],[-75.591649,45.468446],[-75.588689,45.469155],[-75.584193,45.471158],[-75.586399,45.471705]]],[[[-76.227755,45.477485],[-76.229079,45.476607],[-76.227562,45.474490],[-76.226129,45.473911],[-76.225851,45.472888],[-76.223266,45.471674],[-76.222759,45.470716],[-76.220255,45.470302],[-76.222222,45.473089],[-76.225140,45.474345],[-76.225778,45.476021],[-76.227192,45.475745],[-76.227755,45.477485]]],[[[-76.234105,45.483547],[-76.234427,45.483066],[-76.233685,45.480698],[-76.230857,45.480116],[-76.230777,45.481152],[-76.232237,45.482937],[-76.234105,45.483547]]],[[[-75.512705,45.493878],[-75.516660,45.493824],[-75.514808,45.492842],[-75.512705,45.493878]]],[[[-75.376486,45.525589],[-75.375938,45.524060],[-75.374051,45.525345],[-75.376486,45.525589]]],[[[-75.351478,45.527891],[-75.349136,45.530122],[-75.353723,45.528425],[-75.354866,45.526999],[-75.351885,45.527350],[-75.351478,45.527891]]],[[[-75.337388,45.530467],[-75.339790,45.530726],[-75.340320,45.531535],[-75.338237,45.531953],[-75.338324,45.532105],[-75.340808,45.531650],[-75.342130,45.530044],[-75.343573,45.529392],[-75.342146,45.528469],[-75.339261,45.527883],[-75.336061,45.528144],[-75.336370,45.528684],[-75.337804,45.528410],[-75.339844,45.529079],[-75.337278,45.530273],[-75.337388,45.530467]]]]} },
                { "type": "Feature", "properties": { "id": "elexicon", "type_org": "municipal", "utility": "Elexicon Energy", "region": "Durham Region", "customers": "175K", "line_km": "4,500", "density": "38", "mix": "Grid", "saidi": 0.95, "saifi": 1.10 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.10, 43.84], [-79.14, 44.02], [-78.85, 43.98], [-78.75, 43.85], [-78.90, 43.82], [-79.10, 43.84]]] } },
                { "type": "Feature", "properties": { "id": "london-hydro", "type_org": "municipal", "utility": "London Hydro", "region": "London", "customers": "165K", "line_km": "3,100", "density": "53", "mix": "Grid", "saidi": 0.85, "saifi": 1.00 }, "geometry": { "type": "Polygon", "coordinates": [[[-81.35, 42.90], [-81.35, 43.05], [-81.15, 43.05], [-81.15, 42.90], [-81.35, 42.90]]] } },
                { "type": "Feature", "properties": { "id": "enova", "type_org": "municipal", "utility": "Enova Power", "region": "Kitchener/Waterloo", "customers": "160K", "line_km": "3,800", "density": "42", "mix": "Grid", "saidi": 0.90, "saifi": 1.05 }, "geometry": { "type": "Polygon", "coordinates": [[[-80.60, 43.35], [-80.65, 43.45], [-80.55, 43.55], [-80.45, 43.52], [-80.40, 43.42], [-80.60, 43.35]]] } },
                { "type": "Feature", "properties": { "id": "grandbridge", "type_org": "municipal", "utility": "GrandBridge Energy", "region": "Brantford/Cambridge", "customers": "110K", "line_km": "3,200", "density": "34", "mix": "Grid", "saidi": 1.05, "saifi": 1.10 }, "geometry": { "type": "Polygon", "coordinates": [[[-80.40, 43.15], [-80.40, 43.25], [-80.30, 43.42], [-80.20, 43.40], [-80.15, 43.20], [-80.40, 43.15]]] } },
                { "type": "Feature", "properties": { "id": "enwin", "type_org": "municipal", "utility": "ENWIN Utilities", "region": "Windsor", "customers": "91K", "line_km": "1,100", "density": "82", "mix": "Grid", "saidi": 0.88, "saifi": 0.98 }, "geometry": { "type": "Polygon", "coordinates": [[[-83.10, 42.25], [-83.10, 42.35], [-82.90, 42.35], [-82.90, 42.25], [-83.10, 42.25]]] } },
                { "type": "Feature", "properties": { "id": "niagara-pen", "type_org": "municipal", "utility": "Niagara Peninsula Energy", "region": "Niagara Region", "customers": "85K", "line_km": "2,200", "density": "38", "mix": "Grid", "saidi": 1.20, "saifi": 1.30 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.35, 42.90], [-79.40, 43.10], [-79.25, 43.20], [-79.10, 43.15], [-79.05, 42.95], [-79.35, 42.90]]] } },
                { "type": "Feature", "properties": { "id": "oakville", "type_org": "municipal", "utility": "Oakville Hydro", "region": "Oakville", "customers": "74K", "line_km": "1,800", "density": "41.1", "mix": "Grid", "saidi": 0.85, "saifi": 0.90 }, "geometry": {"type":"Polygon","coordinates":[[[-79.625065,43.481349],[-79.645403,43.496293],[-79.663821,43.509701],[-79.681675,43.522768],[-79.697278,43.508325],[-79.697445,43.508318],[-79.715900,43.521947],[-79.724821,43.528255],[-79.772399,43.484786],[-79.777424,43.485537],[-79.786406,43.486637],[-79.797114,43.476922],[-79.808118,43.466784],[-79.802952,43.455705],[-79.801360,43.453807],[-79.795212,43.449253],[-79.810949,43.434760],[-79.792701,43.421491],[-79.775211,43.408879],[-79.756537,43.395344],[-79.738002,43.381743],[-79.724475,43.371753],[-79.722834,43.372949],[-79.720809,43.372980],[-79.719442,43.374604],[-79.717780,43.375585],[-79.716806,43.377267],[-79.716302,43.379503],[-79.713491,43.383443],[-79.713136,43.385573],[-79.711748,43.388781],[-79.710053,43.390680],[-79.709757,43.392378],[-79.708091,43.392341],[-79.705875,43.395531],[-79.703417,43.397880],[-79.700516,43.400134],[-79.698007,43.400790],[-79.695331,43.402326],[-79.692430,43.403437],[-79.691098,43.405078],[-79.691179,43.410491],[-79.690952,43.413009],[-79.690036,43.414800],[-79.687924,43.415397],[-79.686248,43.416359],[-79.684811,43.418819],[-79.684263,43.423612],[-79.682987,43.425443],[-79.679328,43.427283],[-79.679158,43.429415],[-79.677940,43.431445],[-79.676626,43.432249],[-79.673978,43.434650],[-79.669708,43.437806],[-79.669090,43.438951],[-79.666562,43.439858],[-79.664999,43.443478],[-79.659325,43.449147],[-79.655958,43.451052],[-79.654129,43.452688],[-79.653734,43.454367],[-79.651017,43.456478],[-79.649344,43.458943],[-79.648348,43.459796],[-79.645695,43.460683],[-79.644436,43.461731],[-79.643857,43.465532],[-79.641565,43.468486],[-79.636462,43.472198],[-79.634459,43.472750],[-79.632866,43.474307],[-79.629660,43.475583],[-79.629184,43.476397],[-79.626885,43.477981],[-79.625065,43.481349]]]} },
                { "type": "Feature", "properties": { "id": "burlington", "type_org": "municipal", "utility": "Burlington Hydro", "region": "Burlington", "customers": "69K", "line_km": "1,500", "density": "46", "mix": "Grid", "saidi": 0.90, "saifi": 0.95 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.85, 43.30], [-79.88, 43.43], [-79.78, 43.48], [-79.76, 43.38], [-79.80, 43.33], [-79.85, 43.30]]] } },
                { "type": "Feature", "properties": { "id": "entegrus", "type_org": "municipal", "utility": "Entegrus Powerlines", "region": "Chatham-Kent", "customers": "60K", "line_km": "2,100", "density": "28", "mix": "Grid", "saidi": 1.05, "saifi": 1.15 }, "geometry": { "type": "Polygon", "coordinates": [[[-82.25, 42.20], [-82.40, 42.45], [-82.00, 42.60], [-81.70, 42.60], [-81.80, 42.30], [-82.00, 42.25], [-82.25, 42.20]]] } },
                { "type": "Feature", "properties": { "id": "oshawa", "type_org": "municipal", "utility": "Oshawa PUC Networks", "region": "Oshawa", "customers": "60K", "line_km": "1,500", "density": "40", "mix": "Grid", "saidi": 0.95, "saifi": 1.00 }, "geometry": { "type": "Polygon", "coordinates": [[[-78.90, 43.85], [-78.95, 43.95], [-78.85, 44.05], [-78.75, 43.90], [-78.90, 43.85]]] } },
                { "type": "Feature", "properties": { "id": "synergy", "type_org": "municipal", "utility": "Synergy North", "region": "Thunder Bay/Kenora", "customers": "56K", "line_km": "2,200", "density": "25", "mix": "Grid", "saidi": 1.25, "saifi": 1.30 }, "geometry": { "type": "Polygon", "coordinates": [[[-89.35, 48.38], [-89.30, 48.48], [-89.15, 48.45], [-89.10, 48.35], [-89.20, 48.30], [-89.35, 48.38]]] } },
                { "type": "Feature", "properties": { "id": "newmarket-tay", "type_org": "municipal", "utility": "Newmarket-Tay Power", "region": "Newmarket/Midland", "customers": "48K", "line_km": "1,600", "density": "30", "mix": "Grid", "saidi": 1.15, "saifi": 1.25 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.50, 44.02], [-79.52, 44.10], [-79.40, 44.15], [-79.35, 44.05], [-79.50, 44.02]]] } },
                { "type": "Feature", "properties": { "id": "greater-sudbury", "type_org": "municipal", "utility": "Greater Sudbury Hydro", "region": "Sudbury", "customers": "47K", "line_km": "1,100", "density": "42", "mix": "Grid", "saidi": 1.10, "saifi": 1.20 }, "geometry": { "type": "Polygon", "coordinates": [[[-81.05, 46.45], [-81.10, 46.55], [-80.95, 46.65], [-80.85, 46.50], [-81.05, 46.45]]] } },
                { "type": "Feature", "properties": { "id": "milton", "type_org": "municipal", "utility": "Milton Hydro", "region": "Milton", "customers": "40K", "line_km": "1,400", "density": "28", "mix": "Grid", "saidi": 0.85, "saifi": 0.95 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.95, 43.48], [-80.00, 43.58], [-79.85, 43.60], [-79.80, 43.50], [-79.95, 43.48]]] } },
                { "type": "Feature", "properties": { "id": "elexicon-belleville", "type_org": "municipal", "utility": "Elexicon Energy", "region": "Belleville", "customers": "40K", "line_km": "1,000", "density": "40.0", "mix": "Grid", "saidi": 0.95, "saifi": 1.10 }, "geometry": {"type":"Polygon","coordinates":[[[-77.319947,44.153734],[-77.320266,44.153899],[-77.320630,44.153603],[-77.320004,44.153598],[-77.319947,44.153734]]]} },
                { "type": "Feature", "properties": { "id": "bluewater", "type_org": "municipal", "utility": "Bluewater Power", "region": "Sarnia", "customers": "36K", "line_km": "1,200", "density": "30.0", "mix": "Grid", "saidi": 1.05, "saifi": 1.15 }, "geometry": {"type":"MultiPolygon","coordinates":[[[[-82.229862,43.038464],[-82.233497,43.037697],[-82.239284,43.036716],[-82.240752,43.035854],[-82.252433,43.033764],[-82.257727,43.032715],[-82.268008,43.031269],[-82.273872,43.030537],[-82.278472,43.029792],[-82.282685,43.029331],[-82.293379,43.027734],[-82.298877,43.027086],[-82.304721,43.026587],[-82.316570,43.025092],[-82.330130,43.022738],[-82.330566,43.022490],[-82.339500,43.021305],[-82.348636,43.020423],[-82.354282,43.019312],[-82.359961,43.018660],[-82.366656,43.017265],[-82.372519,43.016609],[-82.378465,43.015773],[-82.379388,43.015365],[-82.385180,43.014233],[-82.388496,43.012761],[-82.389945,43.011707],[-82.397983,43.007386],[-82.401560,43.006604],[-82.405589,43.005186],[-82.408275,43.004595],[-82.411839,43.004326],[-82.410988,43.002535],[-82.410973,43.001347],[-82.413049,43.001456],[-82.415299,43.001113],[-82.415586,43.002397],[-82.418118,43.002582],[-82.419828,43.000158],[-82.400166,43.001782],[-82.395610,43.002605],[-82.395980,42.992334],[-82.394550,42.991491],[-82.396374,42.990402],[-82.399623,42.985560],[-82.405452,42.985698],[-82.415799,42.985561],[-82.414883,42.984603],[-82.413232,42.984254],[-82.409626,42.984290],[-82.409756,42.982973],[-82.413645,42.983042],[-82.414320,42.981989],[-82.413973,42.980733],[-82.412488,42.980706],[-82.411140,42.981840],[-82.409326,42.982429],[-82.406881,42.982234],[-82.406194,42.981711],[-82.406514,42.979042],[-82.407372,42.977960],[-82.407742,42.976434],[-82.408840,42.975123],[-82.409408,42.972037],[-82.411073,42.967667],[-82.413285,42.964623],[-82.418848,42.958619],[-82.420495,42.957221],[-82.422704,42.954619],[-82.423870,42.952569],[-82.426186,42.950406],[-82.426068,42.950056],[-82.429776,42.946597],[-82.430717,42.946504],[-82.432475,42.944591],[-82.433252,42.944284],[-82.441547,42.938894],[-82.444228,42.936636],[-82.446772,42.933812],[-82.448166,42.931587],[-82.450625,42.926746],[-82.453182,42.921107],[-82.455144,42.915715],[-82.455917,42.912507],[-82.424899,42.912262],[-82.376827,42.911722],[-82.376689,42.922086],[-82.356715,42.921844],[-82.356692,42.923409],[-82.331668,42.922859],[-82.301745,42.922155],[-82.234121,42.920733],[-82.233714,42.932604],[-82.232763,42.957291],[-82.232335,42.969490],[-82.231414,42.993427],[-82.230999,43.006208],[-82.229862,43.038464]]],[[[-82.432321,42.930910],[-82.433618,42.928764],[-82.434402,42.929136],[-82.433108,42.931282],[-82.432321,42.930910]]],[[[-82.423393,42.929591],[-82.424489,42.928619],[-82.424611,42.927465],[-82.428317,42.929217],[-82.426883,42.929705],[-82.423393,42.929591]]],[[[-82.433362,42.922667],[-82.424782,42.922511],[-82.424974,42.917039],[-82.435566,42.917285],[-82.433362,42.922667]]],[[[-82.417005,42.929501],[-82.417133,42.916859],[-82.424728,42.917033],[-82.424337,42.928157],[-82.423834,42.929105],[-82.422262,42.929601],[-82.417005,42.929501]]],[[[-82.416750,42.930912],[-82.416730,42.933021],[-82.413048,42.932941],[-82.413610,42.931481],[-82.413646,42.929569],[-82.416762,42.929633],[-82.416750,42.930912]]],[[[-82.397532,42.933146],[-82.399007,42.933177],[-82.398960,42.936160],[-82.396876,42.933745],[-82.397532,42.933146]]],[[[-82.436964,42.916042],[-82.438175,42.912457],[-82.448268,42.912536],[-82.454680,42.915501],[-82.452942,42.921066],[-82.450396,42.926677],[-82.447759,42.931394],[-82.435807,42.925734],[-82.436534,42.924015],[-82.433999,42.922816],[-82.436242,42.917300],[-82.436964,42.916042]]],[[[-82.413637,42.929364],[-82.413487,42.925359],[-82.413580,42.914363],[-82.413708,42.912472],[-82.416929,42.912268],[-82.416756,42.929497],[-82.413637,42.929364]]],[[[-82.398646,42.929648],[-82.396928,42.929611],[-82.397118,42.912031],[-82.410609,42.912198],[-82.412728,42.912524],[-82.412846,42.913937],[-82.412744,42.925453],[-82.412528,42.929411],[-82.401364,42.929180],[-82.398646,42.929648]]],[[[-82.392925,42.911984],[-82.396871,42.912023],[-82.396672,42.930380],[-82.394519,42.930329],[-82.394542,42.927997],[-82.392768,42.927987],[-82.392925,42.911984]]],[[[-82.379241,42.913301],[-82.378727,42.911832],[-82.392328,42.911978],[-82.392171,42.927984],[-82.391904,42.927983],[-82.379241,42.913301]]],[[[-82.390113,42.932439],[-82.376807,42.932118],[-82.377072,42.911814],[-82.378340,42.911828],[-82.378894,42.913411],[-82.391459,42.927980],[-82.391383,42.930253],[-82.390141,42.930224],[-82.390113,42.932439]]],[[[-82.407785,42.932829],[-82.399202,42.932645],[-82.399231,42.930818],[-82.399748,42.929823],[-82.401358,42.929315],[-82.412527,42.929547],[-82.412215,42.932923],[-82.407785,42.932829]]],[[[-82.396652,42.936153],[-82.376760,42.935668],[-82.376797,42.932887],[-82.396093,42.933351],[-82.396627,42.933969],[-82.396652,42.936153]]],[[[-82.411875,42.933476],[-82.408056,42.936007],[-82.405988,42.936377],[-82.399145,42.936220],[-82.399194,42.933181],[-82.411875,42.933476]]],[[[-82.416694,42.936595],[-82.413808,42.936482],[-82.411453,42.934799],[-82.412758,42.933470],[-82.416724,42.933556],[-82.416694,42.936595]]]]} },
                { "type": "Feature", "properties": { "id": "puc-ssm", "type_org": "municipal", "utility": "PUC Distribution", "region": "Sault Ste. Marie", "customers": "33K", "line_km": "1,000", "density": "33", "mix": "Grid", "saidi": 1.15, "saifi": 1.25 }, "geometry": { "type": "Polygon", "coordinates": [[[-84.40, 46.45], [-84.40, 46.60], [-84.20, 46.60], [-84.20, 46.45], [-84.40, 46.45]]] } },
                { "type": "Feature", "properties": { "id": "essex", "type_org": "municipal", "utility": "Essex Powerlines", "region": "Essex County", "customers": "30K", "line_km": "850", "density": "35", "mix": "Grid", "saidi": 1.00, "saifi": 1.10 }, "geometry": { "type": "Polygon", "coordinates": [[[-83.10, 42.15], [-83.10, 42.30], [-82.80, 42.30], [-82.80, 42.15], [-83.10, 42.15]]] } },
                { "type": "Feature", "properties": { "id": "kingston", "type_org": "municipal", "utility": "Kingston Hydro", "region": "Kingston", "customers": "28K", "line_km": "700", "density": "40.0", "mix": "Grid", "saidi": 0.95, "saifi": 1.05 }, "geometry": { "type": "Polygon", "coordinates": [[[-76.60, 44.20], [-76.60, 44.30], [-76.40, 44.30], [-76.40, 44.20], [-76.60, 44.20]]] } },
                { "type": "Feature", "properties": { "id": "cn-power", "type_org": "municipal", "utility": "Canadian Niagara Power", "region": "Fort Erie", "customers": "28K", "line_km": "800", "density": "35", "mix": "Grid", "saidi": 1.10, "saifi": 1.20 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.05, 42.88], [-79.05, 42.95], [-78.90, 42.95], [-78.90, 42.88], [-79.05, 42.88]]] } },
                { "type": "Feature", "properties": { "id": "cornwall", "type_org": "municipal", "utility": "Cornwall Electric", "region": "Cornwall", "customers": "25K", "line_km": "600", "density": "41", "mix": "Grid", "saidi": 0.85, "saifi": 0.95 }, "geometry": { "type": "Polygon", "coordinates": [[[-74.78, 44.98], [-74.78, 45.05], [-74.65, 45.05], [-74.65, 44.98], [-74.78, 44.98]]] } },
                { "type": "Feature", "properties": { "id": "welland", "type_org": "municipal", "utility": "Welland Hydro", "region": "Welland", "customers": "24K", "line_km": "800", "density": "30", "mix": "Grid", "saidi": 1.00, "saifi": 1.10 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.30, 42.95], [-79.30, 43.05], [-79.15, 43.05], [-79.15, 42.95], [-79.30, 42.95]]] } },
                { "type": "Feature", "properties": { "id": "erth", "type_org": "municipal", "utility": "ERTH Power", "region": "Oxford/Elgin", "customers": "24K", "line_km": "900", "density": "26", "mix": "Grid", "saidi": 1.15, "saifi": 1.25 }, "geometry": { "type": "Polygon", "coordinates": [[[-81.05, 42.75], [-81.05, 43.10], [-80.70, 43.10], [-80.70, 42.75], [-81.05, 42.75]]] } },
                { "type": "Feature", "properties": { "id": "north-bay", "type_org": "municipal", "utility": "North Bay Hydro", "region": "North Bay", "customers": "24K", "line_km": "850", "density": "28", "mix": "Grid", "saidi": 1.20, "saifi": 1.30 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.50, 46.28], [-79.50, 46.40], [-79.35, 46.40], [-79.35, 46.28], [-79.50, 46.28]]] } },
                { "type": "Feature", "properties": { "id": "halton-hills", "type_org": "municipal", "utility": "Halton Hills Hydro", "region": "Halton Hills", "customers": "23K", "line_km": "950", "density": "24", "mix": "Grid", "saidi": 1.05, "saifi": 1.15 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.95, 43.62], [-79.95, 43.72], [-79.80, 43.72], [-79.80, 43.62], [-79.95, 43.62]]] } },
                { "type": "Feature", "properties": { "id": "epcor-on", "type_org": "municipal", "utility": "EPCOR Electricity ON", "region": "Collingwood", "customers": "21K", "line_km": "750", "density": "28", "mix": "Grid", "saidi": 1.10, "saifi": 1.20 }, "geometry": { "type": "Polygon", "coordinates": [[[-80.25, 44.45], [-80.25, 44.60], [-80.10, 44.60], [-80.10, 44.45], [-80.25, 44.45]]] } },
                { "type": "Feature", "properties": { "id": "festival", "type_org": "municipal", "utility": "Festival Hydro", "region": "Stratford", "customers": "20K", "line_km": "650", "density": "30", "mix": "Grid", "saidi": 1.05, "saifi": 1.15 }, "geometry": { "type": "Polygon", "coordinates": [[[-81.00, 43.35], [-81.00, 43.42], [-80.85, 43.42], [-80.85, 43.35], [-81.00, 43.35]]] } },
                { "type": "Feature", "properties": { "id": "innpower", "type_org": "municipal", "utility": "InnPower", "region": "Innisfil", "customers": "19K", "line_km": "850", "density": "22", "mix": "Grid", "saidi": 1.25, "saifi": 1.35 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.60, 44.28], [-79.60, 44.40], [-79.45, 44.40], [-79.45, 44.28], [-79.60, 44.28]]] } },
                { "type": "Feature", "properties": { "id": "lakeland", "type_org": "municipal", "utility": "Lakeland Power", "region": "Muskoka", "customers": "14K", "line_km": "900", "density": "15", "mix": "Grid", "saidi": 1.40, "saifi": 1.50 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.35, 45.05], [-79.35, 45.35], [-79.10, 45.35], [-79.10, 45.05], [-79.35, 45.05]]] } },
                { "type": "Feature", "properties": { "id": "wasaga", "type_org": "municipal", "utility": "Wasaga Distribution", "region": "Wasaga Beach", "customers": "14K", "line_km": "500", "density": "28", "mix": "Grid", "saidi": 1.10, "saifi": 1.20 }, "geometry": { "type": "Polygon", "coordinates": [[[-80.05, 44.48], [-80.05, 44.58], [-79.90, 44.58], [-79.90, 44.48], [-80.05, 44.48]]] } },
                { "type": "Feature", "properties": { "id": "orangeville", "type_org": "municipal", "utility": "Orangeville Hydro", "region": "Orangeville", "customers": "12K", "line_km": "400", "density": "30", "mix": "Grid", "saidi": 1.05, "saifi": 1.15 }, "geometry": { "type": "Polygon", "coordinates": [[[-80.15, 43.92], [-80.15, 44.02], [-80.00, 44.02], [-80.00, 43.92], [-80.15, 43.92]]] } },
                { "type": "Feature", "properties": { "id": "algoma", "type_org": "municipal", "utility": "Algoma Power", "region": "Algoma", "customers": "12K", "line_km": "1,800", "density": "6", "mix": "Grid", "saidi": 1.60, "saifi": 1.70 }, "geometry": { "type": "Polygon", "coordinates": [[[-84.45, 46.55], [-84.45, 47.20], [-83.45, 47.20], [-83.45, 46.55], [-84.45, 46.55]]] } },
                { "type": "Feature", "properties": { "id": "elk", "type_org": "municipal", "utility": "E.L.K. Energy", "region": "Essex County", "customers": "12K", "line_km": "400", "density": "30", "mix": "Grid", "saidi": 1.15, "saifi": 1.25 }, "geometry": { "type": "Polygon", "coordinates": [[[-82.85, 42.05], [-82.85, 42.20], [-82.70, 42.20], [-82.70, 42.05], [-82.85, 42.05]]] } },
                { "type": "Feature", "properties": { "id": "ottawa-river", "type_org": "municipal", "utility": "Ottawa River Power", "region": "Eastern Ontario", "customers": "11K", "line_km": "450", "density": "24", "mix": "Grid", "saidi": 1.20, "saifi": 1.30 }, "geometry": { "type": "Polygon", "coordinates": [[[-77.15, 45.75], [-77.15, 45.92], [-76.95, 45.92], [-76.95, 45.75], [-77.15, 45.75]]] } },
                { "type": "Feature", "properties": { "id": "lakefront", "type_org": "municipal", "utility": "Lakefront Utilities", "region": "Cobourg", "customers": "10K", "line_km": "350", "density": "28", "mix": "Grid", "saidi": 1.05, "saifi": 1.15 }, "geometry": { "type": "Polygon", "coordinates": [[[-78.22, 43.98], [-78.22, 44.08], [-78.08, 44.08], [-78.08, 43.98], [-78.22, 43.98]]] } },
                { "type": "Feature", "properties": { "id": "notl", "type_org": "municipal", "utility": "Niagara-on-the-Lake Hydro", "region": "NOTL", "customers": "9K", "line_km": "400", "density": "22", "mix": "Grid", "saidi": 1.15, "saifi": 1.25 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.15, 43.22], [-79.15, 43.32], [-79.05, 43.32], [-79.05, 43.22], [-79.15, 43.22]]] } },
                { "type": "Feature", "properties": { "id": "cw", "type_org": "municipal", "utility": "Centre Wellington Hydro", "region": "Elora/Fergus", "customers": "7K", "line_km": "300", "density": "23", "mix": "Grid", "saidi": 1.10, "saifi": 1.20 }, "geometry": { "type": "Polygon", "coordinates": [[[-80.42, 43.68], [-80.42, 43.78], [-80.32, 43.78], [-80.32, 43.68], [-80.42, 43.68]]] } },
                { "type": "Feature", "properties": { "id": "tillsonburg", "type_org": "municipal", "utility": "Tillsonburg Hydro", "region": "Tillsonburg", "customers": "7K", "line_km": "250", "density": "28", "mix": "Grid", "saidi": 1.05, "saifi": 1.15 }, "geometry": { "type": "Polygon", "coordinates": [[[-80.75, 42.82], [-80.75, 42.95], [-80.62, 42.95], [-80.62, 42.82], [-80.75, 42.82]]] } },
                { "type": "Feature", "properties": { "id": "rideau", "type_org": "municipal", "utility": "Rideau St. Lawrence", "region": "Eastern Ontario", "customers": "6K", "line_km": "250", "density": "24", "mix": "Grid", "saidi": 1.20, "saifi": 1.30 }, "geometry": { "type": "Polygon", "coordinates": [[[-75.75, 44.75], [-75.75, 44.90], [-75.58, 44.90], [-75.58, 44.75], [-75.75, 44.75]]] } },
                { "type": "Feature", "properties": { "id": "northern-wires", "type_org": "municipal", "utility": "Northern Ontario Wires", "region": "Cochrane", "customers": "6K", "line_km": "300", "density": "20", "mix": "Grid", "saidi": 1.35, "saifi": 1.45 }, "geometry": { "type": "Polygon", "coordinates": [[[-81.05, 49.05], [-81.05, 49.40], [-80.75, 49.40], [-80.75, 49.05], [-81.05, 49.05]]] } },
                { "type": "Feature", "properties": { "id": "hydro-hawk", "type_org": "municipal", "utility": "Hydro Hawkesbury", "region": "Hawkesbury", "customers": "5K", "line_km": "140", "density": "35", "mix": "Grid", "saidi": 1.00, "saifi": 1.10 }, "geometry": { "type": "Polygon", "coordinates": [[[-74.62, 45.58], [-74.62, 45.68], [-74.52, 45.68], [-74.52, 45.58], [-74.62, 45.58]]] } },
                { "type": "Feature", "properties": { "id": "renfrew", "type_org": "municipal", "utility": "Renfrew Hydro", "region": "Renfrew", "customers": "4K", "line_km": "150", "density": "26", "mix": "Grid", "saidi": 1.15, "saifi": 1.25 }, "geometry": { "type": "Polygon", "coordinates": [[[-76.72, 45.42], [-76.72, 45.52], [-76.60, 45.52], [-76.60, 45.42], [-76.72, 45.42]]] } },
                { "type": "Feature", "properties": { "id": "fort-frances", "type_org": "municipal", "utility": "Fort Frances Power", "region": "Fort Frances", "customers": "3.5K", "line_km": "150", "density": "23", "mix": "Grid", "saidi": 1.25, "saifi": 1.35 }, "geometry": { "type": "Polygon", "coordinates": [[[-93.45, 48.58], [-93.45, 48.68], [-93.28, 48.68], [-93.28, 48.58], [-93.45, 48.58]]] } },
                { "type": "Feature", "properties": { "id": "sioux", "type_org": "municipal", "utility": "Sioux Lookout Hydro", "region": "Sioux Lookout", "customers": "2.8K", "line_km": "130", "density": "21", "mix": "Grid", "saidi": 1.35, "saifi": 1.45 }, "geometry": { "type": "Polygon", "coordinates": [[[-91.95, 50.05], [-91.95, 50.20], [-91.75, 50.20], [-91.75, 50.05], [-91.95, 50.05]]] } },
                { "type": "Feature", "properties": { "id": "hearst", "type_org": "municipal", "utility": "Hearst Power", "region": "Hearst", "customers": "2.5K", "line_km": "180", "density": "13", "mix": "Grid", "saidi": 1.45, "saifi": 1.55 }, "geometry": { "type": "Polygon", "coordinates": [[[-83.65, 49.68], [-83.65, 49.80], [-83.45, 49.80], [-83.45, 49.68], [-83.65, 49.68]]] } },
                { "type": "Feature", "properties": { "id": "coop-embrun", "type_org": "municipal", "utility": "Cooperative Hydro Embrun", "region": "Embrun", "customers": "2.5K", "line_km": "150", "density": "16", "mix": "Grid", "saidi": 1.15, "saifi": 1.25 }, "geometry": { "type": "Polygon", "coordinates": [[[-75.28, 45.22], [-75.28, 45.32], [-75.18, 45.32], [-75.18, 45.22], [-75.28, 45.22]]] } },
                { "type": "Feature", "properties": { "id": "atikokan", "type_org": "municipal", "utility": "Atikokan Hydro", "region": "Atikokan", "customers": "1.6K", "line_km": "120", "density": "13", "mix": "Grid", "saidi": 1.35, "saifi": 1.45 }, "geometry": { "type": "Polygon", "coordinates": [[[-91.62, 48.72], [-91.62, 48.82], [-91.50, 48.82], [-91.50, 48.72], [-91.62, 48.72]]] } },
                { "type": "Feature", "properties": { "id": "hydro-2000", "type_org": "municipal", "utility": "Hydro 2000", "region": "Alfred/Plantagenet", "customers": "1.2K", "line_km": "80", "density": "15", "mix": "Grid", "saidi": 1.25, "saifi": 1.35 }, "geometry": { "type": "Polygon", "coordinates": [[[-74.95, 45.52], [-74.95, 45.62], [-74.75, 45.62], [-74.75, 45.52], [-74.95, 45.52]]] } },
                { "type": "Feature", "properties": { "id": "attawapiskat", "type_org": "municipal", "utility": "Attawapiskat Power", "region": "Attawapiskat", "customers": "900", "line_km": "50", "density": "18", "mix": "Diesel Microgrid", "saidi": 2.80, "saifi": 3.10 }, "geometry": { "type": "Polygon", "coordinates": [[[-82.42, 52.85], [-82.42, 52.98], [-82.28, 52.98], [-82.28, 52.85], [-82.42, 52.85]]] } },
                { "type": "Feature", "properties": { "id": "fort-albany", "type_org": "municipal", "utility": "Fort Albany Power", "region": "Fort Albany", "customers": "800", "line_km": "40", "density": "20", "mix": "Diesel Microgrid", "saidi": 2.90, "saifi": 3.20 }, "geometry": { "type": "Polygon", "coordinates": [[[-81.65, 52.15], [-81.65, 52.28], [-81.48, 52.28], [-81.48, 52.15], [-81.65, 52.15]]] } },
                { "type": "Feature", "properties": { "id": "kashechewan", "type_org": "municipal", "utility": "Kashechewan Power", "region": "Kashechewan", "customers": "800", "line_km": "45", "density": "17", "mix": "Diesel Microgrid", "saidi": 2.85, "saifi": 3.15 }, "geometry": { "type": "Polygon", "coordinates": [[[-81.72, 52.25], [-81.72, 52.38], [-81.58, 52.38], [-81.58, 52.25], [-81.72, 52.25]]] } }
            ]
        },
        forecastRegions: [
            { id: 'vancouver', name: 'Metro Vancouver', lat: 49.2827, lng: -123.1207, baseLoad: 35.0, mults: { base: 1.007, ev: 1.012, ai: 1.020, heat: 1.018, hydro: 1.005 } }, 
            { id: 'alberta', name: 'Calgary-Edmonton Corridor', lat: 51.0447, lng: -114.0719, baseLoad: 45.0, mults: { base: 1.006, ev: 1.015, ai: 1.015, heat: 1.012, hydro: 1.035 } }, 
            { id: 'sask', name: 'Saskatchewan Industrial Hub', lat: 52.1332, lng: -106.6700, baseLoad: 25.0, mults: { base: 1.004, ev: 1.010, ai: 1.005, heat: 1.010, hydro: 1.030 } }, 
            { id: 'manitoba', name: 'Winnipeg & Southern MB', lat: 49.8951, lng: -97.1384, baseLoad: 22.0, mults: { base: 1.005, ev: 1.012, ai: 1.010, heat: 1.015, hydro: 1.010 } }, 
            { id: 'toronto', name: 'Greater Toronto Area', lat: 43.6532, lng: -79.3832, baseLoad: 48.0, mults: { base: 1.008, ev: 1.010, ai: 1.025, heat: 1.015, hydro: 1.00 } }, 
            { id: 'k-w', name: 'Kitchener-Waterloo Tech Triangle', lat: 43.4516, lng: -80.4925, baseLoad: 14.0, mults: { base: 1.008, ev: 1.012, ai: 1.035, heat: 1.015, hydro: 1.00 } }, 
            { id: 'halton', name: 'Halton-Burlington-Hamilton', lat: 43.3255, lng: -79.7990, baseLoad: 16.0, mults: { base: 1.006, ev: 1.015, ai: 1.010, heat: 1.015, hydro: 1.010 } }, 
            { id: 'london', name: 'London & Middlesex Urban Core', lat: 42.9849, lng: -81.2453, baseLoad: 12.0, mults: { base: 1.005, ev: 1.018, ai: 1.010, heat: 1.015, hydro: 1.010 } }, 
            { id: 'windsor', name: 'Windsor-Essex (Industrial)', lat: 42.3149, lng: -83.0364, baseLoad: 18.0, mults: { base: 1.005, ev: 1.045, ai: 1.005, heat: 1.010, hydro: 1.020 } }, 
            { id: 'stthomas', name: 'Chatham-Kent / St. Thomas', lat: 42.7788, lng: -81.1895, baseLoad: 6.0, mults: { base: 1.005, ev: 1.065, ai: 1.00, heat: 1.010, hydro: 1.010 } }, 
            { id: 'ottawa', name: 'Ottawa Tech & Capital Corridor', lat: 45.4215, lng: -75.6972, baseLoad: 20.0, mults: { base: 1.008, ev: 1.010, ai: 1.030, heat: 1.015, hydro: 1.00 } },
            { id: 'sudbury', name: 'Sudbury & Mining North', lat: 46.4917, lng: -80.9930, baseLoad: 10.0, mults: { base: 1.002, ev: 1.020, ai: 1.00, heat: 1.010, hydro: 1.030 } }, 
            { id: 'montreal', name: 'Greater Montreal & Southern QC', lat: 45.5017, lng: -73.5673, baseLoad: 75.0, mults: { base: 1.007, ev: 1.012, ai: 1.020, heat: 1.018, hydro: 1.025 } }, 
            { id: 'halifax', name: 'Halifax & Maritimes Hub', lat: 44.6488, lng: -63.5752, baseLoad: 18.0, mults: { base: 1.004, ev: 1.015, ai: 1.008, heat: 1.020, hydro: 1.045 } }, 
            { id: 'stjohns', name: 'St. John\'s & Eastern NL', lat: 47.5615, lng: -52.7126, baseLoad: 10.0, mults: { base: 1.003, ev: 1.010, ai: 1.005, heat: 1.015, hydro: 1.035 } }, 
            { id: 'north', name: 'Territories & Mining North', lat: 62.4540, lng: -114.3718, baseLoad: 8.0, mults: { base: 1.002, ev: 1.010, ai: 1.00, heat: 1.010, hydro: 1.020 } }
        ],
        deficitGrids: [
            { id: 'bc', name: 'BC Hydro', lat: 53.0, lng: -125.0, demand: 85, capacity: 78, unit: 'TWh' },
            { id: 'ab', name: 'AESO (Alberta)', lat: 54.0, lng: -115.0, demand: 110, capacity: 85, unit: 'TWh' },
            { id: 'sk', name: 'SaskPower (Saskatchewan)', lat: 52.5, lng: -105.5, demand: 38, capacity: 28, unit: 'TWh' },
            { id: 'mb', name: 'Manitoba Hydro', lat: 51.5, lng: -97.5, demand: 42, capacity: 38, unit: 'TWh' },
            { id: 'on', name: 'IESO (Ontario)', lat: 50.0, lng: -85.0, demand: 250, capacity: 155, unit: 'TWh' },
            { id: 'qc', name: 'Hydro-Québec', lat: 53.0, lng: -70.0, demand: 280, capacity: 250, unit: 'TWh' },
            { id: 'ns', name: 'Nova Scotia Power', lat: 45.0, lng: -63.5, demand: 18, capacity: 11, unit: 'TWh' },
            { id: 'nb', name: 'NB Power', lat: 46.5, lng: -66.0, demand: 25, capacity: 20, unit: 'TWh' },
            { id: 'nl', name: 'NL Hydro (Surplus)', lat: 53.5, lng: -60.0, demand: 15, capacity: 18, unit: 'TWh' },
            { id: 'pei', name: 'Maritime Electric (PEI)', lat: 46.2, lng: -63.1, demand: 1.5, capacity: 0.4, unit: 'TWh' },
            { id: 'yk', name: 'Yukon Energy', lat: 60.7, lng: -135.0, demand: 0.5, capacity: 0.4, unit: 'TWh' },
            { id: 'nwt', name: 'NWT Power Corp', lat: 62.4, lng: -114.3, demand: 0.7, capacity: 0.6, unit: 'TWh' },
            { id: 'nu', name: 'Qulliq Energy (Nunavut)', lat: 64.2, lng: -96.0, demand: 0.3, capacity: 0.2, unit: 'TWh' }
        ],
        offgridZones: {
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
        },
        directoryData: [
            { id: 'nu', region: 'Nunavut', comms: ['Arctic Bay', 'Arviat', 'Baker Lake', 'Cambridge Bay', 'Cape Dorset', 'Chesterfield Inlet', 'Clyde River', 'Coral Harbour', 'Gjoa Haven', 'Grise Fiord', 'Hall Beach', 'Igloolik', 'Iqaluit', 'Kimmirut', 'Kugaaruk', 'Kugluktuk', 'Naujaat', 'Pangnirtung', 'Pond Inlet', 'Qikiqtarjuaq', 'Rankin Inlet', 'Resolute', 'Sanikiluaq', 'Taloyoak', 'Whale Cove'] },
            { id: 'nl', region: 'Labrador Coast (NL)', comms: ['Black Tickle', 'Cartwright', 'Charlottetown', 'Mary\'s Harbour', 'Norman Bay', 'Paradise River', 'Port Hope Simpson', 'Rigolet', 'Postville', 'Makkovik', 'Hopedale', 'Nain'] },
            { id: 'on', region: 'Northern Ontario', comms: ['Bearskin Lake', 'Cat Lake', 'Eabametoong', 'Kasabonika Lake', 'Keewaywin', 'Kingfisher Lake', 'Kitchenuhmaykoosib Inninuwug', 'Marten Falls', 'Muskrat Dam Lake', 'Neskantaga', 'Nibinamik', 'North Caribou Lake', 'North Spirit Lake', 'Peawanuck', 'Pikangikum', 'Poplar Hill', 'Sachigo Lake', 'Sandy Lake', 'Wapekeka', 'Wawakapewin', 'Webequie', 'Weenusk', 'Winisk'] },
            { id: 'nwt', region: 'Northwest Territories', comms: ['Aklavik', 'Colville Lake', 'Fort Good Hope', 'Fort Liard', 'Fort McPherson', 'Gamètì', 'Jean Marie River', 'Kakisa', 'Lutsel K\'e', 'Nahanni Butte', 'Norman Wells', 'Paulatuk', 'Sachs Harbour', 'Sambaa K\'e', 'Tsiigehtchic', 'Tuktoyaktuk', 'Ulukhaktok', 'Wekweètì', 'Whatì', 'Wrigley'] },
            { id: 'qc', region: 'Nunavik (Quebec)', comms: ['Aupaluk', 'Inukjuak', 'Ivujivik', 'Kangiqsualujjuaq', 'Kangiqsujuaq', 'Kangirsuk', 'Kuujjuaq', 'Kuujjuarapik', 'Puvirnituq', 'Quaqtaq', 'Salluit', 'Tasiujaq', 'Umiujaq'] },
            { id: 'bc', region: 'Coastal & North BC', comms: ['Anahim Lake', 'Atlin', 'Bella Bella', 'Dease Lake', 'Eddontenajon', 'Good Hope Lake', 'Hartley Bay', 'Kwadacha', 'Telegraph Creek', 'Tsay Keh Dene', 'Iskut', 'Ahousaht', 'Hot Springs Cove', 'Kingcome Inlet', 'Klemtu', 'Ocean Falls', 'Rivers Inlet'] },
            { id: 'mb', region: 'Northern Manitoba', comms: ['Brochet', 'Lac Brochet', 'Shamattawa', 'Tadoule Lake'] },
            { id: 'yk', region: 'Yukon', comms: ['Old Crow', 'Burwash Landing', 'Destruction Bay', 'Beaver Creek'] }
        ]
    };

    // ==========================================
    // 2. Theme Engine & Live Map Tile Swapper
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
    // 3. UX Elevations (ScrollSpy, Progress, Top)
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
    // 4. Initialize Maps Directly from Local DB
    // ==========================================
    let checkLeaflet = setInterval(() => {
        if (window.L) {
            clearInterval(checkLeaflet);
            // Strict Bounding Box: Locks the map completely within Canada
            const canadaBounds = L.latLngBounds(L.latLng(41.0, -142.0), L.latLng(84.0, -52.0));
            
            initReliabilityMap(db.utilitiesGeoJSON, canadaBounds); 
            initForecastMap(db.forecastRegions, canadaBounds);
            initDeficitMap(db.deficitGrids, canadaBounds);
            initOffGridMap(db.offgridZones, db.directoryData, canadaBounds);
            initNewsFeed();
        }
    }, 100);

    // ==========================================
    // MAP INITIALIZATIONS (ALL STRICTLY BOUND TO CANADA)
    // ==========================================
    function initReliabilityMap(utilitiesGeoJSON, canadaBounds) {
        const mapEl = document.getElementById('leaflet-map');
        if (!mapEl) return;

        const map = L.map('leaflet-map', { 
            zoomControl: false, scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false,
            maxBounds: canadaBounds, maxBoundsViscosity: 1.0, minZoom: 3 
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

    function initForecastMap(regions, canadaBounds) {
        const mapEl = document.getElementById('forecast-map-premium'); if (!mapEl) return;
        const forecastMap = L.map('forecast-map-premium', { 
            zoomControl: false, scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false,
            maxBounds: canadaBounds, maxBoundsViscosity: 1.0, minZoom: 3 
        }).setView([58.0, -98.0], 3);
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

    function initDeficitMap(gridData, canadaBounds) {
        const mapEl = document.getElementById('deficit-leaflet-map'); if (!mapEl) return;
        const deficitMap = L.map('deficit-leaflet-map', { 
            zoomControl: false, scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false,
            maxBounds: canadaBounds, maxBoundsViscosity: 1.0, minZoom: 3 
        }).setView([58.0, -98.0], 3);
        L.control.zoom({ position: 'bottomright' }).addTo(deficitMap);
        
        setupMapControls(deficitMap);
        setTimeout(() => deficitMap.invalidateSize(), 500);

        gridData.forEach(grid => {
            const deficit = grid.demand - grid.capacity; const markerColor = deficit > 0 ? '#ef4444' : '#10b981';
            const pulseIcon = L.divIcon({ className: 'custom-pulse-icon', html: `<div style="width: 20px; height: 20px; background: ${markerColor}; border-radius: 50%; box-shadow: 0 0 15px ${markerColor}; border: 2px solid var(--bg-surface);"></div>`, iconSize: [20, 20], iconAnchor: [10, 10] });
            L.marker([grid.lat, grid.lng], { icon: pulseIcon }).addTo(deficitMap).bindPopup(`<div style="min-width: 240px; padding: 5px;"><strong style="font-size: 1.15rem; display: block; margin-bottom: 12px; border-bottom: 1px solid var(--border-main); padding-bottom: 8px; color: var(--text-main);">${grid.name}</strong><div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span style="color: var(--text-muted); font-size: 0.85rem;">2050 Demand</span><strong style="color: #3b82f6;">${grid.demand} ${grid.unit}</strong></div><div style="width: 100%; background: var(--border-main); height: 6px; border-radius: 3px; margin-bottom: 16px;"><div style="width: 100%; background: #3b82f6; height: 100%; border-radius: 3px;"></div></div><div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span style="color: var(--text-muted); font-size: 0.85rem;">Committed Capacity</span><strong style="color: #10b981;">${grid.capacity} ${grid.unit}</strong></div><div style="width: 100%; background: var(--border-main); height: 6px; border-radius: 3px; margin-bottom: 16px;"><div style="width: ${(grid.capacity / grid.demand) * 100}%; background: #10b981; height: 100%; border-radius: 3px;"></div></div><div style="background: ${deficit > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'}; border: 1px solid ${deficit > 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}; padding: 12px; border-radius: 8px; text-align: center;"><span style="display: block; color: ${markerColor}; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">${deficit > 0 ? 'Unserved Energy Deficit' : 'Capacity Surplus'}</span><strong style="color: ${markerColor}; font-size: 1.6rem; line-height: 1;">${Math.abs(deficit)} <span style="font-size: 1rem;">${grid.unit}</span></strong></div></div>`, { className: 'dark-tooltip' });
        });
    }

    function initOffGridMap(offgridZones, directoryData, canadaBounds) {
        const mapEl = document.getElementById('offgrid-leaflet-map'); if (!mapEl) return;
        const offgridMap = L.map('offgrid-leaflet-map', { 
            zoomControl: false, scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false,
            maxBounds: canadaBounds, maxBoundsViscosity: 1.0, minZoom: 3 
        }).setView([58.0, -98.0], 3);
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
    // LIVE NEWS FEED (Dual-Proxy Architecture for 99.9% Uptime)
    // ==========================================
    function initNewsFeed() {
        const container = document.getElementById('news-feed-container'); 
        if (!container) return;
        
        // 1. Dynamic query with a cache-buster so we always get fresh news
        const targetUrl = `https://news.google.com/rss/search?q=Canada+electric+utility+OR+grid+OR+hydro+when:7d&hl=en-CA&gl=CA&ceid=CA:en&cb=${Date.now()}`;
        
        // 2. Define two separate proxies. If one gets rate-limited, the other saves the feed.
        const primaryProxy = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
        const secondaryProxy = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}&disableCache=true`;

        // Attempt 1: Fetch raw XML via Primary Proxy
        fetch(primaryProxy)
            .then(res => {
                if (!res.ok) throw new Error('Primary Proxy Failed');
                return res.text();
            })
            .then(str => new DOMParser().parseFromString(str, "text/xml"))
            .then(data => processFeed(data, container))
            .catch(() => {
                // Attempt 2: Fallback to Secondary JSON-wrapped proxy
                fetch(secondaryProxy)
                    .then(res => {
                        if (!res.ok) throw new Error('Secondary Proxy Failed');
                        return res.json();
                    })
                    .then(data => new DOMParser().parseFromString(data.contents, "text/xml"))
                    .then(data => processFeed(data, container))
                    .catch(() => renderFallbackNews(container)); // Ultimate Fail-safe
            });
    }

    function processFeed(data, container) {
        const items = data.querySelectorAll("item");
        if (items.length === 0) {
            renderFallbackNews(container);
            return;
        }
        
        container.innerHTML = '';
        Array.from(items).slice(0, 6).forEach(item => {
            let title = item.querySelector("title")?.textContent || ''; 
            let src = 'Utility Intelligence';
            
            // Clean up Google News title formatting (Source is usually after the last '-')
            const lastHyphenIndex = title.lastIndexOf(' - ');
            if (lastHyphenIndex !== -1) {
                src = title.substring(lastHyphenIndex + 3).trim();
                title = title.substring(0, lastHyphenIndex).trim();
            }
            
            // Safe Date Parsing for all browsers (including iOS Safari)
            let pubDate = item.querySelector("pubDate")?.textContent;
            let formattedDate = 'Today';
            if (pubDate) {
                const d = new Date(pubDate);
                if (!isNaN(d)) formattedDate = d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
            }
            
            const link = item.querySelector("link")?.textContent || '#';
            
            const card = document.createElement('article'); 
            card.className = 'news-card';
            card.innerHTML = `
                <div>
                    <div class="news-card-header">
                        <span class="news-source-badge">${src}</span>
                        <span class="news-date">${formattedDate}</span>
                    </div>
                    <h3 class="news-title">${title}</h3>
                </div>
                <a href="${link}" target="_blank" rel="noopener noreferrer" class="news-link">Read Coverage &rarr;</a>
            `;
            container.appendChild(card);
        });
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
