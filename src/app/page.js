'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowRight,
  Check,
  Zap,
  Search,
  Shield,
  Users,
  AlertTriangle,
  MapPin,
  Clock,
  FileCheck,
  MonitorPlay,
  Eye,
  Activity,
  Heart
} from 'lucide-react';
import { useGodMode } from '@/hooks/useGodMode';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
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
    <span ref={ref} className={styles.mono}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export default function LandingPage() {
  const alerts = [
    { id: 4, title: 'Kerala Landslides', severity: 'HIGH', location: 'Wayanad', districts: 'Wayanad', pop: '20,000+', type: 'high' },
    { id: 5, title: 'Gujarat Flood Relief', severity: 'MODERATE', location: 'Kutch', districts: 'Kutch', pop: '15,000+', type: 'mod' },
    { id: 6, title: 'Earthquake Tremors', severity: 'MODERATE', location: 'Manipur', districts: 'Imphal', pop: '5,000+', type: 'mod' },
    { id: 1, title: 'Assam Floods', severity: 'HIGH', location: 'Kamrup', districts: 'Kamrup, Nagaon', pop: '50,000+', type: 'high' },
    { id: 2, title: 'Cyclone Warning', severity: 'MODERATE', location: 'Odisha coast', districts: 'Puri, Ganjam', pop: '100,000+', type: 'mod' },
    { id: 3, title: 'Forest Fire', severity: 'LOW', location: 'Uttarakhand', districts: 'Almora', pop: '1,000+', type: 'low' }
  ];

  const { customDisasters } = useGodMode();
  const { login } = useAuth();
  const router = useRouter();

  const handleNeedHelp = () => {
    login('citizen');
    router.push('/help');
  };
  
  const allAlerts = [
    ...customDisasters.map(d => ({
      id: d.id,
      title: d.name,
      severity: d.severity.toUpperCase(),
      location: d.districts?.[0] || 'Unknown',
      districts: d.districts?.join(', ') || 'Unknown',
      pop: d.affectedPopulation?.toLocaleString() + '+',
      type: d.severity === 'high' || d.severity === 'critical' ? 'high' : d.severity === 'moderate' ? 'mod' : 'low',
      isCustom: true
    })),
    ...alerts
  ];

  const trustParams = [
    { name: 'Registration', icon: FileCheck },
    { name: 'DARPAN', icon: Shield },
    { name: 'PAN Verification', icon: FileCheck },
    { name: '80G Certificate', icon: FileCheck },
    { name: 'FCRA Compliance', icon: Shield },
    { name: 'Physical Address', icon: MapPin },
    { name: 'Response History', icon: Clock },
    { name: 'Activity Status', icon: Activity },
  ];

  // AI Matching demo animation
  const [matchStep, setMatchStep] = useState(0);
  const matchRef = useRef(null);
  const matchInView = useInView(matchRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (matchInView && matchStep === 0) {
      const t1 = setTimeout(() => setMatchStep(1), 600);
      const t2 = setTimeout(() => setMatchStep(2), 2000);
      const t3 = setTimeout(() => setMatchStep(3), 3200);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [matchInView, matchStep]);

  const matchedNGOs = [
    { name: 'Assam Relief Foundation', score: 94, distance: '8km', capabilities: ['Food', 'Water', 'Shelter'] },
    { name: 'Shelter Now India', score: 87, distance: '12km', capabilities: ['Food', 'Shelter'] },
    { name: 'MedCare Initiative', score: 72, distance: '25km', capabilities: ['Medical', 'Transport'] },
  ];

  return (
    <div className={styles.pageContainer}>
      
      {/* HERO — Split Screen */}
      <section className={styles.heroSection}>
        <div className={styles.heroInner}>
          <motion.div 
            className={styles.heroLeft}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className={styles.badge}>AI-Powered Disaster Response</span>
            <h1 className={styles.heroTitle}>
              The platform that <span className={styles.heroAccent}>matches</span> help to those who need it
            </h1>
            <p className={styles.heroSubtitle}>
              Sankalp uses AI to match disaster victims with the nearest verified NGOs in seconds — not hours. Built for India's district collectors, NGOs, and citizens.
            </p>
            <div className={styles.heroButtons}>
              <button onClick={handleNeedHelp} className={styles.btnPrimary}>
                I Need Help <ArrowRight size={18} />
              </button>
              <Link href="/login" className={styles.btnSecondary}>
                View Dashboard
              </Link>
            </div>
          </motion.div>

          <motion.div 
            className={styles.heroRight}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={styles.livePanel}>
              <div className={styles.livePanelHeader}>
                <span className={styles.liveDot}></span>
                <span className={styles.liveLabel}>LIVE STATUS</span>
              </div>
              <div className={styles.liveStats}>
                <div className={styles.liveStat}>
                  <div className={styles.liveStatValue}><CountUp end={6 + customDisasters.length} /></div>
                  <div className={styles.liveStatLabel}>Active Disasters</div>
                </div>
                <div className={styles.liveStat}>
                  <div className={styles.liveStatValue}><CountUp end={142} /></div>
                  <div className={styles.liveStatLabel}>NGOs Verified</div>
                </div>
                <div className={styles.liveStat}>
                  <div className={styles.liveStatValue}><CountUp end={2340} suffix="+" /></div>
                  <div className={styles.liveStatLabel}>Requests Resolved</div>
                </div>
                <div className={styles.liveStat}>
                  <div className={styles.liveStatValue}><CountUp end={340} /></div>
                  <div className={styles.liveStatLabel}>Volunteers Active</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI MATCHING IN ACTION */}
      <section className={styles.section} ref={matchRef}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.sectionHeader}>
            <span className={styles.badge}><Search size={14} /> AI-Powered Matching</span>
            <h2 className={styles.sectionTitle}>Not just a directory. AI finds the RIGHT help.</h2>
            <p className={styles.sectionSubtitle}>Our Gemini-powered engine scores and ranks NGOs by proximity, capability match, and verification status — in under 3 seconds.</p>
          </div>

          <div className={styles.matchDemo}>
            {/* Step 1: Request */}
            <motion.div 
              className={`${styles.matchCard} ${styles.matchRequest}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={matchStep >= 1 ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4 }}
            >
              <div className={styles.matchCardHeader}>
                <AlertTriangle size={18} />
                <span>Incoming Request</span>
              </div>
              <p className={styles.matchCardBody}>"45 people need food + water in Kamrup, Assam"</p>
              <div className={styles.matchCardMeta}>
                <span><MapPin size={14} /> Fancy Bazaar, Kamrup</span>
                <span><Users size={14} /> 45 people</span>
              </div>
            </motion.div>

            {/* Step 2: Processing */}
            <AnimatePresence>
              {matchStep >= 2 && (
                <motion.div 
                  className={styles.matchProcessing}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Zap size={24} />
                  <span>Gemini AI matched in 2.3s</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 3: Results */}
            <div className={styles.matchResults}>
              {matchedNGOs.map((ngo, i) => (
                <motion.div 
                  key={i}
                  className={styles.matchResultCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={matchStep >= 3 ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.15 }}
                >
                  <div className={styles.matchScoreBadge}>
                    {ngo.score}<span>/100</span>
                  </div>
                  <h4>{ngo.name}</h4>
                  <div className={styles.matchMeta}>
                    <span><MapPin size={12} /> {ngo.distance}</span>
                  </div>
                  <div className={styles.matchCaps}>
                    {ngo.capabilities.map((c, j) => (
                      <span key={j} className={styles.capBadge}>{c}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* LIVE DEMO ENGINE */}
      <div className={styles.bgTeal}>
        <section className={styles.section}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.sectionHeaderLight}>
              <span className={styles.badgeLight}><MonitorPlay size={14} /> Live Demo Engine</span>
              <h2 className={styles.sectionTitleLight}>Deploy a disaster. Watch it propagate.</h2>
              <p className={styles.sectionSubtitleLight}>Show the full disaster response flow in real-time. Create a disaster, watch requests pour in, see NGOs respond — all live in front of judges.</p>
            </div>

            <div className={styles.demoFlow}>
              {[
                { icon: Zap, title: 'Create Disaster', desc: 'Pick location on map, set severity' },
                { icon: AlertTriangle, title: 'Requests Pour In', desc: 'Simulated help requests auto-generate' },
                { icon: Shield, title: 'NGOs Respond', desc: 'AI matches and assigns responders' },
                { icon: Eye, title: 'Multi-Tab View', desc: 'Citizen, NGO, and admin — all synced' },
              ].map((step, i) => (
                <motion.div 
                  key={i}
                  className={styles.demoStep}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <div className={styles.demoStepNumber}>{String(i + 1).padStart(2, '0')}</div>
                  <step.icon size={24} />
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className={styles.demoCTA}>
              <Link href="/god-mode" className={styles.btnWhite}>
                Enter God Mode <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </section>
      </div>

      {/* 8-POINT TRUST VERIFICATION */}
      <section className={styles.section}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.sectionHeader}>
            <span className={styles.badge}><Shield size={14} /> Trust Pipeline</span>
            <h2 className={styles.sectionTitle}>Every NGO passes 8 verification checks</h2>
            <p className={styles.sectionSubtitle}>We verify documents, government registrations, physical addresses, and operational history before any NGO appears on Sankalp.</p>
          </div>

          <div className={styles.trustGrid}>
            {trustParams.map((param, i) => (
              <motion.div 
                key={i}
                className={styles.trustItem}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <div className={styles.trustCheck}>
                  <Check size={16} />
                </div>
                <param.icon size={18} className={styles.trustParamIcon} />
                <span>{param.name}</span>
              </motion.div>
            ))}
          </div>

          <div className={styles.trustDemo}>
            <div className={styles.trustDemoHeader}>
              <span>Assam Relief Foundation</span>
              <span className={styles.trustScore}>91/100</span>
            </div>
            <div className={styles.trustBarBg}>
              <motion.div 
                className={styles.trustBarFill}
                initial={{ width: 0 }}
                whileInView={{ width: '91%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <span className={styles.trustVerified}><Shield size={14} /> DOCUMENTS VERIFIED</span>
          </div>

          <div className={styles.centerCTA}>
            <Link href="/ngos" className={styles.btnSecondary}>
              Browse Verified NGOs <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ACTIVE ALERTS — Bento Grid */}
      <div className={styles.bgSubtle}>
        <section className={styles.section}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.sectionHeader}>
              <span className={styles.badge}><AlertTriangle size={14} /> Live Alerts</span>
              <h2 className={styles.sectionTitle}>Active disaster alerts across India</h2>
            </div>

            <div className={styles.bentoGrid}>
              {allAlerts.slice(0, 6).map((alert, index) => (
                <motion.div
                  key={alert.id}
                  className={`${styles.bentoCard} ${index === 0 ? styles.bentoLarge : ''} ${
                    alert.type === 'high' ? styles.bentoHigh : 
                    alert.type === 'mod' ? styles.bentoMod : 
                    styles.bentoLow
                  }`}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <div className={styles.bentoTop}>
                    <span className={styles.bentoSeverity}>{alert.severity}</span>
                    {alert.isCustom && <span className={styles.bentoLive}>LIVE</span>}
                  </div>
                  <h3 className={styles.bentoTitle}>{alert.title}</h3>
                  <div className={styles.bentoMeta}>
                    <span><MapPin size={12} /> {alert.districts}</span>
                    <span><Users size={12} /> {alert.pop}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </div>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className={styles.ctaContent}
        >
          <h2 className={styles.ctaTitle}>Ready to make a difference?</h2>
          <div className={styles.ctaButtons}>
            <button onClick={handleNeedHelp} className={styles.btnPrimary}>
              I Need Help <ArrowRight size={18} />
            </button>
            <Link href="/donate" className={styles.btnAccent}>
              <Heart size={18} /> Donate Now
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
