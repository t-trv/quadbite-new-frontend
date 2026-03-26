'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      label: 'Cài đặt chung',
      href: '/app/settings',
    },
    {
      label: 'Tài khoản',
      href: '/app/settings/account',
    },
    {
      label: 'Thông báo',
      href: '/app/settings/notification',
    },
  ];

  return (
    <div className="flex gap-2">
      {navItems.map((item) => (
        <button
          key={item.href}
          onClick={() => router.push(item.href)}
          disabled={pathname === item.href}
          className={`px-3 py-2 text-xs font-medium rounded-lg ${pathname === item.href ? 'bg-primary text-white' : 'bg-gray-200 cursor-pointer'}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
