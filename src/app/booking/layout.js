import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/layout/FloatingButtons';

export const metadata = {
  title: 'Book Your Move — Instant Pricing',
  description: 'Book your London move in minutes. Instant transparent pricing for moves inside the M25. Insured, professional, no hidden fees.',
};

export default function BookingLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-16 lg:pt-20">{children}</main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
