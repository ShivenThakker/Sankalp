'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  FileText, 
  Building,
  Heart,
  MessageSquare
} from 'lucide-react';
import styles from './page.module.css';

const FULL_NGO = {
  id: '1', 
  name: 'Assam Relief Foundation', 
  verificationStatus: 'verified', 
  verificationScore: 91,
  district: 'Kamrup', 
  state: 'Assam', 
  description: 'Providing food, water, and shelter relief across Assam since 2015. Specializing in rapid response and coordinated grassroots distribution.',
  operationalStatus: 'active',
  totalVolunteers: 142, 
  yearEstablished: 2015, 
  lastActivity: '2 days ago',
  registrationNumber: 'ASM/2019/0042356',
  ngoDarpanId: 'AS/2019/0234567',
  panNumber: 'AABCA1234A',
  has80g: true, 
  hasFcra: false,
  registrationType: 'trust',
  website: 'https://assamrelief.org',
  email: 'contact@assamrelief.org',
  phone: '+91-98765-43210',
  address: '42, MG Road, Guwahati, Assam 781001',
  verifications: [
    { type: 'NGO Registration', status: 'passed', date: '2026-06-01' },
    { type: 'NGO DARPAN', status: 'passed', date: '2026-06-01', detail: 'AS/2019/0234567' },
    { type: 'PAN Verification', status: 'passed', date: '2026-06-01' },
    { type: '80G Certificate', status: 'passed', date: '2026-06-01' },
    { type: 'FCRA', status: 'not_applicable', date: null },
    { type: 'Physical Address', status: 'passed', date: '2026-05-15' },
    { type: 'Disaster Response History', status: 'passed', date: '2026-06-01', detail: '12 past responses' },
    { type: 'Last Activity', status: 'passed', date: '2026-08-18' },
  ],
  resources: [
    { type: 'Food Kits', available: 500, lastUpdated: '4 hours ago', freshness: 'fresh' },
    { type: 'Water (Litres)', available: 2000, lastUpdated: '4 hours ago', freshness: 'fresh' },
    { type: 'Medical Kits', available: 120, lastUpdated: '1 day ago', freshness: 'aging' },
    { type: 'Beds', available: 80, lastUpdated: '2 days ago', freshness: 'aging' },
    { type: 'Vehicles', available: 3, lastUpdated: '4 hours ago', freshness: 'fresh' },
  ],
  capabilities: [
    { type: 'food', label: 'Food Distribution', active: true },
    { type: 'water', label: 'Water Supply', active: true },
    { type: 'shelter', label: 'Temporary Shelter', active: true },
    { type: 'transport', label: 'Transportation', active: false },
  ]
};

export default function NGOProfile() {
  const params = useParams();
  const id = params.id;

  // In a real app, fetch NGO by ID. Here we use FULL_NGO for all for demonstration,
  // except we dynamically set the ID to match so it feels real.
  const ngo = { ...FULL_NGO, id };

  const getVerificationIcon = (status) => {
    switch (status) {
      case 'passed': return <CheckCircle className={styles.iconGreen} size={18} />;
      case 'failed': return <XCircle className={styles.iconRed} size={18} />;
      case 'pending': return <Clock className={styles.iconYellow} size={18} />;
      case 'not_applicable': return <div className={styles.iconGray}>—</div>;
      default: return <AlertCircle className={styles.iconGray} size={18} />;
    }
  };

  const getVerificationLabel = (status) => {
    switch (status) {
      case 'passed': return 'Verified';
      case 'failed': return 'Failed';
      case 'pending': return 'Pending';
      case 'not_applicable': return 'Not Applicable';
      default: return 'Unknown';
    }
  };

  const getFreshnessDot = (freshness) => {
    if (freshness === 'fresh') return '🟢 Fresh';
    if (freshness === 'aging') return '🟡 Aging';
    return '🔴 Stale';
  };

  return (
    <div className={styles.pageContainer}>
      <Link href="/ngos" className={styles.backLink}>
        <ArrowLeft size={16} /> Back to NGOs
      </Link>

      <motion.div 
        className={styles.headerCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.title}>{ngo.name}</h1>
            <p className={styles.subtitle}>Established {ngo.yearEstablished} • {ngo.district}, {ngo.state}</p>
          </div>
          <div className={styles.mainBadge}>
            <div className={styles.badgeScore}>{ngo.verificationScore}</div>
            <div className={styles.badgeLabel}>Trust Score</div>
          </div>
        </div>
        <p className={styles.description}>{ngo.description}</p>
        
        <div className={styles.contactGrid}>
          <div className={styles.contactItem}><Phone size={16} /> {ngo.phone}</div>
          <div className={styles.contactItem}><Mail size={16} /> {ngo.email}</div>
          <div className={styles.contactItem}><Globe size={16} /> {ngo.website}</div>
          <div className={styles.contactItem}><MapPin size={16} /> {ngo.address}</div>
        </div>
      </motion.div>

      <div className={styles.contentGrid}>
        {/* Verification Profile */}
        <motion.div 
          className={styles.glassCard}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className={styles.cardHeader}>
            <h2>Document Verification Profile</h2>
            <p>Score reflects document verification completeness, not organizational endorsement.</p>
          </div>
          
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Status</th>
                  <th>Date Verified</th>
                </tr>
              </thead>
              <tbody>
                {ngo.verifications.map((v, i) => (
                  <tr key={i}>
                    <td>
                      <div className={styles.paramCell}>
                        <FileText size={14} className={styles.paramIcon} />
                        {v.type}
                        {v.detail && <span className={styles.paramDetail}>({v.detail})</span>}
                      </div>
                    </td>
                    <td>
                      <div className={styles.statusCell}>
                        {getVerificationIcon(v.status)}
                        <span className={styles['text-' + v.status]}>{getVerificationLabel(v.status)}</span>
                      </div>
                    </td>
                    <td className={styles.dateCell}>{v.date || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.verificationSummaryBadge}>
            🟢 DOCUMENTS VERIFIED — Score: {ngo.verificationScore}/100
          </div>
        </motion.div>

        <div className={styles.sideCol}>
          {/* Capabilities */}
          <motion.div 
            className={styles.glassCard}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className={styles.cardHeader}>
              <h2>Capabilities</h2>
            </div>
            <div className={styles.capabilitiesGrid}>
              {ngo.capabilities.map((cap, i) => (
                <div key={i} className={`${styles.capabilityCard} ${cap.active ? styles.capActive : styles.capInactive}`}>
                  <div className={styles.capStatusDot}></div>
                  {cap.label}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Resources */}
          <motion.div 
            className={styles.glassCard}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className={styles.cardHeader}>
              <h2>Current Resources</h2>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Resource</th>
                    <th>Available</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ngo.resources.map((res, i) => (
                    <tr key={i}>
                      <td>{res.type}</td>
                      <td className={styles.boldCell}>{res.available}</td>
                      <td className={styles.freshnessCell}>
                        {getFreshnessDot(res.freshness)}
                        <span className={styles.timeSubtext}>{res.lastUpdated}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div 
            className={styles.actionButtons}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button className={styles.donateBtn}>
              <Heart size={18} /> Donate to This NGO
            </button>
            <button className={styles.contactBtn}>
              <MessageSquare size={18} /> Contact
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
