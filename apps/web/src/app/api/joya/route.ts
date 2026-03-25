import { NextRequest, NextResponse } from 'next/server';

/* ─── Knowledge Base (RAG source of truth) ─────────────────────────────── */
interface RestaurantEntry {
  name: string;
  keywords: string[];
  cuisine: string;
  rating: number;
  time: string;       // e.g. "25-35 min"
  deliveryCost: string;
  minOrder: number;
  deals: string[];
  open: boolean;
  openTime?: string;
  popular: string[];  // "Item name €price"
  slug: string;
}

const KNOWLEDGE_BASE: RestaurantEntry[] = [
  {
    name: 'Royal Kitchen',
    keywords: ['indiaas', 'indian', 'india', 'curry', 'tikka', 'masala', 'korma', 'naan', 'tandoori', 'butter chicken', 'saag', 'biryani'],
    cuisine: 'Indiaas · Curry',
    rating: 4.8,
    time: '25-35 min',
    deliveryCost: 'Gratis',
    minOrder: 10,
    deals: ['30% korting vandaag'],
    open: true,
    popular: ['Chicken Tikka Masala €13,50', 'Butter Chicken €12,95', 'Lamb Korma €14,50', 'Garlic Naan €2,50', 'Vegetable Biryani €11,95', 'Mango Lassi €3,95'],
    slug: 'royal-kitchen',
  },
  {
    name: 'Burger Empire',
    keywords: ['burger', 'hamburger', 'burgers', 'american', 'amerikaans', 'fries', 'friet', 'milkshake', 'beef', 'cheeseburger'],
    cuisine: 'Burgers · Amerikaans',
    rating: 4.6,
    time: '15-25 min',
    deliveryCost: '€1,99',
    minOrder: 15,
    deals: ['Gratis bezorging vandaag'],
    open: true,
    popular: ['Classic Burger €9,95', 'Double Smash Burger €13,50', 'BBQ Bacon Burger €12,95', 'Crispy Chicken Burger €11,50', 'Cheese Fries €5,95', 'Oreo Milkshake €5,50'],
    slug: 'burger-empire',
  },
  {
    name: 'Sushi Palace',
    keywords: ['sushi', 'japans', 'japanese', 'japan', 'maki', 'nigiri', 'sashimi', 'temaki', 'ramen', 'edamame', 'wasabi', 'sake'],
    cuisine: 'Japans · Sushi',
    rating: 4.9,
    time: '30-40 min',
    deliveryCost: 'Gratis',
    minOrder: 20,
    deals: ['2+1 gratis vandaag'],
    open: true,
    popular: ['Salmon Maki (8 stuks) €8,95', 'Mixed Sashimi (12 stuks) €18,50', 'Spicy Tuna Roll €9,95', 'California Roll €8,50', 'Edamame €4,50', 'Miso Soep €3,95'],
    slug: 'sushi-palace',
  },
  {
    name: 'Pizza Throne',
    keywords: ['pizza', 'italiaans', 'italian', 'italia', 'pasta', 'margherita', 'pepperoni', 'calzone', 'mozzarella', 'basilicum'],
    cuisine: 'Italiaans · Pizza',
    rating: 4.7,
    time: '20-30 min',
    deliveryCost: '€0,99',
    minOrder: 12,
    deals: [],
    open: true,
    popular: ['Margherita €10,95', 'Pepperoni €12,50', 'BBQ Chicken Pizza €13,95', 'Quattro Formaggi €13,50', 'Truffle Pizza €15,95', 'Tiramisu €5,50'],
    slug: 'pizza-throne',
  },
  {
    name: 'Taco Kingdom',
    keywords: ['taco', 'mexicaans', 'mexican', 'mexico', 'burrito', 'quesadilla', 'nachos', 'guacamole', 'salsa', 'enchilada'],
    cuisine: 'Mexicaans',
    rating: 4.5,
    time: '20-30 min',
    deliveryCost: 'Gratis',
    minOrder: 10,
    deals: [],
    open: false,
    openTime: '17:00',
    popular: ['Chicken Tacos (3 stuks) €11,95', 'Beef Burrito €13,50', 'Nachos met Guacamole €8,95', 'Quesadilla €9,95', 'Churros €5,95'],
    slug: 'taco-kingdom',
  },
  {
    name: 'Pho Dynasty',
    keywords: ['vietnamees', 'vietnamese', 'vietnam', 'pho', 'soep', 'noedels', 'noodles', 'lemongrass', 'spring roll', 'loempia'],
    cuisine: 'Vietnamees · Soepen',
    rating: 4.8,
    time: '25-35 min',
    deliveryCost: '€1,50',
    minOrder: 12,
    deals: [],
    open: true,
    popular: ['Pho Bo (rundvlees) €12,95', 'Pho Ga (kip) €11,95', 'Bun Bo Hue €12,50', 'Loempia (4 stuks) €7,95', 'Banh Mi €8,95', 'Vietnamese Koffie €3,95'],
    slug: 'pho-dynasty',
  },
  {
    name: 'Kebab Palace',
    keywords: ['kebab', 'turks', 'turkish', 'shoarma', 'shawarma', 'doner', 'döner', 'falafel', 'pita', 'lahmacun', 'iskender'],
    cuisine: 'Turks · Shoarma',
    rating: 4.4,
    time: '20-30 min',
    deliveryCost: 'Gratis',
    minOrder: 10,
    deals: [],
    open: false,
    openTime: '15:00',
    popular: ['Döner Box €11,95', 'Shoarma Wrap €9,95', 'Lahmacun €7,50', 'Falafel Pita €9,50', 'Mixed Kebab Platter €16,95', 'Baklava €4,50'],
    slug: 'kebab-palace',
  },
  {
    name: 'Dragon Wok',
    keywords: ['chinees', 'chinese', 'china', 'wok', 'aziatisch', 'asian', 'dim sum', 'bami', 'nasi', 'loempia', 'sweet sour', 'kung pao'],
    cuisine: 'Chinees · Aziatisch',
    rating: 4.6,
    time: '25-40 min',
    deliveryCost: '€2,00',
    minOrder: 15,
    deals: [],
    open: true,
    popular: ['Bami Goreng €11,95', 'Nasi Goreng €11,95', 'Dim Sum (6 stuks) €8,95', 'Kung Pao Chicken €13,50', 'Sweet & Sour Pork €12,95', 'Loempia (3 stuks) €6,95'],
    slug: 'dragon-wok',
  },
  {
    name: 'Mama Mia',
    keywords: ['pasta', 'italiaans', 'italian', 'carbonara', 'bolognese', 'lasagna', 'risotto', 'gnocchi', 'tagliatelle', 'penne'],
    cuisine: 'Italiaans · Pasta',
    rating: 4.7,
    time: '30-45 min',
    deliveryCost: 'Gratis',
    minOrder: 15,
    deals: [],
    open: true,
    popular: ['Spaghetti Carbonara €13,50', 'Tagliatelle Bolognese €12,95', 'Lasagna €13,95', 'Risotto ai Funghi €14,50', 'Gnocchi Sorrentina €12,50', 'Panna Cotta €5,50'],
    slug: 'mama-mia',
  },
];

