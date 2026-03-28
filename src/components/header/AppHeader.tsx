'use client';

import { useDictionary } from '@/contexts/DictionaryContext';
import { Search, ShoppingBag, LogOut, User as UserIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useUserStore } from '@/stores/user';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AppHeader() {
  const dict = useDictionary();
  const { user, logout } = useUserStore();
  const params = useParams();
  const locale = params.locale as string;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="text-3xl font-black italic tracking-tighter text-primary">
          {dict.common.brand}
        </div>
      </div>

      {/* Navigation */}
      <nav className="hidden items-center gap-10 lg:flex">
        {Object.entries(dict.header.nav).map(([key, label]) => (
          <a
            key={key}
            href={`#${key}`}
            className="text-sm font-semibold uppercase tracking-widest text-zinc-800 hover:text-primary"
          >
            {label as string}
          </a>
        ))}
      </nav>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        <button className="text-zinc-800 transition-colors hover:text-primary cursor-pointer">
          <Search size={24} />
        </button>
        
        {mounted && user ? (
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
  );
}
