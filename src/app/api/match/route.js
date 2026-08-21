import { NextResponse } from 'next/server';

const NGO_POOL = [
  { id: '17', name: 'Goonj', lat: 28.5355, lng: 77.2510, verificationScore: 95, capabilities: ['clothing', 'food', 'shelter'], resources: { food_kits: 1500, tents: 200 }, phone: '+91-99999-11111', address: 'New Delhi', lastUpdated: Date.now() - 3600000 },
  { id: '18', name: 'Mercy Corps India', lat: 17.3850, lng: 78.4867, verificationScore: 92, capabilities: ['food', 'water', 'shelter', 'medical'], resources: { food_kits: 2000, water_litres: 10000 }, phone: '+91-99999-22222', address: 'Hyderabad', lastUpdated: Date.now() - 3600000 },
  { id: '19', name: 'SEEDS India', lat: 28.6139, lng: 77.2090, verificationScore: 89, capabilities: ['shelter', 'rescue', 'food'], resources: { tents: 150 }, phone: '+91-99999-33333', address: 'New Delhi', lastUpdated: Date.now() - 3600000 },
  { id: '20', name: 'Kolkata Rescue Foundation', lat: 22.5726, lng: 88.3639, verificationScore: 83, capabilities: ['rescue', 'medical', 'shelter'], resources: { doctors: 4, tents: 50 }, phone: '+91-99999-44444', address: 'Kolkata', lastUpdated: Date.now() - 3600000 },
  { id: '21', name: 'Bengal Relief Corps', lat: 22.5449, lng: 88.3426, verificationScore: 79, capabilities: ['food', 'water', 'transport'], resources: { vehicles: 10, food_kits: 500 }, phone: '+91-99999-55555', address: 'Kolkata', lastUpdated: Date.now() - 3600000 },
  { id: '22', name: 'Howrah Hope Foundation', lat: 22.5958, lng: 88.2636, verificationScore: 76, capabilities: ['shelter', 'clothing'], resources: { tents: 40 }, phone: '+91-99999-66666', address: 'Howrah', lastUpdated: Date.now() - 3600000 },
  { id: '23', name: 'Oxfam India', lat: 28.6448, lng: 77.2167, verificationScore: 94, capabilities: ['food', 'water', 'shelter', 'medical'], resources: { water_litres: 20000, food_kits: 3000 }, phone: '+91-99999-77777', address: 'New Delhi', lastUpdated: Date.now() - 3600000 },
  { id: '24', name: 'CARE India', lat: 28.5921, lng: 77.2270, verificationScore: 93, capabilities: ['food', 'medical', 'shelter'], resources: { food_kits: 2500, doctors: 10 }, phone: '+91-99999-88888', address: 'New Delhi', lastUpdated: Date.now() - 3600000 },

  { id: '1', name: 'Assam Relief Foundation', lat: 26.18, lng: 91.75, verificationScore: 91, capabilities: ['food', 'water', 'shelter'], resources: { food_kits: 500, water_litres: 2000, beds: 80 }, phone: '+91-98765-43210', address: 'MG Road, Guwahati', lastUpdated: Date.now() - 4 * 3600000 },
  { id: '2', name: 'Health First India', lat: 26.15, lng: 91.78, verificationScore: 87, capabilities: ['medical'], resources: { doctors: 3, medical_kits: 120 }, phone: '+91-98765-11111', address: 'GS Road, Guwahati', lastUpdated: Date.now() - 24 * 3600000 },
  { id: '3', name: 'Shelter Now India', lat: 26.11, lng: 91.70, verificationScore: 78, capabilities: ['shelter', 'clothing'], resources: { beds: 80, tents: 25 }, phone: '+91-98765-22222', address: 'Zoo Road, Guwahati', lastUpdated: Date.now() - 48 * 3600000 },
  { id: '4', name: 'Rapid Response Team', lat: 26.20, lng: 91.68, verificationScore: 85, capabilities: ['rescue', 'transport'], resources: { vehicles: 5, boats: 3 }, phone: '+91-98765-33333', address: 'Chandmari, Guwahati', lastUpdated: Date.now() - 2 * 3600000 },
  { id: '5', name: 'Paws & Claws Rescue', lat: 26.25, lng: 91.82, verificationScore: 72, capabilities: ['animal_rescue'], resources: { volunteers: 20 }, phone: '+91-98765-44444', address: 'Beltola, Guwahati', lastUpdated: Date.now() - 168 * 3600000 },
  { id: '6', name: 'River Valley Aid Society', lat: 26.08, lng: 91.65, verificationScore: 55, capabilities: ['food', 'water'], resources: { food_kits: 200, water_litres: 800 }, phone: '+91-98765-55555', address: 'Panbazar, Guwahati', lastUpdated: Date.now() - 72 * 3600000 },
  { id: '7', name: 'Northeast Medical Corps', lat: 26.22, lng: 91.80, verificationScore: 82, capabilities: ['medical', 'rescue'], resources: { doctors: 5, ambulances: 2 }, phone: '+91-98765-66666', address: 'Ulubari, Guwahati', lastUpdated: Date.now() - 6 * 3600000 },
  { id: '8', name: 'Guwahati Food Bank', lat: 26.17, lng: 91.77, verificationScore: 88, capabilities: ['food'], resources: { food_kits: 1000 }, phone: '+91-98765-77777', address: 'Fancy Bazaar, Guwahati', lastUpdated: Date.now() - 1 * 3600000 },
];

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { needs = [], lat, lng, urgency, people } = body;

    if (!lat || !lng) {
      return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
    }

    const totalNeeds = needs.length || 1; // Prevent division by zero
    const results = [];

    for (const ngo of NGO_POOL) {
      const distance = haversine(lat, lng, ngo.lat, ngo.lng);
      
      const matchedCapabilities = ngo.capabilities.filter(cap => needs.includes(cap));
      const capabilityOverlap = matchedCapabilities.length;

      if (capabilityOverlap > 0) {
        // Resource freshness (1 for recently updated, scaling down)
        const ageHours = (Date.now() - ngo.lastUpdated) / 3600000;
        const resourceFreshness = Math.max(0, 1 - (ageHours / 168)); // 1 week max

        const matchScore = (capabilityOverlap / totalNeeds) * 40
                 + (1 - Math.min(distance, 100) / 100) * 30
                 + (ngo.verificationScore / 100) * 20
                 + (resourceFreshness) * 10;

        const eta = Math.round(distance * 12); // 12 mins per km

        results.push({
          ngoId: ngo.id,
          name: ngo.name,
          matchScore: Number(matchScore.toFixed(1)),
          distance: Number(distance.toFixed(1)),
          eta,
          verificationScore: ngo.verificationScore,
          capabilities: ngo.capabilities,
          matchedCapabilities,
          phone: ngo.phone,
          address: ngo.address
        });
      }
    }

    results.sort((a, b) => b.matchScore - a.matchScore);
    const topMatches = results.slice(0, 10);

    return NextResponse.json({
      matches: topMatches,
      totalMatches: results.length,
      requestId: `REQ-${Math.floor(Math.random() * 100000000)}`
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
