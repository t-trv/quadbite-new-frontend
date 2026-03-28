'use client';

import { motion } from 'framer-motion';
import { useDictionary } from '@/contexts/DictionaryContext';
import { Pizza, Utensils, Coffee, UtensilsCrossed, Apple, Sandwich } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AuthLayout({ children, locale }: { children: React.ReactNode, locale: string }) {
  const dict = useDictionary();
  const authDict = dict.auth as any;
  const pathname = usePathname();
  
  const isSignIn = pathname.includes('signin');

  return (
    <div className="min-h-screen bg-[#3E3D32] flex items-center justify-center p-0 md:p-6 font-sans">
      <div className="w-full max-w-md bg-white min-h-[100vh] md:min-h-[85vh] md:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Top Header Section */}
        <div className="h-[40%] flex flex-col items-center justify-center relative p-8">
          
          {/* Floating Icons Circle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[Pizza, Utensils, Coffee, UtensilsCrossed, Apple, Sandwich].map((Icon, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * idx, type: 'spring' }}
                className="absolute"
                style={{
                  transform: `rotate(${idx * 60}deg) translateY(-85px) rotate(-${idx * 60}deg)`
                }}
              >
                <div className="p-2 bg-white rounded-xl shadow-sm border border-zinc-100">
                    <Icon size={20} className="text-primary" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="z-10 text-center flex flex-col items-center">
             <div className="mb-4">
                <div className="w-20 h-20 rounded-full border-2 border-primary flex items-center justify-center p-3">
                   <UtensilsCrossed size={40} className="text-primary" />
                </div>
             </div>
             <h1 className="text-4xl font-serif text-zinc-900 leading-none">Quadbite</h1>
             <p className="text-primary font-medium tracking-wide mt-1 uppercase text-xs">
                {authDict.foodDeliveryApp}
             </p>
          </div>
        </div>

        {/* Form Section / Tab Section */}
        <div className="flex-1 bg-white md:rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.05)] relative z-20 flex flex-col">
          
          {/* Tabs */}
          <div className="flex px-12 pt-12">
            <Link 
              href={`/${locale}/signin`}
              className={`flex-1 text-center pb-4 text-xl font-bold transition-all relative ${
                isSignIn ? 'text-zinc-900' : 'text-zinc-400'
              }`}
            >
              {authDict.signIn}
              {isSignIn && (
                <motion.div 
                    layoutId="auth-tab" 
                    className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-yellow-400 rounded-full" 
                />
              )}
            </Link>
            <Link 
              href={`/${locale}/signup`}
              className={`flex-1 text-center pb-4 text-xl font-bold transition-all relative ${
                !isSignIn ? 'text-zinc-900' : 'text-zinc-400'
              }`}
            >
              {authDict.signUp}
              {!isSignIn && (
                <motion.div 
                    layoutId="auth-tab" 
                    className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-yellow-400 rounded-full" 
                />
              )}
            </Link>
          </div>

          <div className="flex-1 p-12 pt-8 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
