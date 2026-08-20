/**
 * ReliefNet - Geospatial Utilities
 * 
 * Distance calculation, bounding box queries, ETA estimation, and distance formatting
 * optimized for disaster relief matching and map visualization.
 */

/**
 * Calculates the great-circle distance between two geographic coordinates
 * using the Haversine formula.
 * 
 * @param {number} lat1 - Latitude of starting point
 * @param {number} lng1 - Longitude of starting point
 * @param {number} lat2 - Latitude of destination point
 * @param {number} lng2 - Longitude of destination point
 * @returns {number} Distance in kilometers (rounded to 2 decimal places)
 */
export function haversineDistance(lat1, lng1, lat2, lng2) {
  if (
    lat1 === null || lat1 === undefined || isNaN(lat1) ||
    lng1 === null || lng1 === undefined || isNaN(lng1) ||
    lat2 === null || lat2 === undefined || isNaN(lat2) ||
    lng2 === null || lng2 === undefined || isNaN(lng2)
  ) {
    return 0;
  }

  const numLat1 = Number(lat1);
  const numLng1 = Number(lng1);
  const numLat2 = Number(lat2);
  const numLng2 = Number(lng2);

  // If points are identical, distance is zero
  if (numLat1 === numLat2 && numLng1 === numLng2) {
    return 0;
  }

  const EARTH_RADIUS_KM = 6371;
  const toRad = (angle) => (angle * Math.PI) / 180;

  const dLat = toRad(numLat2 - numLat1);
  const dLng = toRad(numLng2 - numLng1);

  const radLat1 = toRad(numLat1);
  const radLat2 = toRad(numLat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return Math.round(distance * 100) / 100;
}

/**
 * Calculates a bounding box around a center point for a given radius in km.
 * Useful for fast SQL bounding box queries before exact Haversine filtering.
 * 
 * @param {number} lat - Center latitude
 * @param {number} lng - Center longitude
 * @param {number} radiusKm - Search radius in kilometers
 * @returns {{minLat: number, maxLat: number, minLng: number, maxLng: number}}
 */
export function getBoundingBox(lat, lng, radiusKm = 50) {
  const numLat = Number(lat);
  const numLng = Number(lng);
  const radius = Math.max(0.1, Number(radiusKm) || 50);

  // 1 degree latitude is approx 111.32 km
  const latDelta = radius / 111.32;

  // 1 degree longitude shrinks with latitude: 111.32 * cos(lat)
  const radLat = (numLat * Math.PI) / 180;
  const cosLat = Math.cos(radLat);
  const lngDelta = cosLat !== 0 ? radius / (111.32 * Math.abs(cosLat)) : radius / 111.32;

  return {
    minLat: Math.max(-90, numLat - latDelta),
    maxLat: Math.min(90, numLat + latDelta),
    minLng: Math.max(-180, numLng - lngDelta),
    maxLng: Math.min(180, numLng + lngDelta),
  };
}

/**
 * Formats a distance in kilometers into a clean, human-readable string.
 * Example: 0.5 -> "500 m", 1.23 -> "1.2 km", 45 -> "45 km"
 * 
 * @param {number} km - Distance in kilometers
 * @returns {string} Human-readable distance
 */
export function formatDistance(km) {
  if (km === null || km === undefined || isNaN(km)) {
    return '0 km';
  }

  const numKm = Number(km);
  if (numKm < 0) return '0 m';

  if (numKm < 1) {
    const meters = Math.round(numKm * 1000);
    return `${meters} m`;
  }

  if (numKm < 10) {
    return `${numKm.toFixed(1)} km`;
  }

  return `${Math.round(numKm)} km`;
}

/**
 * Estimates travel time in minutes based on distance and disaster conditions.
 * Assumes 30 km/h during active disaster (debris, flooded roads, slow traffic),
 * and 50 km/h during normal conditions.
 * 
 * @param {number} distanceKm - Distance in kilometers
 * @param {boolean} [disasterActive=true] - Whether road conditions are impacted by active disaster
 * @returns {number} Estimated arrival time in minutes (minimum 1 minute if distance > 0)
 */
export function estimateETA(distanceKm, disasterActive = true) {
  if (distanceKm === null || distanceKm === undefined || isNaN(distanceKm)) {
    return 0;
  }

  const dist = Math.max(0, Number(distanceKm));
  if (dist === 0) return 0;

  const speedKmH = disasterActive ? 30 : 50;
  const hours = dist / speedKmH;
  const minutes = Math.ceil(hours * 60);

  return Math.max(1, minutes);
}

/**
 * Formats ETA minutes into a friendly string (e.g., "45 mins", "1 hr 15 mins", "3 hrs")
 * 
 * @param {number} minutes - ETA in minutes
 * @returns {string} Human-readable ETA
 */
export function formatETA(minutes) {
  if (!minutes || isNaN(minutes) || minutes <= 0) {
    return 'Immediate';
  }

  const mins = Math.round(Number(minutes));
  if (mins < 60) {
    return `${mins} mins`;
  }

  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;

  if (remainingMins === 0) {
    return hours === 1 ? '1 hour' : `${hours} hours`;
  }

  return `${hours} hr ${remainingMins} mins`;
}

/**
 * Checks whether a point is within a given radius from a center point.
 * 
 * @param {number} lat1 - Center latitude
 * @param {number} lng1 - Center longitude
 * @param {number} lat2 - Target latitude
 * @param {number} lng2 - Target longitude
 * @param {number} radiusKm - Max radius in km
 * @returns {boolean} True if target is within radius
 */
export function isWithinRadius(lat1, lng1, lat2, lng2, radiusKm) {
  const dist = haversineDistance(lat1, lng1, lat2, lng2);
  return dist <= Number(radiusKm);
}
