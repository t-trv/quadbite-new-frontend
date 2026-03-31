'use client';

import { Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

const socialLinks = [
  {
    id: 'zalo',
    name: 'Zalo',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17.65 15.65C17.07 16.23 16.31 16.59 15.48 16.73C14.61 16.88 13.72 16.89 12.85 16.76C12.01 16.63 11.23 16.3 10.57 15.79C10.02 15.37 9.57 14.85 9.24 14.25C8.82 13.48 8.63 12.63 8.68 11.78C8.74 10.93 9.04 10.12 9.54 9.42C10.04 8.72 10.72 8.16 11.51 7.82C12.3 7.48 13.17 7.37 14.02 7.51C14.87 7.65 15.66 8.03 16.3 8.6C16.94 9.17 17.41 9.9 17.64 10.71C17.87 11.52 17.86 12.38 17.61 13.19C17.36 14 16.88 14.73 16.23 15.28C16.23 15.28 17.65 15.65 17.65 15.65ZM12.18 10.72C11.83 10.72 11.54 11.01 11.54 11.36V13.91C11.54 14.26 11.83 14.55 12.18 14.55H14.73C15.08 14.55 15.37 14.26 15.37 13.91V11.36C15.37 11.01 15.08 10.72 14.73 10.72H12.18Z" />
      </svg>
    ),
    href: 'https://zalo.me/0862163122',
    color: 'bg-[#0068FF]',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    href: 'https://www.facebook.com/van.voan.5076/',
    color: 'bg-[#1877F2]',
  },
];

export default function SocialLinks() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-10 right-10 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="flex flex-col gap-4"
          >
            {socialLinks.map((link) => (
              <motion.a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                className={`${link.color} flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl transition-all hover:brightness-110 group relative`}
              >
                {link.icon}
                <span className="absolute right-full mr-4 rounded-xl bg-white/10 backdrop-blur-md px-4 py-2 text-sm font-bold text-zinc-900 border border-white/20 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all shadow-xl">
                  {link.name}
                </span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-2xl shadow-primary/40 ring-4 ring-white relative overflow-hidden group"
      >
        <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            className="flex items-center justify-center"
        >
            <Phone size={28} className={isOpen ? 'hidden' : 'block'} />
            <span className={`text-3xl font-bold leading-none ${isOpen ? 'block' : 'hidden'}`}>+</span>
        </motion.div>
        
        {/* Pulse effect */}
        {!isOpen && (
             <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-25" />
        )}
      </motion.button>
    </div>
  );
}
