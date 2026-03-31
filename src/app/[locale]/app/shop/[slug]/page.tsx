'use client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Plus, Minus, ArrowLeft, Loader2, Star, Clock, ChefHat } from 'lucide-react';
import Header from '@/components/header/Header';
import { useCartStore } from '@/stores/cart';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useDictionary } from '@/contexts/DictionaryContext';
import { formatPrice } from '@/utils/currency';

const fetchFoods = async () => {
  const { data } = await axios.get('http://localhost:3000/api/foods');
  return data.data;
};

export default function FoodDetailPage() {
  const dict = useDictionary();
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const locale = params.locale as string;
  const { addItem } = useCartStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  const { data: foods, isLoading } = useQuery({
    queryKey: ['foods'],
    queryFn: fetchFoods,
  });

  const food = foods?.find((f: any) => f.slug === slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-400">
          <Loader2 className="animate-spin" size={48} />
          <p>{dict.common.loading}</p>
        </div>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <h2 className="text-2xl font-bold text-zinc-900">{dict.common.noData}</h2>
          <Button onClick={() => router.push(`/${locale}/app/shop`)}>{dict.common.back}</Button>
        </div>
      </div>
    );
  }

  const currentPrice =
    Number(food.price) + (selectedVariant ? parseInt(selectedVariant.price_adjust) : 0);

  const handleAddToCart = () => {
    // We add the quantity specified
    for (let i = 0; i < quantity; i++) {
      addItem(food, selectedVariant);
    }
    router.push(`/${locale}/app/cart`);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-7xl px-6 py-10">
        <Link
          href={`/${locale}/app/shop`}
          className="flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors font-bold mb-8"
        >
          <ArrowLeft size={20} />
          {dict.common.back}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-[40px] shadow-sm border border-zinc-100">
          {/* Image Section */}
          <div className="relative aspect-square overflow-hidden rounded-[32px] bg-zinc-50">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${food.image_url}`}
              alt={food.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm flex items-center gap-2">
              <Star className="text-yellow-400 fill-yellow-400" size={18} />
              <span className="font-bold text-zinc-900">4.8</span>
              <span className="text-zinc-400 text-sm">(120+ {dict.shop.reviews})</span>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest">
                  {food.side_category?.name || food.side_category_id || (dict.shop as any)?.popular || 'Popular'}
                </span>
                <div className="flex items-center gap-1.5 text-zinc-400 text-sm font-medium">
                  <Clock size={16} />
                  {food.preparation_time} {dict.shop.preparationTime}
                </div>
              </div>

              <h1 className="text-4xl font-black text-zinc-900">{food.name}</h1>

              <div className="text-3xl font-black text-red-600">
                {formatPrice(currentPrice, locale)}
              </div>

              <p className="text-zinc-500 leading-relaxed text-lg">{food.description}</p>
            </div>

            <div className="h-px bg-zinc-100 my-8" />

            {/* Variants */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-4">
                  {dict.shop.selectSize}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {food.variants?.map((v: any) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all border ${
                        selectedVariant?.id === v.id
                          ? 'bg-zinc-900 text-white border-zinc-900 shadow-lg scale-105'
                          : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                      }`}
                    >
                      {(dict.shop.variants as any)?.sizes?.[v.name] || v.name} (+{formatPrice(v.price_adjust, locale)})
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedVariant(null)}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all border ${
                      !selectedVariant
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-lg scale-105'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    {dict.shop.all}
                  </button>
                </div>
              </div>

              {/* Quantity & Add */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                <div className="flex items-center gap-4 bg-zinc-50 p-2 rounded-2xl border border-zinc-100 w-full sm:w-fit justify-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-12 w-12 flex items-center justify-center rounded-xl bg-white text-zinc-500 hover:text-primary transition-colors shadow-sm"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="text-xl font-black w-10 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-12 w-12 flex items-center justify-center rounded-xl bg-white text-zinc-900 hover:text-primary transition-colors shadow-sm"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  size="md"
                  className="w-full sm:flex-1 text-lg rounded-2xl shadow-xl shadow-red-100 uppercase tracking-widest font-black"
                >
                  {dict.shop.addToCart}
                </Button>
              </div>
            </div>

            <div className="mt-10 flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                <ChefHat size={24} />
              </div>
              <div>
                <div className="text-sm font-bold text-zinc-900">
                  {dict.shop.chefNote}
                </div>
                <div className="text-xs text-zinc-400">
                  {dict.shop.hygieneNote}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Foods */}
        <section className="mt-20">
          <h2 className="text-3xl font-black text-zinc-900 mb-8 px-4 border-l-8 border-primary ml-2 py-2">
            {dict.shop.related}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {foods
              ?.filter((f: any) => f.slug !== slug)
              .slice(0, 4)
              .map((f: any) => (
                <div
                  key={f.id}
                  className="group relative overflow-hidden rounded-3xl bg-white p-4 transition-all hover:shadow-xl border border-dashed border-zinc-200"
                >
                  <Link href={`/${locale}/app/shop/${f.slug}`}>
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-50">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${f.image_url}`}
                        alt={f.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                    <h3 className="mt-4 font-bold text-zinc-900 group-hover:text-primary transition-colors">
                      {f.name}
                    </h3>
                    <div className="text-red-600 font-black mt-1">
                      {formatPrice(f.price, locale)}
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        </section>
      </main>
    </div>
  );
}
