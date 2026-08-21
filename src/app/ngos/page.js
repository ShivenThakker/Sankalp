'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Users, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Clock3, 
  AlertTriangle 
} from 'lucide-react';
import styles from './page.module.css';

const MOCK_NGOS = [
  { id: '7', name: 'Goonj', district: 'New Delhi', state: 'Delhi', lat: 28.5355, lng: 77.2510, verificationScore: 95, capabilities: ['clothing', 'food', 'shelter'], description: 'Disaster relief and humanitarian aid across India since 1999.', verificationStatus: 'verified', operationalStatus: 'active', totalVolunteers: 500, yearEstablished: 1999, operatingDistricts: ['New Delhi', 'All India'] },
  { id: '8', name: 'Mercy Corps India', district: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, verificationScore: 92, capabilities: ['food', 'water', 'shelter', 'medical'], description: 'Global humanitarian organization with India operations.', verificationStatus: 'verified', operationalStatus: 'active', totalVolunteers: 350, yearEstablished: 2010, operatingDistricts: ['Hyderabad'] },
  { id: '9', name: 'SEEDS India', district: 'New Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090, verificationScore: 89, capabilities: ['shelter', 'rescue', 'food'], description: 'Sustainable Environment and Ecological Development Society.', verificationStatus: 'verified', operationalStatus: 'active', totalVolunteers: 200, yearEstablished: 1994, operatingDistricts: ['New Delhi'] },
  { id: '10', name: 'Kolkata Rescue Foundation', district: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, verificationScore: 83, capabilities: ['rescue', 'medical', 'shelter'], description: 'Emergency rescue and relief operations in eastern India.', verificationStatus: 'verified', operationalStatus: 'active', totalVolunteers: 120, yearEstablished: 2005, operatingDistricts: ['Kolkata'] },
  { id: '11', name: 'Bengal Relief Corps', district: 'Kolkata', state: 'West Bengal', lat: 22.5449, lng: 88.3426, verificationScore: 79, capabilities: ['food', 'water', 'transport'], description: 'Food and water distribution during floods and cyclones in Bengal.', verificationStatus: 'verified', operationalStatus: 'active', totalVolunteers: 80, yearEstablished: 2012, operatingDistricts: ['Kolkata', 'South 24 Parganas'] },
  { id: '12', name: 'Howrah Hope Foundation', district: 'Howrah', state: 'West Bengal', lat: 22.5958, lng: 88.2636, verificationScore: 76, capabilities: ['shelter', 'clothing'], description: 'Shelter and clothing support for disaster-affected families.', verificationStatus: 'verified', operationalStatus: 'active', totalVolunteers: 45, yearEstablished: 2018, operatingDistricts: ['Howrah'] },
  { id: '13', name: 'Oxfam India', district: 'New Delhi', state: 'Delhi', lat: 28.6448, lng: 77.2167, verificationScore: 94, capabilities: ['food', 'water', 'shelter', 'medical'], description: 'Fighting inequality to end poverty and injustice.', verificationStatus: 'verified', operationalStatus: 'active', totalVolunteers: 600, yearEstablished: 2008, operatingDistricts: ['New Delhi', 'All India'] },
  { id: '14', name: 'CARE India', district: 'New Delhi', state: 'Delhi', lat: 28.5921, lng: 77.2270, verificationScore: 93, capabilities: ['food', 'medical', 'shelter'], description: 'Working for social justice and disaster response.', verificationStatus: 'verified', operationalStatus: 'active', totalVolunteers: 400, yearEstablished: 1950, operatingDistricts: ['New Delhi', 'All India'] },

  {
    id: '1', name: 'Assam Relief Foundation', verificationStatus: 'verified', verificationScore: 91,
    district: 'Kamrup', state: 'Assam', description: 'Providing food, water, and shelter relief across Assam since 2015.',
    capabilities: ['food', 'water', 'shelter'], operationalStatus: 'active',
    totalVolunteers: 142, yearEstablished: 2015, operatingDistricts: ['Kamrup', 'Nagaon', 'Darrang'],
    lastActivity: '2 days ago'
  },
  {
    id: '2', name: 'Health First India', verificationStatus: 'verified', verificationScore: 87,
    district: 'Kamrup', state: 'Assam', description: 'Medical relief and healthcare support during disasters.',
    capabilities: ['medical', 'psychological'], operationalStatus: 'active',
    totalVolunteers: 89, yearEstablished: 2018, operatingDistricts: ['Kamrup', 'Nagaon'],
    lastActivity: '1 day ago'
  },
  {
    id: '3', name: 'Shelter Now India', verificationStatus: 'verified', verificationScore: 78,
    district: 'Nagaon', state: 'Assam', description: 'Emergency shelter and clothing distribution.',
    capabilities: ['shelter', 'clothing'], operationalStatus: 'active',
    totalVolunteers: 56, yearEstablished: 2020, operatingDistricts: ['Nagaon', 'Morigaon'],
    lastActivity: '5 days ago'
  },
  {
    id: '4', name: 'Rapid Response Team', verificationStatus: 'verified', verificationScore: 85,
    district: 'Kamrup', state: 'Assam', description: 'Search and rescue operations with trained volunteers and equipment.',
    capabilities: ['rescue', 'transport'], operationalStatus: 'active',
    totalVolunteers: 34, yearEstablished: 2019, operatingDistricts: ['Kamrup', 'Darrang', 'Barpeta'],
    lastActivity: '12 hours ago'
  },
  {
    id: '5', name: 'Paws & Claws Rescue', verificationStatus: 'verified', verificationScore: 72,
    district: 'Kamrup', state: 'Assam', description: 'Animal rescue and rehabilitation during natural disasters.',
    capabilities: ['animal_rescue'], operationalStatus: 'aging',
    totalVolunteers: 20, yearEstablished: 2021, operatingDistricts: ['Kamrup'],
    lastActivity: '2 weeks ago'
  },
  {
    id: '6', name: 'River Valley Aid Society', verificationStatus: 'pending', verificationScore: 35,
    district: 'Darrang', state: 'Assam', description: 'Community-driven flood relief.',
    capabilities: ['food', 'water'], operationalStatus: 'active',
    totalVolunteers: 15, yearEstablished: 2023, operatingDistricts: ['Darrang'],
    lastActivity: '3 days ago'
  },
];

const CAPABILITIES = ['All', 'food', 'water', 'shelter', 'medical', 'rescue', 'clothing', 'animal_rescue'];
const STATUSES = ['All', 'verified', 'pending', 'suspended'];

export default function NGODirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCapability, setSelectedCapability] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredNGOs = MOCK_NGOS.filter(ngo => {
    const matchesSearch = ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ngo.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCapability = selectedCapability === 'All' || ngo.capabilities.includes(selectedCapability);
    const matchesStatus = selectedStatus === 'All' || ngo.verificationStatus === selectedStatus;
    
    return matchesSearch && matchesCapability && matchesStatus;
  });

  const getScoreColor = (score) => {
    if (score >= 90) return styles.scoreGreen;
    if (score >= 70) return styles.scoreBlue;
    if (score >= 50) return styles.scoreAmber;
    return styles.scoreRed;
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'verified': return <ShieldCheck className={styles.statusIconGreen} size={16} />;
      case 'pending': return <Clock3 className={styles.statusIconYellow} size={16} />;
      default: return <AlertTriangle className={styles.statusIconRed} size={16} />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Verified NGO Directory</h1>
        <p className={styles.subtitle}>Browse organizations verified by Sankalp's document verification process</p>
      </header>

      <div className={styles.filtersContainer}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} size={20} />
          <input 
            type="text" 
            placeholder="Search NGOs by name or description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.chipGroups}>
          <div className={styles.chipGroup}>
            <span className={styles.filterLabel}>Capabilities:</span>
            <div className={styles.chips}>
              {CAPABILITIES.map(cap => (
                <button 
                  key={cap}
                  className={`${styles.chip} ${selectedCapability === cap ? styles.activeChip : ''}`}
                  onClick={() => setSelectedCapability(cap)}
                >
                  {cap === 'All' ? cap : cap.charAt(0).toUpperCase() + cap.slice(1).replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.chipGroup}>
            <span className={styles.filterLabel}>Status:</span>
            <div className={styles.chips}>
              {STATUSES.map(status => (
                <button 
                  key={status}
                  className={`${styles.chip} ${selectedStatus === status ? styles.activeChip : ''}`}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <motion.div 
        className={styles.ngoGrid}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {filteredNGOs.map(ngo => (
          <motion.div key={ngo.id} className={styles.ngoCard} variants={itemVariants}>
            <div className={styles.cardHeader}>
              <h2 className={styles.ngoName}>{ngo.name}</h2>
              <div className={`${styles.scoreBadge} ${getScoreColor(ngo.verificationScore)}`}>
                {ngo.verificationScore}
              </div>
            </div>

            <div className={styles.statusRow}>
              <div className={styles.verificationStatus}>
                {getStatusIcon(ngo.verificationStatus)}
                <span>
                  {ngo.verificationStatus === 'verified' ? 'DOCUMENTS VERIFIED' : 
                   ngo.verificationStatus === 'pending' ? 'PENDING' : 'SUSPENDED'}
                </span>
              </div>
              <div className={`${styles.operationalStatus} ${ngo.operationalStatus === 'active' ? styles.opActive : styles.opAging}`}>
                <div className={styles.statusDot}></div>
                {ngo.operationalStatus.toUpperCase()}
              </div>
            </div>

            <div className={styles.metaInfo}>
              <div className={styles.metaItem}>
                <MapPin size={14} />
                <span>{ngo.district}, {ngo.state}</span>
              </div>
              <div className={styles.metaItem}>
                <Users size={14} />
                <span>{ngo.totalVolunteers} Volunteers</span>
              </div>
              <div className={styles.metaItem}>
                <Clock size={14} />
                <span>Active {ngo.lastActivity}</span>
              </div>
            </div>

            <div className={styles.capabilities}>
              {ngo.capabilities.map(cap => (
                <span key={cap} className={styles.capabilityTag}>
                  {cap.charAt(0).toUpperCase() + cap.slice(1).replace('_', ' ')}
                </span>
              ))}
            </div>

            <Link href={`/ngos/${ngo.id}`} className={styles.viewProfileBtn}>
              View Profile <ArrowRight size={16} />
            </Link>
          </motion.div>
        ))}
        {filteredNGOs.length === 0 && (
          <div className={styles.noResults}>
            No NGOs found matching your criteria.
          </div>
        )}
      </motion.div>
    </div>
  );
}
