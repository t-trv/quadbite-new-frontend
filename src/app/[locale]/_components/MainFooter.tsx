'use client';

import { useDictionary } from '@/contexts/DictionaryContext';

export default function MainFooter() {
  const dict = useDictionary();
  const footerDict = dict.footer as any;

  return (
    <footer className="bg-zinc-950 px-6 py-24 text-zinc-300">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          <div className="col-span-1 lg:col-span-1">
            <div className="text-3xl font-black italic tracking-tighter text-white">
              <span className="text-primary">@</span>
              {(dict.common.brand || 'Quadbite').toLowerCase()}
            </div>
            <p className="mt-6 text-zinc-400">
              {footerDict?.about?.description || footerDict?.description || 'Delicious food delivery.'}
            </p>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">
              {footerDict?.quickLinks?.title || 'Links'}
            </h4>
            <ul className="space-y-4 text-zinc-400">
              {Object.keys(footerDict?.quickLinks || {}).filter(k => k !== 'title').map((key) => (
                <li key={key}>
                  <a href="#" className="transition-colors hover:text-primary">
                    {footerDict.quickLinks[key]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">
              {footerDict?.support?.title || 'Support'}
            </h4>
            <ul className="space-y-4 text-zinc-400">
              {(footerDict?.supportLinks as string[] || []).map((item) => (
                <li key={item}>
                  <a href="#" className="transition-colors hover:text-primary">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">
              {footerDict?.newsletter?.title || 'Newsletter'}
            </h4>
            <p className="mb-4 text-zinc-400">{footerDict?.newsletter?.description || 'Subscribe for updates.'}</p>
            <div className="flex overflow-hidden rounded-full bg-zinc-800">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-transparent px-6 py-3 text-sm outline-none"
              />
              <button className="bg-primary px-6 py-3 font-bold transition-colors hover:bg-primary">
                {footerDict?.newsletter?.button || 'Join'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-zinc-900 pt-12 text-center text-sm text-zinc-500">
          <p>
            &copy; {new Date().getFullYear()} {dict.common.brand || 'Quadbite'}. {footerDict?.copyright || 'All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
