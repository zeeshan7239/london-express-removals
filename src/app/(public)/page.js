import Hero from '@/components/home/Hero';
import ServicesSection from '@/components/home/ServicesSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import ProcessSection from '@/components/home/ProcessSection';
import Testimonials from '@/components/home/Testimonials';
import CoverageAreas from '@/components/home/CoverageAreas';
import FAQ from '@/components/home/FAQ';
import CTABanner from '@/components/home/CTABanner';

export const metadata = {
  // No brand in the string: the site template adds " | London Express Removals".
  title: 'Removals London — Man & Van from £130',
  description: 'Removals across London from £130 for the first two hours, then hourly. Man and van for flats, houses and offices. Same-day available. Instant online quote.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Removals London — Man & Van from £130 | London Express Removals',
    description: 'Removals across London from £130 for the first two hours, then charged by the hour. Same-day available, no hidden fees.',
    url: '/',
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <WhyChooseUs />
      <ProcessSection />
      <Testimonials />
      <CoverageAreas />
      <FAQ />
      <CTABanner />
    </>
  );
}
