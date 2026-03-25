'use client';

import AppHeader from '@/components/header/AppHeader';
import BaseHeader from '@/components/header/BaseHeader';
import AppSidebar from '@/components/sidebar/AppSidebar';
import BaseSidebar from '@/components/sidebar/BaseSidebar';
import { SidebarProvider } from '@/contexts/SidebarProvider';
import SidebarContent from '@/components/sidebar/SidebarContent';
import queryClient from '@/utils/query';
import { QueryClientProvider } from '@tanstack/react-query';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SidebarProvider>
          <BaseHeader>
            <AppHeader />
          </BaseHeader>
          <div className="flex">
            <BaseSidebar>
              <AppSidebar />
            </BaseSidebar>
            <SidebarContent>{children}</SidebarContent>
          </div>
        </SidebarProvider>
      </QueryClientProvider>
    </>
  );
}
