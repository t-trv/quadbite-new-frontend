'use client';

import Input from './Input';
import { SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ComponentSize } from './shared/size';

interface SearchProps {
  size: ComponentSize;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  delay?: number;
  onChange?: (value: string) => void;
}

export default function Search({
  size = 'md',
  placeholder,
  className,
  delay = 500,
  onChange = () => {},
  inputClassName,
}: SearchProps) {
  const [value, setValue] = useState('');
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  useEffect(() => {
    if (onChange) onChange(debounced);
  }, [debounced]);

  return (
    <Input
      size={size}
      placeholder={placeholder}
      wrapperClassName={className}
      className={inputClassName}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      icon={<SearchIcon className="size-4" />}
    />
  );
}
