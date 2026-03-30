'use client';

import { motion } from 'framer-motion';
import { useDictionary } from '@/contexts/DictionaryContext';
import { ChevronRight } from 'lucide-react';

type CategoryItem = {
  name: string;
  description: string;
  image: string;
};

export default function Categories() {
  const dict = useDictionary();
  const catDict = dict.categories as any;

  return (
    <section className="relative bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-black uppercase text-zinc-900 md:text-5xl">
            {catDict.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {catDict.items.map((item: CategoryItem, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative flex flex-col items-center overflow-hidden rounded-[2.5rem] bg-zinc-900 p-8 pb-12 text-center transition-all hover:bg-zinc-800"
            >
              {/* Circular Image with Hover Effect */}
              <div className="relative mb-8 h-48 w-48 overflow-hidden rounded-full border-4 border-zinc-800 shadow-2xl transition-transform duration-500 group-hover:scale-110">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </div>

              <h3 className="mb-4 text-2xl font-black text-white uppercase">{item.name}</h3>
              <p className="mb-8 text-zinc-400 text-sm leading-relaxed">{item.description}</p>

              <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-primary transition-colors">
                {catDict.viewMore}
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 group-hover:bg-primary transition-colors">
                  <ChevronRight size={14} className="text-white" />
                </div>
              </button>

              {/* Subtle Overlay Pattern */}
              <div className="absolute inset-0 z-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
