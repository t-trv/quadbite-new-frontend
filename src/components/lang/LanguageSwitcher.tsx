'use client';
import { usePathname, useRouter } from 'next/navigation';
import { i18n } from '@/config/i18n';

export default function LanguageSwitcher({ current }: { current: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (locale: string) => {
    // Thay locale đầu tiên trong path
    const newPath = pathname.replace(/^\/(vi|en)/, `/${locale}`);
    router.push(newPath);
  };

  return (
    <div>
      {i18n.locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          style={{ fontWeight: locale === current ? 'bold' : 'normal' }}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
