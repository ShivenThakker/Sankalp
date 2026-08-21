'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './DisasterMap.module.css';

// Fix Leaflet's default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getSeverityColor = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'high': return '#ef4444';
    case 'moderate': return '#f59e0b';
    case 'low': return '#10b981';
    default: return '#3b82f6';
  }
};

const DisasterMarker = ({ disaster, onMarkerClick }) => {
  const map = useMap();
  return (
    <CircleMarker
      center={[disaster.centerLat, disaster.centerLng]}
      pathOptions={{ 
        color: disaster.isCustom ? '#f97316' : getSeverityColor(disaster.severity),
        fillColor: disaster.isCustom ? '#f97316' : getSeverityColor(disaster.severity),
        fillOpacity: 0.2
      }}
      radius={Math.max((disaster.radiusKm * 200) / 1000, 10)}
      className={disaster.isCustom ? styles.pulsingMarker : ''}
      eventHandlers={{
        click: () => {
          map.flyTo([disaster.centerLat, disaster.centerLng], 9, { duration: 1.5 });
          onMarkerClick(disaster, 'disaster');
        },
      }}
    >
      <Popup>
        <div className={styles.popupContent}>
          <h3>{disaster.title} {disaster.isCustom && '⚡'}</h3>
          <p><strong>Severity:</strong> <span style={{ color: disaster.isCustom ? '#f97316' : getSeverityColor(disaster.severity) }}>{disaster.severity}</span></p>
          <p><strong>Type:</strong> {disaster.type}</p>
          <p><strong>Affected:</strong> {disaster.affectedPopulation?.toLocaleString()}</p>
          <p><strong>Radius:</strong> {disaster.radiusKm} km</p>
        </div>
      </Popup>
    </CircleMarker>
  );
};

const DisasterMap = ({
  disasters = [],
  ngos = [],
  helpRequests = [],
  center = [22.5, 82.0],
  zoom = 5,
  height = '500px',
  onMarkerClick = () => {},
}) => {
  return (
    <div className={styles.mapContainer} style={{ height }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {/* Disaster Areas */}
        {disasters.map((disaster) => (
          <DisasterMarker
            key={disaster.id || disaster.title}
            disaster={disaster}
            onMarkerClick={onMarkerClick}
          />
        ))}

        {/* NGOs */}
        {ngos.map((ngo) => (
          <CircleMarker
            key={ngo.id || ngo.name}
            center={[ngo.lat, ngo.lng]}
            pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.8 }}
            radius={8}
            eventHandlers={{
              click: () => onMarkerClick(ngo, 'ngo'),
            }}
          >
            <Popup>
              <div className={styles.popupContent}>
                <h3>{ngo.name}</h3>
                <p><strong>Score:</strong> {ngo.verificationScore}/100</p>
                <p><strong>Capabilities:</strong> {ngo.capabilities?.join(', ')}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Help Requests */}
        {helpRequests.map((req) => (
          <CircleMarker
            key={req.id}
            center={[req.lat, req.lng]}
            pathOptions={{ color: req.isCustom ? '#f97316' : '#ef4444', fillColor: req.isCustom ? '#f97316' : '#ef4444', fillOpacity: 1 }}
            radius={6}
            className={req.urgency === 'critical' || req.isCustom ? styles.pulsingMarker : ''}
            eventHandlers={{
              click: () => onMarkerClick(req, 'request'),
            }}
          >
            <Popup>
              <div className={styles.popupContent}>
                <h3>Help Needed</h3>
                <p><strong>Urgency:</strong> <span style={{ color: '#ef4444' }}>{req.urgency}</span></p>
                <p><strong>People:</strong> {req.people}</p>
                <p><strong>Needs:</strong> {req.needs?.join(', ')}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

      </MapContainer>
      
      {/* Legend */}
      <div className={styles.legend}>
        <h4>Legend</h4>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: '#ef4444', opacity: 0.5 }}></span>
          <span>High Severity</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: '#f59e0b', opacity: 0.5 }}></span>
          <span>Moderate Severity</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: '#10b981', opacity: 0.5 }}></span>
          <span>Low Severity</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: '#3b82f6', width: 8, height: 8, borderRadius: '50%' }}></span>
          <span>NGO</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: '#ef4444', width: 6, height: 6, borderRadius: '50%' }}></span>
          <span>Help Request</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: '#f97316', opacity: 0.5 }}></span>
          <span>⚡ Live Custom Event</span>
        </div>
      </div>
    </div>
  );
};

export default DisasterMap;
