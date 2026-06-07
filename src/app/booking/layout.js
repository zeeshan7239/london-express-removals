import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/layout/FloatingButtons';

export const metadata = {
  title: 'Book a Removal — Instant Online Pricing | London Express Removals',
  description: 'Book your London removal in minutes. Instant transparent pricing for house moves, flat moves, office relocations and man & van services across all London boroughs. No deposit, no hidden fees.',
  alternates: { canonical: '/booking' },
  openGraph: {
    title: 'Book a Removal — Instant Online Pricing | London Express Removals',
    description: 'Book your London removal in minutes. Instant pricing, no deposit, no hidden fees. Covering all London boroughs.',
    url: '/booking',
  },
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
