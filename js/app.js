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
                { "type": "Feature", "properties": { "id": "hq", "type_org": "provincial", "utility": "Hydro-Québec", "region": "Quebec, Montreal, Laval, Gatineau, Saguenay", "customers": "4.4M", "line_km": "118,000", "density": "37", "mix": "99% Hydro", "saidi": 1.45, "saifi": 1.50 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.50, 51.50], [-79.50, 54.50], [-78.00, 62.50], [-72.00, 62.50], [-64.00, 60.50], [-64.00, 52.00], [-57.00, 51.50], [-64.00, 48.50], [-68.00, 47.00], [-71.00, 45.00], [-74.50, 45.00], [-76.00, 46.00], [-79.50, 51.50]]] } },
                { "type": "Feature", "properties": { "id": "bc", "type_org": "provincial", "utility": "BC Hydro", "region": "British Columbia, Vancouver, Surrey, Burnaby, Victoria, Kelowna", "customers": "2.1M", "line_km": "79,000", "density": "26", "mix": "98% Hydro", "saidi": 1.02, "saifi": 0.98 }, "geometry": { "type": "Polygon", "coordinates": [[[-139.05, 60.00], [-120.00, 60.00], [-120.00, 54.00], [-120.00, 49.00], [-123.00, 49.00], [-123.30, 48.30], [-124.00, 48.30], [-125.00, 48.80], [-128.00, 50.80], [-128.50, 51.00], [-130.00, 52.00], [-131.00, 54.00], [-133.00, 54.50], [-139.05, 60.00]]] } },
                { "type": "Feature", "properties": { "id": "ho", "type_org": "provincial", "utility": "Hydro One", "region": "Rural Ontario, Regional Townships", "customers": "1.5M", "line_km": "125,000", "density": "12", "mix": "Nuclear/Hydro", "saidi": 2.50, "saifi": 1.80 }, "geometry": { "type": "MultiPolygon", "coordinates": [[[[-95.1, 49.0], [-95.1, 53.0], [-89.0, 56.5], [-82.0, 55.5], [-79.5, 51.5], [-74.3, 45.5], [-76.0, 44.0], [-76.5, 43.8], [-79.0, 44.2], [-80.5, 44.2], [-81.5, 43.8], [-82.5, 43.0], [-83.1, 42.0], [-82.4, 43.0], [-82.0, 44.0], [-81.5, 45.0], [-84.0, 46.0], [-88.0, 48.5], [-90.0, 48.0], [-95.1, 49.0]]], [[[-78.5, 44.0], [-76.5, 44.0], [-76.5, 45.0], [-78.5, 45.0], [-78.5, 44.0]]]] } },
                { "type": "Feature", "properties": { "id": "mh", "type_org": "provincial", "utility": "Manitoba Hydro", "region": "Manitoba, Winnipeg, Brandon, Thompson", "customers": "608k", "line_km": "75,000", "density": "8.1", "mix": "97% Hydro", "saidi": 1.60, "saifi": 1.40 }, "geometry": { "type": "Polygon", "coordinates": [[[-102.00, 49.00], [-102.00, 60.00], [-95.00, 60.00], [-89.00, 56.50], [-95.00, 51.50], [-95.00, 49.00], [-102.00, 49.00]]] } },
                { "type": "Feature", "properties": { "id": "fa", "type_org": "provincial", "utility": "FortisAlberta", "region": "Alberta Rural, Airdrie, Red Deer, Lethbridge County", "customers": "580k", "line_km": "124,000", "density": "4.6", "mix": "Gas/Wind/Solar", "saidi": 1.85, "saifi": 1.40 }, "geometry": { "type": "Polygon", "coordinates": [[[-120.0, 54.0], [-120.0, 60.0], [-110.0, 60.0], [-110.0, 49.0], [-114.0, 49.0], [-114.5, 50.0], [-115.0, 51.0], [-117.0, 52.0], [-119.0, 53.0], [-120.0, 54.0]]] } },
                { "type": "Feature", "properties": { "id": "skp", "type_org": "provincial", "utility": "SaskPower", "region": "Saskatchewan, Regina, Moose Jaw, Prince Albert", "customers": "540k", "line_km": "157,000", "density": "3.4", "mix": "Gas/Wind/Hydro", "saidi": 2.10, "saifi": 2.30 }, "geometry": { "type": "Polygon", "coordinates": [[[-110.00, 49.00], [-110.00, 60.00], [-102.00, 60.00], [-101.50, 49.00], [-110.00, 49.00]]] } },
                { "type": "Feature", "properties": { "id": "nsp", "type_org": "provincial", "utility": "Nova Scotia Power", "region": "Nova Scotia, Halifax, Sydney, Truro", "customers": "520k", "line_km": "32,000", "density": "16", "mix": "Coal/Wind/Hydro", "saidi": 2.30, "saifi": 2.10 }, "geometry": { "type": "Polygon", "coordinates": [[[-66.15, 43.85], [-64.80, 45.00], [-64.30, 45.90], [-63.80, 46.00], [-63.00, 47.00], [-59.80, 47.00], [-59.80, 46.00], [-61.00, 45.30], [-63.50, 44.50], [-65.50, 43.40], [-66.15, 43.85]]] } },
                { "type": "Feature", "properties": { "id": "nbp", "type_org": "provincial", "utility": "NB Power", "region": "New Brunswick, Fredericton, Moncton, Miramichi", "customers": "400k", "line_km": "21,000", "density": "19", "mix": "Nuclear/Hydro", "saidi": 2.50, "saifi": 2.00 }, "geometry": { "type": "Polygon", "coordinates": [[[-69.00, 47.30], [-68.00, 48.00], [-64.50, 48.00], [-64.00, 46.00], [-64.30, 45.90], [-66.15, 43.85], [-67.00, 45.00], [-67.80, 45.50], [-69.00, 47.30]]] } },
                { "type": "Feature", "properties": { "id": "nfp", "type_org": "provincial", "utility": "Newfoundland Power", "region": "Newfoundland, Corner Brook, Gander, Grand Falls", "customers": "270k", "line_km": "12,000", "density": "22", "mix": "Hydro", "saidi": 1.80, "saifi": 1.90 }, "geometry": { "type": "Polygon", "coordinates": [[[-59.50, 51.50], [-55.50, 51.50], [-52.50, 47.50], [-54.00, 46.60], [-59.50, 47.50], [-59.50, 51.50]]] } },
                { "type": "Feature", "properties": { "id": "me", "type_org": "provincial", "utility": "Maritime Electric", "region": "PEI, Charlottetown, Stratford, Cornwall", "customers": "86k", "line_km": "6,000", "density": "14", "mix": "Wind/Cable Import", "saidi": 3.00, "saifi": 2.50 }, "geometry": { "type": "Polygon", "coordinates": [[[-64.50, 46.50], [-63.80, 46.50], [-62.00, 46.30], [-62.00, 46.00], [-63.50, 46.00], [-64.50, 46.50]]] } },
                { "type": "Feature", "properties": { "id": "ntpc", "type_org": "provincial", "utility": "NWT Power Corp", "region": "Northwest Territories, Yellowknife, Inuvik", "customers": "22k", "line_km": "2,500", "density": "9", "mix": "Hydro/Diesel", "saidi": 3.50, "saifi": 2.90 }, "geometry": { "type": "Polygon", "coordinates": [[[-136.0, 60.0], [-120.0, 60.0], [-120.0, 75.0], [-136.0, 75.0], [-136.0, 60.0]]] } },
                { "type": "Feature", "properties": { "id": "ye", "type_org": "provincial", "utility": "Yukon Energy", "region": "Yukon Territory, Whitehorse, Dawson City", "customers": "18k", "line_km": "1,200", "density": "15", "mix": "Hydro/Diesel", "saidi": 2.80, "saifi": 2.20 }, "geometry": { "type": "Polygon", "coordinates": [[[-141.0, 60.0], [-136.0, 60.0], [-136.0, 70.0], [-141.0, 70.0], [-141.0, 60.0]]] } },
                { "type": "Feature", "properties": { "id": "qec", "type_org": "provincial", "utility": "Qulliq Energy Corp", "region": "Nunavut Territory, Iqaluit, Rankin Inlet", "customers": "15k", "line_km": "600", "density": "25", "mix": "100% Diesel", "saidi": 4.10, "saifi": 3.20 }, "geometry": { "type": "Polygon", "coordinates": [[[-120.0, 60.0], [-102.0, 60.0], [-95.0, 60.0], [-80.0, 62.0], [-70.0, 62.0], [-60.0, 65.0], [-60.0, 83.0], [-120.0, 83.0], [-120.0, 60.0]]] } },
                { "type": "Feature", "properties": { "id": "hydro-one-remote", "type_org": "provincial", "utility": "Hydro One Remote", "region": "Remote Northern Ontario Communities", "customers": "4K", "line_km": "1,200", "density": "3.3", "mix": "Diesel Microgrids", "saidi": 5.5, "saifi": 4.1 }, "geometry": { "type": "Polygon", "coordinates": [[[-94.00, 53.00], [-88.00, 56.00], [-80.00, 55.00], [-80.00, 52.00], [-88.00, 51.00], [-94.00, 53.00]]] } },

                /* --- 2. OUT OF PROVINCE MUNICIPAL & MINOR LDCs --- */
                { "type": "Feature", "properties": { "id": "enmax", "type_org": "municipal", "utility": "ENMAX Power", "region": "Calgary, AB", "customers": "520K", "line_km": "8,500", "density": "61", "mix": "Grid", "saidi": 0.85, "saifi": 0.75 }, "geometry": { "type": "Polygon", "coordinates": [[[-114.25, 50.85], [-114.30, 50.95], [-114.28, 51.10], [-114.15, 51.18], [-113.95, 51.18], [-113.90, 51.05], [-113.95, 50.85], [-114.10, 50.80], [-114.25, 50.85]]] } },
                { "type": "Feature", "properties": { "id": "epcor", "type_org": "municipal", "utility": "EPCOR Utilities", "region": "Edmonton, AB", "customers": "415K", "line_km": "6,000", "density": "69", "mix": "Grid", "saidi": 1.51, "saifi": 0.72 }, "geometry": { "type": "Polygon", "coordinates": [[[-113.70, 53.40], [-113.75, 53.48], [-113.70, 53.60], [-113.50, 53.65], [-113.35, 53.60], [-113.30, 53.50], [-113.35, 53.40], [-113.50, 53.35], [-113.70, 53.40]]] } },
                { "type": "Feature", "properties": { "id": "slp", "type_org": "municipal", "utility": "Saskatoon Light & Power", "region": "Saskatoon, SK", "customers": "112K", "line_km": "1,600", "density": "70", "mix": "Grid", "saidi": 0.95, "saifi": 0.85 }, "geometry": { "type": "Polygon", "coordinates": [[[-106.75, 52.05], [-106.78, 52.12], [-106.75, 52.20], [-106.65, 52.22], [-106.55, 52.20], [-106.52, 52.12], [-106.55, 52.05], [-106.65, 52.02], [-106.75, 52.05]]] } },
                { "type": "Feature", "properties": { "id": "sje", "type_org": "municipal", "utility": "Saint John Energy", "region": "Saint John, NB", "customers": "36K", "line_km": "900", "density": "40", "mix": "Grid", "saidi": 1.05, "saifi": 0.95 }, "geometry": { "type": "Polygon", "coordinates": [[[-66.15, 45.20], [-66.18, 45.28], [-66.15, 45.35], [-66.05, 45.38], [-65.95, 45.35], [-65.92, 45.28], [-65.95, 45.20], [-66.05, 45.18], [-66.15, 45.20]]] } },
                { "type": "Feature", "properties": { "id": "fortisbc", "type_org": "provincial", "utility": "FortisBC", "region": "Interior BC, Kelowna, Penticton, Trail", "customers": "180K", "line_km": "7,350", "density": "24", "mix": "Hydro", "saidi": 1.15, "saifi": 1.25 }, "geometry": { "type": "Polygon", "coordinates": [[[-120.0, 49.0], [-120.5, 49.5], [-120.0, 50.0], [-119.5, 50.2], [-119.0, 50.0], [-118.5, 49.5], [-119.0, 49.0], [-120.0, 49.0]]] } },
                { "type": "Feature", "properties": { "id": "lethbridge", "type_org": "municipal", "utility": "Lethbridge Electric", "region": "Lethbridge, AB", "customers": "40K", "line_km": "600", "density": "66", "mix": "Grid", "saidi": 0.85, "saifi": 0.95 }, "geometry": { "type": "Polygon", "coordinates": [[[-112.85, 49.68], [-112.88, 49.71], [-112.85, 49.75], [-112.80, 49.76], [-112.75, 49.75], [-112.72, 49.71], [-112.75, 49.68], [-112.80, 49.67], [-112.85, 49.68]]] } },
                { "type": "Feature", "properties": { "id": "medicine-hat", "type_org": "municipal", "utility": "Medicine Hat Electric", "region": "Medicine Hat, AB", "customers": "35K", "line_km": "550", "density": "63", "mix": "Gas", "saidi": 0.90, "saifi": 1.00 }, "geometry": { "type": "Polygon", "coordinates": [[[-110.75, 49.98], [-110.78, 50.03], [-110.75, 50.08], [-110.70, 50.10], [-110.65, 50.08], [-110.62, 50.03], [-110.65, 49.98], [-110.70, 49.96], [-110.75, 49.98]]] } },
                { "type": "Feature", "properties": { "id": "red-deer", "type_org": "municipal", "utility": "Red Deer Electric", "region": "Red Deer, AB", "customers": "42K", "line_km": "620", "density": "67", "mix": "Grid", "saidi": 0.88, "saifi": 0.96 }, "geometry": { "type": "Polygon", "coordinates": [[[-113.85, 52.25], [-113.88, 52.28], [-113.85, 52.32], [-113.80, 52.34], [-113.75, 52.32], [-113.72, 52.28], [-113.75, 52.25], [-113.80, 52.23], [-113.85, 52.25]]] } },
                { "type": "Feature", "properties": { "id": "nelson", "type_org": "municipal", "utility": "Nelson Hydro", "region": "Nelson, BC", "customers": "10K", "line_km": "200", "density": "50", "mix": "Hydro", "saidi": 1.05, "saifi": 1.15 }, "geometry": { "type": "Polygon", "coordinates": [[[-117.32, 49.48], [-117.35, 49.50], [-117.32, 49.52], [-117.28, 49.53], [-117.25, 49.52], [-117.22, 49.50], [-117.25, 49.48], [-117.28, 49.47], [-117.32, 49.48]]] } },
                { "type": "Feature", "properties": { "id": "penticton", "type_org": "municipal", "utility": "City of Penticton", "region": "Penticton, BC", "customers": "18K", "line_km": "250", "density": "72", "mix": "Grid", "saidi": 0.95, "saifi": 1.00 }, "geometry": { "type": "Polygon", "coordinates": [[[-119.62, 49.47], [-119.65, 49.49], [-119.62, 49.52], [-119.58, 49.53], [-119.55, 49.52], [-119.52, 49.49], [-119.55, 49.47], [-119.58, 49.46], [-119.62, 49.47]]] } },
                { "type": "Feature", "properties": { "id": "summerland", "type_org": "municipal", "utility": "District of Summerland", "region": "Summerland, BC", "customers": "6K", "line_km": "150", "density": "40", "mix": "Grid", "saidi": 1.10, "saifi": 1.20 }, "geometry": { "type": "Polygon", "coordinates": [[[-119.68, 49.58], [-119.70, 49.60], [-119.68, 49.62], [-119.65, 49.63], [-119.62, 49.62], [-119.60, 49.60], [-119.62, 49.58], [-119.65, 49.57], [-119.68, 49.58]]] } },
                { "type": "Feature", "properties": { "id": "new-west", "type_org": "municipal", "utility": "City of New Westminster", "region": "New Westminster, BC", "customers": "35K", "line_km": "320", "density": "109", "mix": "Grid", "saidi": 0.70, "saifi": 0.85 }, "geometry": { "type": "Polygon", "coordinates": [[[-122.95, 49.18], [-122.98, 49.20], [-122.95, 49.23], [-122.92, 49.24], [-122.88, 49.23], [-122.85, 49.20], [-122.88, 49.18], [-122.92, 49.17], [-122.95, 49.18]]] } },
                { "type": "Feature", "properties": { "id": "sherbrooke", "type_org": "municipal", "utility": "Hydro-Sherbrooke", "region": "Sherbrooke, QC", "customers": "80K", "line_km": "1,200", "density": "66", "mix": "Hydro", "saidi": 0.88, "saifi": 0.98 }, "geometry": { "type": "Polygon", "coordinates": [[[-71.95, 45.38], [-71.98, 45.42], [-71.95, 45.45], [-71.90, 45.47], [-71.85, 45.45], [-71.82, 45.42], [-71.85, 45.38], [-71.90, 45.36], [-71.95, 45.38]]] } },
                { "type": "Feature", "properties": { "id": "magog", "type_org": "municipal", "utility": "Hydro-Magog", "region": "Magog, QC", "customers": "15K", "line_km": "220", "density": "68", "mix": "Hydro", "saidi": 0.95, "saifi": 1.05 }, "geometry": { "type": "Polygon", "coordinates": [[[-72.18, 45.25], [-72.20, 45.28], [-72.18, 45.30], [-72.14, 45.32], [-72.10, 45.30], [-72.08, 45.28], [-72.10, 45.25], [-72.14, 45.23], [-72.18, 45.25]]] } },
                { "type": "Feature", "properties": { "id": "alma", "type_org": "municipal", "utility": "Ville d'Alma", "region": "Alma, QC", "customers": "14K", "line_km": "200", "density": "70", "mix": "Hydro", "saidi": 0.92, "saifi": 1.02 }, "geometry": { "type": "Polygon", "coordinates": [[[-71.68, 48.53], [-71.70, 48.56], [-71.68, 48.60], [-71.64, 48.62], [-71.60, 48.60], [-71.58, 48.56], [-71.60, 48.53], [-71.64, 48.51], [-71.68, 48.53]]] } },
                { "type": "Feature", "properties": { "id": "baie-comeau", "type_org": "municipal", "utility": "Ville de Baie-Comeau", "region": "Baie-Comeau, QC", "customers": "10K", "line_km": "180", "density": "55", "mix": "Hydro", "saidi": 1.00, "saifi": 1.10 }, "geometry": { "type": "Polygon", "coordinates": [[[-68.20, 49.18], [-68.22, 49.21], [-68.20, 49.25], [-68.15, 49.27], [-68.10, 49.25], [-68.08, 49.21], [-68.10, 49.18], [-68.15, 49.16], [-68.20, 49.18]]] } },
                { "type": "Feature", "properties": { "id": "coaticook", "type_org": "municipal", "utility": "Ville de Coaticook", "region": "Coaticook, QC", "customers": "4K", "line_km": "100", "density": "40", "mix": "Hydro", "saidi": 1.15, "saifi": 1.25 }, "geometry": { "type": "Polygon", "coordinates": [[[-71.82, 45.12], [-71.84, 45.14], [-71.82, 45.16], [-71.80, 45.17], [-71.78, 45.16], [-71.76, 45.14], [-71.78, 45.12], [-71.80, 45.11], [-71.82, 45.12]]] } },
                { "type": "Feature", "properties": { "id": "joliette", "type_org": "municipal", "utility": "Ville de Joliette", "region": "Joliette, QC", "customers": "11K", "line_km": "160", "density": "68", "mix": "Hydro", "saidi": 0.90, "saifi": 1.00 }, "geometry": { "type": "Polygon", "coordinates": [[[-73.48, 46.00], [-73.50, 46.02], [-73.48, 46.05], [-73.45, 46.07], [-73.42, 46.05], [-73.40, 46.02], [-73.42, 46.00], [-73.45, 45.98], [-73.48, 46.00]]] } },
                { "type": "Feature", "properties": { "id": "summerside", "type_org": "municipal", "utility": "Summerside Electric", "region": "Summerside, PEI", "customers": "7K", "line_km": "120", "density": "58", "mix": "Wind/Grid", "saidi": 0.95, "saifi": 1.05 }, "geometry": { "type": "Polygon", "coordinates": [[[-63.82, 46.38], [-63.85, 46.40], [-63.82, 46.42], [-63.78, 46.44], [-63.75, 46.42], [-63.72, 46.40], [-63.75, 46.38], [-63.78, 46.36], [-63.82, 46.38]]] } },
                { "type": "Feature", "properties": { "id": "edmundston", "type_org": "municipal", "utility": "Edmundston Energy", "region": "Edmundston, NB", "customers": "8K", "line_km": "140", "density": "57", "mix": "Hydro/Grid", "saidi": 1.00, "saifi": 1.10 }, "geometry": { "type": "Polygon", "coordinates": [[[-68.35, 47.34], [-68.38, 47.36], [-68.35, 47.38], [-68.32, 47.39], [-68.28, 47.38], [-68.25, 47.36], [-68.28, 47.34], [-68.32, 47.32], [-68.35, 47.34]]] } },
                { "type": "Feature", "properties": { "id": "berwick", "type_org": "municipal", "utility": "Berwick Electric", "region": "Berwick, NS", "customers": "1.5K", "line_km": "40", "density": "37", "mix": "Hydro/Grid", "saidi": 1.10, "saifi": 1.20 }, "geometry": { "type": "Polygon", "coordinates": [[[-64.75, 45.02], [-64.77, 45.04], [-64.75, 45.05], [-64.73, 45.06], [-64.72, 45.05], [-64.70, 45.04], [-64.72, 45.02], [-64.73, 45.01], [-64.75, 45.02]]] } },
                { "type": "Feature", "properties": { "id": "mahone-bay", "type_org": "municipal", "utility": "Mahone Bay Electric", "region": "Mahone Bay, NS", "customers": "1K", "line_km": "30", "density": "33", "mix": "Wind/Grid", "saidi": 1.15, "saifi": 1.25 }, "geometry": { "type": "Polygon", "coordinates": [[[-64.39, 44.43], [-64.41, 44.44], [-64.39, 44.46], [-64.38, 44.47], [-64.36, 44.46], [-64.34, 44.44], [-64.36, 44.43], [-64.38, 44.42], [-64.39, 44.43]]] } },
                { "type": "Feature", "properties": { "id": "antigonish", "type_org": "municipal", "utility": "Antigonish Electric", "region": "Antigonish, NS", "customers": "2.5K", "line_km": "60", "density": "41", "mix": "Grid", "saidi": 1.05, "saifi": 1.15 }, "geometry": { "type": "Polygon", "coordinates": [[[-62.01, 45.60], [-62.03, 45.62], [-62.01, 45.64], [-61.99, 45.65], [-61.97, 45.64], [-61.95, 45.62], [-61.97, 45.60], [-61.99, 45.58], [-62.01, 45.60]]] } },
                { "type": "Feature", "properties": { "id": "northland", "type_org": "provincial", "utility": "Northland Utilities", "region": "NWT, Hay River, Fort Smith", "customers": "11K", "line_km": "350", "density": "31", "mix": "Hydro/Diesel", "saidi": 2.10, "saifi": 2.20 }, "geometry": { "type": "Polygon", "coordinates": [[[-114.40, 62.42], [-114.45, 62.45], [-114.40, 62.48], [-114.35, 62.50], [-114.30, 62.48], [-114.25, 62.45], [-114.30, 62.42], [-114.35, 62.40], [-114.40, 62.42]]] } },
                { "type": "Feature", "properties": { "id": "atco-yukon", "type_org": "provincial", "utility": "ATCO Electric Yukon", "region": "Yukon, Watson Lake, Haines Junction", "customers": "19K", "line_km": "450", "density": "42", "mix": "Hydro/Diesel", "saidi": 1.95, "saifi": 2.05 }, "geometry": { "type": "Polygon", "coordinates": [[[-135.10, 60.70], [-135.15, 60.72], [-135.10, 60.75], [-135.05, 60.77], [-135.00, 60.75], [-134.95, 60.72], [-135.00, 60.70], [-135.05, 60.68], [-135.10, 60.70]]] } },

                /* --- 3. ONTARIO LDCs (ENRICHED SEARCH METADATA) --- */
                { "type": "Feature", "properties": { "id": "alectra", "type_org": "municipal", "utility": "Alectra Utilities", "region": "Mississauga, Brampton, Hamilton, Guelph, Markham, Vaughan, Barrie, St. Catharines, Aurora, Penetanguishene", "customers": "1.1M", "line_km": "18,500", "density": "60", "mix": "Grid", "saidi": 0.85, "saifi": 1.05 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.90, 43.20], [-80.00, 43.30], [-79.80, 43.40], [-79.70, 43.30], [-79.90, 43.20]]] } },
                { "type": "Feature", "properties": { "id": "toronto-hydro", "type_org": "municipal", "utility": "Toronto Hydro", "region": "Toronto, Scarborough, North York, Etobicoke, York, East York", "customers": "786K", "line_km": "16,000", "density": "49", "mix": "Grid", "saidi": 0.75, "saifi": 0.95 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.54, 43.58], [-79.56, 43.62], [-79.60, 43.70], [-79.58, 43.75], [-79.40, 43.80], [-79.16, 43.82], [-79.12, 43.78], [-79.20, 43.70], [-79.30, 43.66], [-79.38, 43.62], [-79.54, 43.58]]] } },
                { "type": "Feature", "properties": { "id": "hydro-ottawa", "type_org": "municipal", "utility": "Hydro Ottawa", "region": "Ottawa, Casselman, Kanata, Nepean, Gloucester", "customers": "350K", "line_km": "5,800", "density": "60", "mix": "Grid", "saidi": 1.10, "saifi": 1.25 }, "geometry": { "type": "Polygon", "coordinates": [[[-76.05, 45.30], [-76.00, 45.40], [-75.80, 45.50], [-75.60, 45.52], [-75.40, 45.55], [-75.25, 45.40], [-75.40, 45.10], [-75.70, 45.10], [-75.90, 45.20], [-76.05, 45.30]]] } },
                { "type": "Feature", "properties": { "id": "elexicon", "type_org": "municipal", "utility": "Elexicon Energy", "region": "Whitby, Ajax, Pickering, Clarington, Port Hope, Belleville", "customers": "175K", "line_km": "4,500", "density": "38", "mix": "Grid", "saidi": 0.95, "saifi": 1.10 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.10, 43.84], [-79.14, 43.90], [-79.14, 44.02], [-79.00, 44.00], [-78.85, 43.98], [-78.80, 43.90], [-78.75, 43.85], [-78.90, 43.82], [-79.00, 43.83], [-79.10, 43.84]]] } },
                { "type": "Feature", "properties": { "id": "london-hydro", "type_org": "municipal", "utility": "London Hydro", "region": "London, Middlesex County", "customers": "165K", "line_km": "3,100", "density": "53", "mix": "Grid", "saidi": 0.85, "saifi": 1.00 }, "geometry": { "type": "Polygon", "coordinates": [[[-81.38, 42.92], [-81.36, 42.96], [-81.33, 43.05], [-81.25, 43.06], [-81.18, 43.05], [-81.12, 42.98], [-81.12, 42.92], [-81.20, 42.88], [-81.30, 42.89], [-81.38, 42.92]]] } },
                { "type": "Feature", "properties": { "id": "enova", "type_org": "municipal", "utility": "Enova Power", "region": "Kitchener, Waterloo, Wellesley, Woolwich, Wilmot", "customers": "160K", "line_km": "3,800", "density": "42", "mix": "Grid", "saidi": 0.90, "saifi": 1.05 }, "geometry": { "type": "Polygon", "coordinates": [[[-80.60, 43.35], [-80.65, 43.40], [-80.65, 43.45], [-80.60, 43.50], [-80.55, 43.55], [-80.50, 43.53], [-80.45, 43.52], [-80.40, 43.42], [-80.50, 43.38], [-80.60, 43.35]]] } },
                { "type": "Feature", "properties": { "id": "grandbridge", "type_org": "municipal", "utility": "GrandBridge Energy", "region": "Brantford, Cambridge, Brant County, North Dumfries", "customers": "110K", "line_km": "3,200", "density": "34", "mix": "Grid", "saidi": 1.05, "saifi": 1.10 }, "geometry": { "type": "Polygon", "coordinates": [[[-80.40, 43.15], [-80.42, 43.20], [-80.40, 43.25], [-80.35, 43.35], [-80.30, 43.42], [-80.25, 43.41], [-80.20, 43.40], [-80.15, 43.20], [-80.25, 43.18], [-80.40, 43.15]]] } },
                { "type": "Feature", "properties": { "id": "enwin", "type_org": "municipal", "utility": "ENWIN Utilities", "region": "Windsor, Essex County", "customers": "91K", "line_km": "1,100", "density": "82", "mix": "Grid", "saidi": 0.88, "saifi": 0.98 }, "geometry": { "type": "Polygon", "coordinates": [[[-83.10, 42.25], [-83.11, 42.28], [-83.08, 42.32], [-83.04, 42.34], [-82.95, 42.35], [-82.90, 42.32], [-82.88, 42.28], [-82.92, 42.25], [-83.10, 42.25]]] } },
                { "type": "Feature", "properties": { "id": "niagara-pen", "type_org": "municipal", "utility": "Niagara Peninsula Energy", "region": "Niagara Falls, Pelham, Lincoln, Grimsby, West Lincoln", "customers": "85K", "line_km": "2,200", "density": "38", "mix": "Grid", "saidi": 1.20, "saifi": 1.30 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.35, 42.90], [-79.38, 43.00], [-79.40, 43.10], [-79.32, 43.15], [-79.25, 43.20], [-79.18, 43.18], [-79.10, 43.15], [-79.05, 42.95], [-79.20, 42.92], [-79.35, 42.90]]] } },
                { "type": "Feature", "properties": { "id": "oakville", "type_org": "municipal", "utility": "Oakville Hydro", "region": "Oakville, Halton Region", "customers": "74K", "line_km": "1,800", "density": "41.1", "mix": "Grid", "saidi": 0.85, "saifi": 0.90 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.80, 43.38], [-79.78, 43.42], [-79.75, 43.48], [-79.68, 43.52], [-79.62, 43.50], [-79.60, 43.45], [-79.65, 43.40], [-79.72, 43.38], [-79.80, 43.38]]] } },
                { "type": "Feature", "properties": { "id": "burlington", "type_org": "municipal", "utility": "Burlington Hydro", "region": "Burlington, Halton Region", "customers": "69K", "line_km": "1,500", "density": "46", "mix": "Grid", "saidi": 0.90, "saifi": 0.95 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.85, 43.30], [-79.88, 43.35], [-79.90, 43.43], [-79.85, 43.48], [-79.78, 43.45], [-79.76, 43.38], [-79.80, 43.33], [-79.85, 43.30]]] } },
                { "type": "Feature", "properties": { "id": "entegrus", "type_org": "municipal", "utility": "Entegrus Powerlines", "region": "Chatham-Kent, St. Thomas, Strathroy-Caradoc, Dutton/Dunwich", "customers": "60K", "line_km": "2,100", "density": "28", "mix": "Grid", "saidi": 1.05, "saifi": 1.15 }, "geometry": { "type": "Polygon", "coordinates": [[[-82.25, 42.20], [-82.32, 42.30], [-82.40, 42.45], [-82.20, 42.52], [-80.00, 42.60], [-81.85, 42.60], [-81.70, 42.60], [-81.80, 42.30], [-82.00, 42.25], [-82.25, 42.20]]] } },
                { "type": "Feature", "properties": { "id": "oshawa", "type_org": "municipal", "utility": "Oshawa PUC Networks", "region": "Oshawa, Durham Region", "customers": "60K", "line_km": "1,500", "density": "40", "mix": "Grid", "saidi": 0.95, "saifi": 1.00 }, "geometry": { "type": "Polygon", "coordinates": [[[-78.90, 43.85], [-78.92, 43.90], [-78.95, 43.95], [-78.90, 44.00], [-78.85, 44.05], [-78.80, 43.98], [-78.75, 43.90], [-78.82, 43.88], [-78.90, 43.85]]] } },
                { "type": "Feature", "properties": { "id": "synergy", "type_org": "municipal", "utility": "Synergy North", "region": "Thunder Bay, Kenora", "customers": "56K", "line_km": "2,200", "density": "25", "mix": "Grid", "saidi": 1.25, "saifi": 1.30 }, "geometry": { "type": "Polygon", "coordinates": [[[-89.35, 48.38], [-89.32, 48.42], [-89.30, 48.48], [-89.22, 48.46], [-89.15, 48.45], [-89.12, 48.40], [-89.10, 48.35], [-89.20, 48.30], [-89.35, 48.38]]] } },
                { "type": "Feature", "properties": { "id": "newmarket-tay", "type_org": "municipal", "utility": "Newmarket-Tay Power", "region": "Newmarket, Tay, Midland", "customers": "48K", "line_km": "1,600", "density": "30", "mix": "Grid", "saidi": 1.15, "saifi": 1.25 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.50, 44.02], [-79.51, 44.06], [-79.52, 44.10], [-79.46, 44.12], [-79.40, 44.15], [-79.38, 44.10], [-79.35, 44.05], [-79.42, 44.03], [-79.50, 44.02]]] } },
                { "type": "Feature", "properties": { "id": "greater-sudbury", "type_org": "municipal", "utility": "Greater Sudbury Hydro", "region": "Sudbury, Greater Sudbury, West Nipissing", "customers": "47K", "line_km": "1,100", "density": "42", "mix": "Grid", "saidi": 1.10, "saifi": 1.20 }, "geometry": { "type": "Polygon", "coordinates": [[[-81.05, 46.45], [-81.08, 46.50], [-81.10, 46.55], [-81.02, 46.60], [-80.95, 46.65], [-80.90, 46.58], [-80.85, 46.50], [-80.95, 46.48], [-81.05, 46.45]]] } },
                { "type": "Feature", "properties": { "id": "milton", "type_org": "municipal", "utility": "Milton Hydro", "region": "Milton, Halton Region", "customers": "40K", "line_km": "1,400", "density": "28", "mix": "Grid", "saidi": 0.85, "saifi": 0.95 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.95, 43.48], [-79.98, 43.52], [-80.00, 43.58], [-79.92, 43.59], [-79.85, 43.60], [-79.82, 43.55], [-79.80, 43.50], [-79.88, 43.49], [-79.95, 43.48]]] } },
                { "type": "Feature", "properties": { "id": "elexicon-belleville", "type_org": "municipal", "utility": "Elexicon Energy", "region": "Belleville, Hastings County", "customers": "40K", "line_km": "1,000", "density": "40.0", "mix": "Grid", "saidi": 0.95, "saifi": 1.10 }, "geometry": { "type": "Polygon", "coordinates": [[[-77.40, 44.10], [-77.42, 44.15], [-77.40, 44.20], [-77.32, 44.22], [-77.25, 44.20], [-77.22, 44.15], [-77.25, 44.10], [-77.32, 44.08], [-77.40, 44.10]]] } },
                { "type": "Feature", "properties": { "id": "bluewater", "type_org": "municipal", "utility": "Bluewater Power", "region": "Sarnia, Petrolia, St. Clair, Point Edward, Warwick, Brooke-Alvinston", "customers": "36K", "line_km": "1,200", "density": "30.0", "mix": "Grid", "saidi": 1.05, "saifi": 1.15 }, "geometry": { "type": "Polygon", "coordinates": [[[-82.45, 42.90], [-82.47, 42.98], [-82.45, 43.05], [-82.38, 43.08], [-82.30, 43.05], [-82.28, 42.98], [-82.30, 42.90], [-82.38, 42.88], [-82.45, 42.90]]] } },
                { "type": "Feature", "properties": { "id": "puc-ssm", "type_org": "municipal", "utility": "PUC Distribution", "region": "Sault Ste. Marie, Algoma", "customers": "33K", "line_km": "1,000", "density": "33", "mix": "Grid", "saidi": 1.15, "saifi": 1.25 }, "geometry": { "type": "Polygon", "coordinates": [[[-84.38, 46.48], [-84.40, 46.52], [-84.42, 46.55], [-84.32, 46.58], [-84.25, 46.60], [-84.23, 46.55], [-84.22, 46.50], [-84.30, 46.49], [-84.38, 46.48]]] } },
                { "type": "Feature", "properties": { "id": "essex", "type_org": "municipal", "utility": "Essex Powerlines", "region": "Essex, Amherstburg, LaSalle, Tecumseh", "customers": "30K", "line_km": "850", "density": "35", "mix": "Grid", "saidi": 1.00, "saifi": 1.10 }, "geometry": { "type": "Polygon", "coordinates": [[[-83.10, 42.15], [-83.12, 42.20], [-83.15, 42.25], [-83.05, 42.28], [-82.95, 42.30], [-82.90, 42.22], [-82.85, 42.15], [-82.98, 42.12], [-83.10, 42.15]]] } },
                { "type": "Feature", "properties": { "id": "kingston", "type_org": "municipal", "utility": "Kingston Hydro", "region": "Kingston, Frontenac County", "customers": "28K", "line_km": "700", "density": "40.0", "mix": "Grid", "saidi": 0.95, "saifi": 1.05 }, "geometry": { "type": "Polygon", "coordinates": [[[-76.60, 44.20], [-76.62, 44.25], [-76.60, 44.30], [-76.50, 44.32], [-76.40, 44.30], [-76.38, 44.25], [-76.40, 44.20], [-76.50, 44.18], [-76.60, 44.20]]] } },
                { "type": "Feature", "properties": { "id": "cn-power", "type_org": "municipal", "utility": "Canadian Niagara Power", "region": "Fort Erie, Port Colborne", "customers": "28K", "line_km": "800", "density": "35", "mix": "Grid", "saidi": 1.10, "saifi": 1.20 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.05, 42.88], [-79.06, 42.92], [-79.08, 42.95], [-79.02, 42.96], [-78.95, 42.98], [-78.92, 42.94], [-78.90, 42.90], [-78.98, 42.89], [-79.05, 42.88]]] } },
                { "type": "Feature", "properties": { "id": "cornwall", "type_org": "municipal", "utility": "Cornwall Electric", "region": "Cornwall, South Glengarry", "customers": "25K", "line_km": "600", "density": "41", "mix": "Grid", "saidi": 0.85, "saifi": 0.95 }, "geometry": { "type": "Polygon", "coordinates": [[[-74.78, 44.98], [-74.80, 45.02], [-74.82, 45.05], [-74.75, 45.06], [-74.68, 45.08], [-74.66, 45.04], [-74.65, 45.00], [-74.72, 44.99], [-74.78, 44.98]]] } },
                { "type": "Feature", "properties": { "id": "welland", "type_org": "municipal", "utility": "Welland Hydro", "region": "Welland, Niagara Region", "customers": "24K", "line_km": "800", "density": "30", "mix": "Grid", "saidi": 1.00, "saifi": 1.10 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.30, 42.95], [-79.32, 42.98], [-79.35, 43.02], [-79.28, 43.04], [-79.20, 43.05], [-79.18, 43.00], [-79.15, 42.95], [-79.22, 42.94], [-79.30, 42.95]]] } },
                { "type": "Feature", "properties": { "id": "erth", "type_org": "municipal", "utility": "ERTH Power", "region": "Ingersoll, Aylmer, Thames Centre, Central Elgin, Bayham, West Perth", "customers": "24K", "line_km": "900", "density": "26", "mix": "Grid", "saidi": 1.15, "saifi": 1.25 }, "geometry": { "type": "Polygon", "coordinates": [[[-81.05, 42.75], [-81.10, 42.82], [-81.15, 42.90], [-81.00, 42.95], [-80.85, 43.00], [-80.80, 42.92], [-80.75, 42.85], [-80.90, 42.80], [-81.05, 42.75]]] } },
                { "type": "Feature", "properties": { "id": "north-bay", "type_org": "municipal", "utility": "North Bay Hydro", "region": "North Bay, Nipissing District", "customers": "24K", "line_km": "850", "density": "28", "mix": "Grid", "saidi": 1.20, "saifi": 1.30 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.50, 46.28], [-79.52, 46.33], [-79.55, 46.38], [-79.48, 46.40], [-79.40, 46.42], [-79.38, 46.37], [-79.35, 46.32], [-79.42, 46.30], [-79.50, 46.28]]] } },
                { "type": "Feature", "properties": { "id": "halton-hills", "type_org": "municipal", "utility": "Halton Hills Hydro", "region": "Halton Hills, Georgetown, Acton", "customers": "23K", "line_km": "950", "density": "24", "mix": "Grid", "saidi": 1.05, "saifi": 1.15 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.95, 43.62], [-79.98, 43.67], [-80.00, 43.72], [-79.92, 43.74], [-79.85, 43.75], [-79.82, 43.70], [-79.80, 43.65], [-79.88, 43.64], [-79.95, 43.62]]] } },
                { "type": "Feature", "properties": { "id": "epcor-on", "type_org": "municipal", "utility": "EPCOR Electricity ON", "region": "Collingwood, The Blue Mountains", "customers": "21K", "line_km": "750", "density": "28", "mix": "Grid", "saidi": 1.10, "saifi": 1.20 }, "geometry": { "type": "Polygon", "coordinates": [[[-80.25, 44.45], [-80.28, 44.50], [-80.30, 44.55], [-80.22, 44.58], [-80.15, 44.60], [-80.12, 44.55], [-80.10, 44.50], [-80.18, 44.48], [-80.25, 44.45]]] } },
                { "type": "Feature", "properties": { "id": "festival", "type_org": "municipal", "utility": "Festival Hydro", "region": "Stratford, St. Marys, South Huron", "customers": "20K", "line_km": "650", "density": "30", "mix": "Grid", "saidi": 1.05, "saifi": 1.15 }, "geometry": { "type": "Polygon", "coordinates": [[[-81.00, 43.35], [-81.02, 43.38], [-81.05, 43.42], [-80.98, 43.42], [-80.90, 43.42], [-80.88, 43.38], [-80.85, 43.35], [-80.92, 43.35], [-81.00, 43.35]]] } },
                { "type": "Feature", "properties": { "id": "innpower", "type_org": "municipal", "utility": "InnPower", "region": "Innisfil, Essa Township", "customers": "19K", "line_km": "850", "density": "22", "mix": "Grid", "saidi": 1.25, "saifi": 1.35 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.60, 44.28], [-79.62, 44.33], [-79.65, 44.38], [-79.58, 44.39], [-79.50, 44.40], [-79.48, 44.35], [-79.45, 44.30], [-79.52, 44.29], [-79.60, 44.28]]] } },
                { "type": "Feature", "properties": { "id": "lakeland", "type_org": "municipal", "utility": "Lakeland Power", "region": "Muskoka, Huntsville, Bracebridge, Parry Sound, Magnetawan, Burk's Falls", "customers": "14K", "line_km": "900", "density": "15", "mix": "Grid", "saidi": 1.40, "saifi": 1.50 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.35, 45.05], [-79.38, 45.12], [-79.40, 45.20], [-79.28, 45.28], [-79.15, 45.35], [-79.12, 45.25], [-79.10, 45.15], [-79.22, 45.10], [-79.35, 45.05]]] } },
                { "type": "Feature", "properties": { "id": "wasaga", "type_org": "municipal", "utility": "Wasaga Distribution", "region": "Wasaga Beach, Simcoe County", "customers": "14K", "line_km": "500", "density": "28", "mix": "Grid", "saidi": 1.10, "saifi": 1.20 }, "geometry": { "type": "Polygon", "coordinates": [[[-80.05, 44.48], [-80.08, 44.52], [-80.10, 44.55], [-80.02, 44.56], [-79.95, 44.58], [-79.92, 44.54], [-79.90, 44.50], [-79.98, 44.49], [-80.05, 44.48]]] } },
                { "type": "Feature", "properties": { "id": "orangeville", "type_org": "municipal", "utility": "Orangeville Hydro", "region": "Orangeville, Grand Valley", "customers": "12K", "line_km": "400", "density": "30", "mix": "Grid", "saidi": 1.05, "saifi": 1.15 }, "geometry": { "type": "Polygon", "coordinates": [[[-80.15, 43.92], [-80.18, 43.95], [-80.20, 43.98], [-80.12, 44.00], [-80.05, 44.02], [-80.02, 43.98], [-80.00, 43.95], [-80.08, 43.93], [-80.15, 43.92]]] } },
                { "type": "Feature", "properties": { "id": "algoma", "type_org": "municipal", "utility": "Algoma Power", "region": "Algoma, Huron Shores, Blind River, Thessalon, Bruce Mines", "customers": "12K", "line_km": "1,800", "density": "6", "mix": "Grid", "saidi": 1.60, "saifi": 1.70 }, "geometry": { "type": "Polygon", "coordinates": [[[-84.45, 46.55], [-84.48, 46.78], [-84.50, 47.00], [-84.00, 47.10], [-83.50, 47.20], [-83.48, 46.90], [-83.45, 46.60], [-83.95, 46.58], [-84.45, 46.55]]] } },
                { "type": "Feature", "properties": { "id": "elk", "type_org": "municipal", "utility": "E.L.K. Energy", "region": "Kingsville, Lakeshore, Essex County", "customers": "12K", "line_km": "400", "density": "30", "mix": "Grid", "saidi": 1.15, "saifi": 1.25 }, "geometry": { "type": "Polygon", "coordinates": [[[-82.85, 42.05], [-82.88, 42.10], [-82.90, 42.15], [-82.82, 42.18], [-82.75, 42.20], [-82.72, 42.15], [-82.70, 42.10], [-82.78, 42.08], [-82.85, 42.05]]] } },
                { "type": "Feature", "properties": { "id": "ottawa-river", "type_org": "municipal", "utility": "Ottawa River Power", "region": "Pembroke, Deep River, Laurentian Hills, Killaloe", "customers": "11K", "line_km": "450", "density": "24", "mix": "Grid", "saidi": 1.20, "saifi": 1.30 }, "geometry": { "type": "Polygon", "coordinates": [[[-77.15, 45.75], [-77.20, 45.80], [-77.25, 45.85], [-77.15, 45.88], [-77.05, 45.92], [-77.00, 45.86], [-76.95, 45.80], [-77.05, 45.78], [-77.15, 45.75]]] } },
                { "type": "Feature", "properties": { "id": "lakefront", "type_org": "municipal", "utility": "Lakefront Utilities", "region": "Cobourg, Alnwick/Haldimand", "customers": "10K", "line_km": "350", "density": "28", "mix": "Grid", "saidi": 1.05, "saifi": 1.15 }, "geometry": { "type": "Polygon", "coordinates": [[[-78.22, 43.98], [-78.25, 44.02], [-78.28, 44.05], [-78.20, 44.06], [-78.12, 44.08], [-78.10, 44.04], [-78.08, 44.00], [-78.15, 43.99], [-78.22, 43.98]]] } },
                { "type": "Feature", "properties": { "id": "notl", "type_org": "municipal", "utility": "Niagara-on-the-Lake Hydro", "region": "Niagara-on-the-Lake, NOTL", "customers": "9K", "line_km": "400", "density": "22", "mix": "Grid", "saidi": 1.15, "saifi": 1.25 }, "geometry": { "type": "Polygon", "coordinates": [[[-79.15, 43.22], [-79.18, 43.26], [-79.20, 43.30], [-79.14, 43.31], [-79.08, 43.32], [-79.06, 43.28], [-79.05, 43.25], [-79.10, 43.24], [-79.15, 43.22]]] } },
                { "type": "Feature", "properties": { "id": "cw", "type_org": "municipal", "utility": "Centre Wellington Hydro", "region": "Elora, Fergus, Centre Wellington", "customers": "7K", "line_km": "300", "density": "23", "mix": "Grid", "saidi": 1.10, "saifi": 1.20 }, "geometry": { "type": "Polygon", "coordinates": [[[-80.42, 43.68], [-80.45, 43.72], [-80.48, 43.75], [-80.42, 43.76], [-80.35, 43.78], [-80.34, 43.74], [-80.32, 43.70], [-80.38, 43.69], [-80.42, 43.68]]] } },
                { "type": "Feature", "properties": { "id": "tillsonburg", "type_org": "municipal", "utility": "Tillsonburg Hydro", "region": "Tillsonburg, Oxford County", "customers": "7K", "line_km": "250", "density": "28", "mix": "Grid", "saidi": 1.05, "saifi": 1.15 }, "geometry": { "type": "Polygon", "coordinates": [[[-80.75, 42.82], [-80.78, 42.86], [-80.80, 42.90], [-80.74, 42.92], [-80.68, 42.95], [-80.65, 42.90], [-80.62, 42.85], [-80.68, 42.84], [-80.75, 42.82]]] } },
                { "type": "Feature", "properties": { "id": "rideau", "type_org": "municipal", "utility": "Rideau St. Lawrence", "region": "Prescott, Cardinal, South Dundas", "customers": "6K", "line_km": "250", "density": "24", "mix": "Grid", "saidi": 1.20, "saifi": 1.30 }, "geometry": { "type": "Polygon", "coordinates": [[[-75.75, 44.75], [-75.78, 44.80], [-75.82, 44.85], [-75.74, 44.88], [-75.65, 44.90], [-75.62, 44.85], [-75.58, 44.80], [-75.66, 44.78], [-75.75, 44.75]]] } },
                { "type": "Feature", "properties": { "id": "northern-wires", "type_org": "municipal", "utility": "Northern Ontario Wires", "region": "Cochrane, Iroquois Falls, Kapuskasing", "customers": "6K", "line_km": "300", "density": "20", "mix": "Grid", "saidi": 1.35, "saifi": 1.45 }, "geometry": { "type": "Polygon", "coordinates": [[[-81.05, 49.05], [-81.10, 49.18], [-81.15, 49.30], [-81.00, 49.35], [-80.85, 49.40], [-80.80, 49.25], [-80.75, 49.10], [-80.90, 49.08], [-81.05, 49.05]]] } },
                { "type": "Feature", "properties": { "id": "hydro-hawk", "type_org": "municipal", "utility": "Hydro Hawkesbury", "region": "Hawkesbury, Prescott-Russell", "customers": "5K", "line_km": "140", "density": "35", "mix": "Grid", "saidi": 1.00, "saifi": 1.10 }, "geometry": { "type": "Polygon", "coordinates": [[[-74.62, 45.58], [-74.65, 45.62], [-74.68, 45.65], [-74.62, 45.66], [-74.55, 45.68], [-74.54, 45.64], [-74.52, 45.60], [-74.58, 45.59], [-74.62, 45.58]]] } },
                { "type": "Feature", "properties": { "id": "renfrew", "type_org": "municipal", "utility": "Renfrew Hydro", "region": "Renfrew, Renfrew County", "customers": "4K", "line_km": "150", "density": "26", "mix": "Grid", "saidi": 1.15, "saifi": 1.25 }, "geometry": { "type": "Polygon", "coordinates": [[[-76.72, 45.42], [-76.75, 45.45], [-76.78, 45.48], [-76.72, 45.50], [-76.65, 45.52], [-76.62, 45.48], [-76.60, 45.45], [-76.66, 45.44], [-76.72, 45.42]]] } },
                { "type": "Feature", "properties": { "id": "fort-frances", "type_org": "municipal", "utility": "Fort Frances Power", "region": "Fort Frances, Rainy River District", "customers": "3.5K", "line_km": "150", "density": "23", "mix": "Grid", "saidi": 1.25, "saifi": 1.35 }, "geometry": { "type": "Polygon", "coordinates": [[[-93.45, 48.58], [-93.48, 48.62], [-93.52, 48.65], [-93.44, 48.66], [-93.35, 48.68], [-93.32, 48.64], [-93.28, 48.60], [-93.36, 48.59], [-93.45, 48.58]]] } },
                { "type": "Feature", "properties": { "id": "sioux", "type_org": "municipal", "utility": "Sioux Lookout Hydro", "region": "Sioux Lookout, Kenora District", "customers": "2.8K", "line_km": "130", "density": "21", "mix": "Grid", "saidi": 1.35, "saifi": 1.45 }, "geometry": { "type": "Polygon", "coordinates": [[[-91.95, 50.05], [-92.00, 50.10], [-92.05, 50.15], [-91.95, 50.18], [-91.85, 50.20], [-91.80, 50.15], [-91.75, 50.10], [-91.85, 50.08], [-91.95, 50.05]]] } },
                { "type": "Feature", "properties": { "id": "hearst", "type_org": "municipal", "utility": "Hearst Power", "region": "Hearst, Cochrane District", "customers": "2.5K", "line_km": "180", "density": "13", "mix": "Grid", "saidi": 1.45, "saifi": 1.55 }, "geometry": { "type": "Polygon", "coordinates": [[[-83.65, 49.68], [-83.70, 49.72], [-83.75, 49.75], [-83.65, 49.78], [-83.55, 49.80], [-83.50, 49.75], [-83.45, 49.70], [-83.55, 49.69], [-83.65, 49.68]]] } },
                { "type": "Feature", "properties": { "id": "coop-embrun", "type_org": "municipal", "utility": "Cooperative Hydro Embrun", "region": "Embrun, Russell Township", "customers": "2.5K", "line_km": "150", "density": "16", "mix": "Grid", "saidi": 1.15, "saifi": 1.25 }, "geometry": { "type": "Polygon", "coordinates": [[[-75.28, 45.22], [-75.30, 45.25], [-75.32, 45.28], [-75.28, 45.30], [-75.22, 45.32], [-75.20, 45.28], [-75.18, 45.25], [-75.22, 45.24], [-75.28, 45.22]]] } },
                { "type": "Feature", "properties": { "id": "atikokan", "type_org": "municipal", "utility": "Atikokan Hydro", "region": "Atikokan, Rainy River District", "customers": "1.6K", "line_km": "120", "density": "13", "mix": "Grid", "saidi": 1.35, "saifi": 1.45 }, "geometry": { "type": "Polygon", "coordinates": [[[-91.62, 48.72], [-91.65, 48.75], [-91.68, 48.78], [-91.62, 48.80], [-91.55, 48.82], [-91.52, 48.78], [-91.50, 48.75], [-91.56, 48.74], [-91.62, 48.72]]] } },
                { "type": "Feature", "properties": { "id": "hydro-2000", "type_org": "municipal", "utility": "Hydro 2000", "region": "Alfred, Plantagenet", "customers": "1.2K", "line_km": "80", "density": "15", "mix": "Grid", "saidi": 1.25, "saifi": 1.35 }, "geometry": { "type": "Polygon", "coordinates": [[[-74.95, 45.52], [-75.00, 45.55], [-75.05, 45.58], [-74.95, 45.60], [-74.85, 45.62], [-74.80, 45.58], [-74.75, 45.55], [-74.85, 45.54], [-74.95, 45.52]]] } },
                { "type": "Feature", "properties": { "id": "attawapiskat", "type_org": "municipal", "utility": "Attawapiskat Power", "region": "Attawapiskat First Nation", "customers": "900", "line_km": "50", "density": "18", "mix": "Diesel Microgrid", "saidi": 2.80, "saifi": 3.10 }, "geometry": { "type": "Polygon", "coordinates": [[[-82.42, 52.85], [-82.45, 52.88], [-82.48, 52.92], [-82.42, 52.95], [-82.35, 52.98], [-82.32, 52.94], [-82.28, 52.90], [-82.35, 52.88], [-82.42, 52.85]]] } },
                { "type": "Feature", "properties": { "id": "fort-albany", "type_org": "municipal", "utility": "Fort Albany Power", "region": "Fort Albany First Nation", "customers": "800", "line_km": "40", "density": "20", "mix": "Diesel Microgrid", "saidi": 2.90, "saifi": 3.20 }, "geometry": { "type": "Polygon", "coordinates": [[[-81.65, 52.15], [-81.68, 52.18], [-81.72, 52.22], [-81.65, 52.25], [-81.55, 52.28], [-81.52, 52.24], [-81.48, 52.20], [-81.55, 52.18], [-81.65, 52.15]]] } },
                { "type": "Feature", "properties": { "id": "kashechewan", "type_org": "municipal", "utility": "Kashechewan Power", "region": "Kashechewan First Nation", "customers": "800", "line_km": "45", "density": "17", "mix": "Diesel Microgrid", "saidi": 2.85, "saifi": 3.15 }, "geometry": { "type": "Polygon", "coordinates": [[[-81.72, 52.25], [-81.76, 52.28], [-81.80, 52.32], [-81.72, 52.35], [-81.65, 52.38], [-81.62, 52.34], [-81.58, 52.30], [-81.65, 52.28], [-81.72, 52.25]]] } }
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
            "Dark Mode": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', { 
                maxNativeZoom: 16, maxZoom: 18, attribution: '&copy; Esri' 
            }),
            "Light Mode": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', { 
                maxNativeZoom: 16, maxZoom: 18, attribution: '&copy; Esri' 
            }),
            "Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { 
                maxNativeZoom: 19, maxZoom: 19, attribution: '&copy; Esri' 
            }),
            "Street Map": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
                maxNativeZoom: 19, maxZoom: 19, attribution: '&copy; OpenStreetMap' 
            })
        };
    }

    function setupMapControls(mapInstance, includeGeocoder = false) {
        const baseMaps = createBasemaps();
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const defaultBasemap = isLight ? baseMaps["Light Mode"] : baseMaps["Dark Mode"];
        
        defaultBasemap.addTo(mapInstance);
        attachLocateControl(mapInstance);
        attachResetControl(mapInstance); 
        L.control.layers(baseMaps, null, { position: 'bottomright', collapsed: true }).addTo(mapInstance);
        
        if (includeGeocoder) {
            attachCustomGeocoder(mapInstance);
        }
    }

    // ENHANCEMENT 1: Consolidated Intersection Observer helper to prevent memory leaks and keep code DRY.
    function bindMapObserver(mapInstance, elementId) {
        const mapEl = document.getElementById(elementId);
        if (!mapEl) return;
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) { mapInstance.invalidateSize(); }
        });
        observer.observe(mapEl);
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

    function attachResetControl(mapInstance) {
        const ResetControl = L.Control.extend({
            options: { position: 'bottomright' },
            onAdd: function() {
                const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
                const button = L.DomUtil.create('a', 'leaflet-control-reset-btn', container);
                button.href = '#'; button.title = 'Reset to National View'; button.role = 'button'; button.innerHTML = `🇨🇦`;
                L.DomEvent.disableClickPropagation(button);
                L.DomEvent.on(button, 'click', function(e) {
                    L.DomEvent.stop(e);
                    mapInstance.closePopup();
                    mapInstance.flyTo([58.0, -98.0], 3, { duration: 1.5, easeLinearity: 0.25 });
                });
                return container;
            }
        });
        mapInstance.addControl(new ResetControl());
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
            const canadaBounds = L.latLngBounds(L.latLng(41.0, -142.0), L.latLng(84.0, -52.0));
            
            initReliabilityMap(db.utilitiesGeoJSON, canadaBounds); 
            initForecastMap(db.forecastRegions, canadaBounds);
            initDeficitMap(db.deficitGrids, canadaBounds);
            initOffGridMap(db.offgridZones, db.directoryData, canadaBounds);
            initNewsFeed();
        }
    }, 100);

    // ==========================================
    // MAP INITIALIZATIONS (CANVAS RENDERER + BOUNDS)
    // ==========================================
    function initReliabilityMap(utilitiesGeoJSON, canadaBounds) {
        const mapEl = document.getElementById('leaflet-map');
        if (!mapEl) return;

        const map = L.map('leaflet-map', { 
            preferCanvas: true, 
            zoomControl: false, 
            scrollWheelZoom: false, 
            dragging: true, 
            touchZoom: true, 
            maxBounds: canadaBounds, 
            maxBoundsViscosity: 1.0, 
            minZoom: 3 
        }).setView([58.0, -98.0], 3); 
        
        L.control.zoom({ position: 'bottomright' }).addTo(map);
        
        bindMapObserver(map, 'leaflet-map');

        map.createPane('provincialPane'); map.getPane('provincialPane').style.zIndex = 400;
        map.createPane('municipalPane'); map.getPane('municipalPane').style.zIndex = 500;
        map.createPane('labels'); map.getPane('labels').style.zIndex = 650; map.getPane('labels').style.pointerEvents = 'none';

        setupMapControls(map, true);

        const layerMap = {};
        function getColor(saidi) { return saidi < 1.0 ? '#10b981' : saidi <= 1.8 ? '#f59e0b' : '#ef4444'; }

        // ==========================================
        // OPTIMIZED "GHOST LAYER" & HIGH-CONTRAST LDC STYLING
        // ==========================================
        let geojsonLayer = L.geoJSON(utilitiesGeoJSON, { 
            smoothFactor: 1.5, 
            style: function(f) { 
                const isHydroOne = f.properties.id === 'ho';
                const isProv = f.properties.type_org === 'provincial';
                
                let polyFillOpacity = isHydroOne ? 0.08 : (isProv ? 0.15 : 0.45);
                let borderOpacity = isHydroOne ? 0.0 : (isProv ? 0.4 : 0.90);
                let borderWeight = isHydroOne ? 0 : (isProv ? 1 : 2.0);

                return { 
                    fillColor: getColor(f.properties.saidi), 
                    weight: borderWeight, 
                    opacity: borderOpacity, 
                    color: getColor(f.properties.saidi), 
                    fillOpacity: polyFillOpacity, 
                    lineJoin: 'round', 
                    lineCap: 'round'
                }; 
            }, 
            onEachFeature: function(f, layer) {
                layerMap[f.properties.id] = layer;
                layer.options.pane = f.properties.type_org === 'provincial' ? 'provincialPane' : 'municipalPane';
                
                layer.bindTooltip(`<div style="padding: 2px 4px;"><strong style="font-size: 0.85rem; display:block; color: var(--text-main);">${f.properties.utility}</strong><span style="color: var(--text-muted); font-size: 0.75rem;">${f.properties.region} &bull; ${f.properties.customers} Cust.</span></div>`, { className: 'dark-tooltip', sticky: true, direction: 'auto' });
                layer.bindPopup(`<div style="min-width: 260px; padding: 4px;"><div style="font-size: 0.75rem; text-transform: uppercase; color: var(--accent); font-weight: 800; margin-bottom: 4px;">${f.properties.region}</div><strong style="font-size: 1.15rem; color: var(--text-main); display: block; margin-bottom: 10px; border-bottom: 1px solid var(--border-main); padding-bottom: 6px;">${f.properties.utility}</strong><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;"><div style="background: var(--hover-overlay); padding: 8px; border-radius: 6px;"><span style="display:block; color: var(--text-muted); font-size: 0.7rem;">Customer Pop.</span><strong style="font-size: 0.9rem; color: var(--text-main);">${f.properties.customers}</strong></div><div style="background: var(--hover-overlay); padding: 8px; border-radius: 6px;"><span style="display:block; color: var(--text-muted); font-size: 0.7rem;">Route Length</span><strong style="font-size: 0.9rem; color: var(--text-main);">${f.properties.line_km} km</strong></div></div><div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.8rem;"><span style="color: var(--text-muted);">Grid Density:</span><strong style="color: #10b981;">${f.properties.density} /km</strong></div><div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.8rem; border-bottom: 1px solid var(--border-main); padding-bottom: 8px;"><span style="color: var(--text-muted);">Generation Mix:</span><strong style="text-align: right; color: var(--text-main);">${f.properties.mix}</strong></div><div style="display: flex; justify-content: space-between; align-items: flex-end;"><div><span style="display:block; color: var(--text-muted); font-size: 0.7rem;">OEB SAIDI</span><strong style="color: ${getColor(f.properties.saidi)}; font-size: 1.05rem;">${f.properties.saidi} hrs</strong></div><div style="text-align: right;"><span style="display:block; color: var(--text-muted); font-size: 0.7rem;">OEB SAIFI</span><strong style="color: ${getColor(f.properties.saidi)}; font-size: 1.05rem;">${f.properties.saifi}</strong></div></div></div>`);
                
                layer.on({ 
                    mouseover: (e) => { 
                        e.target.setStyle({ weight: 3, opacity: 1, fillOpacity: 0.75 }); 
                        document.getElementById(`row-${f.properties.id}`)?.classList.add('active'); 
                    }, 
                    mouseout: (e) => { 
                        geojsonLayer.resetStyle(e.target); 
                        document.getElementById(`row-${f.properties.id}`)?.classList.remove('active'); 
                    }, 
                    click: () => selectUtility(f.properties.id) 
                });
            }
        }).addTo(map);

        // ==========================================
        // NORMALIZATION & MULTI-KEY BOUNDARY INGESTION ENGINE
        // ==========================================
        function normalizeName(str) {
            if (!str) return '';
            return str.toString().toUpperCase()
                .replace(/^(CITY|TOWN|TOWNSHIP|MUNICIPALITY|VILLAGE|COUNTY)\s+OF\s+/i, '')
                .replace(/^(VILLAGE|TOWN|CITY|TOWNSHIP|MUNICIPALITY)\s+/i, '')
                .replace(/[^A-Z0-9]/g, '');
        }

        function extractPolygonRings(geom) {
            if (!geom) return [];
            if (geom.type === 'Polygon') return [geom.coordinates];
            if (geom.type === 'MultiPolygon') return geom.coordinates;
            return [];
        }

        const boundaryLookup = {
            "OTTAWA": "hydro-ottawa",
            "CASSELMAN": "hydro-ottawa",
            "LONDON": "london-hydro",
            "TORONTO": "toronto-hydro",
            "MISSISSAUGA": "alectra",
            "BRAMPTON": "alectra",
            "HAMILTON": "alectra",
            "GUELPH": "alectra",
            "MARKHAM": "alectra",
            "VAUGHAN": "alectra",
            "BARRIE": "alectra",
            "STCATHARINES": "alectra",
            "SAINTCATHARINES": "alectra",
            "AURORA": "alectra",
            "BRADFORDWESTGWILLIMBURY": "alectra",
            "NEWTECUMSETH": "alectra",
            "PENETANGUISHENE": "alectra",
            "KITCHENER": "enova",
            "WATERLOO": "enova",
            "WELLESLEY": "enova",
            "WOOLWICH": "enova",
            "WILMOT": "enova",
            "BRANTFORD": "grandbridge",
            "CAMBRIDGE": "grandbridge",
            "BRANT": "grandbridge",
            "COUNTYOFBRANT": "grandbridge",
            "NORTHDUMFRIES": "grandbridge",
            "WINDSOR": "enwin",
            "NIAGARAFALLS": "niagara-pen",
            "PELHAM": "niagara-pen",
            "LINCOLN": "niagara-pen",
            "WESTLINCOLN": "niagara-pen",
            "GRIMSBY": "niagara-pen",
            "OAKVILLE": "oakville",
            "BURLINGTON": "burlington",
            "CHATHAMKENT": "entegrus",
            "STRATHROYCARADOC": "entegrus",
            "DUTTONDUNWICH": "entegrus",
            "DUTTON": "entegrus",
            "DUNWICH": "entegrus",
            "STTHOMAS": "entegrus",
            "SAINTTHOMAS": "entegrus",
            "OSHAWA": "oshawa",
            "THUNDERBAY": "synergy",
            "KENORA": "synergy",
            "NEWMARKET": "newmarket-tay",
            "TAY": "newmarket-tay",
            "MIDLAND": "newmarket-tay",
            "GREATERSUDBURY": "greater-sudbury",
            "SUDBURY": "greater-sudbury",
            "WESTNIPISSING": "greater-sudbury",
            "MILTON": "milton",
            "BELLEVILLE": "elexicon-belleville",
            "WHITBY": "elexicon",
            "AJAX": "elexicon",
            "PICKERING": "elexicon",
            "CLARINGTON": "elexicon",
            "PORTHOPE": "elexicon",
            "SARNIA": "bluewater",
            "PETROLIA": "bluewater",
            "STCLAIR": "bluewater",
            "SAINTCLAIR": "bluewater",
            "POINTEDWARD": "bluewater",
            "WARWICK": "bluewater",
            "BROOKEALVINSTON": "bluewater",
            "SAULTSTEMARIE": "puc-ssm",
            "SAULTSTE": "puc-ssm",
            "ESSEX": "essex",
            "AMHERSTBURG": "essex",
            "LASALLE": "essex",
            "TECUMSEH": "essex",
            "KINGSTON": "kingston",
            "FORTERIE": "cn-power",
            "PORTCOLBORNE": "cn-power",
            "CORNWALL": "cornwall",
            "SOUTHGLENGARRY": "cornwall",
            "WELLAND": "welland",
            "INGERSOLL": "erth",
            "AYLMER": "erth",
            "CENTRALELGIN": "erth",
            "BAYHAM": "erth",
            "WESTPERTH": "erth",
            "NORTHBAY": "north-bay",
            "HALTONHILLS": "halton-hills",
            "COLLINGWOOD": "epcor-on",
            "THEBLUEMOUNTAINS": "epcor-on",
            "BLUEMOUNTAINS": "epcor-on",
            "STRATFORD": "festival",
            "STMARYS": "festival",
            "SAINTMARYS": "festival",
            "SOUTHHURON": "festival",
            "INNISFIL": "innpower",
            "HUNTSVILLE": "lakeland",
            "BRACEBRIDGE": "lakeland",
            "PARRYSOUND": "lakeland",
            "MAGNETAWAN": "lakeland",
            "PERRY": "lakeland",
            "BURKSFALLS": "lakeland",
            "WASAGABEACH": "wasaga",
            "WASAGA": "wasaga",
            "ORANGEVILLE": "orangeville",
            "GRANDVALLEY": "orangeville",
            "HURONSHORES": "algoma",
            "BLINDRIVER": "algoma",
            "THENORTHSHORE": "algoma",
            "NORTHSHORE": "algoma",
            "THESSALON": "algoma",
            "BRUCEMINES": "algoma",
            "PLUMMERADDITIONAL": "algoma",
            "HILTONBEACH": "algoma",
            "KINGSVILLE": "elk",
            "LAKESHORE": "elk",
            "PEMBROKE": "ottawa-river",
            "DEEPRIVER": "ottawa-river",
            "LAURENTIANHILLS": "ottawa-river",
            "KILLALOEHAGARTYANDRICHARDS": "ottawa-river",
            "COBOURG": "lakefront",
            "ALNWICKHALDIMAND": "lakefront",
            "NIAGARAONTHELAKE": "notl",
            "CENTREWELLINGTON": "cw",
            "TILLSONBURG": "tillsonburg",
            "PRESCOTT": "rideau",
            "CARDINAL": "rideau",
            "SOUTHDUNDAS": "rideau",
            "EDWARDSBURGHCARDINAL": "rideau",
            "COCHRANE": "northern-wires",
            "IROQUOISFALLS": "northern-wires",
            "KAPUSKASING": "northern-wires",
            "HAWKESBURY": "hydro-hawk",
            "RENFREW": "renfrew",
            "FORTFRANCES": "fort-frances",
            "SIOUXLOOKOUT": "sioux",
            "HEARST": "hearst",
            "RUSSELL": "coop-embrun",
            "EMBRUN": "coop-embrun",
            "ATIKOKAN": "atikokan",
            "ALFREDANDPLANTAGENET": "hydro-2000"
        };

        fetch('data/ontario_cities.geojson')
            .then(res => res.json())
            .then(highResData => {
                const ldcGeomMap = {};

                highResData.features.forEach(hiResFeature => {
                    const p = hiResFeature.properties || {};
                    const rawName = p.MUNICIPAL_NAME || p.MUNICIPAL_NAME_SHORTFORM || p.MUN_NAME || p.LDC_NAME || p.NAME || p.MUNICIPALITY || '';
                    const norm = normalizeName(rawName);
                    const ldcId = boundaryLookup[norm] || 'ho';

                    const rings = extractPolygonRings(hiResFeature.geometry);
                    if (!ldcGeomMap[ldcId]) ldcGeomMap[ldcId] = [];
                    ldcGeomMap[ldcId].push(...rings);
                });

                // ENHANCEMENT 2: Safe geometry assignment to prevent core DB mutation errors
                for (const [ldcId, rings] of Object.entries(ldcGeomMap)) {
                    const ldcFeature = utilitiesGeoJSON.features.find(f => f.properties.id === ldcId);
                    if (ldcFeature && rings.length > 0) {
                        ldcFeature.geometry = JSON.parse(JSON.stringify({
                            type: "MultiPolygon",
                            coordinates: rings
                        }));
                    }
                }

                geojsonLayer.clearLayers();
                geojsonLayer.addData(utilitiesGeoJSON);
                buildTable(utilitiesGeoJSON.features);
            })
            .catch(err => console.log("High-res boundary file not found. Falling back to default DB coordinates.", err));

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
                
                // ENHANCEMENT 3: Safe event triggers for table rows preventing undefined layer errors
                row.addEventListener('mouseenter', () => { if(layerMap[p.id]) layerMap[p.id].fire('mouseover'); });
                row.addEventListener('mouseleave', () => { if(layerMap[p.id]) layerMap[p.id].fire('mouseout'); });
                
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
            const layer = layerMap[id];
            if (!layer) return;
            
            map.fitBounds(layer.getBounds(), { padding: [50, 50], maxZoom: 11 });
            layer.openPopup();
            
            document.querySelectorAll('.utility-row').forEach(r => r.classList.remove('active'));
            document.getElementById(`row-${id}`)?.classList.add('active');
            document.getElementById(`row-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        let searchTimeout;
        document.getElementById('search-input')?.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const query = e.target.value.toLowerCase().trim();
                const filtered = utilitiesGeoJSON.features.filter(f => 
                    f.properties.utility.toLowerCase().includes(query) || 
                    f.properties.region.toLowerCase().includes(query) ||
                    f.properties.id.toLowerCase().includes(query)
                );
                buildTable(filtered); 
                geojsonLayer.clearLayers(); 
                geojsonLayer.addData({ type: "FeatureCollection", features: filtered });
            }, 250);
        });
        window.addEventListener('resize', () => map.invalidateSize());
    }

    function initForecastMap(regions, canadaBounds) {
        const mapEl = document.getElementById('forecast-map-premium'); if (!mapEl) return;
        const forecastMap = L.map('forecast-map-premium', { 
            preferCanvas: true,
            zoomControl: false, 
            scrollWheelZoom: false, 
            dragging: true, 
            touchZoom: true, 
            maxBounds: canadaBounds, 
            maxBoundsViscosity: 1.0, 
            minZoom: 3 
        }).setView([58.0, -98.0], 3);
        
        L.control.zoom({ position: 'bottomright' }).addTo(forecastMap);
        bindMapObserver(forecastMap, 'forecast-map-premium');
        setupMapControls(forecastMap, false);
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
            preferCanvas: true,
            zoomControl: false, 
            scrollWheelZoom: false, 
            dragging: true, 
            touchZoom: true, 
            maxBounds: canadaBounds, 
            maxBoundsViscosity: 1.0, 
            minZoom: 3 
        }).setView([58.0, -98.0], 3);
        
        L.control.zoom({ position: 'bottomright' }).addTo(deficitMap);
        bindMapObserver(deficitMap, 'deficit-leaflet-map');
        setupMapControls(deficitMap, false);
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
            preferCanvas: true,
            zoomControl: false, 
            scrollWheelZoom: false, 
            dragging: true, 
            touchZoom: true, 
            maxBounds: canadaBounds, 
            maxBoundsViscosity: 1.0, 
            minZoom: 3 
        }).setView([58.0, -98.0], 3);
        
        L.control.zoom({ position: 'bottomright' }).addTo(offgridMap);
        bindMapObserver(offgridMap, 'offgrid-leaflet-map');
        setupMapControls(offgridMap, false);
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
        
        const targetUrl = `https://news.google.com/rss/search?q=Canada+electric+utility+OR+grid+OR+hydro+when:7d&hl=en-CA&gl=CA&ceid=CA:en&cb=${Date.now()}`;
        
        const primaryProxy = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
        const secondaryProxy = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}&disableCache=true`;

        fetch(primaryProxy)
            .then(res => {
                if (!res.ok) throw new Error('Primary Proxy Failed');
                return res.text();
            })
            .then(str => new DOMParser().parseFromString(str, "text/xml"))
            .then(data => processFeed(data, container))
            .catch(() => {
                fetch(secondaryProxy)
                    .then(res => {
                        if (!res.ok) throw new Error('Secondary Proxy Failed');
                        return res.json();
                    })
                    .then(data => new DOMParser().parseFromString(data.contents, "text/xml"))
                    .then(data => processFeed(data, container))
                    .catch(() => renderFallbackNews(container)); 
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
            
            const lastHyphenIndex = title.lastIndexOf(' - ');
            if (lastHyphenIndex !== -1) {
                src = title.substring(lastHyphenIndex + 3).trim();
                title = title.substring(0, lastHyphenIndex).trim();
            }
            
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

});
