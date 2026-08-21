'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { addCustomDisaster, clearCustomDisasters, generateRequest, addSimulatedRequest } from '../../lib/god-mode';
import { useGodMode } from '../../hooks/useGodMode';
import { Zap, Lock, ShieldAlert } from 'lucide-react';
import styles from './page.module.css';

const MapPicker = dynamic(() => import('../../components/map/MapPicker'), { ssr: false });

const ADMIN_EMAIL = 'admin@sankalp.in';
const ADMIN_PASS = 'sankalp2026';

export default function GodModePage() {
  const { customDisasters, simulatedRequests, refresh } = useGodMode();
  const [isSimulating, setIsSimulating] = useState(false);
  const simulationRef = useRef(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('godmode_auth') === 'true') {
      setAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginEmail === ADMIN_EMAIL && loginPass === ADMIN_PASS) {
      setAuthenticated(true);
      sessionStorage.setItem('godmode_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Access denied.');
    }
  };

  const [formData, setFormData] = useState({
    name: 'Chennai Floods',
    type: 'Flood',
    severity: 'High',
    centerLat: 13.0827,
    centerLng: 80.2707,
    affectedPopulation: 500000,
    radiusKm: 50,
    districts: 'Chennai, Kanchipuram'
  });

  const [stats, setStats] = useState({
    helpRequests: 0,
    ngosNotified: 0,
    peopleAffected: 0
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (latlng) => {
    setFormData(prev => ({
      ...prev,
      centerLat: latlng[0],
      centerLng: latlng[1]
    }));
  };

  const deployDisaster = () => {
    const disaster = {
      ...formData,
      districts: formData.districts.split(',').map(d => d.trim()),
      affectedPopulation: Number(formData.affectedPopulation),
      radiusKm: Number(formData.radiusKm),
      timestamp: new Date().toISOString()
    };
    addCustomDisaster(disaster);
    refresh();
  };

  const toggleSimulation = () => {
    if (isSimulating) {
      clearInterval(simulationRef.current);
      setIsSimulating(false);
    } else {
      if (customDisasters.length === 0) {
        alert('Please create a disaster first');
        return;
      }
      const activeDisaster = customDisasters[customDisasters.length - 1];
      
      setIsSimulating(true);
      simulationRef.current = setInterval(() => {
        const newReq = generateRequest(activeDisaster);
        addSimulatedRequest(newReq);
        
        setStats(prev => ({
          helpRequests: prev.helpRequests + 1,
          ngosNotified: Math.floor((prev.helpRequests + 1) / 5) + 2,
          peopleAffected: prev.peopleAffected + newReq.people
        }));
        
      }, 4000);
    }
  };

  const clearAll = () => {
    if (isSimulating) {
      clearInterval(simulationRef.current);
      setIsSimulating(false);
    }
    clearCustomDisasters();
    setStats({ helpRequests: 0, ngosNotified: 0, peopleAffected: 0 });
    refresh();
  };

  useEffect(() => {
    return () => {
      if (simulationRef.current) clearInterval(simulationRef.current);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>

        {!authenticated ? (
          <div className={styles.loginGate}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={styles.loginCard}
            >
              <div className={styles.loginIcon}><Lock size={40} /></div>
              <h1 className={styles.loginTitle}>Restricted Access</h1>
              <p className={styles.loginSubtitle}>Admin credentials required to access God Mode</p>
              <form onSubmit={handleLogin} className={styles.loginForm}>
                <input
                  type="email"
                  placeholder="Admin Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className={styles.loginInput}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className={styles.loginInput}
                  required
                />
                {loginError && <div className={styles.loginError}><ShieldAlert size={16} /> {loginError}</div>}
                <button type="submit" className={styles.loginBtn}>
                  <Zap size={18} /> Authenticate
                </button>
              </form>
            </motion.div>
          </div>
        ) : (
        <>
        
        <header className={styles.header}>
          <h1 className={styles.title}>God Mode <span role="img" aria-label="lightning">⚡</span></h1>
          <p className={styles.subtitle}>Live Demo Disaster Simulation Engine</p>
          <div className={styles.warningBanner}>
            This panel is for demo purposes. Created disasters appear across the entire platform instantly.
          </div>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Create Disaster</h2>
          <motion.div 
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={styles.formGrid}>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Disaster Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={styles.input} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Disaster Type</label>
                <select name="type" value={formData.type} onChange={handleInputChange} className={styles.input}>
                  <option value="Flood">Flood</option>
                  <option value="Cyclone">Cyclone</option>
                  <option value="Earthquake">Earthquake</option>
                  <option value="Landslide">Landslide</option>
                  <option value="Fire">Fire</option>
                  <option value="Drought">Drought</option>
                  <option value="Tsunami">Tsunami</option>
                </select>
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Severity</label>
                <div className={styles.severityGrid}>
                  {['Moderate', 'High', 'Critical'].map(level => (
                    <div 
                      key={level}
                      className={styles['severity' + level] + ' ' + (formData.severity === level ? styles['severity' + level + 'Active'] : '')}
                      onClick={() => setFormData({...formData, severity: level})}
                    >
                      {level}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Location</label>
                <div className={styles.mapContainer}>
                  <MapPicker onSelect={handleLocationSelect} position={[formData.centerLat, formData.centerLng]} />
                </div>
                <div className={styles.latLngDisplay}>
                  Lat: {formData.centerLat.toFixed(4)}, Lng: {formData.centerLng.toFixed(4)}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Affected Population</label>
                <input type="number" name="affectedPopulation" value={formData.affectedPopulation} onChange={handleInputChange} className={styles.input} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Radius (km)</label>
                <input type="number" name="radiusKm" value={formData.radiusKm} onChange={handleInputChange} className={styles.input} />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Districts (comma-separated)</label>
                <input type="text" name="districts" value={formData.districts} onChange={handleInputChange} className={styles.input} />
              </div>
            </div>

            <button onClick={deployDisaster} className={styles.deployButton}>
              ⚡ Deploy Disaster
            </button>
          </motion.div>
        </section>

        {customDisasters.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Live Simulation</h2>
            <div className={styles.simulationGrid}>
              
              <div>
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>{stats.helpRequests}</div>
                    <div className={styles.statLabel}>Help Requests</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>{stats.ngosNotified}</div>
                    <div className={styles.statLabel}>NGOs Notified</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>{stats.peopleAffected}</div>
                    <div className={styles.statLabel}>Est. People Affected</div>
                  </div>
                </div>

                <div className={styles.controlsGroup}>
                  <button onClick={toggleSimulation} className={styles.btnPrimary}>
                    {isSimulating ? 'Pause Simulation' : 'Start Simulation'}
                  </button>
                  <button onClick={clearAll} className={styles.btnDanger}>
                    Clear All
                  </button>
                </div>
              </div>

              <div className={styles.card}>
                <h3 className={styles.label} style={{marginBottom: '16px'}}>Incoming Requests</h3>
                <div className={styles.liveFeed}>
                  <AnimatePresence>
                    {simulatedRequests.map(req => (
                      <motion.div
                        key={req.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className={styles.requestCard}
                      >
                        <div className={styles.requestHeader}>
                          <div>
                            <div className={styles.requestName}>{req.name}</div>
                            <div className={styles.requestLocation}>{req.location}</div>
                          </div>
                          <div className={styles['requestUrgency'] + ' ' + styles['urgency' + req.urgency.charAt(0).toUpperCase() + req.urgency.slice(1)]}>
                            {req.urgency}
                          </div>
                        </div>
                        <div className={styles.requestMessage}>{req.message}</div>
                        <div className={styles.requestFooter}>
                          <div className={styles.needsList}>
                            {req.needs.map(need => (
                              <span key={need} className={styles.needBadge}>{need}</span>
                            ))}
                          </div>
                          <div className={styles.requestTime}>Just now</div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {simulatedRequests.length === 0 && (
                    <div style={{textAlign: 'center', padding: '40px', color: '#6B7280'}}>
                      No requests yet. Start the simulation.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </section>
        )}

        {customDisasters.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Active Custom Disasters</h2>
            <div className={styles.disasterList}>
              {customDisasters.map(disaster => (
                <div key={disaster.id} className={styles.disasterCard}>
                  <div>
                    <div className={styles.disasterTitle}>{disaster.name}</div>
                    <div className={styles.disasterType}>{disaster.type} - {disaster.severity}</div>
                  </div>
                  <div className={styles.latLngDisplay}>
                    {disaster.districts.join(', ')}
                  </div>
                  <button onClick={clearAll} className={styles.btnDanger} style={{marginTop: 'auto'}}>
                    Delete All
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        </>
        )}

      </div>
    </div>
  );
}
