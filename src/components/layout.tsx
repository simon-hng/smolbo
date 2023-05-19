interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="p-12">{children}</div>
    </div>
  );
};
