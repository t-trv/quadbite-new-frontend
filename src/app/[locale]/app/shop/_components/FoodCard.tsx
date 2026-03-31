'use client';
import { Plus } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatPrice } from '@/utils/currency';

interface FoodCardProps {
  food: {
    id: number | string;
    name: string;
    image_url: string;
    price: number | string;
    short_description: string;
    preparation_time?: number;
    slug: string;
    side_category?: { name: string };
    side_category_id?: string;
  };
}

export default function FoodCard({ food }: FoodCardProps) {
  const { addItem } = useCartStore();
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white p-4 transition-all hover:shadow-xl border border-dashed border-zinc-200">
      <Link href={`/${locale}/app/shop/${food.slug}`}>
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100">
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}${food.image_url}`}
            alt={food.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold text-zinc-900 group-hover:text-primary transition-colors">
            {food.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-zinc-500">{food.short_description}</p>
        </div>
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-lg font-black text-red-600">
          {formatPrice(food.price, locale)}
        </div>
        <button
          onClick={() => addItem(food)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
}
