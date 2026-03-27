import type { Locale } from '@/config/i18n';

const dictionaries = {
  vi: () => import('@/locales/vi.json').then((m) => m.default),
  en: () => import('@/locales/en.json').then((m) => m.default),
};

export const getDictionary = async (locale: Locale) => {
  const load = dictionaries[locale];
  if (!load) throw new Error(`No dictionary found for locale: "${locale}"`);
  return load();
};
