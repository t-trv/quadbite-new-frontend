'use client';
import Header from '@/components/header/Header';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function CheckoutPage() {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-4xl px-6 py-20 flex flex-col items-center text-center">
        <div className="h-24 w-24 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-8 border-4 border-green-100">
            <CheckCircle2 size={48} />
        </div>
        
        <h1 className="text-4xl font-black text-zinc-900 mb-4 tracking-tight">Xác nhận thanh toán</h1>
        <p className="text-xl text-zinc-500 max-w-2xl leading-relaxed">
            Bạn đang tiến gần hơn đến món ngon của mình! Chúng tôi đang chuẩn bị hệ thống thanh toán an toàn cho bạn.
        </p>

        <div className="mt-12 p-8 bg-white rounded-[40px] border border-zinc-100 shadow-xl w-full max-w-lg">
            <div className="space-y-6">
                <div className="flex items-center justify-between pb-6 border-b border-dashed border-zinc-100">
                    <span className="text-zinc-500 font-bold">Trạng thái</span>
                    <span className="px-4 py-1 rounded-full bg-yellow-50 text-yellow-600 text-sm font-black uppercase">Đang xử lý</span>
                </div>

                <div className="space-y-4">
                    <p className="text-zinc-400 text-sm italic">
                        "Hệ thống đang được kết nối với cổng thanh toán. Vui lòng quay lại sớm hoặc liên hệ nhân viên để được hỗ trợ trực tiếp."
                    </p>
                </div>

                <div className="pt-6 grid grid-cols-1 gap-4">
                    <Link href={`/${locale}/app/shop`}>
                        <Button size="md" className="w-full rounded-2xl">
                            Khám phá thêm món khác
                        </Button>
                    </Link>
                    <Link href={`/${locale}/app/cart`}>
                        <Button size="md" variant="secondary" className="w-full rounded-2xl border-none bg-zinc-100 hover:bg-zinc-200">
                            Quay lại giỏ hàng
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
