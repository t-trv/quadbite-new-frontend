// This is base header component, use this component to wrap all of header content

export default function BaseHeader({ children }: { children: React.ReactNode }) {
  return <header className="absolute top-0 z-50 w-full bg-white">{children}</header>;
}
