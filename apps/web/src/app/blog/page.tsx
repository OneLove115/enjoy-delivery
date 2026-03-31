'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';

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
  'Food Culture': '#E67E22',
  Product:       PINK,
  Brand:         '#8E44AD',
  Operations:    '#27AE60',
  Trends:        '#2980B9',
};

export default function BlogPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggle = (i: number) => setExpanded(expanded === i ? null : i);

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      <div style={{ maxWidth: 920, margin: '0 auto', padding: 'clamp(24px,5vw,60px) clamp(16px,4vw,40px)' }}>
        <h1 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 950, marginBottom: 12, background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: -1 }}>
          The EnJoy Journal
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 18, marginBottom: 48, lineHeight: 1.6 }}>
          Eetcultuur, technologie en de koninklijke behandeling — verhalen uit de EnJoy-keuken.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {posts.map((p, i) => (
            <motion.article
              key={i}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => toggle(i)}
              style={{
                background: 'var(--bg-card)', borderRadius: 20,
                border: `1px solid ${expanded === i ? `${PURPLE}50` : 'var(--border)'}`,
                overflow: 'hidden', cursor: 'pointer',
                transition: 'border-color 0.25s, box-shadow 0.25s',
                boxShadow: expanded === i ? `0 8px 32px rgba(90,49,244,0.15)` : 'none',
                gridColumn: expanded === i ? 'span 2' : undefined,
              }}
            >
              {/* Image */}
              <div style={{ height: 180, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                <img src={p.img} alt={p.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', transform: expanded === i ? 'scale(1.03)' : 'scale(1)' }} />
                <span style={{ position: 'absolute', top: 12, left: 12, background: tagColors[p.tag] ?? PURPLE, color: 'white', padding: '4px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {p.tag}
                </span>
                <span style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', color: 'rgba(255,255,255,0.8)', padding: '4px 10px', borderRadius: 8, fontSize: 12, transition: 'transform 0.25s', transform: expanded === i ? 'rotate(45deg)' : 'none' }}>
                  {expanded === i ? '×' : '+'}
                </span>
              </div>

              {/* Meta */}
              <div style={{ padding: '20px 24px 16px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>{p.date}</p>
                <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 10, lineHeight: 1.3 }}>{p.title}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 0 }}>{p.excerpt}</p>
              </div>

              {/* Expanded body */}
              <AnimatePresence>
                {expanded === i && (
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
                        <p key={pi} style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.8, marginTop: 16,
                          fontWeight: para.startsWith('**') ? 700 : 400,
                        }}>
                          {para.replace(/\*\*/g, '')}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
