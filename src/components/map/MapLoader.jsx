'use client';
import dynamic from 'next/dynamic';
import Loader from '../ui/Loader';

const DisasterMap = dynamic(() => import('./DisasterMap'), {
  ssr: false,
  loading: () => <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}><Loader text="Loading map..." /></div>,
});

export default DisasterMap;
