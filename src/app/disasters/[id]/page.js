'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MOCK_DISASTERS } from '../page';
import Badge from '@/components/ui/Badge';
import styles from './page.module.css';

const EMOJIS = {
  food: '🍚',
  water: '💧',
  medical: '💊',
  shelter: '⛺',
  transport: '🚛',
  rescue: '🚁'
};

function ResourceGauge({ need }) {
  const percent = Math.round((need.fulfilled / need.needed) * 100);
  const color = percent < 30 ? 'var(--danger-color)' : percent < 70 ? 'var(--warning-color)' : 'var(--success-color)';
  
  return (
    <div className={styles.gauge}>
      <div className={styles.gaugeHeader}>
        <span className={styles.gaugeLabel}>
          {EMOJIS[need.type] || '📦'} {need.type}
        </span>
        {need.priority === 'critical' && (
          <Badge variant="danger">Critical</Badge>
        )}
      </div>
      <div className={styles.gaugeTrack}>
        <div className={styles.gaugeFill} style={{ width: `${percent}%`, backgroundColor: color }} />
      </div>
      <div className={styles.gaugeStats}>
        <span>{need.fulfilled.toLocaleString()} / {need.needed.toLocaleString()}</span>
        <span style={{ color }}>{percent}%</span>
      </div>
    </div>
  );
}

export default function DisasterDetailPage() {
  const params = useParams();
  const disaster = MOCK_DISASTERS.find(d => d.id === params.id);

  if (!disaster) return <div className={styles.container}>Disaster not found</div>;

  const getSeverityVariant = (severity) => {
    if (severity === 'high' || severity === 'critical') return 'danger';
    if (severity === 'moderate') return 'warning';
    return 'success';
  };

  const formatDonation = (amount) => {
    return `₹${(amount / 100000).toFixed(2)}L`;
  };

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link href="/disasters" className={styles.backLink}>
        ← Back to Disasters
      </Link>

      <div className={styles.header}>
        <h1 className={styles.title}>{disaster.title}</h1>
        <div className={styles.badges}>
          <Badge variant={getSeverityVariant(disaster.severity)}>{disaster.severity.toUpperCase()}</Badge>
          <Badge variant="neutral">{disaster.status.toUpperCase()}</Badge>
        </div>
      </div>

      <p className={styles.description}>{disaster.description}</p>

      <div className={styles.grid}>
        <div className={styles.leftCol}>
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Resource Coverage</h2>
            <div className={styles.gaugeList}>
              {disaster.needs.map((need, idx) => (
                <ResourceGauge key={idx} need={need} />
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Response Summary</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statBox}>
                <div className={styles.statValue}>{disaster.ngosActive}</div>
                <div className={styles.statLabel}>NGOs Active</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statValue}>{disaster.volunteerCount}</div>
                <div className={styles.statLabel}>Volunteers</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statValue}>{formatDonation(disaster.donationsRaised)}</div>
                <div className={styles.statLabel}>Donations</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Incident Info</h2>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <span className={styles.infoKey}>Affected Population</span>
                <span className={styles.infoVal}>{disaster.affectedPopulation.toLocaleString()}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoKey}>Districts</span>
                <span className={styles.infoVal}>{disaster.affectedDistricts.join(', ')}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoKey}>States</span>
                <span className={styles.infoVal}>{disaster.affectedStates.join(', ')}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoKey}>Source</span>
                <span className={styles.infoVal}>{disaster.source}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoKey}>Started</span>
                <span className={styles.infoVal}>{new Date(disaster.startedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <Link href="/help" className={styles.primaryBtn}>
              🆘 Report a Need
            </Link>
            <Link href="/donate" className={styles.secondaryBtn}>
              💰 Donate
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
