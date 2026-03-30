'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';
import { useRouter, useParams } from 'next/navigation';
import {
  CheckCircle2,
  Package,
  MapPin,
  Clock,
  ArrowRight,
  ShoppingBag,
  Loader2,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Suspense } from 'react';
import Header from '@/components/header/Header';

const fetchOrder = async (id: string) => {
  const { data } = await api.get(`/orders/${id}`);
  return data.data;
};

function OrderSuccessContent() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const orderId = params.id;

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrder(orderId as string),
    enabled: !!orderId,
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-400 py-40">
        <Loader2 className="animate-spin" size={48} />
        <p className="font-bold">Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 py-40 text-center">
        <h2 className="text-2xl font-bold text-zinc-900">
          {isError ? 'Đã có lỗi xảy ra!' : 'Không tìm thấy đơn hàng!'}
        </h2>
        <Button onClick={() => router.push(`/${locale}/app/shop`)}>Quay lại cửa hàng</Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[40px] p-8 lg:p-12 border border-zinc-100 shadow-xl shadow-zinc-200/50 text-center">
      {/* Success Icon Section */}
      <div className="flex justify-center mb-8 relative">
        <div className="absolute inset-0 bg-green-100 rounded-full scale-150 blur-3xl opacity-20 animate-pulse" />
        <div className="h-24 w-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 relative">
          <CheckCircle2 size={56} strokeWidth={2.5} />
        </div>
      </div>

      <h1 className="text-4xl font-black text-zinc-900 mb-2 tracking-tight">
        Đặt hàng thành công!
      </h1>
      <p className="text-zinc-500 text-lg mb-8 max-w-md mx-auto">
        Cảm ơn bạn đã lựa chọn QuadBite. Đơn hàng{' '}
        <span className="text-zinc-900 font-bold">#{order.orderId}</span> của bạn đang được chuẩn
        bị.
      </p>

      {/* Order Status Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 text-yellow-700 text-sm font-black uppercase tracking-wider mb-10 border border-yellow-100">
        <Clock size={16} />
        {order.orderStatus?.name || 'Đang xử lý'}
      </div>

      <div className="h-px bg-zinc-100 my-10" />

      {/* Order Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left mb-12">
        {/* Delivery Info */}
        <div className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">
            Thông tin giao hàng
          </h3>
          <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100 space-y-4">
            <div className="flex items-start gap-4">
              <MapPin className="text-primary mt-1 shrink-0" size={20} />
              <div className="space-y-1">
                <div className="font-black text-zinc-900">{order.address?.receiptionName}</div>
                <div className="text-sm text-zinc-500 font-bold">{order.address?.phone}</div>
                <div className="text-sm text-zinc-600 leading-relaxed">
                  {order.address?.addressLine}, {order.address?.district}, {order.address?.city}
                </div>
                <div className="inline-block mt-2 px-3 py-1 rounded-lg bg-white border border-zinc-200 text-[10px] font-black uppercase text-zinc-400">
                  {order.address?.addressName}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200/60 flex items-center gap-3 text-sm">
              <Clock size={16} className="text-zinc-400" />
              <span className="text-zinc-500 font-bold">Dự kiến giao: </span>
              <span className="text-zinc-900 font-black">20-30 phút</span>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">
            Chi tiết thanh toán
          </h3>
          <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500 font-bold">Phương thức</span>
              <span className="text-zinc-900 font-black uppercase">
                {order.paymentMethod?.name}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500 font-bold">Trạng thái</span>
              <span className="text-blue-600 font-black uppercase">
                {order.paymentStatus?.name}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-zinc-200">
              <span className="text-zinc-900 font-black text-lg">Tổng cộng</span>
              <span className="text-2xl font-black text-red-600">
                {new Intl.NumberFormat('vi-VN').format(Number(order.totalPrice) || 0)}đ
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="text-left mb-12">
        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-6">
          Danh sách món ăn ({order.orderItems?.length})
        </h3>
        <div className="space-y-4">
          {order.orderItems?.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-100 bg-white"
            >
              <div className="h-16 w-16 rounded-xl bg-zinc-50 flex items-center justify-center shrink-0">
                <Package size={24} className="text-zinc-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-black text-zinc-900 truncate">{item.name}</div>
                <div className="text-xs text-zinc-500 font-bold">
                  Loại: {item.variant} | SL: {item.quantity}
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-zinc-900">
                  {new Intl.NumberFormat('vi-VN').format(Number(item.price) * item.quantity)}đ
                </div>
                <div className="text-[10px] text-zinc-400 font-bold">
                  {new Intl.NumberFormat('vi-VN').format(Number(item.price))}đ / món
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => router.push(`/${locale}/app/shop`)}
          className="flex-1 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-black text-lg shadow-xl shadow-zinc-200 transition-all active:scale-95"
        >
          Tiếp tục mua sắm
        </Button>
        <Button
          variant="secondary"
          onClick={() => router.push(`/${locale}/app/order/history`)}
          className="flex-1 py-4 rounded-2xl bg-white border-2 border-zinc-100 text-zinc-600 font-black text-lg hover:bg-zinc-50 transition-all active:scale-95"
        >
          Xem lịch sử đơn hàng
          <ArrowRight size={20} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-4xl px-6 py-12 lg:py-20">
        <Suspense
          fallback={
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-400 py-40">
              <Loader2 className="animate-spin" size={48} />
              <p className="font-bold">Đang chuẩn bị nội dung...</p>
            </div>
          }
        >
          <OrderSuccessContent />
        </Suspense>

        <div className="mt-12 text-center text-zinc-400 text-sm font-medium flex items-center justify-center gap-2">
          <ShoppingBag size={16} />
          Quý khách sẽ nhận được email xác nhận đơn hàng sớm nhất.
        </div>
      </main>
    </div>
  );
}
