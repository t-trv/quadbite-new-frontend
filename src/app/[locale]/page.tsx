import BaseHeader from '@/components/header/BaseHeader';
import AppHeader from '@/components/header/AppHeader';
import MainHeroSlider from './_components/MainHeroSlider';
import Categories from './_components/Categories';
import SpecialFoods from './_components/SpecialFoods';
import BestSeller from './_components/BestSeller';
import MainFooter from './_components/MainFooter';

export default function Home() {
  return (
    <div className="h-screen overflow-y-auto hide-scrollbar">
      <BaseHeader>
        <AppHeader />
      </BaseHeader>
      <div className="flex flex-col flex-1 bg-white">
        <MainHeroSlider />
        <Categories />
        <SpecialFoods />
        <BestSeller />
        <MainFooter />
      </div>
    </div>
  );
}