/* ─── RAG: Retrieve relevant context ───────────────────────────────────── */
function retrieveContext(messages: Array<{ role: string; text: string }>): RestaurantEntry[] {
  const text = messages.map(m => m.text).join(' ').toLowerCase();

  // Exact restaurant name match (highest priority)
  const byName = KNOWLEDGE_BASE.filter(r =>
    text.includes(r.name.toLowerCase())
  );
  if (byName.length > 0) return byName;

  // Keyword match
  const byKeyword = KNOWLEDGE_BASE.filter(r =>
    r.keywords.some(k => text.includes(k))
  );
  if (byKeyword.length > 0) return byKeyword.slice(0, 4);

  // Special intent: fastest delivery
  if (/snel|haast|quick|fast|asap|zo snel|snelst/.test(text)) {
    return [...KNOWLEDGE_BASE]
      .filter(r => r.open)
      .sort((a, b) => parseInt(a.time) - parseInt(b.time))
      .slice(0, 3);
  }

  // Special intent: free delivery
  if (/gratis bezorg|free delivery|geen bezorgkost/.test(text)) {
    return KNOWLEDGE_BASE.filter(r => r.deliveryCost === 'Gratis' && r.open);
  }

  // Special intent: deals / offers
  if (/deal|aanbieding|korting|actie|offer|discount|promo/.test(text)) {
    return KNOWLEDGE_BASE.filter(r => r.deals.length > 0);
  }

  // Special intent: vegetarian / vegan
  if (/vegetar|vegan|plant|groen/.test(text)) {
    return KNOWLEDGE_BASE.filter(r =>
      ['sushi-palace', 'dragon-wok', 'mama-mia', 'taco-kingdom'].includes(r.slug)
    );
  }

  // Special intent: halal
  if (/halal/.test(text)) {
    return KNOWLEDGE_BASE.filter(r =>
      ['royal-kitchen', 'kebab-palace', 'taco-kingdom', 'pho-dynasty'].includes(r.slug)
    );
  }

  // Return top-rated open restaurants if no specific match
  return KNOWLEDGE_BASE.filter(r => r.open).sort((a, b) => b.rating - a.rating).slice(0, 5);
}

