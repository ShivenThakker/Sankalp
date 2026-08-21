'use client'

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './page.module.css';

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
  const urgency = searchParams.get('urgency') || 'high';
  const people = searchParams.get('people') || '1';
  const address = searchParams.get('address');
  
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestId, setRequestId] = useState('');

  const requestedNeeds = needsParam ? needsParam.split(',') : [];

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch('/api/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            needs: requestedNeeds,
            lat: parseFloat(lat) || 26.18,
            lng: parseFloat(lng) || 91.75,
            urgency,
            people: parseInt(people) || 1,
          }),
        });
        const data = await res.json();
        setMatches(data.matches || []);
        setRequestId(data.requestId || '');
      } catch (err) {
        console.error('Match API failed, using empty results:', err);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, []);

  const locDisplay = (lat && lng) ? `${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}` : address || 'Unknown location';

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>🔍 Finding verified help near you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>✅ Help is available near you</h1>
        <p className={styles.location}>📍 Your location: {locDisplay}</p>
        {requestId && <p className={styles.requestIdText}>Request ID: {requestId}</p>}
      </header>

      <div className={styles.warning}>
        ⚠️ Resource data freshness varies. Call ahead to confirm availability.
      </div>

      <div className={styles.resultsList}>
        {matches.length > 0 ? matches.map((ngo, index) => (
          <motion.div 
            key={ngo.ngoId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={styles.card}
          >
            <div className={styles.cardHeader}>
              <div className={styles.capLabel}>
                <span className={styles.emoji}>{EMOJI_MAP[ngo.matchedCapabilities?.[0]] || '📦'}</span>
                <span className={styles.capText}>{(ngo.matchedCapabilities || ngo.capabilities)?.join(', ').replace(/_/g, ' ').toUpperCase()}</span>
              </div>
              <div className={styles.trustBadge}>
                🟢 {ngo.verificationScore} 
                <span className={styles.matchScore}>Match: {ngo.matchScore}%</span>
              </div>
            </div>
            
            <h3 className={styles.ngoName}>{ngo.name}</h3>
            
            <div className={styles.details}>
              <p>📍 {ngo.distance} km away</p>
              <p>🕐 ETA: ~{ngo.eta} minutes</p>
              <p className={styles.phone}>📞 {ngo.phone}</p>
              <p className={styles.addressText}>📮 {ngo.address}</p>
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
        <p>⚠️ Can&apos;t find what you need?</p>
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
