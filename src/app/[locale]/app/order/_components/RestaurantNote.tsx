'use client';

import { MessageSquare } from 'lucide-react';

export default function RestaurantNote({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (val: string) => void;
}) {
  return (
    <div className="bg-white rounded-[32px] p-8 border border-zinc-100 shadow-sm font-sans">
      <div className="flex items-center gap-4 mb-4">
        <MessageSquare className="text-zinc-400" size={20} />
        <h2 className="text-lg font-black text-zinc-900">Nhắc nhở tới nhà hàng</h2>
      </div>
      <textarea 
        className="w-full h-32 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-zinc-900 focus:outline-none transition-all placeholder:text-zinc-400 font-medium"
        placeholder="Ví dụ: Không cho hành tây, ít cay..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
