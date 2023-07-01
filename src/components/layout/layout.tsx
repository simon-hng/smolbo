import { Footer } from "~/components/footer";
import { Navigation } from "~/components/navigation";
import { inter } from "~/styles/fonts";

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
    </>
  );
};
