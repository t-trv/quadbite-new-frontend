'use client';
import { useState } from 'react';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useUserStore } from '@/stores/user';
import api from '@/utils/api';
import Button from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());

      const response = await api.post('/auth/login', data);
      
      setUser(response.data.data || response.data);
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-zinc-900">Đăng nhập</h2>
                  <p className="text-zinc-500 text-sm mt-1">Vui lòng đăng nhập để tiếp tục thanh toán</p>
                </div>
                <button 
                  onClick={onClose}
                  className="h-10 w-10 flex items-center justify-center rounded-2xl hover:bg-zinc-100 text-zinc-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-zinc-400 text-xs font-black uppercase tracking-widest">Tài khoản / Email</label>
                  <input
                    name="text"
                    type="text"
                    placeholder="Nhập tài khoản của bạn"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-3.5 text-zinc-900 focus:border-red-500 outline-none transition-all placeholder:text-zinc-300 font-medium"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-zinc-400 text-xs font-black uppercase tracking-widest">Mật khẩu</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-3.5 text-zinc-900 focus:border-red-500 outline-none transition-all placeholder:text-zinc-300 font-medium"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    size="md"
                    disabled={loading}
                    className="w-full rounded-2xl shadow-xl shadow-red-100 uppercase tracking-widest font-black"
                  >
                    {loading ? <Loader2 className="animate-spin" size={24} /> : 'Đăng nhập ngay'}
                  </Button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-zinc-400 text-sm">
                  Chưa có tài khoản?{' '}
                  <button className="text-zinc-900 font-bold hover:underline">
                    Đăng ký ngay
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
