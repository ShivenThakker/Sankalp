'use client'

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './page.module.css';

const MOCK_NGOS = [
  { id: '1', name: 'Assam Relief Foundation', trustScore: 91, verificationStatus: 'verified', distance: 1.1, eta: 15, capabilities: ['food', 'water', 'shelter'], resources: { food_kits: 500, water_litres: 2000 }, phone: '+91-98765-43210', address: 'MG Road, Guwahati' },
  { id: '2', name: 'Health First India', trustScore: 87, verificationStatus: 'verified', distance: 2.4, eta: 30, capabilities: ['medical'], resources: { doctors: 3, medical_kits: 120 }, phone: '+91-98765-11111', address: 'GS Road, Guwahati' },
  { id: '3', name: 'Shelter Now India', trustScore: 78, verificationStatus: 'verified', distance: 3.7, eta: 45, capabilities: ['shelter', 'clothing'], resources: { beds: 80, tents: 25 }, phone: '+91-98765-22222', address: 'Zoo Road, Guwahati' },
  { id: '4', name: 'Rapid Response Team', trustScore: 85, verificationStatus: 'verified', distance: 4.2, eta: 50, capabilities: ['rescue', 'transport'], resources: { vehicles: 5, boats: 3 }, phone: '+91-98765-33333', address: 'Chandmari, Guwahati' },
  { id: '5', name: 'Paws & Claws Rescue', trustScore: 72, verificationStatus: 'verified', distance: 5.8, eta: 65, capabilities: ['animal_rescue'], resources: { volunteers: 20 }, phone: '+91-98765-44444', address: 'Beltola, Guwahati' },
];

const EMOJI_MAP = {
  food: '🍚',
  medical: '💊',
  shelter: '🏠',
  rescue: '🚑',
  water: '💧',
  transport: '🚗',
  animal_rescue: '🐕',
  other: '📦'
};

function ResultsList() {
  const searchParams = useSearchParams();
  const needsParam = searchParams.get('needs');
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const address = searchParams.get('address');
  
  const requestedNeeds = needsParam ? needsParam.split(',') : [];

  let filteredNgos = MOCK_NGOS.filter(ngo => 
    ngo.capabilities.some(cap => requestedNeeds.includes(cap))
  );

  if (requestedNeeds.length === 0 || requestedNeeds.includes('other')) {
      filteredNgos = MOCK_NGOS;
  }

  const sortedNgos = [...filteredNgos].sort((a, b) => a.distance - b.distance);

  const locDisplay = (lat && lng) ? `${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}` : address || 'Unknown location';

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>✅ Help is available near you</h1>
        <p className={styles.location}>📍 Your location: {locDisplay}</p>
      </header>

      <div className={styles.warning}>
        ⚠️ Resource data was last updated 2 hours ago. Call ahead to confirm availability.
      </div>

      <div className={styles.resultsList}>
        {sortedNgos.length > 0 ? sortedNgos.map((ngo, index) => (
          <motion.div 
            key={ngo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${styles.card} ${styles[ngo.capabilities[0]] || styles.defaultCard}`}
          >
            <div className={styles.cardHeader}>
              <div className={styles.capLabel}>
                <span className={styles.emoji}>{EMOJI_MAP[ngo.capabilities[0]] || '📦'}</span>
                <span className={styles.capText}>{ngo.capabilities[0].replace('_', ' ').toUpperCase()}</span>
              </div>
              <div className={styles.trustBadge}>🟢 {ngo.trustScore}</div>
            </div>
            
            <h3 className={styles.ngoName}>{ngo.name}</h3>
            
            <div className={styles.details}>
              <p>📍 {ngo.distance} km away</p>
              <p>🕐 ETA: ~{ngo.eta} minutes</p>
              <p className={styles.resources}>
                Resources: {Object.entries(ngo.resources).map(([k, v]) => `${v} ${k.replace('_', ' ')}`).join(', ')}
              </p>
              <p className={styles.phone}>📞 {ngo.phone}</p>
            </div>

            <div className={styles.actions}>
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ngo.address)}`} target="_blank" rel="noopener noreferrer" className={styles.btnSecondary}>
                GET DIRECTIONS
              </a>
              <a href={`tel:${ngo.phone.replace(/[^0-9+]/g, '')}`} className={styles.btnPrimary}>
                CALL
              </a>
            </div>
          </motion.div>
        )) : (
          <div className={styles.noResults}>
            No specific NGOs found for your needs, but emergency services can help.
          </div>
        )}
      </div>

      <div className={styles.bottomFallback}>
        <p>⚠️ Can't find what you need?</p>
        <a href="tel:112" className={styles.emergencyBtn}>Call Emergency: 112</a>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className={styles.loading}>Loading results...</div>}>
      <ResultsList />
    </Suspense>
  );
}
