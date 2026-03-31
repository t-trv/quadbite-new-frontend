'use client';

import { Tag, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import api from '@/utils/api';
import { useQuery } from '@tanstack/react-query';
import { CartItem } from '@/stores/cart';
import { useState, useEffect } from 'react';
import { useDictionary } from '@/contexts/DictionaryContext';
import { useParams } from 'next/navigation';
import { formatPrice } from '@/utils/currency';

interface OrderSummaryProps {
  items: CartItem[];
  addressId: number | null;
  paymentMethod: string;
  couponCode: string;
  onCouponChange: (code: string) => void;
  onCheckout: () => void;
}

const fetchOrderPreview = async (
  items: CartItem[],
  addressId: number | null,
  couponCode: string,
  paymentMethod: string,
) => {
  const { data } = await api.post('/orders/preview', {
    addressId: addressId,
    couponCode: couponCode,
    orderItems: items.map(item => ({
      id: Number(item.id),
      imageUrl: item.image_url,
      name: item.name,
      preparationTime: item.preparation_time || 20,
      price: Number(item.price),
      quantity: item.quantity,
      shortDescription: item.short_description || '',
      variant: item.variant ? {
        id: item.variant.id,
        name: item.variant.name,
        price_adjust: Number(item.variant.price_adjust)
      } : {
        id: "small",
        name: "Small",
        price_adjust: 0
      }
    })),
    paymentMethod: paymentMethod || 'cod'
  });
  return data.data;
};

export default function OrderSummary({
  items,
  addressId,
  paymentMethod,
  couponCode,
  onCouponChange,
  onCheckout
}: OrderSummaryProps) {
  const dict = useDictionary();
  const params = useParams();
  const locale = params.locale as string;
  
  const [localCouponCode, setLocalCouponCode] = useState(couponCode);
  const [debouncedCoupon, setDebouncedCoupon] = useState(couponCode);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCoupon(localCouponCode);
      onCouponChange(localCouponCode);
    }, 1000);

    return () => clearTimeout(handler);
  }, [localCouponCode, onCouponChange]);

  const { data: preview, isLoading, isError } = useQuery({
    queryKey: ['orderPreview', items, addressId, debouncedCoupon, paymentMethod],
    queryFn: () => fetchOrderPreview(items, addressId, debouncedCoupon, paymentMethod),
    enabled: items.length > 0,
  });

  const surcharge = 0;
  const shippingFee = 0;

  return (
    <div className="bg-white rounded-[32px] p-8 border border-zinc-100 shadow-sm sticky top-24 font-sans">
      <h2 className="text-lg font-black text-zinc-900 mb-6">{dict.checkout.orderSummary}</h2>
      
      <div className="flex gap-2 mb-8">
        <div className="relative flex-1">
          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder={dict.checkout.couponCode}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-zinc-900 focus:outline-none transition-all font-bold"
            value={localCouponCode}
            onChange={(e) => setLocalCouponCode(e.target.value)}
          />
        </div>
        <button 
          className="bg-zinc-900 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-zinc-800 transition-all"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : dict.checkout.apply}
        </button>
      </div>

      <div className="space-y-4 pb-6 border-b border-zinc-100">
        <div className="flex justify-between text-zinc-500 font-bold">
          <span>{dict.checkout.subtotal}</span>
          <span className="text-zinc-900 font-black">
            {formatPrice(preview?.totalItemsPrice || 0, locale)}
          </span>
        </div>
        <div className="flex justify-between text-zinc-500 font-bold">
          <span>{dict.checkout.discount}</span>
          <span className="text-red-600 font-black">
            -{formatPrice(preview?.totalDiscount || 0, locale)}
          </span>
        </div>
        <div className="flex justify-between text-zinc-500 font-bold">
          <span>{dict.checkout.shipping}</span>
          <span className="text-zinc-900 font-black">Free</span>
        </div>
      </div>

      <div className="py-6 flex justify-between items-center mb-6">
        <span className="text-xl font-black text-zinc-900 tracking-tight">{dict.checkout.total}</span>
        <span className="text-3xl font-black text-zinc-900">
          {formatPrice(preview?.totalPrice || 0, locale)}
        </span>
      </div>

      {isLoading && <p className="text-xs text-zinc-400 text-center mb-4 italic">{dict.common.loading}</p>}

      <Button 
        onClick={onCheckout}
        disabled={isLoading || isError || !addressId}
        className="w-full py-5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-black text-lg transition-all active:scale-95 shadow-xl shadow-zinc-200"
      >
        {dict.checkout.placeOrder}
      </Button>
      
      {!addressId && <p className="text-xs text-red-500 text-center mt-4">{dict.checkout.errors.selectAddress}</p>}
    </div>
  );
}
