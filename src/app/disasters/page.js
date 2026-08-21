'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Waves, Wind, Flame, Mountain, AlertTriangle, Users, Building2, MapPin } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import styles from './page.module.css';

export const MOCK_DISASTERS = [
  {
    id: '4', title: 'Kerala Landslides - Wayanad', type: 'landslide', severity: 'high',
    description: 'Massive landslides triggered by heavy rainfall have hit Wayanad and Kozhikode districts, causing widespread damage to property and isolating villages.',
    affectedDistricts: ['Wayanad', 'Kozhikode'], affectedStates: ['Kerala'],
    centerLat: 11.6854, centerLng: 76.1320, radiusKm: 25,
    affectedPopulation: 30000, source: 'NDRF', status: 'active',
    startedAt: '2026-08-20T02:00:00Z',
    needs: [
      { type: 'rescue', needed: 150, fulfilled: 80, priority: 'critical' },
      { type: 'medical', needed: 300, fulfilled: 100, priority: 'critical' },
      { type: 'shelter', needed: 1500, fulfilled: 600, priority: 'high' }
    ],
    ngosActive: 15, volunteerCount: 220, donationsRaised: 850000
  },
  {
    id: '5', title: 'Gujarat Flood Relief - Kutch', type: 'flood', severity: 'moderate',
    description: 'Unseasonal heavy rains have flooded parts of Kutch and Patan, requiring immediate relief materials and water pumping.',
    affectedDistricts: ['Kutch', 'Patan'], affectedStates: ['Gujarat'],
    centerLat: 23.7337, centerLng: 69.8597, radiusKm: 60,
    affectedPopulation: 25000, source: 'SDMA', status: 'active',
    startedAt: '2026-08-19T10:00:00Z',
    needs: [
      { type: 'food', needed: 2500, fulfilled: 1200, priority: 'medium' },
      { type: 'water', needed: 5000, fulfilled: 3000, priority: 'high' }
    ],
    ngosActive: 8, volunteerCount: 110, donationsRaised: 320000
  },
  {
    id: '6', title: 'Earthquake Tremors - Manipur', type: 'earthquake', severity: 'moderate',
    description: 'A 5.4 magnitude earthquake struck Manipur, causing minor structural damages and panic among residents.',
    affectedDistricts: ['Imphal East', 'Imphal West', 'Churachandpur'], affectedStates: ['Manipur'],
    centerLat: 24.8170, centerLng: 93.9368, radiusKm: 40,
    affectedPopulation: 15000, source: 'ISC', status: 'monitoring',
    startedAt: '2026-08-21T04:30:00Z',
    needs: [
      { type: 'shelter', needed: 500, fulfilled: 200, priority: 'medium' },
      { type: 'medical', needed: 100, fulfilled: 50, priority: 'low' }
    ],
    ngosActive: 4, volunteerCount: 45, donationsRaised: 120000
  },

  {
    id: '1', title: 'Assam Floods August 2026', type: 'flood', severity: 'high',
    description: 'Heavy monsoon rains have caused severe flooding across multiple districts in Assam. The Brahmaputra river has breached its banks affecting lakhs of people.',
    affectedDistricts: ['Kamrup', 'Nagaon', 'Darrang', 'Morigaon', 'Barpeta'],
    affectedStates: ['Assam'], centerLat: 26.1445, centerLng: 91.7362, radiusKm: 80,
    affectedPopulation: 150000, source: 'SACHET', status: 'active',
    startedAt: '2026-08-18T06:00:00Z',
    needs: [
      { type: 'food', needed: 5000, fulfilled: 4100, priority: 'high' },
      { type: 'water', needed: 10000, fulfilled: 6500, priority: 'high' },
      { type: 'medical', needed: 500, fulfilled: 255, priority: 'critical' },
      { type: 'shelter', needed: 2000, fulfilled: 560, priority: 'critical' },
      { type: 'transport', needed: 100, fulfilled: 17, priority: 'critical' },
      { type: 'rescue', needed: 200, fulfilled: 150, priority: 'high' },
    ],
    ngosActive: 25, volunteerCount: 340, donationsRaised: 1740000
  },
  {
    id: '2', title: 'Cyclone Warning - Odisha Coast', type: 'cyclone', severity: 'moderate',
    description: 'A deep depression over the Bay of Bengal is likely to intensify into a cyclonic storm. Coastal districts have been put on alert.',
    affectedDistricts: ['Puri', 'Ganjam', 'Jagatsinghpur'], affectedStates: ['Odisha'],
    centerLat: 19.8135, centerLng: 85.8312, radiusKm: 120,
    affectedPopulation: 50000, source: 'IMD', status: 'monitoring',
    startedAt: '2026-08-19T12:00:00Z',
    needs: [
      { type: 'shelter', needed: 1000, fulfilled: 300, priority: 'high' },
      { type: 'food', needed: 2000, fulfilled: 800, priority: 'medium' },
      { type: 'transport', needed: 50, fulfilled: 10, priority: 'high' },
    ],
    ngosActive: 12, volunteerCount: 85, donationsRaised: 420000
  },
  {
    id: '3', title: 'Forest Fire - Uttarakhand', type: 'fire', severity: 'low',
    description: 'A forest fire in the Kumaon region has been largely contained but monitoring continues.',
    affectedDistricts: ['Nainital', 'Almora'], affectedStates: ['Uttarakhand'],
    centerLat: 29.3803, centerLng: 79.4636, radiusKm: 30,
    affectedPopulation: 5000, source: 'Manual', status: 'monitoring',
    startedAt: '2026-08-17T08:00:00Z',
    needs: [
      { type: 'medical', needed: 50, fulfilled: 40, priority: 'medium' },
      { type: 'shelter', needed: 200, fulfilled: 150, priority: 'low' },
    ],
    ngosActive: 5, volunteerCount: 28, donationsRaised: 85000
  },
];

