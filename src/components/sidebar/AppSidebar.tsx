'use client';

import {
  AlertCircle,
  Calendar,
  Camera,
  Car,
  Home,
  Map,
  Monitor,
  Network,
  Plug,
  Settings,
  User,
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import SidebarCategory from './SidebarCategory';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export default function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const appRoutes = [
    {
      category: 'Trang chủ',
      items: [
        {
          path: '/app',
          label: 'Tổng quan',
          icon: <Home size={16} />,
        },
      ],
    },
    {
      category: 'Nhật ký',
      items: [
        {
          path: '/app/alert',
          label: 'Cảnh báo',
          icon: <AlertCircle size={16} />,
        },
        {
          path: '/app/human-face',
          label: 'Người và gương mặt',
          icon: <User size={16} />,
        },
        {
          path: '/app/license-plate',
          label: 'Biển số xe',
          icon: <Car size={16} />,
        },
        {
          path: '/app/stranger',
          label: 'Người lạ',
          icon: <User size={16} />,
        },
      ],
    },
    {
      category: 'Camera',
      items: [
        {
          path: '/app/monitor',
          label: 'Giám sát',
          icon: <Monitor size={16} />,
        },
        {
          path: '/app/camera',
          label: 'Quản lý camera',
          icon: <Camera size={16} />,
        },
      ],
    },
    {
      category: 'Cài đặt',
      items: [
        {
          path: '/app/settings',
          label: 'Cài đặt chung',
          icon: <Settings size={16} />,
        },
        {
          path: '/app/facial-recognition',
          label: 'Định danh khuôn mặt',
          icon: <User size={16} />,
        },
        {
          path: '/app/module-management',
          label: 'Quản lý module',
          icon: <Network size={16} />,
        },
        {
          path: '/app/schedule',
          label: 'Lịch biểu',
          icon: <Calendar size={16} />,
        },
        {
          path: '/app/camera-map',
          label: 'Sơ đồ camera',
          icon: <Map size={16} />,
        },
        {
          path: '/app/camera-config',
          label: 'Cấu hình camera',
          icon: <Camera size={16} />,
        },
        {
          path: '/app/integration',
          label: 'Tích hợp',
          icon: <Plug size={16} />,
        },
      ],
    },
  ];

  return (
    <div className="bg-gray-100 h-full p-4 space-y-4">
      {appRoutes.map((route) => (
        <SidebarCategory key={route.category} title={route.category}>
          {route.items.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              onClick={() => router.push(item.path)}
              isActive={pathname === item.path}
            >
              {item.label}
            </SidebarItem>
          ))}
        </SidebarCategory>
      ))}
    </div>
  );
}
