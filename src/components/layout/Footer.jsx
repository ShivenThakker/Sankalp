'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.brandSection}>
            <Link href="/" className={styles.logo}>
              🌿 <span className={styles.brandText}>Sankalp</span>
            </Link>
            <p className={styles.brandDesc}>
              A unified platform for disaster management, NGO coordination, and community resilience.
            </p>
          </div>
          
          <div className={styles.linksSection}>
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>Platform</h4>
              <Link href="/disasters" className={styles.link}>Disasters</Link>
              <Link href="/ngos" className={styles.link}>NGOs</Link>
              <Link href="/map" className={styles.link}>Map</Link>
            </div>
            
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>Get Involved</h4>
              <Link href="/donate" className={styles.link}>Donate</Link>
              <Link href="/volunteer" className={styles.link}>Volunteer</Link>
              <Link href="/register-ngo" className={styles.link}>Register NGO</Link>
            </div>
            
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>Resources</h4>
              <Link href="/help" className={styles.link}>Help Center</Link>
              <Link href="/dashboard" className={styles.link}>Dashboard</Link>
              <Link href="/login" className={styles.link}>Login</Link>
            </div>
          </div>
          
          <div className={styles.newsletterSection}>
            <h4 className={styles.columnTitle}>Stay Updated</h4>
            <p className={styles.newsletterDesc}>Get the latest updates on relief efforts and platform features.</p>
            <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className={styles.emailInput}
                required
              />
              <button type="submit" className={styles.subscribeBtn}>
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            © 2026 Sankalp. All rights reserved. | Made for SIH 2026
          </div>
        </div>
      </div>
    </footer>
  );
}
