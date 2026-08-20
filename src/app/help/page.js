'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Phone, ArrowRight, Loader2 } from 'lucide-react';
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

export default function HelpPage() {
  const router = useRouter();
  const [selectedNeeds, setSelectedNeeds] = useState([]);
  const [peopleCount, setPeopleCount] = useState('1');
  const [urgency, setUrgency] = useState('medium');
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('getting'); // 'getting', 'found', 'failed'
  const [manualAddress, setManualAddress] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationStatus('found');
        },
        (error) => {
          setLocationStatus('failed');
        },
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

  const handleFindHelp = () => {
    if (selectedNeeds.length === 0) return;
    if (locationStatus === 'failed' && !manualAddress) return;

    const query = new URLSearchParams();
    query.set('needs', selectedNeeds.join(','));
    query.set('people', peopleCount);
    query.set('urgency', urgency);
    if (location) {
      query.set('lat', location.lat);
      query.set('lng', location.lng);
    }
    if (manualAddress) query.set('address', manualAddress);
    if (phone) query.set('phone', phone);

    router.push(`/help/results?${query.toString()}`);
  };

  const isFormValid = selectedNeeds.length > 0 && (location || manualAddress);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>🆘 I Need Help</h1>
        <p className={styles.subtitle}>Tell us what you need. We'll find verified help near you.</p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>What do you need? (Select all that apply)</h2>
        <div className={styles.needsGrid}>
          {NEEDS.map((need) => (
            <motion.button
              key={need.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleNeed(need.id)}
              className={`${styles.needCard} ${selectedNeeds.includes(need.id) ? styles.selected : ''}`}
            >
              <span className={styles.emoji}>{need.emoji}</span>
              <span className={styles.label}>{need.label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>How many people?</h2>
        <div className={styles.peopleRow}>
          {PEOPLE.map((p) => (
            <button
              key={p}
              onClick={() => setPeopleCount(p)}
              className={`${styles.peopleBtn} ${peopleCount === p ? styles.selectedBtn : ''}`}
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Urgency</h2>
        <div className={styles.urgencyRow}>
          {URGENCY.map((u) => (
            <button
              key={u.id}
              onClick={() => setUrgency(u.id)}
              className={`${styles.urgencyBtn} ${styles[u.color]} ${urgency === u.id ? styles.selectedUrgency : ''}`}
            >
              {u.label}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Location</h2>
        <div className={styles.locationBox}>
          {locationStatus === 'getting' && (
            <p className={styles.locText}><Loader2 className={styles.spin} size={20} /> Getting your location...</p>
          )}
          {locationStatus === 'found' && location && (
            <p className={styles.locText}><MapPin size={20} /> Location found: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
          )}
          {locationStatus === 'failed' && (
            <div className={styles.manualLoc}>
              <p className={styles.locText}><MapPin size={20} /> Could not get location. Enter manually:</p>
              <input 
                type="text" 
                value={manualAddress} 
                onChange={(e) => setManualAddress(e.target.value)} 
                placeholder="e.g. 123 Main St, Near Central Park" 
                className={styles.input}
              />
            </div>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Contact Phone (Optional)</h2>
        <div className={styles.inputWrapper}>
          <Phone className={styles.inputIcon} size={20} />
          <input 
            type="tel" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            placeholder="Your phone number" 
            className={styles.inputWithIcon}
          />
        </div>
      </section>

      <motion.button 
        whileTap={isFormValid ? { scale: 0.95 } : {}}
        onClick={handleFindHelp}
        disabled={!isFormValid}
        className={styles.ctaButton}
      >
        FIND HELP NOW <ArrowRight size={24} />
      </motion.button>
    </div>
  );
}
