'use client';

import { useEffect } from 'react';
import api from '@/utils/api';

export default function AnalyticsTracker() {
  useEffect(() => {
    const trackAccess = async () => {
      try {
        await api.post('/analytics/track', { type: 'ACCESS' });
      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
    };

    trackAccess();
  }, []);

  return null;
}
