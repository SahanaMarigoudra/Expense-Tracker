// Dynamic API URL for Local Development and Production Cloud Hosting
const isLocal = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 
  (isLocal ? 'http://127.0.0.1:8002' : (typeof window !== 'undefined' ? window.location.origin : ''))
).replace(/\/+$/, '');

export const API = isLocal ? 'http://127.0.0.1:8002/api' : '/api';
