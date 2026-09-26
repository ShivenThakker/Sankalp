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
  Map,
  Filter,
  Check,
  UserCheck,
  Send,
  Search,
  Phone,
  RotateCcw
} from 'lucide-react';
import { useGodMode } from '@/hooks/useGodMode';
import styles from './page.module.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requestUrgencyFilter, setRequestUrgencyFilter] = useState('all');
  const [requestStatusFilter, setRequestStatusFilter] = useState('all');
  const [volunteerStatusFilter, setVolunteerStatusFilter] = useState('all');

  // Modal state
  const [assignModal, setAssignModal] = useState(null); // { req } or null
  const [deployModal, setDeployModal] = useState(null); // { vol } or null

  // Live status overrides (req.id -> status, vol.id -> status)
  const [requestStatuses, setRequestStatuses] = useState({});
  const [volunteerStatuses, setVolunteerStatuses] = useState({});
  // Which volunteer is assigned to which request (volId -> reqId)
  const [volAssignments, setVolAssignments] = useState({});

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

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
    if (percentage < 30) return 'var(--color-danger)';
    if (percentage <= 70) return 'var(--color-accent)';
    return 'var(--color-success)';
  };

  const mockRequests = [
    { id: 'req-1', time: '2 min ago', people: 12, needs: ['food', 'medical'], location: 'Fancy Bazaar, Kamrup', status: 'pending', urgency: 'critical', contact: '+91 98765 43210' },
    { id: 'req-2', time: '8 min ago', people: 50, needs: ['shelter'], location: 'Nagaon Town', status: 'pending', urgency: 'high', contact: '+91 98765 11223' },
    { id: 'req-3', time: '15 min ago', people: 5, needs: ['water'], location: 'Chandmari, Kamrup', status: 'resolved', urgency: 'medium', contact: '+91 98765 33445' },
    { id: 'req-4', time: '28 min ago', people: 200, needs: ['food', 'water', 'shelter'], location: 'Darrang District', status: 'matched', urgency: 'critical', contact: '+91 98765 55667' },
    { id: 'req-5', time: '45 min ago', people: 8, needs: ['medical'], location: 'Barpeta', status: 'matched', urgency: 'high', contact: '+91 98765 77889' },
    { id: 'req-6', time: '1 hour ago', people: 30, needs: ['rescue', 'transport'], location: 'Morigaon', status: 'in_progress', urgency: 'critical', contact: '+91 98765 99001' },
  ];

  const mockVolunteers = [
    { id: 'v-1', name: 'Rahul Sharma', skills: ['First Aid', 'Boat Rescue'], location: 'Guwahati, Kamrup', status: 'Available', phone: '+91 98123 45678', rating: 4.9, deployments: 8 },
    { id: 'v-2', name: 'Priya Das', skills: ['Food Distribution', 'Medical'], location: 'Silchar, Cachar', status: 'Deployed', phone: '+91 98234 56789', rating: 4.8, deployments: 14 },
    { id: 'v-3', name: 'Amitav Gogoi', skills: ['Ham Radio', 'Transport'], location: 'Jorhat', status: 'Available', phone: '+91 98345 67890', rating: 5.0, deployments: 6 },
    { id: 'v-4', name: 'Sunita Roy', skills: ['Shelter Mgmt', 'Childcare'], location: 'Nagaon', status: 'Deployed', phone: '+91 98456 78901', rating: 4.7, deployments: 11 },
    { id: 'v-5', name: 'Bikram Kalita', skills: ['Rescue', 'Diving'], location: 'Kamrup Metro', status: 'Offline', phone: '+91 98567 89012', rating: 4.9, deployments: 19 },
  ];

  const availableNgos = [
    { id: 'n-1', name: 'Rapid Relief Foundation', score: 98, capabilities: ['food', 'water'], active: 12 },
    { id: 'n-2', name: 'Shelter Now India', score: 95, capabilities: ['shelter', 'transport'], active: 8 },
    { id: 'n-3', name: 'MedCare Initiative', score: 92, capabilities: ['medical', 'rescue'], active: 5 },
    { id: 'n-4', name: 'Assam Relief Foundation', score: 91, capabilities: ['food', 'water', 'shelter'], active: 7 },
    { id: 'n-5', name: 'Kolkata Rescue Foundation', score: 83, capabilities: ['rescue', 'medical'], active: 3 },
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
      contact: '+91 98765 00000',
      isCustom: true
    })),
    ...mockRequests
  ];

  const activeRequestsCount = 47 + simulatedRequests.length;
  const hasCustomDisaster = customDisasters.length > 0;
  const latestCustomDisaster = hasCustomDisaster ? customDisasters[0] : null;

  // Apply live status overrides
  const getReqStatus = (req) => requestStatuses[req.id] || req.status;
  const getVolStatus = (vol) => volunteerStatuses[vol.id] || vol.status;

  const filteredRequests = allRequests.filter(req => {
    const status = getReqStatus(req);
    if (requestUrgencyFilter !== 'all' && req.urgency !== requestUrgencyFilter) return false;
    if (requestStatusFilter !== 'all' && status !== requestStatusFilter) return false;
    return true;
  });

  const filteredVolunteers = mockVolunteers.filter(vol => {
    const status = getVolStatus(vol);
    if (volunteerStatusFilter !== 'all' && status.toLowerCase() !== volunteerStatusFilter.toLowerCase()) return false;
    return true;
  });

  // Assign NGO to request
  const handleAssignNgo = (ngo) => {
    setRequestStatuses(prev => ({ ...prev, [assignModal.req.id]: 'matched' }));
    showToast(`✅ ${ngo.name} assigned to request in ${assignModal.req.location}`);
    setAssignModal(null);
  };

  // Deploy volunteer to a request
  const handleDeploy = (req) => {
    setVolunteerStatuses(prev => ({ ...prev, [deployModal.vol.id]: 'Deployed' }));
    setRequestStatuses(prev => ({ ...prev, [req.id]: 'in_progress' }));
    setVolAssignments(prev => ({ ...prev, [deployModal.vol.id]: req.id }));
    showToast(`🚀 ${deployModal.vol.name} deployed to ${req.location}`);
    setDeployModal(null);
  };

  // Recall volunteer
  const handleRecall = (vol) => {
    const assignedReqId = volAssignments[vol.id];
    setVolunteerStatuses(prev => ({ ...prev, [vol.id]: 'Available' }));
    if (assignedReqId) {
      setRequestStatuses(prev => ({ ...prev, [assignedReqId]: 'matched' }));
    }
    setVolAssignments(prev => { const n = { ...prev }; delete n[vol.id]; return n; });
    showToast(`↩️ ${vol.name} recalled — now available`);
  };

  // Pending/matched requests available for volunteer deployment
  const deployableRequests = allRequests.filter(r => {
    const s = getReqStatus(r);
    return s === 'pending' || s === 'matched';
  });

  return (
    <div className={styles.dashboardContainer}>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className={styles.toast}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assign NGO Modal */}
      <AnimatePresence>
        {assignModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.modalOverlay}
              onClick={() => setAssignModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className={styles.modal}
            >
              <div className={styles.modalHeader}>
                <div>
                  <h3 className={styles.modalTitle}><Send size={18} /> Assign NGO to Request</h3>
                  <p className={styles.modalSubtitle}>
                    {assignModal.req.people} people · {assignModal.req.needs.join(', ')} · {assignModal.req.location}
                  </p>
                </div>
                <button className={styles.modalClose} onClick={() => setAssignModal(null)}><X size={20} /></button>
              </div>

              <div className={styles.modalBody}>
                <p className={styles.modalSectionLabel}>SELECT VERIFIED NGO</p>
                <div className={styles.ngoOptionList}>
                  {availableNgos.map(ngo => (
                    <button
                      key={ngo.id}
                      className={styles.ngoOption}
                      onClick={() => handleAssignNgo(ngo)}
                    >
                      <div className={styles.ngoOptionLeft}>
                        <strong>{ngo.name}</strong>
                        <div className={styles.ngoOptionMeta}>
                          <span className={styles.verifiedBadge}><CheckCircle size={12} /> {ngo.score}% verified</span>
                          <span className={styles.ngoOptionCaps}>{ngo.capabilities.join(' · ')}</span>
                        </div>
                      </div>
                      <div className={styles.ngoOptionRight}>
                        <span className={styles.activeCount}>{ngo.active} active</span>
                        <div className={styles.assignBtn}><Send size={13} /> Assign</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Deploy Volunteer Modal */}
      <AnimatePresence>
        {deployModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.modalOverlay}
              onClick={() => setDeployModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className={styles.modal}
            >
              <div className={styles.modalHeader}>
                <div>
                  <h3 className={styles.modalTitle}><UserCheck size={18} /> Deploy {deployModal.vol.name}</h3>
                  <p className={styles.modalSubtitle}>
                    {deployModal.vol.skills.join(', ')} · {deployModal.vol.location}
                  </p>
                </div>
                <button className={styles.modalClose} onClick={() => setDeployModal(null)}><X size={20} /></button>
              </div>

              <div className={styles.modalBody}>
                <p className={styles.modalSectionLabel}>SELECT ACTIVE REQUEST</p>
                {deployableRequests.length === 0 ? (
                  <div className={styles.emptyState}>No pending requests available</div>
                ) : (
                  <div className={styles.ngoOptionList}>
                    {deployableRequests.map(req => (
                      <button
                        key={req.id}
                        className={styles.ngoOption}
                        onClick={() => handleDeploy(req)}
                      >
                        <div className={styles.ngoOptionLeft}>
                          <strong>{req.people} people — {req.needs.join(', ')}</strong>
                          <div className={styles.ngoOptionMeta}>
                            <span className={`${styles.badgeUrgency} ${styles['urgency-' + req.urgency]}`}>{req.urgency.toUpperCase()}</span>
                            <span className={styles.ngoOptionCaps}><MapPin size={11} /> {req.location}</span>
                          </div>
                        </div>
                        <div className={styles.ngoOptionRight}>
                          <span className={styles.monoCell}>{req.time}</span>
                          <div className={styles.assignBtn} style={{ background: 'var(--color-primary-700)' }}><UserCheck size={13} /> Deploy</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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

        {/* OVERVIEW TAB */}
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
                  <AlertTriangle size={24} className={styles.statIcon} style={{ color: 'var(--color-danger)' }} />
                  <span className={styles.trendUp}><TrendingUp size={14} /> +{12 + simulatedRequests.length} today</span>
                </div>
                <div className={styles.statValue}>{activeRequestsCount}</div>
                <div className={styles.statLabel}>Active Requests</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <Building2 size={24} className={styles.statIcon} style={{ color: 'var(--color-primary-700)' }} />
                </div>
                <div className={styles.statValue}>25</div>
                <div className={styles.statLabel}>NGOs Responding</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <Users size={24} className={styles.statIcon} style={{ color: 'var(--color-accent)' }} />
                </div>
                <div className={styles.statValue}>340</div>
                <div className={styles.statLabel}>Volunteers Deployed</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <IndianRupee size={24} className={styles.statIcon} style={{ color: 'var(--color-success)' }} />
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
                      {allRequests.slice(0, 6).map(request => (
                        <motion.div
                          key={request.id}
                          initial={request.isCustom ? { opacity: 0, x: -20, backgroundColor: 'var(--color-accent-light)' } : {}}
                          animate={request.isCustom ? { opacity: 1, x: 0, backgroundColor: 'var(--bg-card)' } : {}}
                          transition={{ duration: 0.5 }}
                          className={styles.requestItem}
                        >
                          <div className={styles.requestStatusCol}>
                            {renderUrgencyDot(request.urgency, getReqStatus(request))}
                          </div>
                          <div className={styles.requestContent}>
                            <div className={styles.requestHeader}>
                              <span className={styles.requestTime}>{request.time} {request.isCustom && <span className={styles.simBadge}>⚡ SIMULATED</span>}</span>
                              <span className={`${styles.statusBadge} ${styles[getReqStatus(request)]}`}>
                                {getReqStatus(request).replace('_', ' ')}
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

        {/* REQUESTS TAB */}
        {activeTab === 'Requests' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.tabModule}
          >
            <div className={styles.tabHeader}>
              <div>
                <h2 className={styles.tabTitle}>Help Requests Directory</h2>
                <p className={styles.tabSubtitle}>Manage and assign incoming emergency requests to verified NGOs</p>
              </div>
              <div className={styles.filterRow}>
                <select
                  className={styles.selectFilter}
                  value={requestUrgencyFilter}
                  onChange={(e) => setRequestUrgencyFilter(e.target.value)}
                >
                  <option value="all">All Urgency</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                </select>
                <select
                  className={styles.selectFilter}
                  value={requestStatusFilter}
                  onChange={(e) => setRequestStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="matched">Matched</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className={styles.tableCard}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Urgency</th>
                    <th>Time</th>
                    <th>People</th>
                    <th>Needs</th>
                    <th>Location</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => {
                    const status = getReqStatus(req);
                    const isResolved = status === 'resolved';
                    return (
                      <motion.tr
                        key={req.id}
                        layout
                        initial={false}
                        animate={{ backgroundColor: 'transparent' }}
                      >
                        <td>
                          <span className={`${styles.badgeUrgency} ${styles['urgency-' + req.urgency]}`}>
                            {req.urgency.toUpperCase()}
                          </span>
                        </td>
                        <td className={styles.monoCell}>{req.time}</td>
                        <td><strong>{req.people}</strong></td>
                        <td>
                          <div className={styles.needsPills}>
                            {req.needs.map((n, i) => (
                              <span key={i} className={styles.needPill}>{n}</span>
                            ))}
                          </div>
                        </td>
                        <td>{req.location}</td>
                        <td className={styles.monoCell}>{req.contact}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${styles[status]}`}>
                            {status.replace('_', ' ')}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionGroup}>
                            {isResolved ? (
                              <span className={styles.resolvedLabel}><CheckCircle size={14} /> Done</span>
                            ) : (
                              <button
                                className={`btn btn-primary btn-sm`}
                                onClick={() => setAssignModal({ req })}
                              >
                                <Send size={14} />
                                {status === 'matched' || status === 'in_progress' ? 'Reassign NGO' : 'Assign NGO'}
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* VOLUNTEERS TAB */}
        {activeTab === 'Volunteers' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.tabModule}
          >
            <div className={styles.tabHeader}>
              <div>
                <h2 className={styles.tabTitle}>Volunteer Force Roster</h2>
                <p className={styles.tabSubtitle}>Track deployed and available field volunteers across all districts</p>
              </div>
              <div className={styles.filterRow}>
                <select
                  className={styles.selectFilter}
                  value={volunteerStatusFilter}
                  onChange={(e) => setVolunteerStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="available">Available</option>
                  <option value="deployed">Deployed</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>

            <div className={styles.tableCard}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Volunteer Name</th>
                    <th>Skills</th>
                    <th>Location</th>
                    <th>Rating</th>
                    <th>Deployments</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVolunteers.map((vol) => {
                    const status = getVolStatus(vol);
                    const isOffline = status === 'Offline';
                    const isDeployed = status === 'Deployed';
                    return (
                      <tr key={vol.id}>
                        <td>
                          <strong>{vol.name}</strong>
                          <div className={styles.monoSubtext}>{vol.phone}</div>
                        </td>
                        <td>
                          <div className={styles.needsPills}>
                            {vol.skills.map((skill, i) => (
                              <span key={i} className={styles.needPill}>{skill}</span>
                            ))}
                          </div>
                        </td>
                        <td>{vol.location}</td>
                        <td className={styles.monoCell}>⭐ {vol.rating}</td>
                        <td className={styles.monoCell}>{vol.deployments}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${styles[status.toLowerCase()]}`}>
                            {status}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionGroup}>
                            {isOffline ? (
                              <span className={styles.offlineLabel}>Unavailable</span>
                            ) : isDeployed ? (
                              <button
                                className={`btn btn-secondary btn-sm`}
                                style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}
                                onClick={() => handleRecall(vol)}
                              >
                                <RotateCcw size={14} /> Recall
                              </button>
                            ) : (
                              <button
                                className={`btn btn-secondary btn-sm`}
                                onClick={() => setDeployModal({ vol })}
                              >
                                <UserCheck size={14} /> Deploy Task
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* MAP VIEW / NGOS / OTHER TABS */}
        {activeTab !== 'Overview' && activeTab !== 'Requests' && activeTab !== 'Volunteers' && (
          <div className={styles.placeholderTab}>
            <h2>{activeTab} Module</h2>
            <p>Access active response operations for {activeTab}.</p>
            <Link href="/map" className="btn btn-primary" style={{ marginTop: '16px' }}>
              Open Full Map Interface
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
