'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { 
  AlertTriangle, 
  Search, 
  CheckCircle, 
  ClipboardList, 
  Building2, 
  Users, 
  IndianRupee, 
  MapPin, 
  Shield, 
  Heart, 
  HandHelping, 
  ArrowRight,
  Check
} from 'lucide-react';
import styles from './page.module.css';

const CountUp = ({ end, duration = 2, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const step = end / (duration * 60);
      const timer = setInterval(() => {
        start += step;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className={styles.pageContainer}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroBackground} />
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.heroTitle}>When Disaster Strikes, Every Second Counts.</h1>
          <p className={styles.heroSubtitle}>
            India's verified disaster relief coordination platform. Connecting affected citizens with verified NGOs, donors, and volunteers in real-time.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/help" className={styles.btnDanger}>
              🆘 I Need Help
            </Link>
            <Link href="/volunteer" className={styles.btnPrimary}>
              I Want to Help
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ACTIVE ALERTS BANNER */}
      <section className={styles.alertsSection}>
        <div className={styles.alertsScroll}>
          {[
            
            { id: 4, title: '⛰️ Kerala Landslides', severity: 'HIGH', location: 'Wayanad', date: 'Aug 2026', type: 'high' },
            { id: 5, title: '🌊 Gujarat Flood Relief', severity: 'MODERATE', location: 'Kutch', date: 'Aug 2026', type: 'mod' },
            { id: 6, title: '💥 Earthquake Tremors', severity: 'MODERATE', location: 'Manipur', date: 'Aug 2026', type: 'mod' },
{ id: 1, title: '🌊 Assam Floods', severity: 'HIGH', location: 'Kamrup, Nagaon districts', date: 'Aug 2026', type: 'high' },
            { id: 2, title: '🌀 Cyclone Warning', severity: 'MODERATE', location: 'Odisha coast', date: 'Aug 2026', type: 'mod' },
            { id: 3, title: '🔥 Forest Fire', severity: 'LOW', location: 'Uttarakhand', date: 'Aug 2026', type: 'low' }
          ].map((alert, idx) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
            >
              <Link href="/disasters" className={`${styles.glassCard} ${styles.alertCard} ${alert.type === 'high' ? styles.alertHigh : alert.type === 'mod' ? styles.alertMod : styles.alertLow}`}>
                <div className={styles.alertHeader}>
                  <h3 className={styles.alertTitle}>{alert.title}</h3>
                  <span className={`${styles.alertBadge} ${alert.type === 'high' ? styles.badgeHigh : alert.type === 'mod' ? styles.badgeMod : styles.badgeLow}`}>
                    {alert.severity}
                  </span>
                </div>
                <div className={styles.alertBody}>
                  <span>📍 {alert.location}</span>
                  <span>🗓️ {alert.date}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>How Sankalp Works</h2>
          <p className={styles.sectionSubtitle}>Seamlessly coordinating relief efforts from alert to delivery.</p>
        </div>
        <motion.div 
          className={styles.stepsGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {[
            { icon: AlertTriangle, title: 'Disaster Detected', desc: 'SACHET alerts trigger our system automatically' },
            { icon: ClipboardList, title: 'Needs Identified', desc: 'Citizens report what they need. AI categorizes requirements.' },
            { icon: Search, title: 'NGOs Matched', desc: 'Our matching engine finds the nearest verified responders.' },
            { icon: CheckCircle, title: 'Help Delivered', desc: 'Relief reaches those who need it, tracked transparently.' }
          ].map((step, idx) => (
            <motion.div key={idx} variants={itemVariants} className={`${styles.glassCard} ${styles.stepCard}`}>
              <div className={styles.stepIcon}>
                <step.icon size={32} />
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* IMPACT STATS */}
      <section className={styles.section}>
        <motion.div 
          className={styles.statsGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { icon: Building2, end: 142, label: 'Verified NGOs', suffix: '' },
            { icon: Users, end: 2340, label: 'Volunteers Registered', suffix: '+' },
            { icon: IndianRupee, end: 12, label: 'Donations Tracked', prefix: '₹', suffix: ' Cr' },
            { icon: MapPin, end: 47, label: 'Active Districts', suffix: '' }
          ].map((stat, idx) => (
            <motion.div key={idx} variants={itemVariants} className={`${styles.glassCard} ${styles.statCard}`}>
              <stat.icon size={32} className={styles.ctaIcon} style={{ margin: '0 auto' }} />
              <div className={styles.statValue}>
                <CountUp end={stat.end} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <div className={styles.statLabel}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FOR DISTRICT COLLECTORS */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Built for Decision Makers</h2>
          <p className={styles.sectionSubtitle}>Sankalp gives District Collectors a real-time command center for disaster response coordination.</p>
        </div>
        <div className={styles.featuresGrid}>
          {[
            { icon: '📊', title: 'Resource Gap Analysis', desc: "See exactly what's covered and what's critically short across your district" },
            { icon: '🏢', title: 'Unified NGO View', desc: 'Every verified organization, their capabilities, and current resources in one dashboard' },
            { icon: '⚡', title: 'Smart Assignment', desc: 'AI-powered matching connects needs to the nearest capable responder' }
          ].map((feat, idx) => (
            <motion.div 
              key={idx}
              className={`${styles.glassCard} ${styles.featureCard}`}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.featureIcon}>{feat.icon}</div>
              <h3 className={styles.stepTitle}>{feat.title}</h3>
              <p className={styles.stepDesc}>{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TRUST & VERIFICATION */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Trust & Verification</h2>
          <p className={styles.sectionSubtitle}>Ensuring only verified organizations handle crucial relief operations.</p>
        </div>
        <div className={styles.pipeline}>
          {['Registration', 'DARPAN ID', 'PAN Verification', 'Address Check', 'Activity History', 'Verification Score'].map((step, idx) => (
            <motion.div 
              key={idx}
              className={styles.pipelineStep}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Check className={styles.pipelineIcon} size={24} />
              <span className={styles.pipelineText}>{step}</span>
            </motion.div>
          ))}
        </div>
        <div className={styles.trustBadge}>
          <div className={styles.trustBadgeInner}>
            <Shield size={20} />
            <span>🟢 DOCUMENTS VERIFIED — Score: 91/100</span>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Join the Network</h2>
        </div>
        <div className={styles.bottomCtaGrid}>
          <div className={`${styles.glassCard} ${styles.ctaCard}`}>
            <Building2 size={40} className={styles.ctaIcon} />
            <h3 className={styles.stepTitle}>Register as NGO</h3>
            <p className={styles.stepDesc}>Join our verified network to coordinate relief efforts effectively.</p>
            <Link href="/ngo-register" className={styles.btnSecondary}>
              Register <ArrowRight size={18} />
            </Link>
          </div>
          <div className={`${styles.glassCard} ${styles.ctaCard}`}>
            <HandHelping size={40} className={styles.ctaIcon} />
            <h3 className={styles.stepTitle}>Volunteer</h3>
            <p className={styles.stepDesc}>Offer your skills and time to help communities in need.</p>
            <Link href="/volunteer" className={styles.btnSecondary}>
              Sign Up <ArrowRight size={18} />
            </Link>
          </div>
          <div className={`${styles.glassCard} ${styles.ctaCard}`}>
            <Heart size={40} className={styles.ctaIcon} />
            <h3 className={styles.stepTitle}>Donate</h3>
            <p className={styles.stepDesc}>Fund critical relief operations through our verified partners.</p>
            <Link href="/donate" className={styles.btnSecondary}>
              Contribute <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
