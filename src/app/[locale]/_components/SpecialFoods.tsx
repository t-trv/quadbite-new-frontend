'use client';

import { motion } from 'framer-motion';
import { useDictionary } from '@/contexts/DictionaryContext';
import { useParams } from 'next/navigation';
import { formatPrice } from '@/utils/currency';

type SpecialFoodType = {
  title: string;
  titleRecipes: string;
  titleTop: string;
  description: string;
  viewAll: string;
  addToCart: string;
  readRecipe: string;
  chefNote: string;
  items: {
    name: string;
    tag: string;
    price: number;
    imageUrl: string;
  }[];
};

export default function SpecialFoods() {
  const dict = useDictionary();
  const params = useParams();
  const locale = params.locale as string;
  const specialDict = dict.specialFood as SpecialFoodType;

  return (
    <section className="relative bg-[#FAFAFA] py-24 pb-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-md text-left">
             <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-primary font-bold uppercase tracking-widest text-sm mb-2 block"
            >
              {specialDict.title}
            </motion.span>
            <h2 className="text-4xl font-black uppercase text-zinc-900 md:text-5xl leading-tight">
              {specialDict.titleRecipes} <br />
              <span className="text-primary">{(specialDict as any).titleTop}</span>
            </h2>
          </div>
          <button className="rounded-full border-2 border-zinc-200 px-8 py-3 text-sm font-bold uppercase tracking-widest text-zinc-900 transition-all hover:bg-zinc-900 hover:text-white">
            {specialDict.viewAll}
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {(specialDict?.items || []).map((item: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative flex flex-col items-center bg-white p-6 transition-all"
            >
              {/* Image with background blob */}
              <div className="relative mb-8 h-64 w-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-40 bg-zinc-100 rounded-full scale-110 opacity-50 group-hover:scale-125 transition-transform duration-700" />
                <img
                  src={item.imageUrl.startsWith('http') ? item.imageUrl : `${process.env.NEXT_PUBLIC_API_URL}${item.imageUrl}`}
                  alt={item.name}
                  className="relative z-10 h-full w-auto object-contain transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                />
                
                {/* Floating Price Tag */}
                <div className="absolute right-0 top-0 z-20 flex px-3 py-2 items-center justify-center rounded-full bg-primary text-sm font-black text-white shadow-xl opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                    {formatPrice(item.price, locale)}
                </div>
              </div>

              <div className="w-full space-y-3 text-center">
                <div className="flex items-center justify-center gap-2">
                    <span className="h-px w-8 bg-zinc-300" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                        {item.tag}
                    </span>
                    <span className="h-px w-8 bg-zinc-300" />
                </div>
                <h3 className="text-2xl font-black text-zinc-900 uppercase group-hover:text-primary transition-colors">{item.name}</h3>
                <p className="text-zinc-500 text-sm">{(specialDict as any).chefNote}</p>
                <div className="pt-4">
                    <button className="text-sm font-bold uppercase tracking-tight text-zinc-900 border-b-2 border-primary pb-1 hover:text-primary transition-colors">
                        {(specialDict as any).readRecipe}
                    </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
