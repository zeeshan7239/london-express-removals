import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/layout/FloatingButtons';

export const metadata = {
  title: 'Request a Custom Removal Quote | London Express Removals',
  description: 'Need a quote for a complex move, long-distance removal, or special requirements? Request a custom quote from London Express Removals — we respond within 30 minutes, 7 days a week.',
  alternates: { canonical: '/custom-quote' },
  openGraph: {
    title: 'Request a Custom Removal Quote | London Express Removals',
    description: 'Complex move or outside the M25? Request a custom quote — we respond within 30 minutes, 7 days a week.',
    url: '/custom-quote',
  },
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
