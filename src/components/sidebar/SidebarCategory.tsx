import React from 'react';

interface SidebarCategoryProps {
  children: React.ReactNode;
  title: string;
}

export default function SidebarCategory({ children, title }: SidebarCategoryProps) {
  return (
    <div>
      <div className="text-gray-800 font-semibold">{title}</div>
      <div className="space-y-2 mt-2">{children}</div>
    </div>
  );
}
