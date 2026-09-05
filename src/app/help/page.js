'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  MapPin,
  Loader2,
  Mic,
  MicOff,
  CheckCircle,
  AlertTriangle,
  Navigation,
  PhoneCall,
  Shield,
  Clock,
  Volume2,
  ChevronRight,
  Globe
} from 'lucide-react';
import styles from './page.module.css';

// ==================== LANGUAGE LIST ====================
const LANGUAGES = [
  { code: 'en-IN', label: 'English', native: 'English' },
  { code: 'hi-IN', label: 'Hindi', native: 'हिन्दी' },
  { code: 'bn-IN', label: 'Bengali', native: 'বাংলা' },
  { code: 'ta-IN', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te-IN', label: 'Telugu', native: 'తెలుగు' },
  { code: 'mr-IN', label: 'Marathi', native: 'मराठी' },
  { code: 'gu-IN', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn-IN', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml-IN', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'or-IN', label: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'pa-IN', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'as-IN', label: 'Assamese', native: 'অসমীয়া' },
  { code: 'ur-IN', label: 'Urdu', native: 'اردو' },
];

// ==================== MAIN COMPONENT ====================
export default function HelpPage() {
  const router = useRouter();

  // ---- Voice State ----
  const [selectedLang, setSelectedLang] = useState('hi-IN');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [sosStep, setSosStep] = useState('idle');
  // 'idle' | 'recording' | 'parsing' | 'matching' | 'done' | 'error'
  const recognitionRef = useRef(null);

  // ---- Location (auto-captured on mount) ----
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('getting');
  const [manualAddress, setManualAddress] = useState('');

  // ---- Result State ----
  const [parsedData, setParsedData] = useState(null);
  const [matchedNgo, setMatchedNgo] = useState(null);
  const [requestId, setRequestId] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // ==================== GEOLOCATION ====================
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setLocationStatus('found');
        },
        () => { setLocationStatus('failed'); },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationStatus('failed');
    }
  }, []);

  // ==================== MATCH API ====================
  const callMatchAPI = useCallback(async (needs, lat, lng, urgencyLevel, peopleNum) => {
    const res = await fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        needs,
        lat: lat || 26.18,
        lng: lng || 91.75,
        urgency: urgencyLevel,
        people: peopleNum
      })
    });
    return await res.json();
  }, []);

  // ==================== VOICE RECORDING ====================
  const startRecording = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = selectedLang;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      setSosStep('recording');
      setTranscript('');
      setInterimTranscript('');
    };

    recognition.onresult = (event) => {
      let finalT = '';
      let interimT = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalT += event.results[i][0].transcript;
        } else {
          interimT += event.results[i][0].transcript;
        }
      }
      if (finalT) setTranscript(finalT);
      setInterimTranscript(interimT);
    };

    recognition.onerror = (event) => {
      console.error('Speech error:', event.error);
      setIsRecording(false);
      if (event.error === 'not-allowed') {
        alert('Microphone access was denied. Please allow microphone access and try again.');
      }
      setSosStep('idle');
    };

    recognition.onend = () => {
      setIsRecording(false);
      setTranscript(prev => {
        if (prev && prev.trim().length > 0) {
          processSOS(prev);
        } else {
          setSosStep('idle');
        }
        return prev;
      });
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [selectedLang]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) recognitionRef.current.stop();
  }, []);

  // ==================== SOS PROCESSING PIPELINE ====================
  const processSOS = async (spokenText) => {
    setSosStep('parsing');
    try {
      // Step 1: Gemini parses voice text
      const parseRes = await fetch('/api/parse-sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: spokenText,
          lat: location?.lat,
          lng: location?.lng,
          language: selectedLang
        })
      });
      const parsed = await parseRes.json();
      setParsedData(parsed);

      // Step 2: Auto-match to best NGO
      setSosStep('matching');
      const matchData = await callMatchAPI(
        parsed.needs,
        location?.lat || 26.18,
        location?.lng || 91.75,
        parsed.urgency,
        parsed.people
      );

      if (matchData.matches && matchData.matches.length > 0) {
        setMatchedNgo(matchData.matches[0]);
        setRequestId(matchData.requestId);
      }

      setSosStep('done');
      setShowConfirmation(true);
    } catch (error) {
      console.error('SOS processing error:', error);
      setSosStep('error');
    }
  };

  // ==================== RESET ====================
  const resetAll = () => {
    setShowConfirmation(false);
    setParsedData(null);
    setMatchedNgo(null);
    setRequestId('');
    setSosStep('idle');
    setTranscript('');
    setInterimTranscript('');
  };

  // ==================== RENDER: CONFIRMATION SCREEN ====================
  if (showConfirmation) {
    return (
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={styles.confirmationScreen}
        >
          <div className={styles.confirmHeader}>
            <CheckCircle size={48} className={styles.confirmIcon} />
            <h1 className={styles.confirmTitle}>Help Request Sent</h1>
            {requestId && <p className={styles.requestIdText}>Request ID: {requestId}</p>}
          </div>

          {parsedData && (
            <div className={styles.parsedCard}>
              <h3 className={styles.parsedCardTitle}>
                <AlertTriangle size={18} /> Request Summary
              </h3>
              <div className={styles.parsedGrid}>
                <div className={styles.parsedItem}>
                  <span className={styles.parsedLabel}>Needs</span>
                  <span className={styles.parsedValue}>
                    {parsedData.needs.map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(', ')}
                  </span>
                </div>
                <div className={styles.parsedItem}>
                  <span className={styles.parsedLabel}>People</span>
                  <span className={styles.parsedValue}>{parsedData.people}</span>
                </div>
                <div className={styles.parsedItem}>
                  <span className={styles.parsedLabel}>Urgency</span>
                  <span className={`${styles.parsedValue} ${styles['urgency_' + parsedData.urgency]}`}>
                    {parsedData.urgency.toUpperCase()}
                  </span>
                </div>
                {parsedData.location_description && parsedData.location_description !== 'Not specified' && (
                  <div className={styles.parsedItem}>
                    <span className={styles.parsedLabel}>Location Info</span>
                    <span className={styles.parsedValue}>{parsedData.location_description}</span>
                  </div>
                )}
              </div>
              {parsedData.message && (
                <p className={styles.parsedMessage}>"{parsedData.message}"</p>
              )}
            </div>
          )}

          {matchedNgo && (
            <div className={styles.ngoCard}>
              <div className={styles.ngoCardHeader}>
                <h3>{matchedNgo.name}</h3>
                <div className={styles.ngoScore}>
                  <Shield size={14} />
                  <span>Match: {matchedNgo.matchScore}%</span>
                </div>
              </div>
              <div className={styles.ngoDetails}>
                <div className={styles.ngoStat}>
                  <MapPin size={14} />
                  <span>{matchedNgo.distance} km away</span>
                </div>
                <div className={styles.ngoStat}>
                  <Clock size={14} />
                  <span>ETA: ~{matchedNgo.eta} min</span>
                </div>
                <div className={styles.ngoStat}>
                  <Shield size={14} />
                  <span>Trust: {matchedNgo.verificationScore}%</span>
                </div>
              </div>
              <div className={styles.ngoActions}>
                <a href={`tel:${matchedNgo.phone.replace(/[^0-9+]/g, '')}`} className={styles.callBtn}>
                  <PhoneCall size={18} /> Call NGO
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(matchedNgo.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.directionsBtn}
                >
                  <Navigation size={18} /> Directions
                </a>
              </div>
            </div>
          )}

          {!matchedNgo && (
            <div className={styles.noMatchCard}>
              <p>No specific NGO matched. Please call emergency services.</p>
            </div>
          )}

          <div className={styles.confirmFooter}>
            <button onClick={() => {
              const query = new URLSearchParams();
              if (parsedData) {
                query.set('needs', parsedData.needs.join(','));
                query.set('urgency', parsedData.urgency);
                query.set('people', String(parsedData.people));
              }
              if (location) {
                query.set('lat', String(location.lat));
                query.set('lng', String(location.lng));
              }
              router.push(`/help/results?${query.toString()}`);
            }} className={styles.browseBtn}>
              Browse All Matched NGOs
            </button>
            <div className={styles.emergencyFallback}>
              <p>Can't reach them?</p>
              <a href="tel:112" className={styles.emergencyBtn}>
                <PhoneCall size={18} /> Call Emergency: 112
              </a>
            </div>
            <button onClick={resetAll} className={styles.resetBtn}>
              Submit Another Request
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ==================== RENDER: SOS MAIN PAGE ====================
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>I Need Help</h1>
        <p className={styles.subtitle}>Tap the SOS button and describe your emergency in any language.</p>
      </header>

      {/* Location Bar */}
      <div className={styles.locationBar}>
        {locationStatus === 'getting' && (
          <span><Loader2 className={styles.spin} size={14} /> Getting GPS location...</span>
        )}
        {locationStatus === 'found' && location && (
          <span><MapPin size={14} /> Location locked: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
        )}
        {locationStatus === 'failed' && (
          <div className={styles.manualLocInline}>
            <MapPin size={14} />
            <input
              type="text"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              placeholder="Enter your location"
              className={styles.inlineInput}
            />
          </div>
        )}
      </div>

      {/* Language Picker */}
      <div className={styles.langSection}>
        <div className={styles.langHeader}>
          <Globe size={16} />
          <span>Speak in your language</span>
        </div>
        <div className={styles.langScroll}>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              className={`${styles.langPill} ${selectedLang === lang.code ? styles.langPillActive : ''}`}
              onClick={() => setSelectedLang(lang.code)}
            >
              {lang.native}
            </button>
          ))}
        </div>
      </div>

      {/* ===== SOS BUTTON STATES ===== */}

      {/* Idle: Show SOS button */}
      {sosStep === 'idle' && (
        <div className={styles.sosCenter}>
          <motion.button
            className={styles.sosButton}
            onClick={startRecording}
            whileTap={{ scale: 0.93 }}
          >
            <Mic size={44} />
            <span>SOS</span>
          </motion.button>
          <p className={styles.sosHint}>Tap and describe your situation</p>
        </div>
      )}

      {/* Recording */}
      {sosStep === 'recording' && (
        <div className={styles.sosCenter}>
          <motion.button
            className={`${styles.sosButton} ${styles.sosButtonRecording}`}
            onClick={stopRecording}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            <MicOff size={44} />
            <span>STOP</span>
          </motion.button>
          <p className={styles.listeningText}>Listening...</p>
          <div className={styles.transcriptBox}>
            <Volume2 size={16} className={styles.spin} />
            <p>{interimTranscript || transcript || '...'}</p>
          </div>
        </div>
      )}

      {/* Parsing */}
      {sosStep === 'parsing' && (
        <div className={styles.sosCenter}>
          <Loader2 size={56} className={styles.spin} style={{ color: '#2D6A4F' }} />
          <p className={styles.processingText}>AI is understanding your message...</p>
          <div className={styles.transcriptBox}>
            <p>"{transcript}"</p>
          </div>
        </div>
      )}

      {/* Matching */}
      {sosStep === 'matching' && (
        <div className={styles.sosCenter}>
          <Loader2 size={56} className={styles.spin} style={{ color: '#2D6A4F' }} />
          <p className={styles.processingText}>Finding the best NGO near you...</p>
        </div>
      )}

      {/* Error */}
      {sosStep === 'error' && (
        <div className={styles.sosCenter}>
          <AlertTriangle size={56} style={{ color: '#D62828' }} />
          <p className={styles.errorText}>Something went wrong. Try again or call 112.</p>
          <button onClick={resetAll} className={styles.retryBtn}>Try Again</button>
          <a href="tel:112" className={styles.emergencyBtn}>
            <PhoneCall size={18} /> Call Emergency: 112
          </a>
        </div>
      )}

      {/* ===== MANUAL OPTION (always visible at bottom) ===== */}
      <div className={styles.manualLink}>
        <Link href="/help/manual" className={styles.manualBtn}>
          Select Manually Instead <ChevronRight size={18} />
        </Link>
      </div>

      {/* Emergency fallback always visible */}
      <div className={styles.bottomEmergency}>
        <a href="tel:112" className={styles.bottomEmergencyLink}>
          <PhoneCall size={16} /> Emergency: 112
        </a>
      </div>
    </div>
  );
}
