'use client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from '@/components/header/Header';
import CategoryTabs from './_components/CategoryTabs';
import FoodCard from './_components/FoodCard';
import OrderSidebar from './_components/OrderSidebar';
import { Loader2 } from 'lucide-react';

const fetchFoods = async (mainCategoryId: string) => {
  const { data } = await axios.get(
    `http://localhost:3000/api/categories/main/${mainCategoryId}/foods`,
  );
  return data.data;
};

function ShopContent() {
  const searchParams = useSearchParams();
  const [activeMainCategory, setActiveMainCategory] = useState('main-food');
  const [activeCategory, setActiveCategory] = useState('all');

  // Sync category from URL if present
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setActiveMainCategory(cat);
    }
  }, [searchParams]);

  const {
    data: foods,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['foods', activeMainCategory],
    queryFn: () => fetchFoods(activeMainCategory),
  });

  // Reset side category when main category changes
  useEffect(() => {
    setActiveCategory('all');
  }, [activeMainCategory]);

  const filteredFoods = foods?.filter((food: any) => {
    if (activeCategory === 'all') return true;

    // Check both id and slug just in case, and handle both string/number types
    const foodCatId = food.side_category_id;
    const activeCatId = activeCategory.toString();

    return foodCatId === activeCatId;
  });

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Header
        activeMainCategory={activeMainCategory}
        onMainCategoryChange={setActiveMainCategory}
      />

      <main className="flex-1 mx-auto w-full max-w-[1600px] px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Menu Section */}
          <div className="flex-1">
            <div className="mb-10">
              <h1 className="text-4xl font-black text-zinc-900 mb-2">Menu món ăn</h1>
              <p className="text-zinc-500">Khám phá hương vị tuyệt vời của QuadBite</p>
            </div>

            <CategoryTabs
              mainCategoryId={activeMainCategory}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-40 gap-4 text-zinc-400">
                <Loader2 className="animate-spin" size={48} />
                <p className="font-medium">Đang tải danh sách món ăn...</p>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-40 gap-4 text-red-500">
                <p className="font-bold">Đã có lỗi xảy ra khi tải dữ liệu!</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-red-600 text-white rounded-full font-bold"
                >
                  Thử lại
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {filteredFoods?.map((food: any) => (
                  <FoodCard key={food.id} food={food} />
                ))}
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          <aside className="w-full lg:w-[400px] lg:sticky lg:top-[100px] h-fit max-h-[calc(100vh-140px)]">
            <OrderSidebar />
          </aside>
        </div>
      </main>
    </div>
  );
}

import { Suspense } from 'react';

export default function ShopPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center gap-4 text-zinc-400">
         <Loader2 className="animate-spin" size={48} />
         <p className="font-bold">Đang tải...</p>
       </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
