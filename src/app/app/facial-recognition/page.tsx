'use client';

import Search from '@/components/ui/Search';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';

export default function FacialRecognitionPage() {
  return (
    <div className="p-4">
      {/* Heading */}
      <h1 className="text-xl font-semibold">Định danh khuôn mặt</h1>

      {/* Search bar */}
      <div className="mt-4 flex gap-2">
        <Search onChange={() => {}} placeholder="Tìm kiếm" size="sm"></Search>
        <Button size="sm">Thêm</Button>
        <Select
          options={[
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3', value: 'option3' },
          ]}
          value="option2"
          onChange={() => {}}
          placeholder="Chọn..."
          size="sm"
        ></Select>
      </div>
    </div>
  );
}
