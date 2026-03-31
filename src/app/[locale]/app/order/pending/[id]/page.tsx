'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';
import { useParams, useRouter } from 'next/navigation';
import { 
  Clock, 
  ChevronLeft, 
  QrCode, 
  Loader2, 
  Copy, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Header from '@/components/header/Header';
import Button from '@/components/ui/Button';
import { useDictionary } from '@/contexts/DictionaryContext';
import { formatPrice } from '@/utils/currency';
import { useState } from 'react';

const fetchOrderDetails = async (id: string) => {
  const { data } = await api.get(`/orders/${id}`);
  return data.data;
};

export default function OrderPendingPage() {
  const dict = useDictionary();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const locale = params.locale as string;
  const [copied, setCopied] = useState(false);

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['orderDetails', id],
    queryFn: () => fetchOrderDetails(id),
    enabled: !!id,
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-400">
          <Loader2 className="animate-spin" size={48} />
          <p className="font-bold">{dict.orderSuccess.loading}</p>
        </main>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-6">
          <AlertCircle size={64} className="text-red-500" />
          <h2 className="text-2xl font-black text-zinc-900">{dict.orderSuccess.orderNotFound}</h2>
          <Button onClick={() => router.push(`/${locale}/app/shop`)}>{dict.orderSuccess.backToShop}</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-2xl px-6 py-12">
        <div className="bg-white rounded-[40px] p-8 md:p-12 border border-zinc-100 shadow-xl shadow-zinc-200/50 text-center">
          <div className="mb-8">
            <div className="h-16 w-16 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600 mx-auto mb-4 border border-yellow-100">
              <Clock size={32} />
            </div>
            <h1 className="text-3xl font-black text-zinc-900 mb-2 tracking-tight">{dict.orderPending.title}</h1>
            <p className="text-zinc-500 font-bold">{dict.orderPending.subtitle}</p>
          </div>

          {/* QR Code Section */}
          <div className="relative inline-block mb-10 group">
            <div className="absolute inset-0 bg-primary/20 rounded-3xl scale-105 blur-2xl opacity-30 group-hover:opacity-50 transition-all duration-500" />
            <div className="bg-white p-6 rounded-[32px] border-2 border-zinc-100 relative shadow-sm">
                <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=QUADBITE_ORDER_${order.orderId}_AMOUNT_${order.totalPrice}`} 
                    alt="Payment QR" 
                    className="w-64 h-64 mx-auto"
                />
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-zinc-50 rounded-[32px] p-6 mb-10 text-left space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">{dict.orderPending.amount}</span>
              <span className="text-xl font-black text-zinc-900">
                {formatPrice(order.totalPrice, locale)}
              </span>
            </div>
            <div className="h-px bg-zinc-100" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">{dict.history.orderId}</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-zinc-900 italic">#{order.orderId}</span>
                <button 
                  onClick={() => handleCopy(`#${order.orderId}`)}
                  className="p-2 hover:bg-zinc-200 rounded-lg transition-colors text-zinc-400"
                  title={dict.orderPending.copy}
                >
                  {copied ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
                onClick={() => router.push(`/${locale}/app/order/success/${order.orderId}`)}
                className="w-full rounded-2xl bg-zinc-900 py-4 font-black text-white hover:bg-zinc-800 transition-all active:scale-95"
            >
                {dict.orderPending.done}
            </Button>
            <button 
              onClick={() => router.push(`/${locale}/app/order/history`)}
              className="text-zinc-400 font-bold hover:text-zinc-900 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <ChevronLeft size={18} />
              {dict.profile.orderHistory}
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-12 text-center text-zinc-400">
          <p className="text-sm font-bold flex items-center justify-center gap-2">
            <CheckCircle2 size={16} className="text-green-500" />
            Thanh toán an toàn với QuadBite
          </p>
        </div>
      </main>
    </div>
  );
}
