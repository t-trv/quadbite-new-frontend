'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '@/stores/cart';
import { useDictionary } from '@/contexts/DictionaryContext';
import { useParams } from 'next/navigation';
import { formatPrice } from '@/utils/currency';

export default function OrderItemsList({ 
  items, 
  onAdd, 
  onRemove 
}: { 
  items: CartItem[]; 
  onAdd: (item: CartItem) => void;
  onRemove: (id: number) => void;
}) {
  const dict = useDictionary();
  const params = useParams();
  const locale = params.locale as string;
  return (
    <div className="bg-white rounded-[32px] p-8 border border-zinc-100 shadow-sm">
      <h2 className="text-lg font-black text-zinc-900 mb-6 font-sans">{dict.checkout.orderItems}</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-12 text-xs font-black uppercase tracking-widest text-zinc-400 pb-2 border-b border-zinc-50">
          <div className="col-span-6">{dict.checkout.orderItems}</div>
          <div className="col-span-2 text-center">{dict.history.items}</div>
          <div className="col-span-2 text-right">{dict.cart.totalPriceItem}</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {items.map((item) => (
          <div key={`${item.id}-${item.variant?.id}`} className="grid grid-cols-12 items-center gap-4 py-4 border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 rounded-2xl transition-colors px-2 -mx-2">
            <div className="col-span-6 flex items-center gap-4">
              <div className="h-20 w-20 rounded-2xl overflow-hidden bg-zinc-100 shrink-0">
                <img src={`${process.env.NEXT_PUBLIC_API_URL}${item.image_url}`} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-zinc-900 truncate text-lg">
                  {item.name} {item.variant && (
                    <span className="text-zinc-400 text-sm font-medium">
                      ({(dict.shop.variants as any)?.sizes?.[item.variant.name] || item.variant.name})
                    </span>
                  )}
                </div>
                <div className="text-sm text-zinc-400 line-clamp-2 mt-1 leading-snug">
                  {item.short_description || ''}
                </div>
              </div>
            </div>
            
            <div className="col-span-2 flex justify-center">
              <div className="flex items-center gap-3 bg-zinc-100/50 p-1.5 rounded-xl border border-zinc-200">
                <button 
                  onClick={() => onRemove(item.id)}
                  className="p-1 rounded-lg hover:bg-white text-zinc-500 transition-colors shadow-sm"
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm font-black w-6 text-center">{item.quantity}</span>
                <button 
                  onClick={() => onAdd(item)}
                  className="p-1 rounded-lg hover:bg-white text-zinc-900 transition-colors shadow-sm"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="col-span-2 text-right font-black text-zinc-900 text-lg">
              {formatPrice((item.price + (item.variant?.price_adjust || 0)) * item.quantity, locale)}
            </div>

            <div className="col-span-2 text-right">
              <button className="p-3 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
