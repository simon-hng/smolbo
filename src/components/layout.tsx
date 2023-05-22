import { Footer } from "./footer";
import { Navigation } from "./navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navigation />
      <main className="p-12">{children}</main>
      <Footer />
    </div>
  );
};
