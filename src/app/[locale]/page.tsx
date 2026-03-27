'use client';

import { useDictionary } from '@/contexts/DictionaryContext';
import LanguageSwitcher from '@/components/lang/LanguageSwitcher';

export default function Home() {
  const dict = useDictionary();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="space-y-4">
        <LanguageSwitcher current={dict.current} />
        <h1>{dict.home.title}</h1>
        <p>{dict.home.description}</p>
      </main>
    </div>
  );
}
