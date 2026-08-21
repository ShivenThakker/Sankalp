'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee, Heart, ShieldCheck, MapPin, Truck, Home, PlusCircle, User, Mail, CheckCircle2, ChevronRight, Activity, ArrowRight, X } from 'lucide-react';
import styles from './page.module.css';

const DISASTERS = [
  { id: 'assam', title: 'Assam Floods', urgent: true },
  { id: 'odisha', title: 'Cyclone Warning Odisha', urgent: false },
  { id: 'uttarakhand', title: 'Forest Fire Uttarakhand', urgent: false },
  { id: 'general', title: 'General Relief Fund', urgent: false },
];

const PRESET_AMOUNTS = [100, 500, 1000, 5000, 10000];

const ALLOCATIONS = [
  { id: 'food', label: 'Food & Nutrition', icon: Activity },
  { id: 'medical', label: 'Medical Supplies', icon: Heart },
  { id: 'shelter', label: 'Shelter', icon: Home },
  { id: 'logistics', label: 'Transport & Logistics', icon: Truck },
];

export default function DonatePage() {
  const [selectedDisaster, setSelectedDisaster] = useState('assam');
  const [amount, setAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  
  const [allocations, setAllocations] = useState({
    food: false,
    medical: false,
    shelter: false,
    logistics: false,
    platform: true // Let Sankalp Decide
  });

  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    anonymous: false
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [receiptId, setReceiptId] = useState('');

  const handleAllocationToggle = (id) => {
    if (id === 'platform') {
      setAllocations({
        food: false,
        medical: false,
        shelter: false,
        logistics: false,
        platform: true
      });
    } else {
      setAllocations(prev => ({
        ...prev,
        platform: false,
        [id]: !prev[id]
      }));
    }
  };

  const handleDonate = (e) => {
    e.preventDefault();
    const finalAmount = isCustom ? (parseInt(customAmount) || 0) : amount;
    if (finalAmount <= 0) return;

    setReceiptId(`RNET-2026-${Math.floor(10000 + Math.random() * 90000)}`);
    setIsSuccess(true);
  };

  const displayAmount = isCustom ? (customAmount || '0') : amount;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.title}
        >
          💰 Donate for Relief
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={styles.subtitle}
        >
          Every rupee goes directly to verified organizations. Track where your donation goes.
        </motion.p>
      </div>

      <div className={styles.content}>
        <form onSubmit={handleDonate} className={styles.formContainer}>
          
          {/* Disaster Selector */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Select Cause</h2>
            <div className={styles.disasterGrid}>
              {DISASTERS.map((disaster) => (
                <div 
                  key={disaster.id}
                  className={`${styles.disasterCard} ${selectedDisaster === disaster.id ? styles.selectedCard : ''}`}
                  onClick={() => setSelectedDisaster(disaster.id)}
                >
                  <div className={styles.disasterInfo}>
                    <MapPin size={18} />
                    <span>{disaster.title}</span>
                  </div>
                  {disaster.urgent && <span className={styles.urgentBadge}>Urgent</span>}
                </div>
              ))}
            </div>
          </section>

          {/* Amount Selection */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Donation Amount</h2>
            <div className={styles.amountGrid}>
              {PRESET_AMOUNTS.map((amt) => (
                <button
                  type="button"
                  key={amt}
                  className={`${styles.amountBtn} ${!isCustom && amount === amt ? styles.selectedAmount : ''}`}
                  onClick={() => {
                    setAmount(amt);
                    setIsCustom(false);
                  }}
                >
                  ₹{amt.toLocaleString()}
                </button>
              ))}
              <button
                type="button"
                className={`${styles.amountBtn} ${isCustom ? styles.selectedAmount : ''}`}
                onClick={() => setIsCustom(true)}
              >
                Custom
              </button>
            </div>
            
            <AnimatePresence>
              {isCustom && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={styles.customAmountWrapper}
                >
                  <div className={styles.inputIconWrapper}>
                    <IndianRupee size={20} className={styles.inputIcon} />
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className={styles.inputField}
                      min="1"
                      required={isCustom}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Allocation Preference */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Allocation Preference (Optional)</h2>
            <div className={styles.allocationGrid}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={allocations.platform}
                  onChange={() => handleAllocationToggle('platform')}
                />
                <span className={styles.checkboxText}>
                  <ShieldCheck size={18} />
                  Let Sankalp Decide
                </span>
              </label>
              
              {ALLOCATIONS.map((alloc) => (
                <label key={alloc.id} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={allocations[alloc.id]}
                    onChange={() => handleAllocationToggle(alloc.id)}
                  />
                  <span className={styles.checkboxText}>
                    <alloc.icon size={18} />
                    {alloc.label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Donor Info */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Your Details</h2>
            <div className={styles.donorForm}>
              <div className={styles.inputGroup}>
                <User size={18} />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={donorInfo.name}
                  onChange={(e) => setDonorInfo({...donorInfo, name: e.target.value})}
                  required={!donorInfo.anonymous}
                  disabled={donorInfo.anonymous}
                />
              </div>
              <div className={styles.inputGroup}>
                <Mail size={18} />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={donorInfo.email}
                  onChange={(e) => setDonorInfo({...donorInfo, email: e.target.value})}
                  required={!donorInfo.anonymous}
                  disabled={donorInfo.anonymous}
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"
                />
              </div>
              <label className={styles.anonymousToggle}>
                <input
                  type="checkbox"
                  checked={donorInfo.anonymous}
                  onChange={(e) => setDonorInfo({...donorInfo, anonymous: e.target.checked})}
                />
                Donate Anonymously
              </label>
            </div>
          </section>

          <button type="submit" className={styles.submitBtn}>
            DONATE ₹{Number(displayAmount).toLocaleString()} <ArrowRight size={20} />
          </button>
        </form>

        {/* Transparency Section */}
        <section className={styles.transparencySection}>
          <h2 className={styles.transparencyTitle}>Where Your Money Goes</h2>
          <div className={styles.barChartContainer}>
            <div className={styles.barChart}>
              <div className={styles.barSegment} style={{width: '65%', backgroundColor: '#10b981'}}>65%</div>
              <div className={styles.barSegment} style={{width: '25%', backgroundColor: '#f59e0b'}}>25%</div>
              <div className={styles.barSegment} style={{width: '10%', backgroundColor: '#ef4444'}}>10%</div>
            </div>
            <div className={styles.legend}>
              <div className={styles.legendItem}><span className={styles.dot} style={{backgroundColor: '#10b981'}}></span>Direct Relief</div>
              <div className={styles.legendItem}><span className={styles.dot} style={{backgroundColor: '#f59e0b'}}></span>Logistics</div>
              <div className={styles.legendItem}><span className={styles.dot} style={{backgroundColor: '#ef4444'}}></span>Emergency Reserve</div>
            </div>
          </div>
        </section>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={styles.modalContent}
            >
              <button className={styles.closeBtn} onClick={() => setIsSuccess(false)}>
                <X size={24} />
              </button>
              <div className={styles.successIcon}>
                <CheckCircle2 size={64} />
              </div>
              <h2 className={styles.modalTitle}>Thank you!</h2>
              <p className={styles.modalDesc}>Your donation of ₹{Number(displayAmount).toLocaleString()} has been recorded.</p>
              <div className={styles.receiptBox}>
                <span>Receipt ID:</span>
                <strong>{receiptId}</strong>
              </div>
              <a href="/donate/track" className={styles.trackLink}>
                Track your donation <ChevronRight size={16} />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
