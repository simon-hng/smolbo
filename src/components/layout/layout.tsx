import { ToastIcon, Toaster, resolveValue } from "react-hot-toast";
import { Footer } from "~/components/footer";
import { Navigation } from "~/components/navigation";
import { inter } from "~/styles/fonts";
import { Card } from "../ui/card";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <div className="min-h-screen max-w-full overflow-hidden bg-slate-900 text-white">
        <Navigation />
        <main>{children}</main>
        <Footer />
      </div>
      <Toaster position="bottom-right">
        {(t) => (
          <Card variant="glass">
            <div className="flex w-64 gap-4 text-white">
              <ToastIcon toast={t} /> {resolveValue(t.message, t)}
            </div>
          </Card>
        )}
      </Toaster>
    </>
  );
};
