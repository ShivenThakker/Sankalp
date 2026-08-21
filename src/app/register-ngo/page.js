'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, FileText, Phone, Mail, Globe, MapPin, CheckCircle2, ArrowRight, X } from 'lucide-react';
import styles from './page.module.css';

const CAPABILITIES = [
  { id: 'food', label: 'Food Distribution', emoji: '🍚' },
  { id: 'medical', label: 'Medical Aid', emoji: '💊' },
  { id: 'shelter', label: 'Shelter', emoji: '🏠' },
  { id: 'rescue', label: 'Rescue', emoji: '🚑' },
  { id: 'water', label: 'Water Supply', emoji: '💧' },
  { id: 'transport', label: 'Transport', emoji: '🚗' },
  { id: 'animal', label: 'Animal Rescue', emoji: '🐕' },
  { id: 'counseling', label: 'Counseling', emoji: '🧠' },
  { id: 'logistics', label: 'Logistics', emoji: '📦' }
];

const STATES = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];

export default function RegisterNGOPage() {
  const [formData, setFormData] = useState({
    name: '',
    regNumber: '',
    darpanId: '',
    panNumber: '',
    regType: 'Trust',
    year: '',
    contactName: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    state: '',
    district: ''
  });

  const [selectedCapabilities, setSelectedCapabilities] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCapabilityToggle = (id) => {
    setSelectedCapabilities(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
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
          🏢 Register Your NGO
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={styles.subtitle}
        >
          Join the verified relief network. Get matched with citizens who need your help.
        </motion.p>
      </div>

      <form onSubmit={handleSubmit} className={styles.formContainer}>
        {/* Organization Info */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 40 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, amount: 0.2 }} 
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className={styles.sectionTitle}>Organization Info</h2>
          <div className={styles.inputGrid}>
            <div className={styles.inputGroup}>
              <Building2 size={18} />
              <input
                type="text"
                placeholder="Organization Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <FileText size={18} />
              <input
                type="text"
                placeholder="Registration Number"
                value={formData.regNumber}
                onChange={(e) => setFormData({...formData, regNumber: e.target.value})}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <FileText size={18} />
              <input
                type="text"
                placeholder="NGO DARPAN ID (Optional)"
                value={formData.darpanId}
                onChange={(e) => setFormData({...formData, darpanId: e.target.value})}
              />
            </div>
            <div className={styles.inputGroup}>
              <FileText size={18} />
              <input
                type="text"
                placeholder="PAN Number"
                value={formData.panNumber}
                onChange={(e) => setFormData({...formData, panNumber: e.target.value})}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <Building2 size={18} />
              <select
                value={formData.regType}
                onChange={(e) => setFormData({...formData, regType: e.target.value})}
                required
              >
                <option value="Trust">Trust</option>
                <option value="Society">Society</option>
                <option value="Section 8 Company">Section 8 Company</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <FileText size={18} />
              <input
                type="number"
                placeholder="Year Established"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: e.target.value})}
                required
              />
            </div>
          </div>
        </motion.section>

        {/* Contact Info */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 40 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, amount: 0.2 }} 
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className={styles.sectionTitle}>Contact Info</h2>
          <div className={styles.inputGrid}>
            <div className={styles.inputGroup}>
              <Building2 size={18} />
              <input
                type="text"
                placeholder="Contact Person Name"
                value={formData.contactName}
                onChange={(e) => setFormData({...formData, contactName: e.target.value})}
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
              <Globe size={18} />
              <input
                type="url"
                placeholder="Website (Optional)"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
              />
            </div>
            <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
              <MapPin size={18} />
              <textarea
                placeholder="Full Address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
                rows={3}
                className={styles.textarea}
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
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
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
        </motion.section>

        {/* Capabilities */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 40 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, amount: 0.2 }} 
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className={styles.sectionTitle}>Capabilities</h2>
          <div className={styles.capabilitiesGrid}>
            {CAPABILITIES.map(cap => (
              <div
                key={cap.id}
                className={`${styles.capCard} ${selectedCapabilities.includes(cap.id) ? styles.selectedCap : ''}`}
                onClick={() => handleCapabilityToggle(cap.id)}
              >
                <span className={styles.capEmoji}>{cap.emoji}</span>
                <span className={styles.capLabel}>{cap.label}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Documents Upload */}
        <motion.section 
          className={styles.section}
          initial={{ opacity: 0, y: 40 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, amount: 0.2 }} 
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className={styles.sectionTitle}>Documents Upload</h2>
          <p className={styles.helperText}>Please upload valid PDF or image files for verification.</p>
          <div className={styles.inputGrid}>
            <div className={styles.fileUpload}>
              <label>Registration Certificate *</label>
              <input type="file" required accept=".pdf,.jpg,.jpeg,.png" />
            </div>
            <div className={styles.fileUpload}>
              <label>PAN Card *</label>
              <input type="file" required accept=".pdf,.jpg,.jpeg,.png" />
            </div>
            <div className={styles.fileUpload}>
              <label>80G Certificate (Optional)</label>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
            </div>
            <div className={styles.fileUpload}>
              <label>FCRA Certificate (Optional)</label>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
            </div>
          </div>
        </motion.section>

        <button type="submit" className={styles.submitBtn}>
          SUBMIT FOR VERIFICATION <ArrowRight size={20} />
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
              <h2 className={styles.modalTitle}>✅ Application submitted!</h2>
              <p className={styles.modalDesc}>Our team will review your documents within 48 hours.</p>
              <button 
                className={styles.primaryModalBtn}
                onClick={() => setIsSuccess(false)}
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
