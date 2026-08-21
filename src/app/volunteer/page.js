'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Mail, MapPin, CheckCircle2, ArrowRight, X } from 'lucide-react';
import styles from './page.module.css';

const SKILLS = [
  { id: 'first_aid', label: 'First Aid', icon: '🏥' },
  { id: 'driving', label: 'Driving', icon: '🚗' },
  { id: 'cooking', label: 'Cooking', icon: '🍳' },
  { id: 'medical', label: 'Medical', icon: '👨‍⚕️' },
  { id: 'engineering', label: 'Engineering', icon: '🔧' },
  { id: 'translation', label: 'Translation', icon: '🌐' },
  { id: 'logistics', label: 'Logistics', icon: '📦' },
  { id: 'counseling', label: 'Counseling', icon: '🧠' },
  { id: 'drone', label: 'Drone Ops', icon: '🚁' },
  { id: 'swimming', label: 'Swimming', icon: '🏊' },
  { id: 'electrical', label: 'Electrical', icon: '⚡' },
  { id: 'plumbing', label: 'Plumbing', icon: '🚰' },
];

export default function VolunteerPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    state: '',
    district: ''
  });

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [availability, setAvailability] = useState('full-time');
  const [hasVehicle, setHasVehicle] = useState(false);
  const [vehicleType, setVehicleType] = useState('car');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSkillToggle = (id) => {
    setSelectedSkills(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.title}
        >
          🙋 Volunteer for Relief
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={styles.subtitle}
        >
          Join verified relief operations. Your skills can save lives.
        </motion.p>
      </div>

      <form onSubmit={handleSubmit} className={styles.formContainer}>
        {/* Personal Info */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Personal Information</h2>
          <div className={styles.inputGrid}>
            <div className={styles.inputGroup}>
              <User size={18} />
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <Phone size={18} />
              <input
                type="tel"
                placeholder="10-digit mobile number"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\\D/g, '').slice(0, 10)})}
                maxLength={10}
                pattern="[0-9]{10}"
                inputMode="numeric"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <Mail size={18} />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <MapPin size={18} />
              <select 
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                required
              >
                <option value="">Select State</option>
                {['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className={styles.inputGroup}>
              <MapPin size={18} />
              <input 
                type="text"
                placeholder="District"
                value={formData.district}
                onChange={(e) => setFormData({...formData, district: e.target.value})}
                required
              />
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Your Skills</h2>
          <div className={styles.skillsGrid}>
            {SKILLS.map(skill => (
              <div
                key={skill.id}
                className={`${styles.skillCard} ${selectedSkills.includes(skill.id) ? styles.selectedSkill : ''}`}
                onClick={() => handleSkillToggle(skill.id)}
              >
                <span className={styles.skillIcon}>{skill.icon}</span>
                <span className={styles.skillLabel}>{skill.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Availability */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Availability</h2>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input 
                type="radio" 
                name="availability" 
                value="full-time"
                checked={availability === 'full-time'}
                onChange={() => setAvailability('full-time')}
              />
              <span className={styles.radioContent}>
                <strong>Full-time</strong>
                <span>During disaster duration</span>
              </span>
            </label>
            <label className={styles.radioLabel}>
              <input 
                type="radio" 
                name="availability" 
                value="part-time"
                checked={availability === 'part-time'}
                onChange={() => setAvailability('part-time')}
              />
              <span className={styles.radioContent}>
                <strong>Part-time</strong>
                <span>Weekends or specific hours</span>
              </span>
            </label>
            <label className={styles.radioLabel}>
              <input 
                type="radio" 
                name="availability" 
                value="on-call"
                checked={availability === 'on-call'}
                onChange={() => setAvailability('on-call')}
              />
              <span className={styles.radioContent}>
                <strong>On-call</strong>
                <span>Emergency situations only</span>
              </span>
            </label>
          </div>
        </section>

        {/* Additional Info */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Additional Resources</h2>
          <div className={styles.vehicleSection}>
            <label className={styles.toggleLabel}>
              <input 
                type="checkbox" 
                checked={hasVehicle}
                onChange={(e) => setHasVehicle(e.target.checked)}
              />
              I have a vehicle available for relief work
            </label>
            
            <AnimatePresence>
              {hasVehicle && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={styles.vehicleSelectWrapper}
                >
                  <select 
                    className={styles.select}
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                  >
                    <option value="car">Car / SUV</option>
                    <option value="motorcycle">Motorcycle / Scooter</option>
                    <option value="truck">Truck / Mini-Truck</option>
                    <option value="boat">Boat / Raft</option>
                  </select>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <button type="submit" className={styles.submitBtn}>
          REGISTER AS VOLUNTEER <ArrowRight size={20} />
        </button>
      </form>

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
              <h2 className={styles.modalTitle}>You're registered!</h2>
              <p className={styles.modalDesc}>Thank you for stepping up. We'll contact you when help is needed in your area.</p>
              <button 
                className={styles.primaryModalBtn}
                onClick={() => setIsSuccess(false)}
              >
                Back to Dashboard
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
