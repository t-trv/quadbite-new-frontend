'use client';

import AuthLayout from '../_components/AuthLayout';
import { useDictionary } from '@/contexts/DictionaryContext';
import { use } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import api from '@/utils/api';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'next/navigation';

export default function SignInPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const dict = useDictionary();
  const authDict = dict.auth as any;
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());

      // The user will fill the actual API URL here
      const response = await api.post('/auth/login', data);
      console.log('Sign in success:', response.data);
      
      // Save user to store
      setUser(response.data.data || response.data); // Adjust based on API structure
      
      // Redirect to home or dashboard
      router.push(`/${locale}`);
      
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout locale={locale}>
      <form onSubmit={handleSubmit} className="space-y-8 flex flex-col h-full">
        <div className="space-y-6 flex-1">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-zinc-400 text-sm font-medium">{authDict.emailLabel}</label>
            <input
              name="text"
              type="text"
              placeholder={authDict.emailPlaceholder}
              className="w-full bg-transparent border-b border-zinc-200 py-3 text-zinc-900 focus:border-yellow-400 outline-none transition-all placeholder:text-zinc-300"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-zinc-400 text-sm font-medium">{authDict.passwordLabel}</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={authDict.passwordPlaceholder}
                className="w-full bg-transparent border-b border-zinc-200 py-3 text-zinc-900 focus:border-yellow-400 outline-none transition-all placeholder:text-zinc-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <button type="button" className="text-zinc-900 font-bold hover:underline">
              {authDict.forgotPassword}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pb-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-zinc-900 font-black py-4 rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-95 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '...' : authDict.signIn}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
