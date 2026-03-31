'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useDictionary } from '@/contexts/DictionaryContext';
import { Search, ShoppingBag, LogOut, User as UserIcon, ChevronDown, ChevronRight, Users, Settings } from 'lucide-react';
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
        className={`flex w-full items-center justify-between gap-1 text-[13px] font-black uppercase tracking-tight transition-colors whitespace-nowrap ${
          depth === 0 
            ? (isOpen ? 'text-primary' : 'text-zinc-800 hover:text-primary')
            : `px-4 py-2 rounded-lg hover:bg-zinc-50 hover:text-primary ${isOpen ? 'bg-zinc-50 text-primary' : 'text-zinc-600'}`
        }`}
      >
        <span className="flex items-center gap-1 text-left">
          {item.title}
        </span>
        {hasChildren && (
          depth === 0 ? (
            <ChevronDown 
              size={14} 
              className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'text-zinc-400'}`} 
            />
          ) : (
            <ChevronRight 
              size={14} 
              className={`transition-transform duration-300 ${isOpen ? 'rotate-90 text-primary' : 'text-zinc-400'}`} 
            />
          )
        )}
      </button>

      {/* Submenu */}
      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`absolute ${depth === 0 ? 'left-0 mt-2' : 'left-full top-0 ml-1'} z-10`}
          >
            <div className={`${depth === 0 ? 'min-w-[200px] rounded-2xl bg-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-black/5' : 'w-48 rounded-xl bg-white p-2 shadow-xl ring-1 ring-black/5'}`}>
              <div className="flex flex-col gap-1">
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
  const router = useRouter();
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

  // Dynamic nav items from header.home (Mega Menu)
  const homeNav = (dict.header as any).home || {};
  const navItems: NavItem[] = Object.entries(homeNav).map(([key, value]: [string, any]) => ({
    title: value.title,
    href: value.href || '#',
    children: value.children
  }));

  // Add Cart as a top-level item if not present in homeNav
  if (!navItems.find(item => item.title === (dict.header.nav as any).cart)) {
    navItems.push({
      title: (dict.header.nav as any).cart,
      href: '/app/cart'
    });
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-zinc-100">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-2 md:py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href={`/${locale}`}>
            <div className="text-3xl font-black italic tracking-tighter text-primary">
              {dict.common.brand}
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden items-center gap-4 xl:gap-8 lg:flex">
          {navItems.map((item, index) => {
            const href = item.href.startsWith('http') ? item.href : `/${locale}${item.href}`;
            const targetItem: NavItem = { 
              ...item,
              href 
            };

            return (
              <NavMenuItem 
                key={index} 
                item={targetItem} 
                locale={locale}
                onClose={() => {}} 
              />
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3 md:gap-6">
          <button className="text-zinc-800 transition-colors hover:text-primary cursor-pointer hidden sm:block">
            <Search size={22} />
          </button>
          
          {user ? (
            <div className="flex items-center gap-2 md:gap-4">
              <div 
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-all"
                onClick={() => router.push(`/${locale}/app/user/profile`)}
              >
                <div className="h-9 w-9 overflow-hidden rounded-full bg-zinc-100 border-2 border-primary/20">
                  {user.avatar_url ? (
                    <img src={`${process.env.NEXT_PUBLIC_API_URL}${user.avatar_url}`} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <UserIcon size={16} className="text-zinc-400" />
                    </div>
                  )}
                </div>
                <span className="text-sm font-black text-zinc-900 hidden md:block whitespace-nowrap">
                  {user.name}
                </span>
              </div>
              
              {user.roles?.includes('staff') && (
                <button className="p-2 text-zinc-400 hover:text-primary transition-colors" title={dict.header?.nav?.staff}>
                  <Users size={20} />
                </button>
              )}

              {user.roles?.includes('admin') && (
                <button className="p-2 text-zinc-400 hover:text-primary transition-colors" title={dict.header?.nav?.admin}>
                  <Settings size={20} />
                </button>
              )}

              <button 
                onClick={logout}
                className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link href={`/${locale}/signin`}>
              <Button className="rounded-3xl px-6" size="sm">
                {dict.common.login}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
