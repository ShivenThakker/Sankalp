'use client';

import MapLoader from '@/components/map/MapLoader';
import { useGodMode } from '@/hooks/useGodMode';
import styles from './page.module.css';

const MOCK_MAP_DATA = {
  disasters: [
    { id: '4', title: 'Kerala Landslides - Wayanad', centerLat: 11.6854, centerLng: 76.1320, radiusKm: 25, severity: 'high', type: 'landslide', affectedPopulation: 30000 },
    { id: '5', title: 'Gujarat Flood Relief - Kutch', centerLat: 23.7337, centerLng: 69.8597, radiusKm: 60, severity: 'moderate', type: 'flood', affectedPopulation: 25000 },
    { id: '6', title: 'Earthquake Tremors - Manipur', centerLat: 24.8170, centerLng: 93.9368, radiusKm: 40, severity: 'moderate', type: 'earthquake', affectedPopulation: 15000 },

    { id: '1', title: 'Assam Floods', centerLat: 26.1445, centerLng: 91.7362, radiusKm: 80, severity: 'high', type: 'flood', affectedPopulation: 150000 },
    { id: '2', title: 'Cyclone Warning Odisha', centerLat: 19.8135, centerLng: 85.8312, radiusKm: 120, severity: 'moderate', type: 'cyclone', affectedPopulation: 50000 },
    { id: '3', title: 'Forest Fire Uttarakhand', centerLat: 29.3803, centerLng: 79.4636, radiusKm: 30, severity: 'low', type: 'fire', affectedPopulation: 5000 },
  ],
  ngos: [
  { id: '7', name: 'Goonj', lat: 28.5355, lng: 77.2510, verificationScore: 95, capabilities: ['clothing', 'food', 'shelter'] },
  { id: '8', name: 'Mercy Corps India', lat: 17.3850, lng: 78.4867, verificationScore: 92, capabilities: ['food', 'water', 'shelter', 'medical'] },
  { id: '9', name: 'SEEDS India', lat: 28.6139, lng: 77.2090, verificationScore: 89, capabilities: ['shelter', 'rescue', 'food'] },
  { id: '10', name: 'Kolkata Rescue Foundation', lat: 22.5726, lng: 88.3639, verificationScore: 83, capabilities: ['rescue', 'medical', 'shelter'] },
  { id: '11', name: 'Bengal Relief Corps', lat: 22.5449, lng: 88.3426, verificationScore: 79, capabilities: ['food', 'water', 'transport'] },
  { id: '12', name: 'Howrah Hope Foundation', lat: 22.5958, lng: 88.2636, verificationScore: 76, capabilities: ['shelter', 'clothing'] },
  { id: '13', name: 'Oxfam India', lat: 28.6448, lng: 77.2167, verificationScore: 94, capabilities: ['food', 'water', 'shelter', 'medical'] },
  { id: '14', name: 'CARE India', lat: 28.5921, lng: 77.2270, verificationScore: 93, capabilities: ['food', 'medical', 'shelter'] },

    { id: '1', name: 'Assam Relief Foundation', lat: 26.18, lng: 91.75, verificationScore: 91, capabilities: ['food', 'water', 'shelter'] },
    { id: '2', name: 'Health First India', lat: 26.15, lng: 91.78, verificationScore: 87, capabilities: ['medical'] },
    { id: '3', name: 'Shelter Now India', lat: 26.11, lng: 91.70, verificationScore: 78, capabilities: ['shelter'] },
    { id: '4', name: 'Rapid Response Team', lat: 26.20, lng: 91.68, verificationScore: 85, capabilities: ['rescue', 'transport'] },
  ],
  helpRequests: [
    { id: '1', lat: 26.16, lng: 91.73, people: 12, needs: ['food', 'medical'], urgency: 'critical' },
    { id: '2', lat: 26.12, lng: 91.80, people: 50, needs: ['shelter'], urgency: 'high' },
    { id: '3', lat: 26.19, lng: 91.72, people: 5, needs: ['water'], urgency: 'medium' },
  ],
};

export default function MapPage() {
  const { customDisasters, simulatedRequests } = useGodMode();
  
  const allMapDisasters = [
    ...MOCK_MAP_DATA.disasters,
    ...customDisasters.map(d => ({
      id: d.id,
      title: d.name,
      type: d.type,
      severity: d.severity,
      centerLat: d.centerLat,
      centerLng: d.centerLng,
      radiusKm: d.radiusKm,
      affectedPopulation: d.affectedPopulation,
      isCustom: true
    }))
  ];

  const allMapRequests = [
    ...MOCK_MAP_DATA.helpRequests,
    ...simulatedRequests.map(r => ({
      id: r.id,
      lat: r.lat,
      lng: r.lng,
      people: r.people,
      needs: r.needs,
      urgency: r.urgency,
      isCustom: true
    }))
  ];

  const totalAffected = allMapDisasters.reduce((acc, d) => acc + (d.affectedPopulation || 0), 0);

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>🗺️ Live Disaster Map</h1>
        <p className={styles.subtitle}>
          Real-time view of active disasters, NGO positions, and help requests across India
        </p>
      </header>

      <div className={styles.mapWrapper}>
        <MapLoader 
          disasters={allMapDisasters}
          ngos={MOCK_MAP_DATA.ngos}
          helpRequests={allMapRequests}
          center={[24.0, 85.0]}
          zoom={5}
          height="60vh"
        />
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>🚨</div>
          <div className={styles.cardContent}>
            <h3>{allMapDisasters.length}</h3>
            <p>Active Disasters</p>
          </div>
        </div>
        
        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>🤝</div>
          <div className={styles.cardContent}>
            <h3>{MOCK_MAP_DATA.ngos.length}</h3>
            <p>NGOs Mapped</p>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>🆘</div>
          <div className={styles.cardContent}>
            <h3>{allMapRequests.length}</h3>
            <p>Help Requests Pending</p>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>👥</div>
          <div className={styles.cardContent}>
            <h3>{totalAffected.toLocaleString()}</h3>
            <p>Total People Affected</p>
          </div>
        </div>
      </div>
    </div>
  );
}