const ICONS = {
  flood: <Waves size={20} />,
  cyclone: <Wind size={20} />,
  fire: <Flame size={20} />,
  earthquake: <Mountain size={20} />
};

export default function DisastersPage() {
  const [filterType, setFilterType] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');

  const filteredDisasters = MOCK_DISASTERS.filter(d => {
    const typeMatch = filterType === 'All' || d.type.toLowerCase() === filterType.toLowerCase();
    const severityMatch = filterSeverity === 'All' || d.severity.toLowerCase() === filterSeverity.toLowerCase();
    return typeMatch && severityMatch;
  });

  const getSeverityVariant = (severity) => {
    if (severity === 'high' || severity === 'critical') return 'danger';
    if (severity === 'moderate') return 'warning';
    return 'success';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Active Disasters</h1>
        <p className={styles.subtitle}>Tracking {filteredDisasters.length} ongoing incidents</p>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          {['All', 'Flood', 'Cyclone', 'Fire', 'Earthquake'].map(type => (
            <button
              key={type}
              className={`${styles.filterBtn} ${filterType === type ? styles.active : ''}`}
              onClick={() => setFilterType(type)}
            >
              {type}
            </button>
          ))}
        </div>
        <div className={styles.filterGroup}>
          {['All', 'Critical', 'High', 'Moderate', 'Low'].map(sev => (
            <button
              key={sev}
              className={`${styles.filterBtn} ${filterSeverity === sev ? styles.active : ''}`}
              onClick={() => setFilterSeverity(sev)}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      <motion.div 
        className={styles.grid}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
      >
        {filteredDisasters.map((disaster) => (
          <motion.div 
            key={disaster.id}
            initial={{ opacity: 0, y: 40 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, amount: 0.2 }} 
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`${styles.card} ${styles[`border-${disaster.severity}`]}`}
          >
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleArea}>
                <span className={styles.emoji}>{ICONS[disaster.type] || <AlertTriangle size={20}/>}</span>
                <h2 className={styles.cardTitle}>{disaster.title}</h2>
              </div>
              <div className={styles.badges}>
                <Badge variant={getSeverityVariant(disaster.severity)}>{disaster.severity.toUpperCase()}</Badge>
                <Badge variant="neutral">{disaster.status.toUpperCase()}</Badge>
              </div>
            </div>

            <div className={styles.impactArea}>
              <div className={styles.impactStat}>
                <Users size={16} />
                <span>{disaster.affectedPopulation.toLocaleString()} affected</span>
              </div>
              <div className={styles.impactStat}>
                <MapPin size={16} />
                <span>{disaster.affectedDistricts.length} districts</span>
              </div>
            </div>

            <div className={styles.needsSection}>
              <h3 className={styles.needsTitle}>Top Needs</h3>
              {disaster.needs.slice(0, 3).map((need, idx) => {
                const percent = Math.round((need.fulfilled / need.needed) * 100);
                return (
                  <div key={idx} className={styles.needBar}>
                    <div className={styles.needLabel}>
                      <span>{need.type}</span>
                      <span>{percent}%</span>
                    </div>
                    <div className={styles.progressTrack}>
                      <div 
                        className={styles.progressFill} 
                        style={{ width: `${percent}%`, backgroundColor: percent < 30 ? 'var(--danger-color)' : percent < 70 ? 'var(--warning-color)' : 'var(--success-color)' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.cardFooter}>
              <div className={styles.footerStats}>
                <Building2 size={16} /> {disaster.ngosActive} NGOs
                <span className={styles.divider}>|</span>
                <Users size={16} /> {disaster.volunteerCount} Vols
              </div>
              <Link href={`/disasters/${disaster.id}`} className={styles.viewLink}>
                View Details
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
