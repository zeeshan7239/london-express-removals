import Hero from '@/components/home/Hero';
import ServicesSection from '@/components/home/ServicesSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import ProcessSection from '@/components/home/ProcessSection';
import Testimonials from '@/components/home/Testimonials';
import CoverageAreas from '@/components/home/CoverageAreas';
import FAQ from '@/components/home/FAQ';
import CTABanner from '@/components/home/CTABanner';

export const metadata = {
  title: 'Reliable Man & Van Service Across London',
  description: 'Premium man & van removals in London. Instant pricing, Fully secured, transparent fees. House moves, flats, offices, single items. Same-day service available.',
  alternates: { canonical: '/' },
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
