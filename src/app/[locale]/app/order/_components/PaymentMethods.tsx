'use client';

import { Truck, Wallet, CreditCard } from 'lucide-react';

export default function PaymentMethods({ 
  selectedMethod, 
  onSelect 
}: { 
  selectedMethod: string; 
  onSelect: (id: string) => void;
}) {
  const methods = [
    { id: 'cod', label: 'Thanh toán khi nhận hàng', icon: <Truck size={18} /> },
    { id: 'internet_banking', label: 'Chuyển khoản ngân hàng', icon: <Wallet size={18} /> },
    { id: 'card', label: 'Thanh toán qua thẻ', icon: <CreditCard size={18} /> }
  ];

  return (
    <div className="bg-white rounded-[32px] p-8 border border-zinc-100 shadow-sm">
      <h2 className="text-lg font-black text-zinc-900 mb-6 flex items-center gap-2 font-sans">
        Thông tin thanh toán
      </h2>
      
      <div className="space-y-4">
        {methods.map((method) => (
          <label 
            key={method.id}
            className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedMethod === method.id 
                ? 'border-zinc-900 bg-zinc-50' 
                : 'border-zinc-50 hover:border-zinc-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedMethod === method.id ? 'border-zinc-900 bg-zinc-900' : 'border-zinc-300'
              }`}>
                {selectedMethod === method.id && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
              <span className="font-bold text-zinc-900">{method.label}</span>
            </div>
            <div className="text-zinc-400">
              {method.icon}
            </div>
            <input 
              type="radio" 
              name="payment" 
              className="hidden" 
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={() => onSelect(method.id)}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
