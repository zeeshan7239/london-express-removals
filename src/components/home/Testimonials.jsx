import { Star, ExternalLink } from 'lucide-react';
import { getGoogleReviews } from '@/lib/services/googleReviews';
import { siteConfig } from '@/lib/utils/siteConfig';
import ReviewsSlider from './ReviewsSlider';

// Shown only when live Google data isn't available.
const fallbackReviews = [
  { name: 'Precious Benson', area: 'Dartford', text: 'Very reliable service, I recommend 100%', rating: 5 },
  { name: 'Csilla Vegh', area: 'Hounslow', text: 'Left a 5-star rating on Google.', rating: 5 },
  { name: 'Trang Nhung Vu', area: 'Gillingham', text: 'Left a 5-star rating on Google.', rating: 5 },
];

export default async function Testimonials() {
  const live = await getGoogleReviews();
  const list = live ? live.reviews : fallbackReviews;
  const profileUrl = live?.url || siteConfig.googleProfileUrl;

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-ink-50 to-white">
      <div className="container-wide">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="section-eyebrow mb-3 mx-auto">Real reviews</div>
          <h2 className="heading-display text-3xl lg:text-4xl mb-4">Loved by Londoners</h2>

          <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm">
            <div className="flex" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 fill-ember-500 text-ember-500" />)}
            </div>
            {live?.rating ? (
              <>
                <span className="font-bold">{live.rating.toFixed(1)} out of 5</span>
                {live.count ? <span className="text-ink-500">· {live.count} Google reviews</span> : null}
              </>
            ) : (
              <span className="font-bold">Rated 5 stars <span className="font-normal text-ink-400">on Google</span></span>
            )}
          </div>
        </div>

        <ReviewsSlider reviews={list} />

        <div className="text-center mt-8">
          <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            See all reviews on Google <ExternalLink className="w-4 h-4" />
          </a>
          {live && <p className="text-xs text-ink-400 mt-3">Reviews from Google</p>}
        </div>
      </div>
    </section>
  );
}