function formatContext(restaurants: RestaurantEntry[]): string {
  return restaurants.map(r => {
    const status = r.open ? 'Nu open' : `Opent om ${r.openTime}`;
    const deals = r.deals.length > 0 ? `\n  Deals: ${r.deals.join(', ')}` : '';
    const popular = r.popular.slice(0, 5).join(', ');
    return `• ${r.name} (${r.cuisine})
  Status: ${status} | ⭐${r.rating} | ${r.time} | Bezorging: ${r.deliveryCost} | Min. bestelling: €${r.minOrder}${deals}
  Populaire items: ${popular}`;
  }).join('\n\n');
}

/* ─── System prompt builder ─────────────────────────────────────────────── */
function buildSystemPrompt(context: string): string {
  return `Je bent Joya, de enthousiaste en vriendelijke AI-concierge van EnJoy — een premium gourmet bezorgservice.

KRITIEKE REGEL: Je MOET alleen informatie geven die expliciet in de CONTEXT hieronder staat. Verzin NOOIT menu-items, prijzen, openingstijden of andere details die niet in de context staan. Als je iets niet weet, zeg dan: "Dat weet ik helaas niet exact, maar ik kan je helpen met wat er beschikbaar is."

Je helpt klanten met:
- Persoonlijke restaurant- en gerechten-aanbevelingen op basis van hun wensen
- Informatie over bezorgtijden, kosten en minimum bestellingen
- Actuele deals en promoties
- Upselling: suggereer bijgerechten, drankjes en desserts wanneer passend
- Antwoorden op vragen over het platform

CONTEXT (gebruik ALLEEN deze informatie):
${context}

Stijlregels:
- Houd antwoorden kort en bondig (max 3-4 zinnen)
- Gebruik emoji's spaarzaam maar enthousiast
- Geef altijd concrete aanbevelingen met restaurantnaam en prijs uit de context
- Stel altijd een vervolgvraag of suggestie voor upselling (drankje, dessert, extra)
- Spreek de klant altijd vriendelijk en persoonlijk aan
- Antwoord in de taal van de klant (NL, EN, DE, AR)
- Als de klant vraagt naar iets wat NIET in de context staat, geef eerlijk aan dat je het niet weet`;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as { messages: ChatMessage[] };
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'No API key configured' }, { status: 503 });
    }

    // RAG: retrieve relevant context based on conversation
    const relevantRestaurants = retrieveContext(messages);
    const context = formatContext(relevantRestaurants);
    const systemPrompt = buildSystemPrompt(context);

    const anthropicMessages = messages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .slice(-10)
      .map(m => ({ role: m.role, content: m.text }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: systemPrompt,
        messages: anthropicMessages,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic error:', err);
      return NextResponse.json({ error: 'AI unavailable' }, { status: 502 });
    }

    const data = await response.json() as {
      content: Array<{ type: string; text: string }>;
    };
    const text = data.content.find(c => c.type === 'text')?.text ?? '';
    return NextResponse.json({ text });
  } catch (err) {
    console.error('Joya API error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
