interface UploadProps {
  onChange: (file: File) => void;
  className?: string;
  children?: React.ReactNode;
}

export default function Upload({ onChange, className, children }: UploadProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <label className={className}>
      {children}
      <input type="file" className="hidden" accept="image/*" onChange={handleChange} />
    </label>
  );
}
