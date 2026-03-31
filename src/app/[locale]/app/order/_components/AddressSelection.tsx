'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { MapPin, Settings, Loader2 } from 'lucide-react';
import { useDictionary } from '@/contexts/DictionaryContext';

interface Address {
  id: number;
  address_name: string;
  receiption_name: string;
  phone: string;
  address_line: string;
  city: string;
  district: string;
}

const fetchAddresses = async (userId: number) => {
  const { data } = await axios.get(`http://localhost:3000/api/addresses?userId=${userId}`);
  return data.data;
};

export default function AddressSelection({ 
  userId, 
  selectedId, 
  onSelect 
}: { 
  userId: number; 
  selectedId: number | null; 
  onSelect: (id: number) => void;
}) {
  const dict = useDictionary();
  const { data: addresses, isLoading, isError } = useQuery({
    queryKey: ['addresses', userId],
    queryFn: () => fetchAddresses(userId),
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-[32px] p-8 border border-zinc-100 shadow-sm flex flex-col items-center justify-center py-20 gap-4 text-zinc-400">
        <Loader2 className="animate-spin" size={32} />
        <p className="font-bold">{dict.common.loading}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-[32px] p-8 border border-zinc-100 shadow-sm text-red-500 font-bold text-center">
        {dict.common.noData}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] p-8 border border-zinc-100 shadow-sm">
      <h2 className="text-lg font-black text-zinc-900 mb-6">{dict.checkout.selectAddress}</h2>
      
      <div className="space-y-4">
        {addresses?.map((addr: Address) => (
          <div 
            key={addr.id}
            onClick={() => onSelect(addr.id)}
            className={`p-6 rounded-2xl border-2 transition-all cursor-pointer relative ${
              selectedId === addr.id 
                ? 'border-zinc-900 bg-blue-50/10' 
                : 'border-zinc-50 bg-zinc-50/50 hover:border-zinc-100'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                selectedId === addr.id ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-500'
              }`}>
                {addr.address_name}
              </span>
            </div>
            <div className="font-extrabold text-zinc-900 mb-1">{addr.receiption_name}</div>
            <div className="text-sm font-bold text-zinc-900 mb-2">{addr.phone}</div>
            <div className="text-sm text-zinc-500 leading-snug flex items-start gap-2">
              <MapPin size={16} className="shrink-0 mt-0.5" />
              {addr.address_line}, {addr.district}, {addr.city}
            </div>
          </div>
        ))}

        <button className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-zinc-300 rounded-2xl text-zinc-500 font-bold hover:bg-zinc-50 transition-all text-sm mt-4">
           <Settings size={18} />
           {dict.common.edit}
        </button>
      </div>
    </div>
  );
}
