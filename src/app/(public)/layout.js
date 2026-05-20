import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/layout/FloatingButtons';
import CookieConsent from '@/components/layout/CookieConsent';

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-16 lg:pt-20">{children}</main>
      <Footer />
      <FloatingButtons />
      <CookieConsent />
    </>
  );
}
