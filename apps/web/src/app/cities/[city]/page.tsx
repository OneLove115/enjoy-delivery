import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cities, getCityBySlug, getCitiesByCountry, getGhanaRegions } from '@/data/cities';
import { Nav } from '../../components/Nav';
import { Footer } from '../../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

export function generateStaticParams() {
  return cities.map(city => ({ city: city.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return {};

  const isEN = city.language === 'en';
  const title = city.status === 'live'
    ? isEN
      ? `Food delivery in ${city.name} — ${city.restaurantCount}+ restaurants | EnJoy`
      : `Eten bestellen in ${city.nameNL} — ${city.restaurantCount}+ restaurants | EnJoy`
    : `Food delivery in ${city.name} — Coming Soon | EnJoy`;
  const description = city.status === 'live'
    ? isEN
      ? `Order from ${city.restaurantCount}+ restaurants in ${city.name}${city.region ? `, ${city.region}` : ''}. ${city.topCuisines.slice(0, 4).join(', ')} and more. Delivered in ${city.deliveryTime}.`
      : `Bestel bij ${city.restaurantCount}+ restaurants in ${city.nameNL}. ${city.topCuisines.slice(0, 4).join(', ')} en meer. Bezorgd in ${city.deliveryTime}.`
    : `EnJoy is coming to ${city.name}. Sign up for early access to the best food delivery in ${city.name}.`;

  return {
    title,
    description,
    alternates: { canonical: `https://enjoy.veloci.online/cities/${city.slug}` },
    openGraph: {
      title,
      description,
      url: `https://enjoy.veloci.online/cities/${city.slug}`,
      siteName: 'EnJoy',
      locale: 'nl_NL',
      type: 'website',
    },
  };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  const isLive = city.status === 'live';

  const isEN = city.language === 'en';
  const countryCities = getCitiesByCountry(city.country);
  const isGhana = city.country === 'Ghana';
  const ghanaRegions = isGhana ? getGhanaRegions() : [];

  const jsonLd = isLive ? {
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    name: `EnJoy ${city.name}`,
    url: `https://enjoy.veloci.online/cities/${city.slug}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.name,
      ...(city.region ? { addressRegion: city.region } : {}),
      addressCountry: city.countryCode,
    },
    description: isEN
      ? `Order from ${city.restaurantCount}+ restaurants in ${city.name}. ${city.tagline}`
      : `Bestel bij ${city.restaurantCount}+ restaurants in ${city.nameNL}. ${city.taglineNL}`,
    servesCuisine: city.topCuisines,
  } : undefined;

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <Nav />

      {/* Hero */}
      <section style={{ padding: 'clamp(32px, 8vw, 100px) clamp(16px, 4vw, 60px) clamp(24px, 5vw, 60px)', textAlign: 'center' }}>
        {city.region && (
          <div style={{ fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 2 }}>
            {city.region}, {city.country}
          </div>
        )}
        <div style={{ fontSize: 'clamp(36px, 7vw, 64px)', fontWeight: 950, letterSpacing: -2, marginBottom: 16 }}>
          {isLive ? (
            <>{isEN ? 'Food delivery in' : 'Food delivery in'} <span style={{ background: `linear-gradient(135deg, ${PURPLE}, ${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{city.name}</span></>
          ) : (
            <>{isEN ? 'EnJoy is coming to' : 'EnJoy komt naar'} <span style={{ background: `linear-gradient(135deg, ${PURPLE}, ${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{city.name}</span></>
          )}
        </div>
        <p style={{ fontSize: 20, color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.6 }}>
          {city.tagline}
        </p>

        {isLive ? (
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/discover" style={{ background: `linear-gradient(135deg, ${PURPLE}, ${PINK})`, color: '#fff', padding: '16px 40px', borderRadius: 14, fontSize: 17, fontWeight: 800, textDecoration: 'none' }}>
              {isEN ? `Order now in ${city.name}` : `Bestel nu in ${city.nameNL}`}
            </Link>
          </div>
        ) : (
          <div style={{ maxWidth: 400, margin: '0 auto' }}>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 16 }}>
              {isEN ? 'Sign up for early access' : 'Meld je aan voor vroege toegang'}
            </p>
            <Link href="/signup" style={{ background: `linear-gradient(135deg, ${PURPLE}, ${PINK})`, color: '#fff', padding: '16px 40px', borderRadius: 14, fontSize: 17, fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>
              {isEN ? 'Sign up' : 'Meld je aan'}
            </Link>
          </div>
        )}
      </section>

      {/* Stats bar (live cities only) */}
      {isLive && (
        <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '40px 20px' }}>
          <div style={{ maxWidth: 700, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: 36, fontWeight: 950, background: `linear-gradient(135deg, ${PURPLE}, ${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{city.restaurantCount}+</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, fontWeight: 600 }}>Restaurants</div>
            </div>
            <div>
              <div style={{ fontSize: 36, fontWeight: 950, background: `linear-gradient(135deg, ${PURPLE}, ${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{city.deliveryTime}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, fontWeight: 600 }}>{isEN ? 'Delivery time' : 'Bezorgtijd'}</div>
            </div>
            <div>
              <div style={{ fontSize: 36, fontWeight: 950, background: `linear-gradient(135deg, ${PURPLE}, ${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{city.population}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, fontWeight: 600 }}>{isEN ? 'Population' : 'Inwoners'}</div>
            </div>
          </div>
        </section>
      )}

      {/* Top cuisines */}
      <section style={{ padding: 'clamp(40px, 6vw, 80px) clamp(16px, 4vw, 60px)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 32 }}>
          {isLive
            ? (isEN ? `Top cuisines in ${city.name}` : `Populaire keukens in ${city.nameNL}`)
            : (isEN ? `Expected cuisines in ${city.name}` : `Verwachte keukens in ${city.nameNL}`)
          }
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', maxWidth: 600, margin: '0 auto' }}>
          {city.topCuisines.map(cuisine => (
            <span key={cuisine} style={{ padding: '10px 22px', borderRadius: 100, background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: 15, fontWeight: 700 }}>
              {cuisine}
            </span>
          ))}
        </div>
      </section>

      {/* Neighborhoods (live cities only) */}
      {isLive && city.neighborhoods.length > 0 && (
        <section style={{ padding: '0 clamp(16px, 4vw, 60px) clamp(40px, 6vw, 80px)', textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 32 }}>
            {isEN ? `Delivery across ${city.name}` : `Bezorging in heel ${city.nameNL}`}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 500, margin: '0 auto 24px', lineHeight: 1.6 }}>
            {isEN
              ? `We deliver to all neighborhoods in ${city.name}. From ${city.neighborhoods[0]} to ${city.neighborhoods[city.neighborhoods.length - 1]}.`
              : `We bezorgen in alle wijken van ${city.nameNL}. Van ${city.neighborhoods[0]} tot ${city.neighborhoods[city.neighborhoods.length - 1]}.`
            }
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', maxWidth: 600, margin: '0 auto' }}>
            {city.neighborhoods.map(neighborhood => (
              <span key={neighborhood} style={{ padding: '8px 18px', borderRadius: 10, background: `${PURPLE}12`, border: `1px solid ${PURPLE}30`, fontSize: 14, fontWeight: 600, color: PURPLE }}>
                {neighborhood}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Ghana regions / states */}
      {isGhana && ghanaRegions.length > 0 && (
        <section style={{ padding: 'clamp(40px, 6vw, 80px) clamp(16px, 4vw, 60px) 0', textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>EnJoy across Ghana</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 500, margin: '0 auto 24px', lineHeight: 1.6 }}>
            We deliver in {ghanaRegions.length} regions across Ghana. Find your city below.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', maxWidth: 600, margin: '0 auto' }}>
            {ghanaRegions.map(region => (
              <span key={region} style={{ padding: '10px 22px', borderRadius: 100, background: `${PURPLE}12`, border: `1px solid ${PURPLE}30`, fontSize: 15, fontWeight: 700, color: PURPLE }}>
                {region} Region
              </span>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding: 'clamp(40px, 6vw, 80px) clamp(16px, 4vw, 60px)', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '48px 32px', borderRadius: 24, background: `linear-gradient(135deg, ${PURPLE}15, ${PINK}10)`, border: `1px solid ${PURPLE}25` }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>
            {isLive
              ? (isEN ? `Ready to order in ${city.name}?` : `Klaar om te bestellen in ${city.nameNL}?`)
              : (isEN ? `Want EnJoy in ${city.name}?` : `Wil je EnJoy in ${city.nameNL}?`)
            }
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 24 }}>
            {isLive
              ? (isEN ? `Discover ${city.restaurantCount}+ restaurants and order in minutes.` : `Ontdek ${city.restaurantCount}+ restaurants en bestel in minuten.`)
              : (isEN ? 'Sign up and be the first to know when we go live.' : 'Meld je aan en wees de eerste die het weet wanneer we live gaan.')
            }
          </p>
          <Link href={isLive ? '/discover' : '/signup'} style={{ background: `linear-gradient(135deg, ${PURPLE}, ${PINK})`, color: '#fff', padding: '16px 40px', borderRadius: 14, fontSize: 17, fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>
            {isLive ? (isEN ? 'Order now' : 'Bestel nu') : (isEN ? 'Sign up' : 'Meld je aan')}
          </Link>
        </div>
      </section>

      {/* Cities in same country */}
      {countryCities.length > 1 && (
        <section style={{ padding: '0 clamp(16px, 4vw, 60px) clamp(40px, 6vw, 60px)', textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 24 }}>
            {isEN ? `More cities in ${city.country}` : `Meer steden in ${city.country}`}
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', maxWidth: 700, margin: '0 auto' }}>
            {countryCities.filter(c => c.slug !== city.slug).map(c => (
              <Link key={c.slug} href={`/cities/${c.slug}`} style={{ padding: '10px 20px', borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: 14, fontWeight: 700, textDecoration: 'none', color: 'var(--text-primary)' }}>
                {c.name} {c.status === 'live' ? `(${c.restaurantCount}+)` : '(soon)'}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All other cities */}
      <section style={{ padding: '0 clamp(16px, 4vw, 60px) clamp(40px, 6vw, 80px)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 24 }}>
          {isEN ? 'EnJoy in other cities' : 'EnJoy in andere steden'}
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', maxWidth: 700, margin: '0 auto' }}>
          {cities.filter(c => c.slug !== city.slug && c.country !== city.country).map(c => (
            <Link key={c.slug} href={`/cities/${c.slug}`} style={{ padding: '10px 20px', borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: 14, fontWeight: 700, textDecoration: 'none', color: 'var(--text-primary)' }}>
              {c.name} {c.status === 'live' ? `(${c.restaurantCount}+)` : '(soon)'}
            </Link>
          ))}
        </div>
      </section>

      <div style={{ height: 60 }} />
      <Footer />
    </div>
  );
}
