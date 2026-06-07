import PageHeader from '@/components/common/PageHeader';

export const metadata = {
  title: 'Terms of Service | London Express Removals',
  description: 'Terms and conditions for London Express Removals. Booking, cancellation, pricing, insurance and liability terms.',
  alternates: { canonical: '/terms' },
  robots: { index: false, follow: false }, // no SEO value — exclude from index
};


export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms of Service" subtitle="Last updated: January 2026" />
      <section className="py-16 lg:py-20">
        <div className="container-wide max-w-3xl prose prose-slate">
          <h2 className="font-display font-bold text-2xl mt-8 mb-3">1. Booking & Cancellation</h2>
          <p className="text-ink-700 leading-relaxed mb-4">
            All bookings are subject to availability. We aim to confirm bookings within 30 minutes during business hours.
            You may cancel free of charge up to 24 hours before your scheduled move. Cancellations within 24 hours
            may incur a charge of up to 25% of the quoted price.
          </p>

          <h2 className="font-display font-bold text-2xl mt-8 mb-3">2. Pricing & Payment</h2>
          <p className="text-ink-700 leading-relaxed mb-4">
            Quoted prices are valid for 7 days from the date of quote. The price you see at booking is what you pay,
            unless the move significantly exceeds the agreed time or scope, in which case additional hourly charges apply
            at the rate disclosed at booking.
          </p>

          <h2 className="font-display font-bold text-2xl mt-8 mb-3">3. Insurance</h2>
          <p className="text-ink-700 leading-relaxed mb-4">
            Goods-in-transit insurance up to £10,000 is included as standard. Higher coverage available on request.
            Items must be packed appropriately for transit. We are not liable for damage to inadequately packed items.
          </p>

          <h2 className="font-display font-bold text-2xl mt-8 mb-3">4. Liability</h2>
          <p className="text-ink-700 leading-relaxed mb-4">
            Our maximum liability for any move is limited to the insurance coverage of £10,000 unless otherwise agreed
            in writing. We are not liable for indirect or consequential losses, delays caused by traffic or weather,
            or for items left behind at the pickup location.
          </p>

          <h2 className="font-display font-bold text-2xl mt-8 mb-3">5. Contact</h2>
          <p className="text-ink-700 leading-relaxed mb-4">
            For any questions about these terms, contact us at <a href="mailto:bookings@londonexpressremovals.co.uk" className="text-ember-600 underline">bookings@londonexpressremovals.co.uk</a>.
          </p>
        </div>
      </section>
    </>
  );
}
