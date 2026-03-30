'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useDictionary } from '@/contexts/DictionaryContext';
import { Search, ShoppingBag, LogOut, User as UserIcon, ChevronDown, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useUserStore } from '@/stores/user';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

interface NavItem {
  title: string;
  href: string;
  children?: NavItem[];
}

const NavMenuItem = ({ 
  item, 
  depth = 0, 
  locale,
  onClose
}: { 
  item: NavItem; 
  depth?: number; 
  locale: string;
  onClose: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (itemRef.current && !itemRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const router = useRouter();

  const handleToggle = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else {
      const href = item.href;
      if (href.startsWith('http')) {
        window.location.href = href;
      } else {
        // Prepend locale if it's not already there
        const targetHref = href.startsWith(`/${locale}`) ? href : `/${locale}${href}`;
        router.push(targetHref);
      }
      onClose();
    }
  };

  return (
    <div ref={itemRef} className={`relative ${depth === 0 ? 'py-4' : 'w-full'}`}>
      <button
        onClick={handleToggle}
        className={`flex w-full items-center justify-between gap-1 text-sm font-semibold uppercase tracking-widest transition-colors ${
          depth === 0 
            ? (isOpen ? 'text-primary' : 'text-zinc-800 hover:text-primary')
            : `px-4 py-3 hover:bg-zinc-50 hover:text-primary ${isOpen ? 'bg-zinc-50 text-primary' : 'text-zinc-600'}`
        }`}
      >
        <span className="flex items-center gap-1 text-left">
          {item.title}
          {depth === 0 && hasChildren && (
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={14} />
            </motion.span>
          )}
        </span>
        {depth > 0 && hasChildren && (
          <ChevronRight size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
        )}
      </button>

      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`overflow-hidden ${
              depth === 0 
                ? 'absolute left-0 top-full pt-2 z-50' 
                : 'pl-4 border-l border-zinc-100 ml-4 mt-1'
            }`}
          >
            <div className={`${depth === 0 ? 'w-64 rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-black/5' : 'w-full'}`}>
              <div className="grid gap-1">
                {item.children?.map((child, idx) => (
                  <NavMenuItem 
                    key={idx} 
                    item={child} 
                    depth={depth + 1} 
                    locale={locale}
                    onClose={() => {
                      if (depth === 0) setIsOpen(false);
                      onClose();
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function AppHeader() {
  const dict = useDictionary();
  const { user, logout } = useUserStore();
  const params = useParams();
  const locale = params.locale as string;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-3xl font-black italic tracking-tighter text-primary">
            {dict.common.brand}
          </div>
          <div className="h-10 w-32 animate-pulse rounded-3xl bg-zinc-100" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href={`/${locale}`}>
            <div className="text-3xl font-black italic tracking-tighter text-primary">
              {dict.common.brand}
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden items-center gap-10 lg:flex">
          {Object.entries(dict.header.nav).map(([key, value]: [string, any]) => {
            const item: NavItem = typeof value === 'object' 
              ? value 
              : { title: value, href: `/${locale}#${key}` };

            return (
              <NavMenuItem 
                key={key} 
                item={item} 
                locale={locale}
                onClose={() => {}} 
              />
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          <button className="text-zinc-800 transition-colors hover:text-primary cursor-pointer">
            <Search size={24} />
          </button>
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 overflow-hidden rounded-full bg-zinc-100 border border-zinc-200">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <UserIcon size={16} className="text-zinc-400" />
                    </div>
                  )}
                </div>
                <span className="text-sm font-bold text-zinc-900 hidden md:block">
                  {user.name}
                </span>
              </div>
              
              <button 
                onClick={logout}
                className="text-zinc-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link href={`/${locale}/signin`}>
              <Button className="rounded-3xl" size="sm">
                {dict.common.login}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
