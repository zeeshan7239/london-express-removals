import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/layout/FloatingButtons';

export const metadata = {
  title: 'My Bookings',
  description: 'View and manage your London Express Removals bookings.',
  robots: { index: false, follow: false },  // user account pages shouldn't be indexed
};

export default function MyBookingsLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-16 lg:pt-20 min-h-[80vh] bg-ink-50">{children}</main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
