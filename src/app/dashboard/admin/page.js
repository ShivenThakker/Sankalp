'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Users,
  Building2,
  IndianRupee,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Activity,
  BarChart3,
  Shield,
  Heart,
  Truck,
  Home,
  Droplets,
  Utensils,
  Stethoscope,
  LifeBuoy,
  Menu,
  X,
  LayoutDashboard,
  Map
} from 'lucide-react';
import { useGodMode } from '@/hooks/useGodMode';
import styles from './page.module.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Map View', icon: Map },
    { name: 'Requests', icon: AlertTriangle, badge: 47 },
    { name: 'NGOs', icon: Building2, badge: 25 },
    { name: 'Volunteers', icon: Users, badge: 340 },
    { name: 'Donations', icon: IndianRupee },
    { name: 'Verification', icon: Shield }
  ];

  const resourceCoverage = [
    { type: 'Food', percentage: 82, icon: Utensils },
    { type: 'Rescue', percentage: 75, icon: LifeBuoy },
    { type: 'Water', percentage: 65, icon: Droplets },
    { type: 'Medical', percentage: 51, icon: Stethoscope },
    { type: 'Shelter', percentage: 28, icon: Home, critical: true },
    { type: 'Transport', percentage: 17, icon: Truck, critical: true }
  ];

  const getCoverageColor = (percentage) => {
    if (percentage < 30) return 'var(--danger)';
    if (percentage <= 70) return 'var(--warning)';
    return 'var(--success)';
  };

  const mockRequests = [
    { id: 1, time: '2 min ago', people: 12, needs: ['food', 'medical'], location: 'Fancy Bazaar, Kamrup', status: 'pending', urgency: 'critical' },
    { id: 2, time: '8 min ago', people: 50, needs: ['shelter'], location: 'Nagaon Town', status: 'pending', urgency: 'high' },
    { id: 3, time: '15 min ago', people: 5, needs: ['water'], location: 'Chandmari, Kamrup', status: 'resolved', urgency: 'medium' },
    { id: 4, time: '28 min ago', people: 200, needs: ['food', 'water', 'shelter'], location: 'Darrang District', status: 'matched', urgency: 'critical' },
    { id: 5, time: '45 min ago', people: 8, needs: ['medical'], location: 'Barpeta', status: 'matched', urgency: 'high' },
    { id: 6, time: '1 hour ago', people: 30, needs: ['rescue', 'transport'], location: 'Morigaon', status: 'in_progress', urgency: 'critical' },
  ];

  const renderUrgencyDot = (urgency, status) => {
    if (status === 'resolved') return <div className={`${styles.statusDot} ${styles.resolved}`}></div>;
    if (urgency === 'critical') return <div className={`${styles.statusDot} ${styles.critical}`}></div>;
    if (urgency === 'high') return <div className={`${styles.statusDot} ${styles.high}`}></div>;
    return <div className={`${styles.statusDot} ${styles.medium}`}></div>;
  };

  const topNgos = [
    { id: '1', name: 'Rapid Relief Foundation', score: 98, active: 12, icons: [Utensils, Droplets] },
    { id: '2', name: 'Shelter Now India', score: 95, active: 8, icons: [Home, Truck] },
    { id: '3', name: 'MedCare Initiative', score: 92, active: 5, icons: [Stethoscope, LifeBuoy] },
  ];

  const { customDisasters, simulatedRequests } = useGodMode();
  
  const allRequests = [
    ...simulatedRequests.map(r => ({
      id: r.id,
      time: 'Just now',
      people: r.people,
      needs: r.needs,
      location: r.location,
      status: r.status,
      urgency: r.urgency,
      isCustom: true
    })),
    ...mockRequests
  ];
  
  const activeRequestsCount = 47 + simulatedRequests.length;
  const hasCustomDisaster = customDisasters.length > 0;
  const latestCustomDisaster = hasCustomDisaster ? customDisasters[0] : null;

  return (
    <div className={styles.dashboardContainer}>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.sidebarOverlay}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2>Sankalp</h2>
          <span className={styles.adminBadge}>Command Center</span>
        </div>
        
        <nav className={styles.sidebarNav}>
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`${styles.navItem} ${activeTab === item.name ? styles.navItemActive : ''}`}
              onClick={() => {
                setActiveTab(item.name);
                if (window.innerWidth <= 768) setSidebarOpen(false);
              }}
            >
              <item.icon className={styles.navIcon} size={20} />
              <span>{item.name}</span>
              {item.badge && <span className={styles.navBadge}>{item.badge}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Mobile Header */}
        <div className={styles.mobileHeader}>
          <button onClick={toggleSidebar} className={styles.menuButton}>
            <Menu size={24} />
          </button>
          <h2>Command Center</h2>
        </div>

        {activeTab === 'Overview' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.overviewTab}
          >
            {hasCustomDisaster && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.pulsingBanner}
                style={{ backgroundColor: 'var(--accent-orange)', color: 'white', padding: '12px 24px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', animation: 'pulse 2s infinite' }}
              >
                <AlertTriangle size={24} />
                <strong style={{ letterSpacing: '1px' }}>⚡ NEW DISASTER DEPLOYED: {latestCustomDisaster.name.toUpperCase()}</strong>
                <span>| {latestCustomDisaster.districts?.join(', ')}</span>
              </motion.div>
            )}

            {/* Top Bar */}
            <div className={styles.topBar}>
              <div className={styles.topBarLeft}>
                <div className={styles.severityBadge}>
                  <AlertTriangle size={18} />
                  <span>ASSAM FLOODS — ACTIVE</span>
                </div>
                <div className={styles.disasterMeta}>
                  Started: Aug 18, 2026 | Affected: 1,50,000 people | 5 districts
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <AlertTriangle size={24} className={styles.statIcon} style={{ color: 'var(--danger)' }} />
                  <span className={styles.trendUp}><TrendingUp size={14} /> +{12 + simulatedRequests.length} today</span>
                </div>
                <div className={styles.statValue}>{activeRequestsCount}</div>
                <div className={styles.statLabel}>Active Requests</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <Building2 size={24} className={styles.statIcon} style={{ color: 'var(--primary)' }} />
                </div>
                <div className={styles.statValue}>25</div>
                <div className={styles.statLabel}>NGOs Responding</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <Users size={24} className={styles.statIcon} style={{ color: 'var(--secondary)' }} />
                </div>
                <div className={styles.statValue}>340</div>
                <div className={styles.statLabel}>Volunteers Deployed</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <IndianRupee size={24} className={styles.statIcon} style={{ color: 'var(--success)' }} />
                </div>
                <div className={styles.statValue}>₹17.4L</div>
                <div className={styles.statLabel}>Funds Raised</div>
              </div>
            </div>

            <div className={styles.dashboardGrid}>
              <div className={styles.gridLeft}>
                {/* Resource Coverage Section */}
                <div className={styles.card}>
                  <h3 className={styles.cardTitle}><Activity size={20} /> Resource Coverage Analysis</h3>
                  <div className={styles.resourceList}>
                    {resourceCoverage.map(resource => (
                      <div key={resource.type} className={styles.resourceItem}>
                        <div className={styles.resourceHeader}>
                          <div className={styles.resourceLabel}>
                            <resource.icon size={16} />
                            <span>{resource.type}</span>
                          </div>
                          <div className={styles.resourceRight}>
                            <span className={styles.resourcePercentage}>{resource.percentage}%</span>
                            {resource.critical && <span className={styles.criticalBadge}>🚨 CRITICAL</span>}
                          </div>
                        </div>
                        <div className={styles.progressBarContainer}>
                          <div 
                            className={styles.progressBar} 
                            style={{ 
                              width: `${resource.percentage}%`,
                              backgroundColor: getCoverageColor(resource.percentage)
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Donation Tracker */}
                <div className={styles.card}>
                  <h3 className={styles.cardTitle}><Heart size={20} /> Donation Progress</h3>
                  <div className={styles.donationMeta}>
                    <div className={styles.donationTarget}>Target: ₹25,00,000</div>
                    <div className={styles.donationCollected}>Collected: ₹17,40,000 (69.6%)</div>
                  </div>
                  <div className={styles.progressBarContainerLarge}>
                    <div className={styles.progressBarLarge} style={{ width: '69.6%' }}></div>
                  </div>
                  <div className={styles.donationBreakdown}>
                    <div className={styles.breakdownItem}>
                      <span className={styles.breakdownLabel}>Food</span>
                      <span className={styles.breakdownValue}>₹7.2L</span>
                    </div>
                    <div className={styles.breakdownItem}>
                      <span className={styles.breakdownLabel}>Medicine</span>
                      <span className={styles.breakdownValue}>₹4.1L</span>
                    </div>
                    <div className={styles.breakdownItem}>
                      <span className={styles.breakdownLabel}>Shelter</span>
                      <span className={styles.breakdownValue}>₹3.8L</span>
                    </div>
                    <div className={styles.breakdownItem}>
                      <span className={styles.breakdownLabel}>Transport</span>
                      <span className={styles.breakdownValue}>₹2.3L</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.gridRight}>
                {/* Recent Requests Feed */}
                <div className={styles.card}>
                  <h3 className={styles.cardTitle}><Clock size={20} /> Incoming Help Requests</h3>
                  <div className={styles.requestFeed}>
                    <AnimatePresence>
                      {allRequests.map(request => (
                        <motion.div 
                          key={request.id} 
                          initial={request.isCustom ? { opacity: 0, x: -20, backgroundColor: '#fff3e0' } : {}}
                          animate={request.isCustom ? { opacity: 1, x: 0, backgroundColor: '#ffffff' } : {}}
                          transition={{ duration: 0.5 }}
                          className={styles.requestItem}
                          style={request.isCustom ? { borderLeft: '4px solid var(--accent-orange)' } : {}}
                        >
                          <div className={styles.requestStatusCol}>
                            {renderUrgencyDot(request.urgency, request.status)}
                          </div>
                          <div className={styles.requestContent}>
                            <div className={styles.requestHeader}>
                              <span className={styles.requestTime}>{request.time} {request.isCustom && <span style={{color: 'orange', fontSize: '10px'}}>⚡ SIMULATED</span>}</span>
                              <span className={`${styles.statusBadge} ${styles[request.status]}`}>
                                {request.status.replace('_', ' ')}
                              </span>
                            </div>
                            <div className={styles.requestDesc}>
                              {request.people} people need {request.needs.join(' + ')}
                            </div>
                            <div className={styles.requestLocation}>
                              <MapPin size={12} /> {request.location}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Top Responding NGOs */}
                <div className={styles.card}>
                  <h3 className={styles.cardTitle}><Shield size={20} /> Top Responding NGOs</h3>
                  <div className={styles.ngoList}>
                    {topNgos.map(ngo => (
                      <Link href={`/ngos/${ngo.id}`} key={ngo.id} className={styles.ngoCard}>
                        <div className={styles.ngoHeader}>
                          <h4>{ngo.name}</h4>
                          <div className={styles.verificationScore}>
                            <CheckCircle size={14} /> {ngo.score}% verified
                          </div>
                        </div>
                        <div className={styles.ngoFooter}>
                          <div className={styles.ngoCapabilities}>
                            {ngo.icons.map((Icon, idx) => <Icon key={idx} size={16} />)}
                          </div>
                          <div className={styles.ngoAssignments}>
                            {ngo.active} assignments active
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {activeTab !== 'Overview' && (
          <div className={styles.placeholderTab}>
            <h2>{activeTab} Module</h2>
            <p>This module is under development.</p>
          </div>
        )}
      </main>
    </div>
  );
}
