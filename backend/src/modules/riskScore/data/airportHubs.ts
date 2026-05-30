// Airport Traffic — Static Local Database.
//
// Pre-seeded from OpenFlights (https://openflights.org/data.html) major hubs,
// annotated with approximate pre-pandemic annual passenger throughput (millions).
// A region's `airportTraffic` factor is derived by finding the nearest hub to
// its coordinates and converting that hub's throughput into a 0–100 index.
//
// This is intentionally a curated subset of the largest global gateways — the
// nearest-hub heuristic only needs enough coverage that any populated point on
// earth maps to a plausible regional gateway.

import { haversineKm } from "../../../lib/fetchJson";

export interface AirportHub {
  iata: string;
  name: string;
  lat: number;
  lng: number;
  paxMillions: number;
}

export const AIRPORT_HUBS: AirportHub[] = [
  // North America
  { iata: "ATL", name: "Atlanta", lat: 33.6367, lng: -84.4281, paxMillions: 110 },
  { iata: "LAX", name: "Los Angeles", lat: 33.9425, lng: -118.4081, paxMillions: 88 },
  { iata: "ORD", name: "Chicago O'Hare", lat: 41.9786, lng: -87.9048, paxMillions: 84 },
  { iata: "DFW", name: "Dallas/Fort Worth", lat: 32.8968, lng: -97.038, paxMillions: 75 },
  { iata: "JFK", name: "New York JFK", lat: 40.6398, lng: -73.7789, paxMillions: 62 },
  { iata: "YYZ", name: "Toronto Pearson", lat: 43.6772, lng: -79.6306, paxMillions: 50 },
  { iata: "MEX", name: "Mexico City", lat: 19.4363, lng: -99.0721, paxMillions: 50 },
  // South America
  { iata: "GRU", name: "Sao Paulo Guarulhos", lat: -23.4356, lng: -46.4731, paxMillions: 43 },
  { iata: "BOG", name: "Bogota El Dorado", lat: 4.7016, lng: -74.1469, paxMillions: 35 },
  { iata: "EZE", name: "Buenos Aires Ezeiza", lat: -34.8222, lng: -58.5358, paxMillions: 23 },
  { iata: "LIM", name: "Lima", lat: -12.0219, lng: -77.1143, paxMillions: 23 },
  // Europe
  { iata: "LHR", name: "London Heathrow", lat: 51.4706, lng: -0.4619, paxMillions: 80 },
  { iata: "CDG", name: "Paris Charles de Gaulle", lat: 49.0097, lng: 2.5479, paxMillions: 76 },
  { iata: "AMS", name: "Amsterdam Schiphol", lat: 52.3086, lng: 4.7639, paxMillions: 71 },
  { iata: "FRA", name: "Frankfurt", lat: 50.0379, lng: 8.5622, paxMillions: 70 },
  { iata: "IST", name: "Istanbul", lat: 41.2753, lng: 28.7519, paxMillions: 68 },
  { iata: "MAD", name: "Madrid Barajas", lat: 40.4936, lng: -3.5668, paxMillions: 61 },
  { iata: "SVO", name: "Moscow Sheremetyevo", lat: 55.9726, lng: 37.4146, paxMillions: 49 },
  // Middle East / Africa
  { iata: "DXB", name: "Dubai", lat: 25.2532, lng: 55.3657, paxMillions: 86 },
  { iata: "DOH", name: "Doha Hamad", lat: 25.2731, lng: 51.6081, paxMillions: 38 },
  { iata: "JNB", name: "Johannesburg", lat: -26.1392, lng: 28.246, paxMillions: 21 },
  { iata: "CAI", name: "Cairo", lat: 30.1219, lng: 31.4056, paxMillions: 21 },
  { iata: "LOS", name: "Lagos", lat: 6.5774, lng: 3.3212, paxMillions: 7 },
  // Asia
  { iata: "PEK", name: "Beijing Capital", lat: 40.0801, lng: 116.5846, paxMillions: 100 },
  { iata: "HND", name: "Tokyo Haneda", lat: 35.5523, lng: 139.7798, paxMillions: 87 },
  { iata: "PVG", name: "Shanghai Pudong", lat: 31.1443, lng: 121.8083, paxMillions: 76 },
  { iata: "DEL", name: "Delhi", lat: 28.5562, lng: 77.1, paxMillions: 70 },
  { iata: "CAN", name: "Guangzhou", lat: 23.3924, lng: 113.2988, paxMillions: 73 },
  { iata: "HKG", name: "Hong Kong", lat: 22.308, lng: 113.9185, paxMillions: 71 },
  { iata: "ICN", name: "Seoul Incheon", lat: 37.4602, lng: 126.4407, paxMillions: 71 },
  { iata: "BKK", name: "Bangkok Suvarnabhumi", lat: 13.69, lng: 100.7501, paxMillions: 65 },
  { iata: "SIN", name: "Singapore Changi", lat: 1.3644, lng: 103.9915, paxMillions: 68 },
  { iata: "KUL", name: "Kuala Lumpur", lat: 2.7456, lng: 101.7099, paxMillions: 60 },
  { iata: "CGK", name: "Jakarta Soekarno-Hatta", lat: -6.1256, lng: 106.6559, paxMillions: 66 },
  { iata: "BOM", name: "Mumbai", lat: 19.0887, lng: 72.8679, paxMillions: 49 },
  // Oceania
  { iata: "SYD", name: "Sydney", lat: -33.9461, lng: 151.1772, paxMillions: 44 },
  { iata: "MEL", name: "Melbourne", lat: -37.6733, lng: 144.8433, paxMillions: 37 },
  { iata: "AKL", name: "Auckland", lat: -37.0081, lng: 174.7917, paxMillions: 21 },
];

const MAX_PAX = Math.max(...AIRPORT_HUBS.map((h) => h.paxMillions));

export interface NearestHub {
  hub: AirportHub;
  distanceKm: number;
  trafficIndex: number;
}

export function nearestHub(lat: number, lng: number): NearestHub {
  let best = AIRPORT_HUBS[0]!;
  let bestDist = haversineKm(lat, lng, best.lat, best.lng);
  for (const hub of AIRPORT_HUBS) {
    const d = haversineKm(lat, lng, hub.lat, hub.lng);
    if (d < bestDist) {
      best = hub;
      bestDist = d;
    }
  }

  const proximity = Math.exp(-bestDist / 1500);
  const trafficIndex =
    Math.round(Math.min(100, (best.paxMillions / MAX_PAX) * 100 * proximity) * 10) /
    10;

  return { hub: best, distanceKm: Math.round(bestDist), trafficIndex };
}
