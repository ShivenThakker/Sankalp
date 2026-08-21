'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { 
  CheckCircle, 
  ArrowRight,
  Check
} from 'lucide-react';
import { useGodMode } from '@/hooks/useGodMode';
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
  const alerts = [
    { id: 4, title: 'Kerala Landslides', emoji: '⛰️', severity: 'HIGH', location: 'Wayanad', districts: 'Wayanad', pop: '20,000+', type: 'high' },
    { id: 5, title: 'Gujarat Flood Relief', emoji: '🌊', severity: 'MODERATE', location: 'Kutch', districts: 'Kutch', pop: '15,000+', type: 'mod' },
    { id: 6, title: 'Earthquake Tremors', emoji: '💥', severity: 'MODERATE', location: 'Manipur', districts: 'Imphal', pop: '5,000+', type: 'mod' },
    { id: 1, title: 'Assam Floods', emoji: '🌊', severity: 'HIGH', location: 'Kamrup', districts: 'Kamrup, Nagaon', pop: '50,000+', type: 'high' },
    { id: 2, title: 'Cyclone Warning', emoji: '🌀', severity: 'MODERATE', location: 'Odisha coast', districts: 'Puri, Ganjam', pop: '100,000+', type: 'mod' },
    { id: 3, title: 'Forest Fire', emoji: '🔥', severity: 'LOW', location: 'Uttarakhand', districts: 'Almora', pop: '1,000+', type: 'low' }
  ];

  const { customDisasters } = useGodMode();
  
  const allAlerts = [
    ...customDisasters.map(d => ({
      id: d.id,
      title: d.name,
      emoji: '⚡',
      severity: d.severity.toUpperCase(),
      location: d.districts?.[0] || 'Unknown',
      districts: d.districts?.join(', ') || 'Unknown',
      pop: d.affectedPopulation?.toLocaleString() + '+',
      type: d.severity === 'high' || d.severity === 'critical' ? 'high' : d.severity === 'moderate' ? 'mod' : 'low',
      isCustom: true
    })),
    ...alerts
  ];

  const steps = [
    { num: '01', icon: '🆘', title: 'Request Help', desc: 'Citizens report what they need. AI categorizes requirements.' },
    { num: '02', icon: '🤖', title: 'AI Matching', desc: 'Our matching engine finds and scores the nearest verified responders.' },
    { num: '03', icon: '✅', title: 'Verified Response', desc: 'Matched NGO responds and relief reaches those who need it.' }
  ];

  const trustParams = ['Registration', 'DARPAN', 'PAN', '80G', 'FCRA', 'Address', 'History', 'Activity'];

  return (
    <div className={styles.pageContainer}>
      
      {/* HERO SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={styles.heroSection}
      >
        <div className={styles.heroContent}>
          <span className={styles.sectionBadge}>✦ DISASTER RELIEF COORDINATION</span>
          <h1 className={[styles.serifHeading, styles.heroTitle].join(' ')}>Connecting help where it's needed most</h1>
          <p className={styles.heroSubtitle}>
            India's first AI-powered disaster relief platform. Connecting affected citizens with verified NGOs, donors, and volunteers in real-time.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/help" className={styles.btnPrimary}>
              I Need Help
            </Link>
            <Link href="/dashboard/admin" className={styles.btnSecondary}>
              View Dashboard
            </Link>
          </div>
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <div className={styles.statValue}><CountUp end={6} /></div>
              <div className={styles.statLabel}>Active Disasters</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}><CountUp end={142} /></div>
              <div className={styles.statLabel}>NGOs Verified</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}><CountUp end={2340} suffix="+" /></div>
              <div className={styles.statLabel}>Requests Resolved</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ACTIVE ALERTS SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={styles.section}
      >
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>⚡ LIVE ALERTS</span>
          <h2 className={[styles.serifHeading, styles.sectionTitle].join(' ')}>Active disaster alerts</h2>
        </div>
        <div className={styles.alertsGrid}>
          {allAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              className={[
                styles.alertCard, 
                alert.type === 'high' ? styles.borderRed : 
                alert.type === 'mod' ? styles.borderOrange : 
                styles.borderGreen
              ].join(' ')}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className={styles.alertHeader}>
                <div className={styles.alertTitleWrapper}>
                  <span className={styles.alertEmoji}>{alert.emoji}</span>
                  <h3 className={styles.alertTitle}>{alert.title} {alert.isCustom && <span style={{fontSize: '0.6em', color: 'orange', paddingLeft: '4px'}}>⚡ LIVE</span>}</h3>
                </div>
                <span className={[
                  styles.severityBadge, 
                  alert.type === 'high' ? styles.badgeRed : 
                  alert.type === 'mod' ? styles.badgeOrange : 
                  styles.badgeGreen
                ].join(' ')}>
                  {alert.severity}
                </span>
              </div>
              <div className={styles.alertBody}>
                <p><strong>Affected:</strong> {alert.pop}</p>
                <p><strong>Districts:</strong> {alert.districts}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* HOW IT WORKS SECTION */}
      <div className={styles.bgSubtle}>
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={styles.section}
        >
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>✦ HOW IT WORKS</span>
            <h2 className={[styles.serifHeading, styles.sectionTitle].join(' ')}>Three steps to verified relief</h2>
          </div>
          <div className={styles.stepsGrid}>
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className={styles.stepCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={styles.stepHeader}>
                  <span className={styles.stepNumber}>{step.num}</span>
                  <span className={styles.stepIcon}>{step.icon}</span>
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* DC COMMAND CENTER SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={styles.section}
      >
        <div className={styles.dcContainer}>
          <div className={styles.dcContent}>
            <span className={styles.sectionBadge}>🏛️ FOR DISTRICT COLLECTORS</span>
            <h2 className={[styles.serifHeading, styles.sectionTitle].join(' ')}>
              One dashboard. <span className={styles.italicText}>Complete visibility.</span>
            </h2>
            <p className={styles.dcDesc}>
              Sankalp gives District Collectors a real-time command center for disaster response coordination.
            </p>
            <ul className={styles.dcList}>
              <li><CheckCircle className={styles.checkIcon} size={20} /> Resource gap analysis</li>
              <li><CheckCircle className={styles.checkIcon} size={20} /> Real-time request feed</li>
              <li><CheckCircle className={styles.checkIcon} size={20} /> NGO coordination</li>
              <li><CheckCircle className={styles.checkIcon} size={20} /> Donation tracking</li>
            </ul>
            <Link href="/dashboard/admin" className={styles.linkWithIcon}>
              Open Command Center <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* TRUST PIPELINE SECTION */}
      <div className={styles.bgSubtle}>
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={styles.section}
        >
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>🔍 TRUST & VERIFICATION</span>
            <h2 className={[styles.serifHeading, styles.sectionTitle].join(' ')}>Every NGO, verified</h2>
          </div>
          <div className={styles.trustGrid}>
            {trustParams.map((step, index) => (
              <motion.div
                key={index}
                className={styles.trustCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Check className={styles.trustIcon} size={20} />
                <span className={styles.trustText}>{step}</span>
              </motion.div>
            ))}
          </div>
          <div className={styles.trustCtaContainer}>
            <Link href="/ngos" className={styles.linkWithIcon}>
              Browse Verified NGOs <ArrowRight size={18} />
            </Link>
          </div>
        </motion.section>
      </div>

      {/* CTA SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={styles.ctaSection}
      >
        <div className={styles.ctaContent}>
          <h2 className={[styles.serifHeading, styles.ctaTitle].join(' ')}>Ready to make a difference?</h2>
          <div className={styles.ctaButtons}>
            <Link href="/help" className={styles.btnWhite}>
              I Need Help
            </Link>
            <Link href="/donate" className={styles.btnWhiteOutline}>
              Donate Now
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
