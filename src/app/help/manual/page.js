'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Navigation,
  PhoneCall,
  Shield,
  Clock
} from 'lucide-react';
import styles from './page.module.css';

const NEEDS = [
  { id: 'food', label: 'Food', emoji: '🍚' },
  { id: 'medical', label: 'Medical', emoji: '💊' },
  { id: 'shelter', label: 'Shelter', emoji: '🏠' },
  { id: 'rescue', label: 'Rescue', emoji: '🚑' },
  { id: 'water', label: 'Water', emoji: '💧' },
  { id: 'transport', label: 'Transport', emoji: '🚗' },
  { id: 'animal_rescue', label: 'Animal Rescue', emoji: '🐕' },
  { id: 'other', label: 'Other', emoji: '📦' }
];

const PEOPLE = ['1', '2-5', '5-20', '20+'];

const URGENCY = [
  { id: 'low', label: 'Can Wait', color: 'green' },
  { id: 'medium', label: 'Urgent', color: 'amber' },
  { id: 'high', label: 'CRITICAL', color: 'red' }
];

export default function ManualHelpPage() {
  const router = useRouter();

  const [selectedNeeds, setSelectedNeeds] = useState([]);
  const [peopleCount, setPeopleCount] = useState('1');
  const [urgency, setUrgency] = useState('medium');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('getting');
  const [manualAddress, setManualAddress] = useState('');

  const [parsedData, setParsedData] = useState(null);
  const [matchedNgo, setMatchedNgo] = useState(null);
  const [requestId, setRequestId] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setLocationStatus('found');
        },
        () => { setLocationStatus('failed'); },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationStatus('failed');
    }
  }, []);

  const toggleNeed = (id) => {
    setSelectedNeeds((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selectedNeeds.length === 0) return;
    if (locationStatus === 'failed' && !manualAddress) return;

    setSubmitting(true);
    try {
      const useLat = location?.lat || 26.18;
      const useLng = location?.lng || 91.75;
      const peopleNum = peopleCount === '20+' ? 25 : peopleCount === '5-20' ? 10 : peopleCount === '2-5' ? 3 : 1;

      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          needs: selectedNeeds,
          lat: useLat,
          lng: useLng,
          urgency,
          people: peopleNum
        })
      });
      const matchData = await res.json();

      setParsedData({
        needs: selectedNeeds,
        people: peopleNum,
        urgency: urgency,
        location_description: manualAddress || 'GPS location captured',
        message: 'Help needed: ' + selectedNeeds.join(', ') + ' for ' + peopleCount + ' people'
      });

      if (matchData.matches && matchData.matches.length > 0) {
        setMatchedNgo(matchData.matches[0]);
        setRequestId(matchData.requestId);
      }

      setShowConfirmation(true);
    } catch (error) {
      console.error('Submit error:', error);
      alert('Something went wrong. Please call 112 for emergency help.');
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = selectedNeeds.length > 0 && (location || manualAddress);

  // ==================== CONFIRMATION SCREEN ====================
  if (showConfirmation) {
    return (
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={styles.confirmationScreen}
        >
          <div className={styles.confirmHeader}>
            <CheckCircle size={48} className={styles.confirmIcon} />
            <h1 className={styles.confirmTitle}>Help Request Sent</h1>
            {requestId && <p className={styles.requestIdText}>Request ID: {requestId}</p>}
          </div>

          {parsedData && (
            <div className={styles.parsedCard}>
              <h3 className={styles.parsedCardTitle}><AlertTriangle size={18} /> Request Summary</h3>
              <div className={styles.parsedGrid}>
                <div className={styles.parsedItem}>
                  <span className={styles.parsedLabel}>Needs</span>
                  <span className={styles.parsedValue}>
                    {parsedData.needs.map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(', ')}
                  </span>
                </div>
                <div className={styles.parsedItem}>
                  <span className={styles.parsedLabel}>People</span>
                  <span className={styles.parsedValue}>{parsedData.people}</span>
                </div>
                <div className={styles.parsedItem}>
                  <span className={styles.parsedLabel}>Urgency</span>
                  <span className={`${styles.parsedValue} ${styles['urgency_' + parsedData.urgency]}`}>
                    {parsedData.urgency.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {matchedNgo && (
            <div className={styles.ngoCard}>
              <div className={styles.ngoCardHeader}>
                <h3>{matchedNgo.name}</h3>
                <div className={styles.ngoScore}><Shield size={14} /> Match: {matchedNgo.matchScore}%</div>
              </div>
              <div className={styles.ngoDetails}>
                <div className={styles.ngoStat}><MapPin size={14} /> {matchedNgo.distance} km away</div>
                <div className={styles.ngoStat}><Clock size={14} /> ETA: ~{matchedNgo.eta} min</div>
                <div className={styles.ngoStat}><Shield size={14} /> Trust: {matchedNgo.verificationScore}%</div>
              </div>
              <div className={styles.ngoActions}>
                <a href={`tel:${matchedNgo.phone.replace(/[^0-9+]/g, '')}`} className={styles.callBtn}>
                  <PhoneCall size={18} /> Call NGO
                </a>
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(matchedNgo.address)}`} target="_blank" rel="noopener noreferrer" className={styles.directionsBtn}>
                  <Navigation size={18} /> Directions
                </a>
              </div>
            </div>
          )}

          <div className={styles.confirmFooter}>
            <button onClick={() => {
              const q = new URLSearchParams();
              if (parsedData) { q.set('needs', parsedData.needs.join(',')); q.set('urgency', parsedData.urgency); q.set('people', String(parsedData.people)); }
              if (location) { q.set('lat', String(location.lat)); q.set('lng', String(location.lng)); }
              router.push('/help/results?' + q.toString());
            }} className={styles.browseBtn}>Browse All Matched NGOs</button>
            <div className={styles.emergencyFallback}>
              <p>Can't reach them?</p>
              <a href="tel:112" className={styles.emergencyBtn}><PhoneCall size={18} /> Call Emergency: 112</a>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ==================== FORM ====================
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/help" className={styles.backLink}><ArrowLeft size={18} /> Back to SOS</Link>
        <h1 className={styles.title}>Select What You Need</h1>
        <p className={styles.subtitle}>Choose your requirements manually.</p>
      </header>

      <motion.section className={styles.section} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}>
        <h2 className={styles.sectionTitle}>What do you need? (Select all that apply)</h2>
        <div className={styles.needsGrid}>
          {NEEDS.map((need) => (
            <motion.button key={need.id} whileTap={{ scale: 0.95 }} onClick={() => toggleNeed(need.id)} className={`${styles.needCard} ${selectedNeeds.includes(need.id) ? styles.selected : ''}`}>
              <span className={styles.emoji}>{need.emoji}</span>
              <span className={styles.label}>{need.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.section>

      <motion.section className={styles.section} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}>
        <h2 className={styles.sectionTitle}>How many people?</h2>
        <div className={styles.peopleRow}>
          {PEOPLE.map((p) => (
            <button key={p} onClick={() => setPeopleCount(p)} className={`${styles.peopleBtn} ${peopleCount === p ? styles.selectedBtn : ''}`}>{p}</button>
          ))}
        </div>
      </motion.section>

      <motion.section className={styles.section} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}>
        <h2 className={styles.sectionTitle}>Urgency</h2>
        <div className={styles.urgencyRow}>
          {URGENCY.map((u) => (
            <button key={u.id} onClick={() => setUrgency(u.id)} className={`${styles.urgencyBtn} ${styles[u.color]} ${urgency === u.id ? styles.selectedUrgency : ''}`}>{u.label}</button>
          ))}
        </div>
      </motion.section>

      <motion.section className={styles.section} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}>
        <h2 className={styles.sectionTitle}>Location</h2>
        <div className={styles.locationBox}>
          {locationStatus === 'getting' && (<p className={styles.locText}><Loader2 className={styles.spin} size={20} /> Getting your location...</p>)}
          {locationStatus === 'found' && location && (<p className={styles.locText}><MapPin size={20} /> Location found: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>)}
          {locationStatus === 'failed' && (
            <div className={styles.manualLoc}>
              <p className={styles.locText}><MapPin size={20} /> Could not get location. Enter manually:</p>
              <input type="text" value={manualAddress} onChange={(e) => setManualAddress(e.target.value)} placeholder="e.g. 123 Main St, Near Central Park" className={styles.input} />
            </div>
          )}
        </div>
      </motion.section>

      <motion.section className={styles.section} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}>
        <h2 className={styles.sectionTitle}>Contact Phone (Optional)</h2>
        <div className={styles.inputWrapper}>
          <Phone className={styles.inputIcon} size={20} />
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" maxLength={10} inputMode="numeric" className={styles.inputWithIcon} />
        </div>
      </motion.section>

      <motion.button whileTap={isFormValid ? { scale: 0.95 } : {}} onClick={handleSubmit} disabled={!isFormValid || submitting} className={styles.ctaButton}>
        {submitting ? (<><Loader2 className={styles.spin} size={24} /> Finding best NGO...</>) : (<>SEND HELP REQUEST <ArrowRight size={24} /></>)}
      </motion.button>
    </div>
  );
}
