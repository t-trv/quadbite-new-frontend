import React from 'react';

import { cn } from '@/utils/cn';

interface SidebarItemProps {
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export default function SidebarItem({ icon, isActive, onClick, children }: SidebarItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 px-2 py-1 cursor-pointer',
        isActive ? 'text-primary font-semibold' : 'text-gray-800',
      )}
      onClick={onClick}
    >
      <div>{icon}</div>
      <p className="text-base">{children}</p>
    </div>
  );
}
