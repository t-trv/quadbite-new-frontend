'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';
import { useUserStore } from '@/stores/user';
import { useParams, useRouter } from 'next/navigation';
import { 
  Package, 
  ChevronRight, 
  Loader2, 
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import Header from '@/components/header/Header';
import Button from '@/components/ui/Button';

const fetchUserOrders = async (userId: number) => {
  const { data } = await api.get(`/users/${userId}/orders`);
  return data.data;
};

const StatusBadge = ({ status }: { status: any }) => {
  const statusId = status?.id;
  const statusName = status?.name;

  switch (statusId) {
    case 'confirmed':
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 border border-green-100 text-xs font-black uppercase tracking-wider">
          <CheckCircle2 size={14} />
          {statusName}
        </div>
      );
    case 'cancelled':
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-100 text-xs font-black uppercase tracking-wider">
          <XCircle size={14} />
          {statusName}
        </div>
      );
    case 'pending':
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-100 text-xs font-black uppercase tracking-wider">
          <Clock size={14} />
          {statusName}
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-50 text-zinc-600 border border-zinc-100 text-xs font-black uppercase tracking-wider">
          <AlertCircle size={14} />
          {statusName || 'Đang xử lý'}
        </div>
      );
  }
};

export default function OrderHistoryPage() {
  const { user } = useUserStore();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const userId = user?.id;

  // Protect route
  useEffect(() => {
    if (!user) {
      router.push(`/${locale}/app/shop`);
    }
  }, [user, router, locale]);

  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['userOrders', userId],
    queryFn: () => fetchUserOrders(userId!),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-400">
          <Loader2 className="animate-spin" size={48} />
          <p className="font-bold">Đang tải lịch sử đơn hàng...</p>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-6">
          <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center text-red-500">
            <XCircle size={40} />
          </div>
          <h2 className="text-2xl font-black text-zinc-900">Đã có lỗi xảy ra!</h2>
          <p className="text-zinc-500 max-w-md">Không thể tải danh sách đơn hàng của bạn lúc này. Vui lòng thử lại sau.</p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-4xl px-6 py-12">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 mb-2 tracking-tight">Lịch sử đơn hàng</h1>
            <p className="text-zinc-500 font-bold">Quản lý và theo dõi các đơn hàng của bạn</p>
          </div>
          <div className="h-14 w-14 bg-white rounded-2xl border border-zinc-100 shadow-sm flex items-center justify-center text-zinc-400">
            <ShoppingBag size={28} />
          </div>
        </div>

        {orders?.length === 0 ? (
          <div className="bg-white rounded-[40px] p-20 border border-zinc-100 text-center shadow-xl shadow-zinc-200/50">
            <div className="h-24 w-24 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-200 mx-auto mb-6">
              <ShoppingBag size={48} />
            </div>
            <h2 className="text-2xl font-black text-zinc-900 mb-4">Chưa có đơn hàng nào</h2>
            <p className="text-zinc-500 mb-8 max-w-xs mx-auto">Bạn chưa thực hiện bất kỳ giao dịch nào. Hãy bắt đầu mua sắm ngay!</p>
            <Button onClick={() => router.push(`/${locale}/app/shop`)} size="lg" className="rounded-2xl px-12">
              Khám phá menu
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders?.map((order: any) => (
              <div 
                key={order.orderId}
                className="bg-white rounded-[32px] border border-zinc-100 shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 transition-all group overflow-hidden"
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 font-black italic">
                        #{order.orderId}
                      </div>
                      <div>
                        <div className="text-xs text-zinc-400 font-black uppercase tracking-widest mb-1">Đơn hàng</div>
                        <StatusBadge status={order.orderStatus} />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-zinc-400 font-black uppercase tracking-widest mb-1">Tổng cộng</div>
                      <div className="text-xl font-black text-zinc-900">
                        {new Intl.NumberFormat('vi-VN').format(Number(order.totalPrice))}đ
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-zinc-50 mb-6" />

                  <div className="space-y-4 mb-8">
                    {order.orderItems?.slice(0, 2).map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="h-16 w-16 min-w-[64px] rounded-xl overflow-hidden border border-zinc-100 bg-zinc-50">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-zinc-200">
                              <Package size={24} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-black text-zinc-900 truncate">{item.name}</div>
                          <div className="text-xs text-zinc-500 font-bold">
                            {item.variant} | SL: {item.quantity}
                          </div>
                        </div>
                        <div className="font-black text-zinc-900 hidden sm:block">
                          {new Intl.NumberFormat('vi-VN').format(Number(item.price))}đ
                        </div>
                      </div>
                    ))}
                    {order.orderItems?.length > 2 && (
                      <div className="text-xs text-zinc-400 font-bold pl-20">
                        và {order.orderItems.length - 2} món ăn khác...
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={() => router.push(`/${locale}/app/order/success/${order.orderId}`)}
                      className="flex-1 rounded-2xl bg-zinc-900 text-white font-black py-4 hover:bg-zinc-800 transition-all active:scale-95"
                    >
                      Chi tiết đơn hàng
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => router.push(`/${locale}/app/shop`)}
                      className="flex-1 rounded-2xl bg-white border border-zinc-200 text-zinc-600 font-black py-4 hover:bg-zinc-50 transition-all active:scale-95"
                    >
                      Đặt lại món này
                      <ChevronRight size={20} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
