import Hero from '@/components/home/Hero';
import ServicesSection from '@/components/home/ServicesSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import ProcessSection from '@/components/home/ProcessSection';
import Testimonials from '@/components/home/Testimonials';
import CoverageAreas from '@/components/home/CoverageAreas';
import FAQ from '@/components/home/FAQ';
import CTABanner from '@/components/home/CTABanner';

export const metadata = {
  title: 'Removals London — Man & Van from £100 | London Express Removals',
  description: 'Removals across all London boroughs from £100. House moves, flat moves, office relocations and man & van service. Same-day available, transparent fixed pricing, no hidden fees. Instant quote online.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Removals London — Man & Van from £100 | London Express Removals',
    description: 'Removals across all London boroughs from £100. House moves, flat moves, office relocations and man & van service. Same-day available, no hidden fees.',
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
