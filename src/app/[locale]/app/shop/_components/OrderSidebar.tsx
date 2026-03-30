'use client';
import { useCartStore } from '@/stores/cart';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useUserStore } from '@/stores/user';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import AuthModal from '@/components/auth/AuthModal';

export default function OrderSidebar() {
  const { items, addItem, removeItem, clearCart, totalPrice } = useCartStore();
  const { user } = useUserStore();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleCheckout = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      router.push(`/${locale}/app/order`);
    }
  };

  return (
    <div className="h-full rounded-3xl bg-white p-6 shadow-sm border border-zinc-100 flex flex-col">
      <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
        Đơn hàng của bạn
      </h2>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400 gap-4">
            <ShoppingBag size={48} className="opacity-20" />
            <p className="text-sm">Chưa có món ăn nào!</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-2 rounded-2xl hover:bg-zinc-50 transition-colors">
              <div className="h-16 w-16 overflow-hidden rounded-xl bg-zinc-100 shrink-0">
                <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-zinc-900 truncate">{item.name}</div>
                <div className="text-sm text-red-600 font-bold">
                  {new Intl.NumberFormat('vi-VN').format(item.price)}đ
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-1 rounded-lg hover:bg-zinc-200 text-zinc-500"
                >
                  <Minus size={16} />
                </button>
                <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                <button 
                  onClick={() => addItem(item)}
                  className="p-1 rounded-lg hover:bg-zinc-200 text-zinc-900"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="mt-6 pt-6 border-t border-zinc-100 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 font-medium">Tổng cộng</span>
            <span className="text-2xl font-black text-red-600">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice())}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
               size="sm"
               variant="secondary" 
               className="rounded-2xl bg-zinc-100 hover:bg-zinc-200 border-none"
               onClick={clearCart}
            >
              <Trash2 size={18} className="mr-2" />
              Xóa
            </Button>
            <Button 
               size="md" 
               className="rounded-2xl"
               onClick={handleCheckout}
            >
              Thanh toán
            </Button>
          </div>
        </div>
      )}

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          router.push(`/${locale}/app/order`);
        }}
      />
    </div>
  );
}
