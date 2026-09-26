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
} from 'lucide-react';
import styles from './page.module.css';

export default function HelpPage() {
  const router = useRouter();

  // ---- Recording State ----
  const [isRecording, setIsRecording] = useState(false);
  const [sosStep, setSosStep] = useState('idle');
  // 'idle' | 'recording' | 'transcribing' | 'parsing' | 'matching' | 'done' | 'error'
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  // ---- Transcript ----
  const [transcript, setTranscript] = useState('');
  const [detectedLang, setDetectedLang] = useState('');

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

  // ==================== MIME TYPE DETECTION ====================
  const getSupportedMimeType = useCallback(() => {
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg;codecs=opus',
      'audio/wav',
    ];
    for (const type of candidates) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return '';
  }, []);

  // ==================== START RECORDING ====================
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      const mimeType = getSupportedMimeType();
      const options = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const actualMime = mediaRecorder.mimeType || 'audio/webm';
        const extension = actualMime.includes('mp4') ? 'mp4' : 'webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: actualMime });

        // Stop microphone
        stream.getTracks().forEach((track) => track.stop());

        // Process the audio
        await processSOS(audioBlob, extension);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setSosStep('recording');
      setTranscript('');
      setDetectedLang('');
    } catch (err) {
      console.error('Microphone access error:', err);
      if (err.name === 'NotAllowedError') {
        alert('Microphone access was denied. Please allow microphone access and try again.');
      } else {
        alert('Could not access microphone. Please check your device settings.');
      }
    }
  }, [getSupportedMimeType]);

  // ==================== STOP RECORDING ====================
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  // ==================== SOS PROCESSING PIPELINE ====================
  const processSOS = async (audioBlob, extension) => {
    // Step 1: Transcribe with Groq Whisper
    setSosStep('transcribing');
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, `sos_recording.${extension}`);

      const transcribeRes = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      const transcribeData = await transcribeRes.json();

      if (!transcribeData.text || transcribeData.text.trim().length === 0) {
        setSosStep('error');
        return;
      }

      setTranscript(transcribeData.text);
      setDetectedLang(transcribeData.language || 'unknown');

      // Step 2: Parse with Gemini
      setSosStep('parsing');
      const parseRes = await fetch('/api/parse-sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcribeData.text,
          lat: location?.lat,
          lng: location?.lng,
          language: transcribeData.language || 'unknown'
        })
      });
      const parsed = await parseRes.json();
      setParsedData(parsed);

      // Step 3: Auto-match to best NGO
      setSosStep('matching');
      const matchRes = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          needs: parsed.needs,
          lat: location?.lat || 26.18,
          lng: location?.lng || 91.75,
          urgency: parsed.urgency,
          people: parsed.people
        })
      });
      const matchData = await matchRes.json();

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
    setDetectedLang('');
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
              {detectedLang && detectedLang !== 'unknown' && (
                <p className={styles.detectedLangText}>
                  Detected language: {detectedLang.charAt(0).toUpperCase() + detectedLang.slice(1)}
                </p>
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
        <p className={styles.subtitle}>Tap the SOS button and describe your emergency in any language. We'll understand.</p>
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

      {/* Supported languages hint */}
      <p className={styles.langHint}>
        Speaks: English, हिन्दी, বাংলা, தமிழ், తెలుగు, मराठी, ગુજરાતી, ಕನ್ನಡ, മലയാളം, ਪੰਜਾਬੀ, اردو + more
      </p>

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
          <p className={styles.listeningText}>Recording... Speak now</p>
          <div className={styles.recordingIndicator}>
            <span className={styles.recordingDot}></span>
            <span>Recording in progress</span>
          </div>
        </div>
      )}

      {/* Transcribing */}
      {sosStep === 'transcribing' && (
        <div className={styles.sosCenter}>
          <Loader2 size={56} className={styles.spin} style={{ color: '#D62828' }} />
          <p className={styles.processingText}>Converting speech to text...</p>
        </div>
      )}

      {/* Parsing */}
      {sosStep === 'parsing' && (
        <div className={styles.sosCenter}>
          <Loader2 size={56} className={styles.spin} style={{ color: '#2D6A4F' }} />
          <p className={styles.processingText}>AI is understanding your message...</p>
          {transcript && (
            <div className={styles.transcriptBox}>
              <Volume2 size={16} />
              <p>"{transcript}"</p>
            </div>
          )}
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
