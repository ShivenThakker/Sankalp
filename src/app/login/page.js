'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, LogIn, Globe, AlertCircle, CheckCircle2 } from 'lucide-react';
import styles from './page.module.css';

const ROLES = [
  { id: 'citizen', label: 'Citizen' },
  { id: 'volunteer', label: 'Volunteer' },
  { id: 'ngo', label: 'NGO Admin' },
  { id: 'donor', label: 'Donor' }
];

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [role, setRole] = useState('citizen');
  const [showToast, setShowToast] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={styles.toast}
          >
            <CheckCircle2 size={20} className={styles.toastIcon} />
            <span>Success! {activeTab === 'login' ? 'Logged in' : 'Registered'} successfully.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={styles.authCard}
      >
        <div className={styles.header}>
          <h2>{activeTab === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p>Sign in to access Sankalp features</p>
        </div>

        <div className={styles.tabs}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'login' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'register' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className={styles.formContent}
            >
              {activeTab === 'register' && (
                <>
                  <div className={styles.inputGroup}>
                    <User size={18} />
                    <input type="text" placeholder="Full Name" required />
                  </div>
                  <div className={styles.inputGroup}>
                    <Phone size={18} />
                    <input 
                      type="tel" 
                      placeholder="10-digit mobile number" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\\D/g, '').slice(0, 10))}
                      maxLength={10}
                      pattern="[0-9]{10}"
                      inputMode="numeric"
                      required 
                    />
                  </div>
                </>
              )}
              
              <div className={styles.inputGroup}>
                <Mail size={18} />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"
                  required 
                />
              </div>
              
              <div className={styles.inputGroup}>
                <Lock size={18} />
                <input type="password" placeholder="Password" required />
              </div>

              <div className={styles.roleSection}>
                <label className={styles.roleLabel}>I am a:</label>
                <div className={styles.roleGrid}>
                  {ROLES.map(r => (
                    <label 
                      key={r.id} 
                      className={`${styles.roleRadio} ${role === r.id ? styles.roleActive : ''}`}
                    >
                      <input 
                        type="radio" 
                        name="role" 
                        value={r.id}
                        checked={role === r.id}
                        onChange={() => setRole(r.id)}
                      />
                      {r.label}
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className={styles.submitBtn}>
                {activeTab === 'login' ? 'Login' : 'Create Account'}
              </button>

              {activeTab === 'login' && (
                <>
                  <div className={styles.divider}>
                    <span>or</span>
                  </div>
                  <button type="button" className={styles.googleBtn} onClick={handleSubmit}>
                    <Globe size={18} />
                    Continue with Google
                  </button>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </form>

        <div className={styles.simulationNote}>
          <AlertCircle size={14} />
          <span>{activeTab === 'login' ? 'Welcome back! Please enter your details.' : 'Sign in to continue.'}</span>
        </div>
      </motion.div>
    </div>
  );
}
