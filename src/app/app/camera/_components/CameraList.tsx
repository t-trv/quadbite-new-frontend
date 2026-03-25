'use client';

import api from '@/utils/api';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/utils/query';

export default function CameraList() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>test</div>
    </QueryClientProvider>
  );
}
