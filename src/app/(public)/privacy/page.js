import PageHeader from '@/components/common/PageHeader';

export const metadata = {
  title: 'Privacy Policy | London Express Removals',
  description: 'Privacy policy for London Express Removals. How we collect, use and protect your personal data in accordance with UK GDPR.',
  alternates: { canonical: '/privacy' },
  robots: { index: false, follow: false }, // no SEO value — exclude from index
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" subtitle="Last updated: January 2026" />
      <section className="py-16 lg:py-20">
        <div className="container-wide max-w-3xl prose prose-slate">
          <h2 className="font-display font-bold text-2xl mt-8 mb-3">What we collect</h2>
          <p className="text-ink-700 leading-relaxed mb-4">
            When you book a move or contact us, we collect: your name, email, phone number, pickup and delivery addresses,
            move details, and any notes you provide. We do not collect payment card details directly — payments are
            processed at the time of service.
          </p>

          <h2 className="font-display font-bold text-2xl mt-8 mb-3">How we use it</h2>
          <p className="text-ink-700 leading-relaxed mb-4">
            We use your information solely to provide our moving services: confirming your booking, contacting you with
            updates, sending an estimated quote, and following up after your move. We do not sell or share your data
            with third parties for marketing purposes.
          </p>

          <h2 className="font-display font-bold text-2xl mt-8 mb-3">Cookies</h2>
          <p className="text-ink-700 leading-relaxed mb-4">
            We use essential cookies to keep you signed in and to remember your preferences. We also use anonymous
            analytics cookies to understand how visitors use our site. You can decline non-essential cookies via the
            banner that appears on your first visit.
          </p>

          <h2 className="font-display font-bold text-2xl mt-8 mb-3">Your rights</h2>
          <p className="text-ink-700 leading-relaxed mb-4">
            Under UK GDPR you can: request a copy of the data we hold about you, ask us to correct or delete your data,
            and withdraw consent at any time. Email <a href="mailto:bookings@londonexpressremovals.co.uk" className="text-ember-600 underline">bookings@londonexpressremovals.co.uk</a> with any request.
          </p>

          <h2 className="font-display font-bold text-2xl mt-8 mb-3">Data retention</h2>
          <p className="text-ink-700 leading-relaxed mb-4">
            We retain booking records for 7 years for tax and legal purposes, then delete them. Marketing
            subscription preferences are retained until you unsubscribe.
          </p>
        </div>
      </section>
    </>
  );
}
