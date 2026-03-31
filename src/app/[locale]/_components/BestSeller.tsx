'use client';

import { motion } from 'framer-motion';
import { useDictionary } from '@/contexts/DictionaryContext';

export default function BestSeller() {
  const dict = useDictionary();
  const bestDict = dict.bestSeller as any;

  return (
    <section className="relative overflow-hidden bg-zinc-900 py-32">

      <div className="mx-auto max-w-7xl px-6 relative z-20">
        <div className="flex flex-col items-center text-center">
            {/* Offer Tag */}
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="mb-8 rounded-full bg-primary/20 px-6 py-2 text-primary font-black uppercase tracking-widest text-sm border border-primary/30"
            >
                {bestDict?.offer || 'Special Offer'}
            </motion.div>

          {/* Main Content */}
          <div className="max-w-3xl space-y-8">
            <h2 className="text-5xl font-black uppercase leading-none text-white md:text-7xl">
              {bestDict?.title || 'Get'} <span className="text-primary italic">{bestDict?.titlePercent || 'Discount'}</span> <br />
              {bestDict?.titleSeason || 'Today!'}
            </h2>
            <p className="mx-auto max-w-lg text-lg text-zinc-400">
              {bestDict?.description || 'Healthy and delicious meals delivered to your door.'}
            </p>
            <button className="rounded-full bg-primary px-12 py-5 text-lg font-bold uppercase tracking-widest text-white transition-all hover:scale-105 hover:bg-primary/90 active:scale-95 shadow-[0_10px_30px_rgba(227,0,27,0.4)]">
              {bestDict?.exploreNow || 'Explore Now'}
            </button>
          </div>

          {/* Large Salad Image */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
            <motion.div
              initial={{ opacity: 0, y: 50, rotate: 5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, type: 'spring' }}
            >
              <img
                src={bestDict?.imageUrl?.startsWith('http') ? bestDict.imageUrl : (bestDict?.imageUrl ? `${process.env.NEXT_PUBLIC_API_URL}${bestDict.imageUrl}` : 'https://i.pinimg.com/736x/a7/87/b8/a787b8db5d4704bdd31e42c753bc3415.jpg')}
                alt="Healthy Salad"
                className="relative z-10 h-auto w-full max-w-2xl drop-shadow-[0_25px_50px_rgba(0,0,0,0.5)]"
              />
            </motion.div>
            
            {/* Sketchy Doodles Around Image */}
            <div className="absolute -top-10 -right-10 hidden lg:block opacity-40">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="2">
                    <path d="M10,10 C30,40 20,70 50,50 C80,30 70,80 90,90" />
                </svg>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
