// God Mode - Live Demo Disaster Simulation Engine

const STORAGE_KEY = 'sankalp_god_mode_disasters';
const REQUESTS_KEY = 'sankalp_god_mode_requests';
const EVENT_NAME = 'sankalp_disaster_update';

export function getCustomDisasters() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

export function addCustomDisaster(disaster) {
  const disasters = getCustomDisasters();
  const newDisaster = {
    ...disaster,
    id: 'custom-' + Date.now(),
    createdAt: new Date().toISOString(),
    isCustom: true,
    status: 'active',
    helpRequests: [],
    stats: {
      helpRequests: 0,
      ngosResponding: 0,
      volunteersDeployed: 0,
      fundsRaised: 0,
    }
  };
  disasters.push(newDisaster);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(disasters));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: newDisaster }));
  return newDisaster;
}

export function clearCustomDisasters() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(REQUESTS_KEY);
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function getSimulatedRequests() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(REQUESTS_KEY) || '[]');
  } catch { return []; }
}

export function addSimulatedRequest(request) {
  const requests = getSimulatedRequests();
  requests.unshift(request);
  if (requests.length > 50) requests.pop();
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

// Pre-built request templates for simulation
export const REQUEST_TEMPLATES = [
  { needs: ['food', 'water'], people: 45, urgency: 'critical', message: 'Family of 45 stranded on rooftop, need immediate food and water supply' },
  { needs: ['medical'], people: 12, urgency: 'critical', message: 'Elderly people need urgent medical attention, insulin running out' },
  { needs: ['shelter'], people: 120, urgency: 'high', message: 'School building collapsed, 120 people need temporary shelter' },
  { needs: ['rescue'], people: 8, urgency: 'critical', message: '8 people trapped in flooded basement, water level rising' },
  { needs: ['food', 'shelter'], people: 200, urgency: 'high', message: 'Village cut off from road access, 200 families need food and shelter' },
  { needs: ['water', 'medical'], people: 30, urgency: 'high', message: 'Contaminated water supply, 30 people showing symptoms of waterborne disease' },
  { needs: ['transport'], people: 60, urgency: 'moderate', message: 'Need transport to evacuate 60 people from low-lying area before next rain' },
  { needs: ['food'], people: 150, urgency: 'high', message: 'Relief camp running out of food supplies, 150 people affected' },
  { needs: ['medical', 'rescue'], people: 5, urgency: 'critical', message: 'Pregnant woman in labor trapped in flooded area, needs immediate rescue' },
  { needs: ['shelter', 'clothing'], people: 80, urgency: 'moderate', message: '80 people displaced, homes destroyed, need shelter and warm clothing' },
];

// Generate a random name for the requester
const NAMES = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sunita Devi', 'Mohan Singh', 'Anita Roy', 'Vikram Reddy', 'Lakshmi Nair', 'Suresh Gupta', 'Meera Iyer', 'Ravi Verma', 'Pooja Mehta'];
const AREAS = ['Ward 5', 'Block A', 'Sector 12', 'Old Town', 'River Colony', 'Low Lands', 'East Side', 'Relief Camp 3', 'Station Road', 'Mill Area'];

export function generateRequest(disaster) {
  const template = REQUEST_TEMPLATES[Math.floor(Math.random() * REQUEST_TEMPLATES.length)];
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  const area = AREAS[Math.floor(Math.random() * AREAS.length)];
  
  // Add some randomness to the coordinates (within the disaster radius)
  const latOffset = (Math.random() - 0.5) * (disaster.radiusKm / 111) * 2;
  const lngOffset = (Math.random() - 0.5) * (disaster.radiusKm / 111) * 2;
  
  return {
    id: 'req-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    disasterId: disaster.id,
    disasterName: disaster.name,
    name: name,
    location: area + ', ' + (disaster.districts ? disaster.districts[0] : disaster.name),
    lat: disaster.centerLat + latOffset,
    lng: disaster.centerLng + lngOffset,
    needs: template.needs,
    people: template.people,
    urgency: template.urgency,
    message: template.message,
    timestamp: new Date().toISOString(),
    status: 'pending',
    matched: false,
  };
}
