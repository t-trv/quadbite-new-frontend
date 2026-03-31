'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import api from '@/utils/api';
import { useUserStore } from '@/stores/user';
import { useParams, useRouter } from 'next/navigation';
import {
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  Calendar,
  Loader2,
  ChevronLeft,
  Settings,
  LogOut,
  CheckCircle2,
  ShoppingBag,
} from 'lucide-react';
import Header from '@/components/header/Header';
import Button from '@/components/ui/Button';
import Upload from '@/components/ui/Upload';
import { useDictionary } from '@/contexts/DictionaryContext';

const fetchUserProfile = async (userId: number) => {
  const { data } = await api.get(`/users/${userId}`);
  return data.data;
};

export default function UserProfilePage() {
  const dict = useDictionary();
  const { user: storeUser, setUser, logout } = useUserStore();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const userId = storeUser?.id;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Protect route
  useEffect(() => {
    if (!storeUser) {
      router.push(`/${locale}/app/shop`);
    } else if (!isEditing) {
      // Sync form with store when not editing
      setFormData({
        name: storeUser.name,
        email: storeUser.email,
        phone: storeUser.phone,
      });
      setPreviewUrl(null);
      setImageFile(null);
    }
  }, [storeUser, router, locale, isEditing]);

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => fetchUserProfile(userId!),
    enabled: !!userId,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (vars: FormData) => {
      const { data } = await api.put(`/users/${userId}`, vars, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data.data;
    },
    onSuccess: (updatedUser: any) => {
      setUser(updatedUser);
      setIsEditing(false);
      refetch();
      toast.success(dict.common.successUpdate);
    },
    onError: (error: any) => {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || dict.common.errorUpdate);
    },
  });

  const handleUpdate = (e: React.MouseEvent | React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    if (imageFile) {
      data.append('image', imageFile);
    }
    updateProfileMutation.mutate(data);
  };

  const handleLogout = () => {
    logout();
    router.push(`/${locale}/app/shop`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-400">
          <Loader2 className="animate-spin" size={48} />
          <p className="font-bold">{dict.profile.loading}</p>
        </main>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-6">
          <h2 className="text-2xl font-black text-zinc-900">
            {dict.profile.error}
          </h2>
          <Button onClick={() => router.push(`/${locale}/app/shop`)}>{dict.common.back}</Button>
        </main>
      </div>
    );
  }

  const creationDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : dict.profile.comingSoon;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans text-zinc-900">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-4xl px-6 py-12 lg:py-20">
        {/* Back Button */}
        <button
          onClick={() => (isEditing ? setIsEditing(false) : router.back())}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors mb-12 font-bold group"
        >
          <div className="h-8 w-8 rounded-full border border-zinc-200 flex items-center justify-center group-hover:bg-white group-hover:border-zinc-300 transition-all font-black uppercase">
            <ChevronLeft size={18} />
          </div>
          {isEditing ? dict.common.cancelEdit : dict.common.back}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Avatar & Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[40px] p-8 border border-zinc-100 shadow-xl shadow-zinc-200/50 text-center sticky top-24">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-primary/20 rounded-full scale-110 blur-2xl opacity-50" />
                <div
                  className={`h-40 w-40 rounded-full border-4 border-white shadow-xl overflow-hidden relative group block mx-auto ${isEditing ? 'cursor-pointer' : ''}`}
                >
                  {previewUrl || user.avatar_url ? (
                    <img
                      src={previewUrl || `${process.env.NEXT_PUBLIC_API_URL}${user.avatar_url}`}
                      alt={user.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full bg-zinc-50 flex items-center justify-center text-zinc-200">
                      <UserIcon size={64} />
                    </div>
                  )}
                  {isEditing ? (
                    <Upload
                      onChange={(file) => {
                        setImageFile(file);
                        setPreviewUrl(URL.createObjectURL(file));
                      }}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:opacity-100 transition-opacity duration-300 cursor-pointer w-full h-full"
                    >
                      <Settings className="text-white" size={24} />
                    </Upload>
                  ) : null}
                </div>
              </div>

              <h1 className="text-2xl font-black text-zinc-900 mb-1">{user.name}</h1>
              <p className="text-zinc-400 font-bold text-sm mb-6">@{user.username}</p>

              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {user.roles?.map((role: string) => (
                  <span
                    key={role}
                    className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase tracking-wider"
                  >
                    {role === 'admin'
                      ? dict.profile.roles.admin
                      : role === 'staff'
                        ? dict.profile.roles.staff
                        : dict.profile.roles.member}
                  </span>
                ))}
              </div>

              <div className="h-px bg-zinc-50 mb-8" />

              <div className="space-y-4">
                {isEditing ? (
                  <Button
                    type="button"
                    onClick={handleUpdate}
                    disabled={updateProfileMutation.isPending}
                    className="w-full rounded-2xl bg-primary py-4 font-black text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                  >
                    {updateProfileMutation.isPending ? (
                      <Loader2 className="animate-spin mr-2" size={18} />
                    ) : (
                      <CheckCircle2 size={18} className="mr-2" />
                    )}
                    {dict.common.save}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    variant="secondary"
                    className="w-full rounded-2xl border-2 border-zinc-100 py-4 font-black hover:bg-zinc-50"
                  >
                    <Settings size={18} className="mr-2" />
                    {dict.common.edit}
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-2xl bg-zinc-900 py-4 font-black text-white hover:bg-zinc-800"
                >
                  <LogOut size={18} className="mr-2" />
                  {dict.common.logout}
                </Button>

                <Button
                  type="button"
                  onClick={() => router.push(`/${locale}/app/order/history`)}
                  variant="outline"
                  className="w-full rounded-2xl border-2 border-zinc-100 py-4 font-black hover:bg-zinc-50"
                >
                  <ShoppingBag size={18} className="mr-2" />
                  {dict.profile.orderHistory}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[40px] p-10 border border-zinc-100 shadow-xl shadow-zinc-200/40">
              <h2 className="text-xl font-black text-zinc-900 mb-10 flex items-center gap-3">
                <UserIcon className="text-primary" size={24} />
                {dict.profile.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <Mail size={14} /> {dict.profile.email}
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-4 rounded-2xl bg-zinc-50 border-2 border-transparent focus:border-zinc-900 outline-none font-bold transition-all"
                    />
                  ) : (
                    <div className="text-lg font-bold text-zinc-900 break-all">{user.email}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <Phone size={14} /> {dict.profile.phone}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-4 rounded-2xl bg-zinc-50 border-2 border-transparent focus:border-zinc-900 outline-none font-bold transition-all"
                    />
                  ) : (
                    <div className="text-lg font-bold text-zinc-900">
                      {user.phone || dict.profile.notUpdated}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <UserIcon size={14} /> {dict.profile.fullName}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-4 rounded-2xl bg-zinc-50 border-2 border-transparent focus:border-zinc-900 outline-none font-bold transition-all"
                    />
                  ) : (
                    <div className="text-lg font-bold text-zinc-900">{user.name}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <Calendar size={14} /> {dict.profile.joinedDate}
                  </label>
                  <div className="text-lg font-bold text-zinc-600">{creationDate}</div>
                </div>
              </div>
            </div>

            {/* Quick Stats or Preferences? */}
            <div className="bg-linear-to-br from-red-600 to-red-700 rounded-[40px] p-10 text-white shadow-xl shadow-red-200/50">
              <h2 className="text-xl font-black mb-4">{dict.profile.vipTitle}</h2>
              <p className="text-red-100 font-medium mb-8 leading-relaxed opacity-90">
                {dict.profile.vipDesc}
              </p>
              <div className="flex gap-4">
                <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-3xl p-4 border border-white/20">
                  <div className="text-sm opacity-70 font-black uppercase tracking-tighter">
                    {dict.profile.points}
                  </div>
                  <div className="text-2xl font-black">2,450</div>
                </div>
                <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-3xl p-4 border border-white/20">
                  <div className="text-sm opacity-70 font-black uppercase tracking-tighter">
                    {dict.profile.membership}
                  </div>
                  <div className="text-2xl font-black">Gold</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
