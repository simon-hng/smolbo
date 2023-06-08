import * as Toast from "@radix-ui/react-toast";
import { Footer } from "~/components/footer";
import { Navigation } from "~/components/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Toast.Provider>
      <div className="min-h-screen bg-slate-900 text-white">
        <Navigation />
        <main className="overflow-hidden px-6 py-8 container mx-auto">{children}</main>
        <Footer />
      </div>
    </Toast.Provider>
  );
};
