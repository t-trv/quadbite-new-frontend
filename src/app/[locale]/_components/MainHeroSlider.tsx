'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useDictionary } from '@/contexts/DictionaryContext';

type SliderType = {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  imageUrl: string;
};

export default function MainHeroSlider() {
  const dict = useDictionary();
  const sliders = dict.sliders as SliderType[];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((prev: number) => (prev === sliders.length - 1 ? 0 : prev + 1));
    }, 10000);
    return () => clearTimeout(timer);
  }, [current, sliders.length]);

  return (
    <section className="relative h-[90vh] w-full overflow-hidden bg-zinc-950">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="relative h-full w-full"
        >
          <div className="mx-auto flex h-full max-w-7xl flex-col items-center px-6 md:flex-row">
            {/* Text side */}
            <div className="z-20 flex-1 space-y-6 pt-20 text-center md:text-left">
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-6xl font-black leading-none text-white md:text-8xl"
              >
                Best food in <br />
                <span className="text-primary italic">your city</span>
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="max-w-md text-lg text-zinc-400"
              >
                {sliders[current].description}
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start"
              >
                <button className="rounded-full bg-primary px-10 py-4 text-lg font-bold text-white shadow-xl transition-all hover:scale-105 hover:bg-primary/90 active:scale-95">
                  Order Online
                </button>
                <button className="rounded-full border-2 border-zinc-700 bg-transparent px-10 py-4 text-lg font-bold text-white transition-all hover:bg-zinc-800 active:scale-95">
                  Book a Table
                </button>
              </motion.div>
            </div>

            {/* Image side */}
            <div className="relative flex flex-1 items-center justify-center pt-10 md:pt-0">
              <div className="relative z-10">
                {/* Sketchy Doodles - SVG */}
                <div className="absolute -left-12 -top-12 h-24 w-24 animate-pulse text-primary opacity-60">
                  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10,50 Q25,25 50,10 T90,50 Q75,75 50,90 T10,50" />
                    <path d="M30,30 L40,40 M60,60 L70,70" />
                  </svg>
                </div>
                <div className="absolute -right-8 -bottom-8 h-20 w-20 text-green-500 opacity-60">
                   <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20,80 C40,60 60,100 80,80" />
                    <path d="M40,20 L50,30 L60,10" />
                  </svg>
                </div>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ duration: 1, type: 'spring' }}
                >
                  <img
                    src={sliders[current].imageUrl}
                    alt="Delicious Dish"
                    className="h-auto w-full max-w-lg drop-shadow-[0_25px_50px_rgba(227,0,27,0.3)]"
                  />
                </motion.div>
              </div>

              {/* Background Glow */}
              <div className="absolute inset-0 z-0 bg-primary/10 blur-[120px]" />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation dots */}
      <div className="absolute bottom-8 right-12 z-30 flex gap-2">
        {sliders.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 transition-all duration-500 ${
              current === idx ? 'w-10 bg-primary' : 'w-2 bg-zinc-700'
            } rounded-full`}
          />
        ))}
      </div>
    </section>
  );
}
