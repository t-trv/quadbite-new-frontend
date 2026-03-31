'use client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useDictionary } from '@/contexts/DictionaryContext';

import api from '@/utils/api';

const fetchSideCategories = async (mainCategoryId: string) => {
  const { data } = await api.get(`/categories/side?main_category_id=${mainCategoryId}`);
  return data.data;
};

export default function CategoryTabs({ 
  mainCategoryId,
  activeCategory, 
  onCategoryChange 
}: { 
  mainCategoryId: string;
  activeCategory: string; 
  onCategoryChange: (id: string) => void;
}) {
  const dict = useDictionary();
  const { data: sideCategories, isLoading, isError } = useQuery({
    queryKey: ['sideCategories', mainCategoryId],
    queryFn: () => fetchSideCategories(mainCategoryId),
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 mb-8 h-10 overflow-hidden">
        <Loader2 className="animate-spin text-zinc-300" size={20} />
        <span className="text-zinc-400 text-sm animate-pulse">{dict.common.loading}</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mb-8 text-red-500 text-sm">
        {dict.common.errorTitle}
      </div>
    );
  }

  const keyMap: Record<string, string> = {
    'main-food': 'mainFood',
    'dessert': 'dessert',
    'drink': 'drink'
  };

  const sideCatLabels = (dict.shop as any).sideCategories?.[keyMap[mainCategoryId]] || [];

  const allCategories = [
    { id: 'all', name: dict.shop.all },
    ...(sideCategories || []).map((cat: any, index: number) => ({
      ...cat,
      name: sideCatLabels[index] || cat.name
    }))
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {allCategories.map((cat: any) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
            activeCategory === cat.id
              ? 'bg-zinc-900 text-white shadow-lg scale-105'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-400'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
