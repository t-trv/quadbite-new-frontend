'use client';
import { useCartStore } from '@/stores/cart';
import { useUserStore } from '@/stores/user';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import Button from '@/components/ui/Button';
import Header from '@/components/header/Header';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthModal from '@/components/auth/AuthModal';
import { useDictionary } from '@/contexts/DictionaryContext';
import { formatPrice } from '@/utils/currency';

export default function CartPage() {
  const dict = useDictionary();
  const { items, addItem, removeItem, clearCart, totalPrice } = useCartStore();
  const { user } = useUserStore();
  const params = useParams();
  const router = useRouter();
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
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-7xl px-6 py-10">
        <div className="mb-10">
          <Link 
            href={`/${locale}/app/shop`}
            className="flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors font-bold mb-4"
          >
            <ArrowLeft size={20} />
            {dict.common.back}
          </Link>
          <h1 className="text-4xl font-black text-zinc-900">{dict.cart.title}</h1>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-zinc-200 gap-6">
            <div className="h-24 w-24 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-200">
                <ShoppingBag size={48} />
            </div>
            <div className="text-center">
                <h2 className="text-2xl font-bold text-zinc-900">{dict.cart.empty}</h2>
                <p className="text-zinc-500 mt-2">...</p>
            </div>
            <Link href={`/${locale}/app/shop`}>
                <Button size="md" className="rounded-2xl">
                    {dict.common.viewAll}
                </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-3xl border border-zinc-100 flex items-center gap-6 shadow-sm">
                  <div className="h-24 w-24 overflow-hidden rounded-2xl bg-zinc-100 shrink-0">
                    <img src={`${process.env.NEXT_PUBLIC_API_URL}${item.image_url}`} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-zinc-900 truncate">
                      {item.name}
                      {item.variant && (
                        <span className="ml-2 text-sm text-zinc-400 font-medium">
                          ({(dict.shop.variants as any)?.sizes?.[item.variant.name] || item.variant.name})
                        </span>
                      )}
                    </h3>
                    <div className="text-lg font-black text-red-600 mt-1">
                        {formatPrice(item.price, locale)}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-zinc-50 p-2 rounded-2xl">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="h-10 w-10 flex items-center justify-center rounded-xl bg-white text-zinc-500 hover:text-primary transition-colors shadow-sm"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="text-lg font-black w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => addItem(item)}
                      className="h-10 w-10 flex items-center justify-center rounded-xl bg-white text-zinc-900 hover:text-primary transition-colors shadow-sm"
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  <div className="text-right hidden sm:block min-w-[120px]">
                    <div className="text-sm text-zinc-400 font-medium">{dict.cart.totalPriceItem}</div>
                    <div className="text-xl font-black text-zinc-900">
                        {formatPrice(item.price * item.quantity, locale)}
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-4">
                <button 
                    onClick={clearCart}
                    className="flex items-center gap-2 text-zinc-400 hover:text-red-500 transition-colors font-bold"
                >
                    <Trash2 size={20} />
                    {dict.cart.remove}
                </button>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:sticky lg:top-[100px] h-fit">
              <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-xl space-y-6">
                <h2 className="text-2xl font-bold text-zinc-900">{dict.cart.summary}</h2>
                
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between text-zinc-500">
                    <span>{dict.cart.subtotal}</span>
                    <span className="font-bold text-zinc-900">
                        {formatPrice(totalPrice(), locale)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-500">
                    <span>{dict.cart.shipping}</span>
                    <span className="font-bold text-green-600">Free</span>
                  </div>
                  <div className="h-px bg-zinc-100 my-4" />
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-zinc-900">{dict.cart.total}</span>
                    <span className="text-3xl font-black text-red-600">
                        {formatPrice(totalPrice(), locale)}
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={handleCheckout}
                  size="md"
                  className="w-full text-lg rounded-2xl shadow-lg shadow-red-100 mt-4"
                >
                  {dict.cart.checkout}
                </Button>
                
                <p className="text-center text-xs text-zinc-400">
                    Bằng cách nhấn thanh toán, bạn đồng ý với các điều khoản dịch vụ của QuadBite.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

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
