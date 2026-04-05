'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';
const ORANGE = '#FF6B35';

/* ── Data ─────────────────────────────────────────────────────────── */
const posts = [
  {
    title: 'The Rise of AI-Powered Food Photography',
    date: '20 maart 2026',
    tag: 'Technology',
    img: '/food/cat-pizza.png',
    excerpt: 'How EnJoy uses artificial intelligence to generate ultra-realistic food images that make your mouth water before you even order.',
    body: `When a restaurant joins EnJoy, one of the first things we do is generate stunning food photography — without a single camera.

Using our in-house image generation pipeline, trained on tens of thousands of professional food photos, we create mouth-watering visuals for every dish on a restaurant's menu. The results? A 38% increase in click-through rates on menu items with AI-generated photos vs. placeholder images.

The system works by taking the dish name, key ingredients, and cuisine style, then generating a photorealistic image matched to EnJoy's premium visual brand. Restaurants can request regenerations until they're happy — typically within the first hour of onboarding.

We believe every dish deserves to look its best. Great food photography democratises visibility: even a small neighbourhood kitchen can now compete visually with a Michelin-starred restaurant on our platform.

Next up: video loops and AR previews. Stay tuned.`,
  },
  {
    title: 'Street Food Around the World: A Royal Tour',
    date: '18 maart 2026',
    tag: 'Food Culture',
    img: '/food/world-cuisines.png',
    excerpt: 'From Tokyo\'s yakitori alleys to Mexico City\'s taco stands — discover how street food culture fuels the EnJoy experience.',
    body: `Street food is the heartbeat of every great city. It's where grandmothers pass recipes to grandchildren over a single gas burner, where flavour outpaces ambiance by miles.

At EnJoy, we've built our entire platform around this ethos. Our restaurant selection isn't dominated by chains — it's curated around the brilliant street-food operators who've taken the leap indoors.

From Amsterdam's Surinamese roti spots to Rotterdam's Vietnamese bánh mì counters, these are the places Michelin inspectors eat on their days off. Our curation team visits each partner in person before they go live.

The royal treatment isn't about white tablecloths. It's about bringing the world's most exciting street food directly to your front door, in our iconic purple bag, still hot.`,
  },
  {
    title: 'Meet Joya: Your AI Food Concierge',
    date: '15 maart 2026',
    tag: 'Product',
    img: '/food/cat-sushi.png',
    excerpt: 'Voice-powered recommendations, mood-based menus, and learning your preferences. How Joya is redefining the way we order food.',
    body: `"Hé Joya, ik heb trek in iets pittigs maar niet te zwaar." That's all it takes.

Joya — our AI food concierge — understands context, mood, and history. She knows you ordered pad thai three Fridays in a row, that you avoid shellfish, and that you prefer restaurants under 30-minute delivery time.

Joya speaks Dutch, English, German, and Arabic natively. She can handle voice input directly in the app, making ordering hands-free for the first time. Try it on the Discover page.

Under the hood, Joya runs on a combination of our proprietary recommendation engine and a fine-tuned large language model. We've grounded her firmly in our restaurant catalogue — she'll never recommend a dish that isn't on a live menu near you.

The future? Predictive ordering. Joya will have your Thursday night favourite ready to confirm before you even open the app.`,
  },
  {
    title: 'The Purple Bag Promise: Our Delivery Pledge',
    date: '12 maart 2026',
    tag: 'Brand',
    img: '/food/couple-delivery.png',
    excerpt: 'Every EnJoy delivery arrives in our iconic purple branded bag — a symbol of freshness, speed, and the royal treatment.',
    body: `The purple bag isn't just packaging. It's a promise.

When we designed the EnJoy delivery bag, we had three requirements: keep food at the correct temperature for at least 45 minutes, be immediately recognisable from a distance, and feel premium when it arrives at your door.

The current bag — Generation 3 — is made from recycled materials, features a double-layered thermal lining, and has a secure magnetic closure. Riders carry it as a point of pride.

We've heard from customers who've kept their bags. We've seen them repurposed as grocery totes, picnic carriers, even laptop bags. That wasn't planned — but it tells us the quality landed.

The purple bag is also a signal to restaurants: when a customer receives it, they associate everything inside with EnJoy's standard. That's leverage for our partners to deliver at their best.`,
  },
  {
    title: 'Behind the Kitchen: How We Select Our Partners',
    date: '10 maart 2026',
    tag: 'Operations',
    img: '/food/cat-curry.png',
    excerpt: 'Our rigorous vetting process ensures every restaurant on EnJoy meets our royal standards. Quality over quantity, always.',
    body: `We turn down roughly 40% of restaurants that apply to join EnJoy.

That might sound harsh, but it's the foundation of our promise to customers: every restaurant on the platform has been visited, tasted, and approved by a human being on our curation team.

Our criteria are straightforward: consistent food quality, clean kitchen (verified via health authority records), a menu with at least 8 clearly described items, and an owner who communicates reliably. That last point matters more than people expect — a restaurant that ghosts us during onboarding will ghost customers during a busy Friday.

We also look at packaging. Restaurants that use styrofoam or single-use plastic without an offset plan are asked to transition before going live. We support them with our preferred packaging suppliers.

The result is a tighter catalogue — but every item in it is something we'd order ourselves.`,
  },
  {
    title: '5 Food Trends Dominating 2026',
    date: '8 maart 2026',
    tag: 'Trends',
    img: '/food/hero-feast.png',
    excerpt: 'Fermentation, plant-forward luxury, and the return of regional comfort food. What\'s hot on the EnJoy platform this year.',
    body: `Food doesn't stand still, and neither do our menus. Here's what's dominating orders on EnJoy in early 2026.

**1. Fermentation everything.** Kimchi, kefir, koji, kombucha — anything fermented is flying. Customers are increasingly aware of gut health, and restaurants are meeting them there with probiotic-rich options.

**2. Plant-forward luxury.** Not just vegan — premium plant-based dining. Think truffle-oil cauliflower steak, saffron-infused lentil bisque, and mushroom tartare with capers. The margin on these dishes is excellent for our restaurant partners.

**3. Regional Dutch comfort food.** Stamppot, erwtensoep, oliebollen in new formats. There's a nostalgia wave running alongside globalisation, and operators who lean into it are winning.

**4. Breakfast all day.** Avocado toast at 9pm. Shakshuka at noon. Granola bowls at midnight. The traditional meal schedule is gone, and breakfast menus are capitalising.

**5. Zero-waste menus.** Restaurants that publish their sustainability credentials — nose-to-tail cooking, surplus redistribution — are seeing higher average basket sizes. Customers reward transparency.

Watch this space: we're adding a dedicated Trends section to the Discover page later this quarter.`,
  },
];

