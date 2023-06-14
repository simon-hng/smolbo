import * as Toast from "@radix-ui/react-toast";
import { Footer } from "~/components/footer";
import { Navigation } from "~/components/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Toast.Provider>
      <div className="min-h-screen max-w-full overflow-hidden bg-slate-900 text-white">
        <Navigation />
        <main>{children}</main>
        <Footer />
      </div>
    </Toast.Provider>
  );
};
