'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Search, CheckCircle, Clock, Truck, Package } from 'lucide-react';
import styles from './page.module.css';

const MOCK_DONATIONS = [
  {
    id: 'RNET-2026-48291',
    amount: 5000,
    date: '2026-08-19',
    disaster: 'Assam Floods August 2026',
    status: 'allocated',
    allocations: [
      { category: 'Food Kits', amount: 2000, ngo: 'Assam Relief Foundation', status: 'delivered', icon: '🍚' },
      { category: 'Medical Supplies', amount: 1500, ngo: 'Health First India', status: 'in_transit', icon: '💊' },
      { category: 'Emergency Reserve', amount: 1000, ngo: 'ReliefNet Pool', status: 'reserved', icon: '🏦' },
      { category: 'Platform Operations', amount: 500, ngo: 'ReliefNet', status: 'allocated', icon: '⚙️' },
    ]
  },
  {
    id: 'RNET-2026-37154',
    amount: 1000,
    date: '2026-08-20',
    disaster: 'Cyclone Warning - Odisha Coast',
    status: 'pending',
    allocations: [
      { category: 'Shelter Materials', amount: 600, ngo: 'Pending Assignment', status: 'pending', icon: '🏠' },
      { category: 'Transport', amount: 350, ngo: 'Pending Assignment', status: 'pending', icon: '🚗' },
      { category: 'Platform Operations', amount: 50, ngo: 'ReliefNet', status: 'allocated', icon: '⚙️' },
    ]
  }
];

const STATUS_CONFIG = {
  delivered: { label: 'Delivered', color: '#10b981', Icon: CheckCircle },
  in_transit: { label: 'In Transit', color: '#f59e0b', Icon: Truck },
  allocated: { label: 'Allocated', color: '#6366f1', Icon: Package },
  reserved: { label: 'Reserved', color: '#8b5cf6', Icon: Clock },
  pending: { label: 'Pending', color: '#64748b', Icon: Clock },
};

export default function TrackDonationPage() {
  const [searchId, setSearchId] = useState('');
  const [results, setResults] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const found = MOCK_DONATIONS.find(d => d.id.toLowerCase() === searchId.trim().toLowerCase());
    setResults(found || null);
    setSearched(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className={styles.container}>
      <Link href="/donate" className={styles.backLink}>
        <ArrowLeft size={16} /> Back to Donate
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className={styles.title}>🔍 Track Your Donation</h1>
        <p className={styles.subtitle}>Enter your Receipt ID to see exactly where your money went.</p>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.searchInputWrap}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="e.g. RNET-2026-48291"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button type="submit" className={styles.searchBtn}>Track</button>
        </form>

        <div className={styles.demoHint}>
          💡 Try these IDs: <button type="button" onClick={() => setSearchId('RNET-2026-48291')} className={styles.hintBtn}>RNET-2026-48291</button> or <button type="button" onClick={() => setSearchId('RNET-2026-37154')} className={styles.hintBtn}>RNET-2026-37154</button>
        </div>

        {searched && !results && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.notFound}>
            ❌ No donation found with ID &quot;{searchId}&quot;. Check your receipt and try again.
          </motion.div>
        )}

        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.resultCard}
          >
            <div className={styles.resultHeader}>
              <div>
                <h2 className={styles.receiptId}>{results.id}</h2>
                <p className={styles.disasterName}>{results.disaster}</p>
                <p className={styles.dateLine}>Donated on {new Date(results.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div className={styles.totalAmount}>{formatCurrency(results.amount)}</div>
            </div>

            <h3 className={styles.allocationTitle}>Allocation Breakdown</h3>

            <div className={styles.allocList}>
              {results.allocations.map((alloc, idx) => {
                const statusInfo = STATUS_CONFIG[alloc.status];
                const StatusIcon = statusInfo.Icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={styles.allocItem}
                  >
                    <div className={styles.allocLeft}>
                      <span className={styles.allocEmoji}>{alloc.icon}</span>
                      <div>
                        <div className={styles.allocCategory}>{alloc.category}</div>
                        <div className={styles.allocNgo}>→ {alloc.ngo}</div>
                      </div>
                    </div>
                    <div className={styles.allocRight}>
                      <div className={styles.allocAmount}>{formatCurrency(alloc.amount)}</div>
                      <div className={styles.allocStatus} style={{ color: statusInfo.color }}>
                        <StatusIcon size={14} /> {statusInfo.label}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className={styles.disclaimer}>
              ⚠️ This is a prototype demonstration. In production, donation tracking would be linked to real-time NGO disbursement data.
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
