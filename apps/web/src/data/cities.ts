export interface CityData {
  slug: string;
  name: string;
  nameNL: string;
  restaurantCount: number;
  population: string;
  tagline: string;
  taglineNL: string;
  topCuisines: string[];
  neighborhoods: string[];
  deliveryTime: string;
  status: 'live' | 'coming';
  country: string;
  countryCode: string;
  region?: string;
  continent?: string;
  language?: 'nl' | 'en';
}

export const cities: CityData[] = [
  {
    slug: 'amsterdam',
    name: 'Amsterdam',
    nameNL: 'Amsterdam',
    restaurantCount: 342,
    population: '921,000',
    tagline: 'From canal-side kitchens to Michelin stars — delivered to your door.',
    taglineNL: 'Van grachtenpandkeukens tot Michelinsterren — bezorgd aan je deur.',
    topCuisines: ['Sushi', 'Italiaanse pizza', 'Burgers', 'Indonesisch', 'Shoarma', 'Poke bowl'],
    neighborhoods: ['De Pijp', 'Jordaan', 'Oost', 'West', 'Noord', 'Zuid', 'Centrum', 'Amstelveen'],
    deliveryTime: '15-35 min',
    status: 'live',
    country: 'Netherlands', countryCode: 'NL', continent: 'Europe', language: 'nl',
  },
  {
    slug: 'rotterdam',
    name: 'Rotterdam',
    nameNL: 'Rotterdam',
    restaurantCount: 218,
    population: '655,000',
    tagline: 'Rotterdam eats bold. From street food to skyline dining — all delivered.',
    taglineNL: 'Rotterdam eet brutaal. Van streetfood tot skyline dining — alles bezorgd.',
    topCuisines: ['Surinaams', 'Turks', 'Burgers', 'Kip', 'Shoarma', 'Chinees'],
    neighborhoods: ['Kralingen', 'Delfshaven', 'Centrum', 'Noord', 'Zuid', 'Hillegersberg', 'Feijenoord'],
    deliveryTime: '15-35 min',
    status: 'live',
    country: 'Netherlands', countryCode: 'NL', continent: 'Europe', language: 'nl',
  },
  {
    slug: 'den-haag',
    name: 'The Hague',
    nameNL: 'Den Haag',
    restaurantCount: 187,
    population: '552,000',
    tagline: 'Royal taste, delivered royally. The best of Den Haag at your doorstep.',
    taglineNL: 'Koninklijke smaak, koninklijk bezorgd. Het beste van Den Haag aan je deur.',
    topCuisines: ['Indonesisch', 'Surinaams', 'Italiaanse pizza', 'Shoarma', 'Sushi', 'Marokkaans'],
    neighborhoods: ['Scheveningen', 'Centrum', 'Laak', 'Loosduinen', 'Segbroek', 'Escamp'],
    deliveryTime: '15-40 min',
    status: 'live',
    country: 'Netherlands', countryCode: 'NL', continent: 'Europe', language: 'nl',
  },
  {
    slug: 'utrecht',
    name: 'Utrecht',
    nameNL: 'Utrecht',
    restaurantCount: 156,
    population: '361,000',
    tagline: 'University city, world-class food. Fresh flavors from the heart of the Netherlands.',
    taglineNL: 'Universiteitsstad, wereldkeuken. Verse smaken uit het hart van Nederland.',
    topCuisines: ['Burgers', 'Italiaanse pizza', 'Sushi', 'Poke bowl', 'Vegan', 'Thais'],
    neighborhoods: ['Centrum', 'Lombok', 'Wittevrouwen', 'Leidsche Rijn', 'Overvecht', 'Zuilen'],
    deliveryTime: '15-35 min',
    status: 'live',
    country: 'Netherlands', countryCode: 'NL', continent: 'Europe', language: 'nl',
  },
  {
    slug: 'eindhoven',
    name: 'Eindhoven',
    nameNL: 'Eindhoven',
    restaurantCount: 98,
    population: '238,000',
    tagline: 'Tech city, tasty city. Innovation meets flavor in every delivery.',
    taglineNL: 'Techstad, smaakstad. Innovatie ontmoet smaak bij elke bezorging.',
    topCuisines: ['Burgers', 'Shoarma', 'Italiaanse pizza', 'Kip', 'Chinees', 'Doner'],
    neighborhoods: ['Centrum', 'Strijp', 'Woensel', 'Tongelre', 'Gestel', 'Stratum'],
    deliveryTime: '15-35 min',
    status: 'live',
    country: 'Netherlands', countryCode: 'NL', continent: 'Europe', language: 'nl',
  },
  {
    slug: 'breda',
    name: 'Breda',
    nameNL: 'Breda',
    restaurantCount: 72,
    population: '185,000',
    tagline: "Small city, big flavors. Breda's best restaurants, delivered fast.",
    taglineNL: 'Kleine stad, grote smaken. De beste restaurants van Breda, snel bezorgd.',
    topCuisines: ['Italiaanse pizza', 'Burgers', 'Shoarma', 'Snacks', 'Sushi', 'Doner'],
    neighborhoods: ['Centrum', 'Haagse Beemden', 'Princenhage', 'Bavel', 'Ginneken'],
    deliveryTime: '15-30 min',
    status: 'live',
    country: 'Netherlands', countryCode: 'NL', continent: 'Europe', language: 'nl',
  },
  {
    slug: 'brussel',
    name: 'Brussels',
    nameNL: 'Brussel',
    restaurantCount: 0,
    population: '1,200,000',
    tagline: 'The heart of Europe deserves the best food delivery. Coming soon.',
    taglineNL: 'Het hart van Europa verdient de beste bezorging. Binnenkort beschikbaar.',
    topCuisines: ['Frans', 'Belgisch', 'Italiaans', 'Marokkaans', 'Turks'],
    neighborhoods: [],
    deliveryTime: 'Coming soon',
    status: 'coming',
    country: 'Belgium', countryCode: 'BE', continent: 'Europe', language: 'nl',
  },
  {
    slug: 'antwerpen',
    name: 'Antwerp',
    nameNL: 'Antwerpen',
    restaurantCount: 0,
    population: '530,000',
    tagline: "Diamond city, diamond dining. Antwerp's finest — coming to EnJoy.",
    taglineNL: 'Diamantstad, diamanten dining. Het fijnste van Antwerpen — binnenkort op EnJoy.',
    topCuisines: ['Belgisch', 'Italiaans', 'Japans', 'Marokkaans'],
    neighborhoods: [],
    deliveryTime: 'Coming soon',
    status: 'coming',
    country: 'Belgium', countryCode: 'BE', continent: 'Europe', language: 'nl',
  },
  {
    slug: 'berlijn',
    name: 'Berlin',
    nameNL: 'Berlijn',
    restaurantCount: 0,
    population: '3,700,000',
    tagline: "Berlin's legendary food scene — delivered the EnJoy way. Coming soon.",
    taglineNL: 'De legendarische Berlijnse foodscene — bezorgd op de EnJoy-manier. Binnenkort.',
    topCuisines: ['Doner', 'Duits', 'Vietnamees', 'Turks', 'Italiaans'],
    neighborhoods: [],
    deliveryTime: 'Coming soon',
    status: 'coming',
    country: 'Germany', countryCode: 'DE', continent: 'Europe',
  },
  {
    slug: 'londen',
    name: 'London',
    nameNL: 'Londen',
    restaurantCount: 0,
    population: '9,000,000',
    tagline: 'London calling — for the finest food delivery. Coming soon.',
    taglineNL: 'Londen belt — voor de fijnste bezorging. Binnenkort beschikbaar.',
    topCuisines: ['Indiaas', 'Chinees', 'Italiaans', 'Japans', 'Brits'],
    neighborhoods: [],
    deliveryTime: 'Coming soon',
    status: 'coming',
    country: 'United Kingdom', countryCode: 'GB', continent: 'Europe',
  },
  {
    slug: 'parijs',
    name: 'Paris',
    nameNL: 'Parijs',
    restaurantCount: 0,
    population: '2,200,000',
    tagline: 'Parisian gastronomy, delivered with love. Coming soon.',
    taglineNL: 'Parijse gastronomie, met liefde bezorgd. Binnenkort beschikbaar.',
    topCuisines: ['Frans', 'Italiaans', 'Japans', 'Marokkaans'],
    neighborhoods: [],
    deliveryTime: 'Coming soon',
    status: 'coming',
    country: 'France', countryCode: 'FR', continent: 'Europe',
  },
  {
    slug: 'barcelona',
    name: 'Barcelona',
    nameNL: 'Barcelona',
    restaurantCount: 0,
    population: '1,600,000',
    tagline: 'Tapas, paella, and everything in between — coming to EnJoy.',
    taglineNL: 'Tapas, paella en alles ertussen — binnenkort op EnJoy.',
    topCuisines: ['Spaans', 'Mexicaans', 'Italiaans', 'Japans'],
    neighborhoods: [],
    deliveryTime: 'Coming soon',
    status: 'coming',
    country: 'Spain', countryCode: 'ES', continent: 'Europe',
  },
  // — Ghana, Africa —
  {
    slug: 'accra',
    name: 'Accra',
    nameNL: 'Accra',
    restaurantCount: 185,
    population: '4,200,000',
    tagline: 'From jollof wars to grilled tilapia — Accra\'s best food, delivered fresh.',
    taglineNL: 'Van jollof-oorlogen tot gegrilde tilapia — het beste van Accra, vers bezorgd.',
    topCuisines: ['Jollof Rice', 'Waakye', 'Banku & Tilapia', 'Fufu', 'Kelewele', 'Fried Rice', 'Red Red', 'Kenkey'],
    neighborhoods: ['Osu', 'Labone', 'East Legon', 'Airport Residential', 'Cantonments', 'Dansoman', 'Tema', 'Achimota', 'Madina', 'Spintex'],
    deliveryTime: '20-45 min',
    status: 'live',
    country: 'Ghana', countryCode: 'GH', region: 'Greater Accra', continent: 'Africa', language: 'en',
  },
  {
    slug: 'kumasi',
    name: 'Kumasi',
    nameNL: 'Kumasi',
    restaurantCount: 78,
    population: '3,600,000',
    tagline: 'The Garden City serves it fresh. Ashanti flavors, delivered to your door.',
    taglineNL: 'De Tuinstad serveert het vers. Ashanti-smaken, bezorgd aan je deur.',
    topCuisines: ['Fufu & Light Soup', 'Jollof Rice', 'Banku', 'Tuo Zaafi', 'Kelewele', 'Grilled Chicken'],
    neighborhoods: ['Adum', 'Bantama', 'Asokwa', 'Nhyiaeso', 'Suame', 'Tafo', 'Atonsu', 'Kwadaso'],
    deliveryTime: '20-45 min',
    status: 'live',
    country: 'Ghana', countryCode: 'GH', region: 'Ashanti', continent: 'Africa', language: 'en',
  },
  {
    slug: 'tema',
    name: 'Tema',
    nameNL: 'Tema',
    restaurantCount: 52,
    population: '400,000',
    tagline: 'Port city, fresh catches, bold flavors. Tema eats well — and fast.',
    taglineNL: 'Havenstad, verse vangsten, gedurfde smaken. Tema eet goed — en snel.',
    topCuisines: ['Grilled Tilapia', 'Banku', 'Jollof Rice', 'Fried Yam', 'Waakye', 'Seafood'],
    neighborhoods: ['Community 1', 'Community 5', 'Community 25', 'Sakumono', 'Kpone', 'Ashaiman'],
    deliveryTime: '20-40 min',
    status: 'live',
    country: 'Ghana', countryCode: 'GH', region: 'Greater Accra', continent: 'Africa', language: 'en',
  },
  {
    slug: 'takoradi',
    name: 'Takoradi',
    nameNL: 'Takoradi',
    restaurantCount: 35,
    population: '600,000',
    tagline: 'Oil City\'s finest dining — from local chop bars to premium restaurants, delivered.',
    taglineNL: 'Het beste van de Oliestad — van lokale chop bars tot premium restaurants, bezorgd.',
    topCuisines: ['Fante Fante', 'Banku & Okro', 'Jollof Rice', 'Fried Fish', 'Fufu', 'Kenkey'],
    neighborhoods: ['Market Circle', 'Beach Road', 'Airport Ridge', 'Anaji', 'Effia', 'New Takoradi'],
    deliveryTime: '25-45 min',
    status: 'live',
    country: 'Ghana', countryCode: 'GH', region: 'Western', continent: 'Africa', language: 'en',
  },
  {
    slug: 'cape-coast',
    name: 'Cape Coast',
    nameNL: 'Cape Coast',
    restaurantCount: 28,
    population: '190,000',
    tagline: 'Where history meets flavor. Cape Coast\'s vibrant food scene, brought to you.',
    taglineNL: 'Waar geschiedenis smaak ontmoet. De levendige foodscene van Cape Coast, bij jou.',
    topCuisines: ['Fante Kenkey', 'Grilled Fish', 'Banku', 'Jollof Rice', 'Palm Nut Soup', 'Fried Rice'],
    neighborhoods: ['Kotokuraba', 'Abura', 'Pedu', 'Ola', 'UCC Campus', 'Bakaano'],
    deliveryTime: '25-45 min',
    status: 'live',
    country: 'Ghana', countryCode: 'GH', region: 'Central', continent: 'Africa', language: 'en',
  },
  {
    slug: 'tamale',
    name: 'Tamale',
    nameNL: 'Tamale',
    restaurantCount: 22,
    population: '510,000',
    tagline: 'Northern Ghana\'s culinary capital. TZ, guinea fowl, and spice — delivered fast.',
    taglineNL: 'De culinaire hoofdstad van Noord-Ghana. TZ, parelhoen en kruiden — snel bezorgd.',
    topCuisines: ['Tuo Zaafi (TZ)', 'Guinea Fowl', 'Waakye', 'Jollof Rice', 'Banku', 'Tubaani'],
    neighborhoods: ['Central Market', 'Lamashegu', 'Sakasaka', 'Changli', 'Vittin', 'Kalpohin'],
    deliveryTime: '25-50 min',
    status: 'live',
    country: 'Ghana', countryCode: 'GH', region: 'Northern', continent: 'Africa', language: 'en',
  },
];

export function getCityBySlug(slug: string): CityData | undefined {
  return cities.find(c => c.slug === slug);
}

export function getLiveCities(): CityData[] {
  return cities.filter(c => c.status === 'live');
}

export function getComingSoonCities(): CityData[] {
  return cities.filter(c => c.status === 'coming');
}

export function getCitiesByCountry(country: string): CityData[] {
  return cities.filter(c => c.country === country);
}

export function getCitiesByContinent(continent: string): CityData[] {
  return cities.filter(c => c.continent === continent);
}

export function getGhanaRegions(): string[] {
  return [...new Set(cities.filter(c => c.country === 'Ghana' && c.region).map(c => c.region!))];
}
