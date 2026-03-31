import BaseHeader from '@/components/header/BaseHeader';
import AppHeader from '@/components/header/AppHeader';
import MainHeroSlider from './_components/MainHeroSlider';
import Categories from './_components/Categories';
import SpecialFoods from './_components/SpecialFoods';
import BestSeller from './_components/BestSeller';
import Map from '@/components/ui/Map';
import MainFooter from './_components/MainFooter';
import SocialLinks from '@/components/ui/SocialLinks';
import AnalyticsTracker from './_components/AnalyticsTracker';

import { getDictionary } from '@/utils/dictionary';
import { Locale } from '@/config/i18n';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  
  return (
    <div className="h-screen overflow-y-auto hide-scrollbar">
      <AnalyticsTracker />
      <BaseHeader>
        <AppHeader />
      </BaseHeader>
      <div className="flex flex-col flex-1 bg-white">
        <MainHeroSlider />
        <Categories />
        <SpecialFoods />
        <BestSeller />
        <section className="mt-20">
          <h2 className="text-3xl font-black text-zinc-900 mb-8 px-6">
            {(dict as any).home?.mapTitle || 'Vị trí của chúng tôi'}
          </h2>
          <Map iframeSrc="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3729.886601447022!2d106.62132610000001!3d20.8072915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a7735d162afdb%3A0x70df39254ee1c357!2zVHLGsOG7m25nIMSQ4bqhaSBo4buNYyBI4bqjaSBQaMOybmc!5e0!3m2!1svi!2s!4v1743438188208!5m2!1svi!2s" />
        </section>
        <MainFooter />
      </div>
      <SocialLinks />
    </div>
  );
}