const tagColors: Record<string, string> = {
  Technology:    PURPLE,
  'Food Culture': ORANGE,
  Product:       PINK,
  Brand:         '#8E44AD',
  Operations:    '#27AE60',
  Trends:        '#2980B9',
};

const allTags = ['Alle', ...Array.from(new Set(posts.map(p => p.tag)))];

/* ── Page ─────────────────────────────────────────────────────────── */
export default function BlogPage() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [activeTag, setActiveTag] = useState<string>('Alle');

  const toggle = (i: number) => setExpanded(expanded === i ? null : i);

  const filtered = activeTag === 'Alle' ? posts : posts.filter(p => p.tag === activeTag);

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', height: 'clamp(320px, 45vh, 500px)', overflow: 'hidden' }}>
        <img
          src="/marketing/blog-food-culture.png"
          alt="EnJoy blog"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(10,10,20,0.88) 0%, rgba(255,0,128,0.25) 100%)' }} />

        <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'clamp(24px,5vw,56px) clamp(20px,6vw,80px)', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 40, padding: '6px 18px', fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 16 }}>
              The EnJoy Journal
            </div>
            <h1 style={{ fontSize: 'clamp(32px,6.5vw,64px)', fontWeight: 950, lineHeight: 1.0, letterSpacing: -3, margin: '0 0 14px' }}>
              <span style={{ background: `linear-gradient(135deg, #ffffff 0%, ${PINK} 70%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Eetcultuur &amp; Technologie
              </span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 'clamp(14px,1.8vw,18px)', maxWidth: 520, lineHeight: 1.6 }}>
              Verhalen uit de EnJoy-keuken — over voedsel, innovatie en de koninklijke behandeling.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Tag filters ───────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(24px,4vw,40px) clamp(20px,6vw,60px) 0' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {allTags.map(tag => {
            const color = tag === 'Alle' ? PURPLE : (tagColors[tag] ?? PURPLE);
            const active = activeTag === tag;
            return (
              <motion.button
                key={tag}
                onClick={() => { setActiveTag(tag); setExpanded(null); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  padding: '8px 18px',
                  borderRadius: 40,
                  border: `1px solid ${active ? color : 'rgba(255,255,255,0.12)'}`,
                  background: active ? `${color}20` : 'transparent',
                  color: active ? color : 'var(--text-muted)',
                  fontSize: 13,
                  fontWeight: active ? 800 : 600,
                  cursor: 'pointer',
                  fontFamily: 'Outfit, sans-serif',
                  transition: 'all 0.2s',
                  boxShadow: active ? `0 0 14px ${color}30` : 'none',
                }}
              >
                {tag}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Cards ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(24px,4vw,40px) clamp(20px,6vw,60px) clamp(48px,6vw,80px)' }}>
        <motion.div
          layout
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => {
              const isFirst = posts.indexOf(p) === 0;
              const isExpanded = expanded === posts.indexOf(p);
              const originalIdx = posts.indexOf(p);
              const tagColor = tagColors[p.tag] ?? PURPLE;

              return (
                <motion.article
                  key={p.title}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => toggle(originalIdx)}
                  whileHover={!isExpanded ? { y: -6, boxShadow: `0 20px 48px ${tagColor}22` } : {}}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: 20,
                    border: `1px solid ${isExpanded ? `${tagColor}50` : 'var(--border)'}`,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'border-color 0.25s',
                    boxShadow: isExpanded ? `0 12px 40px rgba(90,49,244,0.18)` : 'none',
                    gridColumn: isExpanded ? 'span 2' : undefined,
                  }}
                >
                  {/* Image wrapper with zoom on hover */}
                  <div style={{ height: 200, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                    <motion.img
                      src={p.img}
                      alt={p.title}
                      animate={{ scale: isExpanded ? 1.05 : 1 }}
                      transition={{ duration: 0.4 }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    {/* Dark gradient on image */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,20,0.55) 0%, transparent 50%)' }} />

                    {/* Tag badge */}
                    <span style={{ position: 'absolute', top: 14, left: 14, background: tagColor, color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                      {p.tag}
                    </span>

                    {/* Featured badge on first post */}
                    {isFirst && (
                      <span style={{ position: 'absolute', top: 14, left: tagColor ? 80 : 14, marginLeft: 6, background: `linear-gradient(135deg,${ORANGE},${PINK})`, color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                        Featured
                      </span>
                    )}

                    {/* Expand/collapse toggle */}
                    <motion.span
                      animate={{ rotate: isExpanded ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ position: 'absolute', top: 14, right: 14, width: 30, height: 30, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, lineHeight: 1 }}
                    >
                      +
                    </motion.span>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: '20px 24px 18px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>{p.date}</p>
                    <h2 style={{ fontSize: 17, fontWeight: 900, marginBottom: 10, lineHeight: 1.3 }}>{p.title}</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.65 }}>{p.excerpt}</p>
                  </div>

                  {/* Expanded body */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        key="body"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ padding: '0 24px 28px', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 4 }}>
                          {p.body.split('\n\n').map((para, pi) => (
                            <p key={pi} style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.85, marginTop: 18, fontWeight: para.startsWith('**') ? 700 : 400 }}>
                              {para.replace(/\*\*/g, '')}
                            </p>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
