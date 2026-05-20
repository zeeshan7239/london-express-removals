import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/layout/FloatingButtons';

export const metadata = {
  title: 'Request a Custom Quote',
  description: 'Complex move, outside the M25, or special requirements? Request a custom quote and we\'ll come back within 30 minutes.',
};

export default function CustomQuoteLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-16 lg:pt-20">{children}</main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
