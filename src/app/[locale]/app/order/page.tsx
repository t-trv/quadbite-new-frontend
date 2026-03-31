'use client';

import { useCartStore } from '@/stores/cart';
import { useUserStore } from '@/stores/user';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ChevronLeft, Bookmark } from 'lucide-react';
import Button from '@/components/ui/Button';
import Header from '@/components/header/Header';

// Components
import OrderItemsList from './_components/OrderItemsList';
import AddressSelection from './_components/AddressSelection';
import PaymentMethods from './_components/PaymentMethods';
import RestaurantNote from './_components/RestaurantNote';
import OrderSummary from './_components/OrderSummary';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import api from '@/utils/api';
import { useDictionary } from '@/contexts/DictionaryContext';

export default function OrderPage() {
  const dict = useDictionary();
  const { items, addItem, removeItem, clearCart } = useCartStore();
  const { user } = useUserStore();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [note, setNote] = useState('');
  const [couponCode, setCouponCode] = useState('');

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const { data } = await api.post('/orders', orderData);
      return data.data;
    },
    onSuccess: (responseData) => {
      console.log('Order created successfully:', responseData);
      const id = typeof responseData === 'object' ? responseData.id : responseData;

      if (id) {
        if (paymentMethod === 'internet_banking') {
          router.push(`/${locale}/app/order/pending/${id}`);
        } else {
          router.push(`/${locale}/app/order/success/${id}`);
        }
        // Clear cart after navigation starts
        setTimeout(() => clearCart(), 100);
      } else {
        console.error('No order ID found in response:', responseData);
        toast.error(dict.checkout.errors.orderSuccessNoId);
      }
    },
    onError: (error) => {
      console.error('Order error:', error);
      toast.error(dict.checkout.errors.orderError);
    },
  });

  useEffect(() => {
    // If cart is empty and we are NOT in the middle of a successful checkout, redirect back to shop
    if (items.length === 0 && !createOrderMutation.isSuccess) {
      router.push(`/${locale}/app/shop`);
    }
  }, [items.length, locale, router, createOrderMutation.isSuccess]);

  const handleCheckout = () => {
    if (!selectedAddressId) {
      toast.error(dict.checkout.errors.selectAddress);
      return;
    }

    if (paymentMethod === 'card') {
      toast(dict.checkout.errors.featureDeveloping, { icon: '🚧' });
      return;
    }

    const orderData = {
      orderItems: items.map((item) => ({
        id: Number(item.id),
        quantity: item.quantity,
        price: Number(item.price),
        imageUrl: item.image_url,
        name: item.name,
        shortDescription: item.short_description || '',
        preparationTime: item.preparation_time || 20,
        variant: item.variant
          ? {
              id: item.variant.id,
              name: item.variant.name,
              price_adjust: Number(item.variant.price_adjust),
            }
          : {
              id: 'small',
              name: 'Small',
              price_adjust: 0,
            },
      })),
      couponCode: couponCode || null,
      addressId: selectedAddressId,
      paymentMethod: paymentMethod || 'cod',
      shippingTime: null,
      note: note || null,
    };

    createOrderMutation.mutate(orderData);
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-[1400px] px-6 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black text-zinc-900">{dict.checkout.title}</h1>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            onClick={() => router.back()}
          >
            <ChevronLeft size={18} className="mr-1" />
            {dict.checkout.back}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order & Payment */}
          <div className="lg:col-span-2 space-y-8">
            <OrderItemsList items={items} onAdd={addItem} onRemove={removeItem} />

            <PaymentMethods selectedMethod={paymentMethod} onSelect={setPaymentMethod} />

            <RestaurantNote value={note} onChange={setNote} />

            {/* Save Button */}
            <Button
              variant="secondary"
              className="rounded-full bg-white border border-zinc-200 text-zinc-900 font-black px-8 py-4 hover:bg-zinc-50 shadow-sm"
            >
              <Bookmark size={20} className="mr-2" />
              {dict.checkout.saveToCart}
            </Button>
          </div>

          {/* Right Column - Address & Summary */}
          <div className="space-y-8">
            <AddressSelection
              userId={user?.id || 1}
              selectedId={selectedAddressId}
              onSelect={setSelectedAddressId}
            />

            <OrderSummary
              items={items}
              addressId={selectedAddressId}
              paymentMethod={paymentMethod}
              couponCode={couponCode}
              onCouponChange={setCouponCode}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
