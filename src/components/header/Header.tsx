'use client';
import { ShoppingCart, Users, Settings, LogOut, User as UserIcon } from 'lucide-react';
import { useUserStore } from '@/stores/user';
import { useCartStore } from '@/stores/cart';
import { useDictionary } from '@/contexts/DictionaryContext';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

interface HeaderProps {
  activeMainCategory?: string;
  onMainCategoryChange?: (id: string) => void;
}

export default function Header({ activeMainCategory, onMainCategoryChange }: HeaderProps) {
  const { user } = useUserStore();
  const { items } = useCartStore();
  const dict = useDictionary();
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  const mainCategories = [
    { id: 'main-food', name: 'Món chính' },
    { id: 'dessert', name: 'Tráng miệng' },
    { id: 'drink', name: 'Đồ uống' },
  ];

  const handleClick = (id: string) => {
    if (onMainCategoryChange) {
      onMainCategoryChange(id);
    } else {
      router.push(`/${locale}/app/shop?category=${id}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-zinc-100">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
        {/* Brand */}
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="text-3xl font-black italic tracking-tighter text-primary">
            Quad<span className="text-zinc-900">Bite</span>
          </div>
        </Link>

        {/* Categories Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {mainCategories.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => handleClick(cat.id)}
              className={`text-sm font-bold transition-all relative py-1 ${
                activeMainCategory === cat.id ? 'text-primary' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {cat.name}
              {activeMainCategory === cat.id && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full transition-all" />
              )}
            </button>
          ))}
        </nav>

        {/* User & Actions */}
        <div className="flex items-center gap-6">
          {user && (
            <div
              className="flex items-center gap-3 cursor-pointer group/avatar"
              onClick={() => router.push(`/${locale}/app/user/profile`)}
            >
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-zinc-900 group-hover/avatar:text-primary transition-colors">
                  {user.name}
                </div>
                <div className="text-xs text-zinc-500">{user.email}</div>
              </div>
              <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary/20 group-hover/avatar:border-primary transition-all shadow-sm">
                {user.avatar_url ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${user.avatar_url}`}
                    alt={user.name}
                    className="h-full w-full object-cover transition-transform group-hover/avatar:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-zinc-100">
                    <UserIcon size={20} className="text-zinc-400" />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button
              onClick={() => router.push(`/${locale}/app/cart`)}
              size="sm"
              variant="primary"
              className="rounded-full flex items-center gap-2 bg-red-600 hover:bg-red-700"
            >
              <ShoppingCart size={18} />
              <span className="hidden sm:inline">Giỏ hàng</span>
              {items.length > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-red-600">
                  {items.length}
                </span>
              )}
            </Button>

            {user?.roles?.includes('staff') && (
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full flex items-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800"
              >
                <Users size={18} />
                <span className="hidden sm:inline">Nhân viên</span>
              </Button>
            )}

            {user?.roles?.includes('admin') && (
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full flex items-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800"
              >
                <Settings size={18} />
                <span className="hidden sm:inline">Quản trị</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
