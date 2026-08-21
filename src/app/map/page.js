'use client';

import MapLoader from '@/components/map/MapLoader';
import styles from './page.module.css';

const MOCK_MAP_DATA = {
  disasters: [
    { id: '1', title: 'Assam Floods', centerLat: 26.1445, centerLng: 91.7362, radiusKm: 80, severity: 'high', type: 'flood', affectedPopulation: 150000 },
    { id: '2', title: 'Cyclone Warning Odisha', centerLat: 19.8135, centerLng: 85.8312, radiusKm: 120, severity: 'moderate', type: 'cyclone', affectedPopulation: 50000 },
    { id: '3', title: 'Forest Fire Uttarakhand', centerLat: 29.3803, centerLng: 79.4636, radiusKm: 30, severity: 'low', type: 'fire', affectedPopulation: 5000 },
  ],
  ngos: [
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
  const totalAffected = MOCK_MAP_DATA.disasters.reduce((acc, d) => acc + (d.affectedPopulation || 0), 0);

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
          disasters={MOCK_MAP_DATA.disasters}
          ngos={MOCK_MAP_DATA.ngos}
          helpRequests={MOCK_MAP_DATA.helpRequests}
          center={[24.0, 85.0]}
          zoom={5}
          height="60vh"
        />
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>🚨</div>
          <div className={styles.cardContent}>
            <h3>{MOCK_MAP_DATA.disasters.length}</h3>
            <p>Active Disasters</p>
          </div>
        </div>
        
        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>🤝</div>
          <div className={styles.cardContent}>
            <h3>{MOCK_MAP_DATA.ngos.length}</h3>
            <p>NGOs Responding</p>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>🆘</div>
          <div className={styles.cardContent}>
            <h3>{MOCK_MAP_DATA.helpRequests.length}</h3>
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
