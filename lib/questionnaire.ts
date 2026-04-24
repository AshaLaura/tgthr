// TGTHR — questionnaire data and helpers
// Migrated from app.js; all module-level state references converted to state parameters.

export const MAX_INTERESTS = 3;
export const MAX_VIBE = 3;

export interface State {
  you: {
    name: string;
    interests: string[];
    drinks: string[];
    budget: string;
    dietTags: string[];
  };
  date: {
    stage: string;
    vibe: string[];
    overlap: string[];
    dietTags: string[];
    drinks: string[];
    goal: string;
  };
}

export const STEP_PHASES = [
  "you",   // 0 name
  "you",   // 1 interests
  "you",   // 2 your diet
  "you",   // 3 drinks
  "you",   // 4 budget
  "date",  // 5 stage
  "date",  // 6 their vibe
  "date",  // 7 overlap
  "date",  // 8 their diet
  "date",  // 9 their drinks
  "date",  // 10 goal
];

export const interestMeta = [
  { id: "film", label: "Film & stories", icon: "film" },
  { id: "music", label: "Live music", icon: "music" },
  { id: "food", label: "Food & markets", icon: "food" },
  { id: "art", label: "Art & museums", icon: "art" },
  { id: "outdoors", label: "Outdoors", icon: "outdoors" },
  { id: "games", label: "Games & play", icon: "games" },
  { id: "books", label: "Books & ideas", icon: "books" },
  { id: "wellness", label: "Movement & calm", icon: "wellness" },
];

export const icons: Record<string, string> = {
  film: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M4 7h4v10H4zM14 7h6l2 3-2 3h-6zM10 7h4v10h-4z"/><circle cx="18" cy="6" r="1.5" fill="currentColor"/></svg>`,
  music: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="7" cy="18" r="3"/><circle cx="19" cy="16" r="3"/></svg>`,
  food: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M8 4v16M12 4v16M16 5v15"/><path d="M4 20h16"/></svg>`,
  art: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><circle cx="10" cy="10" r="1" fill="currentColor"/></svg>`,
  outdoors: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M4 20h16M8 16l4-12 4 12M6 12h12"/></svg>`,
  games: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9.5" cy="9.5" r="1.25" fill="currentColor"/><circle cx="14.5" cy="14.5" r="1.25" fill="currentColor"/><path d="M14 8h2M13 9v2"/></svg>`,
  books: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M6 4h10a2 2 0 012 2v14a2 2 0 00-2-2H6z"/><path d="M6 4H5a2 2 0 00-2 2v14a2 2 0 002 2h1"/></svg>`,
  wellness: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M12 3v18M8 8c0-2 2-4 4-4s4 2 4 4c0 3-4 6-4 6s-4-3-4-6z"/></svg>`,
  wine: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M8 2h8v6a4 4 0 01-8 0V2z"/><path d="M12 11v11"/><path d="M9 22h6"/></svg>`,
  cocktails: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M7 4h10l-4 9v9"/><path d="M9 22h6"/><path d="M6 9h12"/></svg>`,
  beer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M6 5h9a3 3 0 013 3v7H6z"/><path d="M18 10h1.5a1.5 1.5 0 011.5 1.5V15a1.5 1.5 0 01-1.5 1.5H18"/><path d="M8 22h8"/></svg>`,
  na: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M12 3c4 4 8 7 8 11a8 8 0 01-16 0c0-4 4-7 8-11z"/><path d="M9.5 12.5l5-5"/><circle cx="12" cy="14" r="1.25" fill="currentColor"/></svg>`,
  coffee: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M5 6h11v9a4 4 0 01-4 4H9a4 4 0 01-4-4V6z"/><path d="M16 9h2a2 2 0 012 2v1a2 2 0 01-2 2h-2"/><path d="M8 22h6"/></svg>`,
  surprise: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M12 3l1.6 4.9H19l-4 2.9 1.5 4.7L12 14.9 7.5 15.5 9 10.8 5 7.9h5.4z"/></svg>`,
};

export const interestLabels: Record<string, string> = {
  film: "stories & film",
  music: "live music",
  food: "food & markets",
  art: "art & museums",
  outdoors: "the outdoors",
  games: "games & play",
  books: "books & ideas",
  wellness: "movement & calm",
};

export const drinkMeta = [
  { id: "wine", label: "Wine", icon: "wine" },
  { id: "cocktails", label: "Cocktails", icon: "cocktails" },
  { id: "beer", label: "Beer", icon: "beer" },
  { id: "na", label: "Non-alc craft", icon: "na" },
  { id: "coffee", label: "Coffee & tea", icon: "coffee" },
  { id: "surprise", label: "Surprise me", icon: "surprise" },
];

export const drinkLabels: Record<string, string> = {
  wine: "wine",
  cocktails: "cocktails",
  beer: "beer",
  na: "non-alc craft",
  coffee: "coffee or tea",
  surprise: "a surprise pour",
};

export const drinkBlueprints: Record<string, Record<string, string>> = {
  wine: {
    easy: "A wine bar quiet enough to keep the conversation close — somewhere with good pours and no rush.",
    spark: "A bar with a short, well-chosen wine list and just enough buzz to feel alive.",
    stretch: "A beautiful wine stop with real ceremony before dinner: let the first glass set the tone.",
  },
  cocktails: {
    easy: "One thoughtful cocktail in a low-light room with no rush to move you along.",
    spark: "A cocktail bar with strong signatures and a little flirt in the air.",
    stretch: "A proper craft cocktail stop that feels occasion-worthy — the kind of place the night orbits around.",
  },
  beer: {
    easy: "A taproom or brewery with a relaxed flight so there's something to compare and talk about.",
    spark: "A lively beer bar with character — good taps, easy to linger, light competitive energy.",
    stretch: "A polished craft brewery or beer-forward bar that still feels like a real night out.",
  },
  na: {
    easy: "A zero-proof menu or tea-forward spot that still feels designed, not like a compromise.",
    spark: "A place with inventive non-alcoholic pours so the drinks feel fun, not dutiful.",
    stretch: "A beautifully done non-alcoholic pairing or nightcap that keeps the ritual intact.",
  },
  coffee: {
    easy: "Coffee or tea somewhere with warmth, texture, and actual room to linger.",
    spark: "A cafe with a late pour and a little edge — somewhere you'd stay past the cup.",
    stretch: "An elegant tea or coffee interlude before dinner: slow and unhurried.",
  },
  surprise: {
    easy: "Dealer's choice at a place with a confident menu and no bad options.",
    spark: "A bar team you can trust to steer you toward something playful.",
    stretch: "A destination drink stop where the team can make the night feel a little bespoke.",
  },
};

export const budgetCopy: Record<string, string> = {
  "1": "smart & cozy",
  "2": "a proper night out",
  "3": "full sparkle mode",
};

export const stageLabels: Record<string, string> = {
  first: "a true first date",
  early: "an early connection",
  steady: "something steadily deepening",
  long: "a relationship with history",
};

export const vibeLabels: Record<string, string> = {
  warm: "warm and easy",
  curious: "curious",
  witty: "witty",
  quiet: "quietly deep",
  bold: "bold",
  grounded: "grounded",
  playful: "playful",
  spontaneous: "spontaneous",
};

export const goalLabels: Record<string, string> = {
  seen: "seen and at ease",
  spark: "playful and electric",
  closer: "closer and more honest",
  adventure: "lit up by something new",
  rest: "restored and cared for",
};

export const activityBlueprints: Record<string, Record<string, string>> = {
  film: {
    easy: "Start with an indie screening or repertory cinema, then let the movie do the first half of the conversational work.",
    spark: "Build around a buzzy screening, short film night, or outdoor movie where there is plenty to react to together.",
    stretch: "Make the movie the anchor, then turn the after into a long walk or slow dessert debrief while the feelings are still fresh.",
  },
  music: {
    easy: "Pick a listening bar, jazz set, or acoustic show where you can settle in without shouting all night.",
    spark: "Lean into a lively live set with enough rhythm and movement to keep the night flirtier than formal.",
    stretch: "Make it a full music night: an intentional set, a second stop after, and room to keep talking once the encore ends.",
  },
  food: {
    easy: "Do a gentle food crawl or market wander so the plan feels social, flexible, and low-pressure.",
    spark: "Choose a place with share plates and a little scene so tasting things together becomes part of the fun.",
    stretch: "Let dinner be the main event at a place worth lingering in, with enough pacing for the conversation to deepen.",
  },
  art: {
    easy: "Start at a gallery, museum late hour, or design space that gives you natural prompts without forcing constant banter.",
    spark: "Pick an exhibit with strong point of view so you have something playful and opinionated to bounce off together.",
    stretch: "Build around an art-forward evening that feels a little transportive before easing into a slower dinner after.",
  },
  outdoors: {
    easy: "Go for a scenic walk, botanical garden, or waterfront loop where the setting keeps everything relaxed.",
    spark: "Choose an outdoor plan with a little movement and novelty so the energy stays buoyant instead of interview-like.",
    stretch: "Make the landscape part of the romance with golden-hour views, then move somewhere cozy once the light drops.",
  },
  games: {
    easy: "Start with a playful spot that gives you something to do with your hands while you get comfortable.",
    spark: "Make it lightly competitive with arcade games, bar games, or a challenge-based stop that keeps the teasing easy.",
    stretch: "Turn the whole night into a playful arc: one gamey stop, one celebratory drink, and one proper sit-down after.",
  },
  books: {
    easy: "Open with a bookstore browse or writerly cafe where conversation can meander without feeling overproduced.",
    spark: "Pick a place with a little intellectual texture so the banter has something interesting to grip onto.",
    stretch: "Let the night feel cinematic and thoughtful: a browse, a slow pour, and then a dinner built for longer talk.",
  },
  wellness: {
    easy: "Choose a tea house, bathhouse, gentle class, or calm ritual that lowers everyone's shoulders right away.",
    spark: "Keep the plan sensory and refreshing so it feels memorable without tipping into pressure.",
    stretch: "Build an unhurried, nourishing night that leaves both of you feeling more present than when you arrived.",
  },
};

export const dietOptionMeta = [
  { id: "dairy_free", label: "Dairy-free" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "pescatarian", label: "Pescatarian" },
  { id: "gluten_free", label: "Gluten-free" },
  { id: "nut_allergy", label: "Nut allergy" },
];

export const dietOptionLabels: Record<string, string> = {
  dairy_free: "dairy-free",
  vegetarian: "vegetarian",
  vegan: "vegan",
  pescatarian: "pescatarian",
  gluten_free: "gluten-free",
  nut_allergy: "nut allergy",
};

export const cityVenues: Record<string, {
  name: string;
  activity: Record<string, Record<string, string>>;
  meal: Record<string, Record<string, string>>;
  bar: Record<string, string>;
}> = {
  sf: {
    name: "San Francisco",
    activity: {
      film: {
        easy: "Roxie Theater (Mission) — pick a double bill and let the film break the ice.",
        spark: "Alamo Drafthouse on Market — cocktail service at your seat, plenty to riff on after.",
        stretch: "Castro Theatre for a special screening — the room alone is worth the night.",
      },
      music: {
        easy: "Café du Nord (Castro) — intimate basement room, good sound, no shouting required.",
        spark: "The Independent (Fillmore) — lively mid-size show with real energy.",
        stretch: "Great American Music Hall — ornate ballroom, full night of music with room to linger.",
      },
      food: {
        easy: "Ferry Building Marketplace stroll — grab something from Acme Bread or Hog Island and meander.",
        spark: "Mission tacos crawl: La Taqueria to El Farolito, short walk between stops.",
        stretch: "Bi-Rite Market + Dolores Park picnic at golden hour, everything sourced local.",
      },
      art: {
        easy: "SFMOMA Thursday late hours — quieter crowd, great light, solid cafe inside.",
        spark: "de Young Museum in Golden Gate Park — strong rotating exhibits and a tower view.",
        stretch: "Creativity Explored (Mission) — unexpected and genuinely moving, great conversation starter.",
      },
      outdoors: {
        easy: "Lands End trail to the Sutro Baths ruins — scenic, short, almost always empty.",
        spark: "Dolores Park on a clear afternoon — bring a blanket, people-watch, stay for sunset.",
        stretch: "Marin Headlands viewpoint at golden hour — 20 min from the city, looks like a film still.",
      },
      games: {
        easy: "Brewcade (Castro) — classic arcade games, good beer, low pressure.",
        spark: "Coin-Op (SoMa) — bigger, louder, perfect for a little competition.",
        stretch: "Spin SF (SoMa) — ping pong tables, full bar, private table if you book ahead.",
      },
      books: {
        easy: "City Lights (North Beach) — three floors, no pressure, built for browsing together.",
        spark: "Green Apple Books (Richmond) — labyrinthine and full of surprises, great for wandering.",
        stretch: "Dog Eared Books (Mission) then drinks at the bar next door — an unhurried evening circuit.",
      },
      wellness: {
        easy: "Kabuki Springs & Spa (Japantown) — communal baths, serene, genuinely restorative.",
        spark: "Archimedes Banya (SoMa) — Russian banya experience, surprisingly fun and social.",
        stretch: "Sutro Baths hike at sunset into dinner in the Outer Sunset — pace and beauty.",
      },
    },
    meal: {
      "1": {
        easy: "Pizzeria Delfina (18th St) — neighborhood, unhurried, genuinely great pizza.",
        stretch: "Che Fico (Divisadero) — bar area takes walk-ins, pasta is worth every minute.",
      },
      "2": {
        easy: "Nopa (Divisadero) — warm room, wood-fired menu, reliably good.",
        stretch: "Frances (17th St) — intimate, seasonal, one of the city's best quiet splurges.",
      },
      "3": {
        easy: "Cotogna (Jackson Square) — rustic Italian that feels luxurious without trying.",
        stretch: "Bix (Gold St) — jazz, supper-club glamour, the kind of room that makes you feel like a character.",
      },
    },
    bar: {
      wine: "The Riddler (Hayes Valley) — 100% women-made wines, gorgeous room, ideal for lingering.",
      cocktails: "Trick Dog (Mission) — inventive rotating menu, reliably one of the city's best.",
      beer: "Cellarmaker Brewing (SoMa) — small-batch pours, friendly room, great for sampling together.",
      na: "Seedlip pop-up at Dandelion Chocolate (Mission) — beautifully done zero-proof sips and chocolate.",
      coffee: "Sightglass Coffee (SoMa) — big industrial space, late hours, good for a slow debrief.",
      surprise: "Mano (Mission) — rotating natural wine and low-intervention pours, the staff will steer you right.",
    },
  },
  oak: {
    name: "Oakland",
    activity: {
      film: {
        easy: "New Parkway Theater (Uptown) — second-run films, couches, pizza and beer at your seat.",
        spark: "Grand Lake Theatre (Grand Lake) — gorgeous 1926 marquee, great for catching something buzzy.",
        stretch: "Paramount Theatre (Uptown) — art deco landmark; check their calendar for a live event or screening.",
      },
      music: {
        easy: "Eli's Mile High Club (North Oakland) — legendary blues bar, casual and intimate.",
        spark: "Starline Social Club (Temescal) — mid-size, good sound, strong local lineup.",
        stretch: "Fox Theater (Uptown) — stunning restored venue, worth planning a whole night around.",
      },
      food: {
        easy: "Temescal Alley stroll — coffee at Farley's East, snack at Tacos Oscar, browse the shops.",
        spark: "Swan's Market (Old Oakland) — food hall with rotating vendors, natural wine, low-key fun.",
        stretch: "Grand Lake Farmers Market (Saturday morning) into a long park breakfast after.",
      },
      art: {
        easy: "Oakland Museum of California (Lake Merritt) — rotating shows, rooftop garden, never crowded.",
        spark: "Vessel Gallery (Temescal) — contemporary work in a converted warehouse, always interesting.",
        stretch: "First Fridays in Uptown — galleries open late, food trucks, street energy you can't manufacture.",
      },
      outdoors: {
        easy: "Lake Merritt loop at golden hour — flat, scenic, city lights come on as you finish.",
        spark: "Redwood Regional Park — canopy hiking that feels nothing like a city, 20 min from downtown.",
        stretch: "Morcom Amphitheatre of Roses at peak bloom — hidden Oakland gem, genuinely romantic.",
      },
      games: {
        easy: "Lost & Found (Jack London) — outdoor bar with bocce, fire pits, very relaxed.",
        spark: "Kingpins (Jack London) — boutique bowling, strong drinks, great for a little competition.",
        stretch: "The Portal (Temescal) — retro arcade and board game bar, surprisingly deep for a full evening.",
      },
      books: {
        easy: "Pegasus Books (Shattuck) — thoughtful independent, great staff picks, easy to spend an hour.",
        spark: "Dog Eared Books (Telegraph) — eclectic, a little chaotic in the best way.",
        stretch: "Pendragon Books (Rockridge) then dinner on College Ave — classic neighborhood evening.",
      },
      wellness: {
        easy: "Lake Merritt morning walk ending at Grand Lake Coffee — gentle and grounding.",
        spark: "Joaquin Miller Park trails — quiet forested hike, feels like an escape.",
        stretch: "Temescal Pool + dinner after — community swim, unhurried evening in the neighborhood.",
      },
    },
    meal: {
      "1": {
        easy: "Homeroom (Grand Ave) — mac and cheese done properly, comfort and charm.",
        stretch: "Shakewell (Cleveland Cascade) — Spanish-inspired small plates, lively but not loud.",
      },
      "2": {
        easy: "Nido (Jack London Square) — modern Mexican, open kitchen, warm and unfussy.",
        stretch: "Duende (Uptown) — Spanish tapas and flamenco, festive energy perfect for a night with momentum.",
      },
      "3": {
        easy: "Burdell (Temescal) — California-soul cooking from a James Beard-nominated chef.",
        stretch: "Commis (Piedmont Ave) — Oakland's only Michelin-starred restaurant, a full tasting menu occasion.",
      },
    },
    bar: {
      wine: "Ordinaire (Piedmont Ave) — Oakland's best natural wine shop and bar, low-key and genuinely lovely.",
      cocktails: "Salsipuedes (Temescal) — inventive cocktails in a warm neighborhood room, one of Oakland's best.",
      beer: "Temescal Brewing (Temescal) — excellent local pours, cozy taproom, easy to stay too long.",
      na: "Timeless Coffee (Uptown) — exceptional zero-waste coffee shop, warm space with late hours.",
      coffee: "Farley's East (Grand Lake) — neighborhood institution, good for lingering with something warm.",
      surprise: "Heinold's First and Last Chance (Jack London) — oldest bar in Oakland, historically weird, unforgettable.",
    },
  },
};

// ——— Venue links ————————————————————————————————————————————————————————————

type VenueLink = { label: string; url: string };

const YELP = 'https://www.yelp.com/biz/';
const MAPS = 'https://maps.google.com/?q=';

// Flat lookup: "city:slot:key1[:key2]" → links array
const cityVenueLinks: Record<string, VenueLink[]> = {

  // ── SF · Activities ──────────────────────────────────────────────────────
  'sf:activity:film:easy': [
    { label: 'Website', url: 'https://www.roxie.com' },
    { label: 'Yelp', url: YELP + 'roxie-theater-san-francisco' },
  ],
  'sf:activity:film:spark': [
    { label: 'Website', url: 'https://drafthouse.com/san-francisco' },
    { label: 'Yelp', url: YELP + 'alamo-drafthouse-cinema-san-francisco' },
  ],
  'sf:activity:film:stretch': [
    { label: 'Website', url: 'https://www.castrotheatre.com' },
    { label: 'Yelp', url: YELP + 'castro-theatre-san-francisco' },
  ],
  'sf:activity:music:easy': [
    { label: 'Website', url: 'https://www.cafedunord.com' },
    { label: 'Yelp', url: YELP + 'cafe-du-nord-san-francisco' },
  ],
  'sf:activity:music:spark': [
    { label: 'Website', url: 'https://www.theindependentsf.com' },
    { label: 'Yelp', url: YELP + 'the-independent-san-francisco' },
  ],
  'sf:activity:music:stretch': [
    { label: 'Website', url: 'https://www.gamh.com' },
    { label: 'Yelp', url: YELP + 'great-american-music-hall-san-francisco' },
  ],
  'sf:activity:food:easy': [
    { label: 'Website', url: 'https://www.ferrybuildingmarketplace.com' },
    { label: 'Maps', url: MAPS + 'Ferry+Building+Marketplace+San+Francisco' },
  ],
  'sf:activity:food:spark': [
    { label: 'La Taqueria', url: YELP + 'la-taqueria-san-francisco' },
    { label: 'El Farolito', url: YELP + 'el-farolito-san-francisco-2' },
  ],
  'sf:activity:food:stretch': [
    { label: 'Website', url: 'https://www.biritemarket.com' },
    { label: 'Yelp', url: YELP + 'bi-rite-market-san-francisco' },
  ],
  'sf:activity:art:easy': [
    { label: 'Website', url: 'https://www.sfmoma.org' },
    { label: 'Yelp', url: YELP + 'sfmoma-san-francisco' },
  ],
  'sf:activity:art:spark': [
    { label: 'Website', url: 'https://www.famsf.org/de-young' },
    { label: 'Yelp', url: YELP + 'de-young-museum-san-francisco' },
  ],
  'sf:activity:art:stretch': [
    { label: 'Website', url: 'https://www.creativityexplored.org' },
    { label: 'Yelp', url: YELP + 'creativity-explored-san-francisco' },
  ],
  'sf:activity:outdoors:easy': [
    { label: 'Maps', url: MAPS + 'Lands+End+Trail+San+Francisco' },
    { label: 'NPS', url: 'https://www.nps.gov/goga/planyourvisit/landsend.htm' },
  ],
  'sf:activity:outdoors:spark': [
    { label: 'Maps', url: MAPS + 'Dolores+Park+San+Francisco' },
  ],
  'sf:activity:outdoors:stretch': [
    { label: 'Maps', url: MAPS + 'Marin+Headlands+Viewpoint+CA' },
    { label: 'NPS', url: 'https://www.nps.gov/goga/marin-headlands.htm' },
  ],
  'sf:activity:games:easy': [
    { label: 'Website', url: 'https://www.brewcade.com' },
    { label: 'Yelp', url: YELP + 'brewcade-san-francisco' },
  ],
  'sf:activity:games:spark': [
    { label: 'Website', url: 'https://www.coinopsf.com' },
    { label: 'Yelp', url: YELP + 'coin-op-game-room-san-francisco' },
  ],
  'sf:activity:games:stretch': [
    { label: 'Website', url: 'https://wearespin.com/san-francisco' },
    { label: 'Yelp', url: YELP + 'spin-san-francisco' },
  ],
  'sf:activity:books:easy': [
    { label: 'Website', url: 'https://citylights.com' },
    { label: 'Yelp', url: YELP + 'city-lights-booksellers-and-publishers-san-francisco' },
  ],
  'sf:activity:books:spark': [
    { label: 'Website', url: 'https://www.greenapplebooks.com' },
    { label: 'Yelp', url: YELP + 'green-apple-books-san-francisco' },
  ],
  'sf:activity:books:stretch': [
    { label: 'Yelp', url: YELP + 'dog-eared-books-san-francisco' },
    { label: 'Maps', url: MAPS + 'Dog+Eared+Books+Mission+San+Francisco' },
  ],
  'sf:activity:wellness:easy': [
    { label: 'Website', url: 'https://kabukisprings.com' },
    { label: 'Yelp', url: YELP + 'kabuki-springs-and-spa-san-francisco' },
  ],
  'sf:activity:wellness:spark': [
    { label: 'Website', url: 'https://archimedesbanya.com' },
    { label: 'Yelp', url: YELP + 'archimedes-banya-san-francisco' },
  ],
  'sf:activity:wellness:stretch': [
    { label: 'Maps', url: MAPS + 'Sutro+Baths+San+Francisco' },
    { label: 'NPS', url: 'https://www.nps.gov/goga/planyourvisit/sutro.htm' },
  ],

  // ── SF · Meals ───────────────────────────────────────────────────────────
  'sf:meal:1:easy': [
    { label: 'Website', url: 'https://pizzeriadelfina.com' },
    { label: 'Yelp', url: YELP + 'pizzeria-delfina-san-francisco-4' },
  ],
  'sf:meal:1:stretch': [
    { label: 'Website', url: 'https://www.chefico.com' },
    { label: 'Yelp', url: YELP + 'che-fico-san-francisco' },
  ],
  'sf:meal:2:easy': [
    { label: 'Website', url: 'https://nopasf.com' },
    { label: 'Yelp', url: YELP + 'nopa-san-francisco' },
  ],
  'sf:meal:2:stretch': [
    { label: 'Website', url: 'https://frances-sf.com' },
    { label: 'Yelp', url: YELP + 'frances-san-francisco' },
  ],
  'sf:meal:3:easy': [
    { label: 'Website', url: 'https://cotognasf.com' },
    { label: 'Yelp', url: YELP + 'cotogna-san-francisco' },
  ],
  'sf:meal:3:stretch': [
    { label: 'Website', url: 'https://www.bixrestaurant.com' },
    { label: 'Yelp', url: YELP + 'bix-san-francisco' },
  ],

  // ── SF · Bars ────────────────────────────────────────────────────────────
  'sf:bar:wine': [
    { label: 'Website', url: 'https://www.theriddlersf.com' },
    { label: 'Yelp', url: YELP + 'the-riddler-san-francisco' },
  ],
  'sf:bar:cocktails': [
    { label: 'Website', url: 'https://www.trickdogbar.com' },
    { label: 'Yelp', url: YELP + 'trick-dog-san-francisco' },
  ],
  'sf:bar:beer': [
    { label: 'Website', url: 'https://cellarmakerbrewing.com' },
    { label: 'Yelp', url: YELP + 'cellarmaker-brewing-san-francisco' },
  ],
  'sf:bar:na': [
    { label: 'Website', url: 'https://www.dandelionchocolate.com' },
    { label: 'Yelp', url: YELP + 'dandelion-chocolate-san-francisco' },
  ],
  'sf:bar:coffee': [
    { label: 'Website', url: 'https://sightglasscoffee.com' },
    { label: 'Yelp', url: YELP + 'sightglass-coffee-san-francisco-2' },
  ],
  'sf:bar:surprise': [
    { label: 'Maps', url: MAPS + 'Mano+Bar+Mission+San+Francisco' },
  ],

  // ── Oakland · Activities ──────────────────────────────────────────────────
  'oak:activity:film:easy': [
    { label: 'Website', url: 'https://thenewparkway.com' },
    { label: 'Yelp', url: YELP + 'the-new-parkway-theater-oakland' },
  ],
  'oak:activity:film:spark': [
    { label: 'Website', url: 'https://www.landmarktheatres.com/theater/grand-lake-theatre' },
    { label: 'Yelp', url: YELP + 'grand-lake-theatre-oakland' },
  ],
  'oak:activity:film:stretch': [
    { label: 'Website', url: 'https://www.paramounttheatre.com' },
    { label: 'Yelp', url: YELP + 'paramount-theatre-oakland' },
  ],
  'oak:activity:music:easy': [
    { label: 'Maps', url: MAPS + "Eli's+Mile+High+Club+Oakland" },
    { label: 'Yelp', url: YELP + 'elis-mile-high-club-oakland' },
  ],
  'oak:activity:music:spark': [
    { label: 'Website', url: 'https://www.starlinesocialclub.com' },
    { label: 'Yelp', url: YELP + 'starline-social-club-oakland' },
  ],
  'oak:activity:music:stretch': [
    { label: 'Website', url: 'https://www.thefoxoakland.com' },
    { label: 'Yelp', url: YELP + 'the-fox-theater-oakland' },
  ],
  'oak:activity:food:easy': [
    { label: 'Maps', url: MAPS + 'Temescal+Alley+Oakland' },
  ],
  'oak:activity:food:spark': [
    { label: 'Website', url: 'https://www.swansmarket.com' },
    { label: 'Yelp', url: YELP + 'swans-market-oakland' },
  ],
  'oak:activity:food:stretch': [
    { label: 'Maps', url: MAPS + 'Grand+Lake+Farmers+Market+Oakland' },
  ],
  'oak:activity:art:easy': [
    { label: 'Website', url: 'https://museumca.org' },
    { label: 'Yelp', url: YELP + 'oakland-museum-of-california-oakland' },
  ],
  'oak:activity:art:spark': [
    { label: 'Website', url: 'https://www.vesselgallery.com' },
    { label: 'Yelp', url: YELP + 'vessel-gallery-oakland' },
  ],
  'oak:activity:art:stretch': [
    { label: 'Website', url: 'https://www.oaklandfirstfridays.org' },
    { label: 'Maps', url: MAPS + 'Uptown+Oakland+Art+District' },
  ],
  'oak:activity:outdoors:easy': [
    { label: 'Maps', url: MAPS + 'Lake+Merritt+Oakland' },
  ],
  'oak:activity:outdoors:spark': [
    { label: 'Website', url: 'https://www.ebparks.org/parks/redwood' },
    { label: 'Maps', url: MAPS + 'Redwood+Regional+Park+Oakland' },
  ],
  'oak:activity:outdoors:stretch': [
    { label: 'Maps', url: MAPS + 'Morcom+Amphitheatre+of+Roses+Oakland' },
  ],
  'oak:activity:games:easy': [
    { label: 'Website', url: 'https://lostandfoundoakland.com' },
    { label: 'Yelp', url: YELP + 'lost-and-found-oakland' },
  ],
  'oak:activity:games:spark': [
    { label: 'Website', url: 'https://www.bowlkingpins.com' },
    { label: 'Yelp', url: YELP + 'kingpins-oakland' },
  ],
  'oak:activity:games:stretch': [
    { label: 'Maps', url: MAPS + 'The+Portal+Temescal+Oakland' },
    { label: 'Yelp', url: YELP + 'the-portal-oakland' },
  ],
  'oak:activity:books:easy': [
    { label: 'Website', url: 'https://www.pegasusbookstore.com' },
    { label: 'Yelp', url: YELP + 'pegasus-books-oakland' },
  ],
  'oak:activity:books:spark': [
    { label: 'Maps', url: MAPS + 'Dog+Eared+Books+Oakland' },
  ],
  'oak:activity:books:stretch': [
    { label: 'Yelp', url: YELP + 'pendragon-books-oakland' },
    { label: 'Maps', url: MAPS + 'Pendragon+Books+Rockridge+Oakland' },
  ],
  'oak:activity:wellness:easy': [
    { label: 'Maps', url: MAPS + 'Lake+Merritt+Oakland' },
  ],
  'oak:activity:wellness:spark': [
    { label: 'Website', url: 'https://www.ebparks.org/parks/joaquin' },
    { label: 'Maps', url: MAPS + 'Joaquin+Miller+Park+Oakland' },
  ],
  'oak:activity:wellness:stretch': [
    { label: 'Maps', url: MAPS + 'Temescal+Pool+Oakland' },
  ],

  // ── Oakland · Meals ───────────────────────────────────────────────────────
  'oak:meal:1:easy': [
    { label: 'Website', url: 'https://www.homeroom510.com' },
    { label: 'Yelp', url: YELP + 'homeroom-oakland' },
  ],
  'oak:meal:1:stretch': [
    { label: 'Website', url: 'https://shakewelloak.com' },
    { label: 'Yelp', url: YELP + 'shakewell-oakland' },
  ],
  'oak:meal:2:easy': [
    { label: 'Website', url: 'https://www.nidooakland.com' },
    { label: 'Yelp', url: YELP + 'nido-oakland' },
  ],
  'oak:meal:2:stretch': [
    { label: 'Website', url: 'https://www.duendeoakland.com' },
    { label: 'Yelp', url: YELP + 'duende-oakland' },
  ],
  'oak:meal:3:easy': [
    { label: 'Website', url: 'https://www.burdelloakland.com' },
    { label: 'Yelp', url: YELP + 'burdell-oakland' },
  ],
  'oak:meal:3:stretch': [
    { label: 'Website', url: 'https://www.commisrestaurant.com' },
    { label: 'Yelp', url: YELP + 'commis-oakland' },
  ],

  // ── Oakland · Bars ────────────────────────────────────────────────────────
  'oak:bar:wine': [
    { label: 'Website', url: 'https://www.ordinairewine.com' },
    { label: 'Yelp', url: YELP + 'ordinaire-wine-shop-and-bar-oakland' },
  ],
  'oak:bar:cocktails': [
    { label: 'Maps', url: MAPS + 'Salsipuedes+Temescal+Oakland' },
    { label: 'Yelp', url: YELP + 'salsipuedes-oakland' },
  ],
  'oak:bar:beer': [
    { label: 'Website', url: 'https://www.temescalbrewing.com' },
    { label: 'Yelp', url: YELP + 'temescal-brewing-oakland' },
  ],
  'oak:bar:na': [
    { label: 'Website', url: 'https://www.timelesscoffee.com' },
    { label: 'Yelp', url: YELP + 'timeless-coffee-roasters-and-espresso-bar-oakland' },
  ],
  'oak:bar:coffee': [
    { label: 'Website', url: 'https://farleyseast.com' },
    { label: 'Yelp', url: YELP + 'farleys-east-oakland' },
  ],
  'oak:bar:surprise': [
    { label: 'Yelp', url: YELP + 'heinolds-first-and-last-chance-saloon-oakland' },
    { label: 'Maps', url: MAPS + "Heinold's+First+and+Last+Chance+Oakland" },
  ],
};

function getVenueLinks(cityKey: string, slot: string, ...keys: string[]): VenueLink[] {
  return cityVenueLinks[`${cityKey}:${slot}:${keys.join(':')}`] ?? [];
}

function renderVenueLinks(links: VenueLink[]): string {
  if (!links.length) return '';
  return `<div class="venue-links">${links
    .map(l => `<a href="${escapeAttr(l.url)}" target="_blank" rel="noopener noreferrer" class="venue-link">${escapeHtml(l.label)} ↗</a>`)
    .join('')}</div>`;
}

// ——— Helper functions ———

export function formatList(arr: string[]): string {
  if (!arr.length) return "a few surprises";
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
  return `${arr.slice(0, -1).join(", ")}, and ${arr[arr.length - 1]}`;
}

export function mapInterests(ids: string[]): string[] {
  return ids.map((id) => interestLabels[id] || id);
}

export function mapDrinks(ids: string[]): string[] {
  return ids.map((id) => drinkLabels[id] || id);
}

export function mapVibes(ids: string[]): string[] {
  return ids.map((id) => vibeLabels[id] || id);
}

export function mapDietTags(ids: string[]): string[] {
  return ids.map((id) => dietOptionLabels[id] || id.replace(/_/g, " "));
}

export function unique(arr: string[]): string[] {
  return Array.from(new Set(arr.filter(Boolean)));
}

export function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/"/g, "&quot;");
}

export function pickAnchorInterest(index: number, state: State): string {
  const anchors = unique([...state.date.overlap, ...state.you.interests, "food"]);
  return anchors[Math.min(index, anchors.length - 1)] || "food";
}

export function pickDrinkPreference(state: State): string {
  return state.you.drinks[0] || "surprise";
}

export function describeFoodFit(state: State): string {
  const foodTags = unique([...state.you.dietTags, ...state.date.dietTags]);
  if (!foodTags.length) {
    return "a menu that is easy to navigate for both of you";
  }
  return `${formatList(mapDietTags(foodTags))} friendly options`;
}

export function mealBlueprint(styleKey: string, state: State): string {
  const baseByBudget: Record<string, Record<string, string>> = {
    "1": {
      easy: "Keep the meal casual but chosen: a cafe, neighborhood spot, or market-led dinner that still feels thoughtful.",
      spark: "Go for shareable plates somewhere lively so ordering becomes part of the chemistry.",
      stretch: "End at a cozy dinner spot that feels like a find rather than a splurge.",
    },
    "2": {
      easy: "Pick a comfortable sit-down restaurant where the pacing lets you exhale and stay a while.",
      spark: "Book somewhere with a little scene and a menu made for splitting a few standout things.",
      stretch: "Let dinner carry real weight with a polished room, a good server, and enough time to settle in.",
    },
    "3": {
      easy: "Even the softer version can feel special here: choose a beautiful room with gracious service and zero chaos.",
      spark: "Make the meal the sexy part with a destination restaurant and a menu worth dressing up for.",
      stretch: "Go all in on a memorable dinner that feels transporting from the first plate onward.",
    },
  };
  const tier = baseByBudget[state.you.budget] || baseByBudget["2"];
  return `${tier[styleKey]} Aim for ${describeFoodFit(state)}.`;
}

export interface IdeaCard {
  title: string;
  activity: string;
  bar?: string;
  meal?: string;
  why: string;
}

export function buildIdeaCard(
  styleKey: string,
  title: string,
  index: number,
  why: string,
  state: State
): IdeaCard {
  const interestId = pickAnchorInterest(index, state);
  const activity =
    activityBlueprints[interestId]?.[styleKey] ||
    activityBlueprints.food[styleKey];

  if (index === 1) {
    const drinkId = pickDrinkPreference(state);
    const bar =
      drinkBlueprints[drinkId]?.[styleKey] || drinkBlueprints.surprise[styleKey];
    return { title, activity, bar, why };
  }

  return { title, activity, meal: mealBlueprint(styleKey, state), why };
}

export function pillGridInterests(selected: string[], name: string): string {
  const items = interestMeta
    .map((item) => {
      const checked = selected.includes(item.id) ? "checked" : "";
      const g = icons[item.icon] || "";
      return `<label class="pill icon-pill">
          <input type="checkbox" name="${name}" value="${item.id}" ${checked} />
          <span class="pill-glyph" aria-hidden="true">${g}</span>
          <span class="pill-label">${item.label}</span>
        </label>`;
    })
    .join("");
  return `<div class="pill-grid" role="group">${items}</div>`;
}

export function pillGridDrinks(selected: string[], name = "youDrinks"): string {
  const items = drinkMeta
    .map((item) => {
      const checked = selected.includes(item.id) ? "checked" : "";
      const g = icons[item.icon] || "";
      return `<label class="pill icon-pill">
          <input type="checkbox" name="${name}" value="${item.id}" ${checked} />
          <span class="pill-glyph" aria-hidden="true">${g}</span>
          <span class="pill-label">${item.label}</span>
        </label>`;
    })
    .join("");
  return `<div class="pill-grid pill-grid--drinks" role="group">${items}</div>`;
}

export function dietFieldsHtml(tags: string[], checkboxName: string): string {
  const chips = dietOptionMeta
    .map((opt) => {
      const c = tags.includes(opt.id) ? "checked" : "";
      return `<label class="chip"><input type="checkbox" name="${checkboxName}" value="${opt.id}" ${c} />${opt.label}</label>`;
    })
    .join("");
  return `
      <div class="chip-grid diet-options" role="group" aria-label="Dietary preferences">
        ${chips}
      </div>`;
}

export function renderStepContent(idx: number, state: State): string {
  switch (idx) {
    case 0: {
      const savedName = state.you.name.trim();
      if (savedName) {
        return `
          <p class="flow-q">Hi ${escapeHtml(savedName)}, let's get this date planned.</p>
          <p class="flow-sub">Want us to use a different name? Update it below, or just keep going.</p>
          <div class="field-row">
            <label class="sr-only" for="fld-name">Name</label>
            <input type="text" id="fld-name" maxlength="80" placeholder="First name or nickname" value="${escapeAttr(savedName)}" autocomplete="given-name" />
          </div>`;
      }
      return `
          <p class="flow-q">What should we call you?</p>
          <p class="flow-sub">Totally optional — nicknames welcome.</p>
          <div class="field-row">
            <label class="sr-only" for="fld-name">Name</label>
            <input type="text" id="fld-name" maxlength="80" placeholder="First name or nickname" value="" autocomplete="given-name" />
          </div>`;
    }

    case 1: {
      const hasSavedInterests = state.you.interests.length > 0;
      return `
          <p class="flow-q">Tap up to <em>three</em> vibes that feel like you.</p>
          <p class="flow-sub">${hasSavedInterests
            ? "We remembered your usual picks — update anything for tonight."
            : "We'll use these to thread your night together."
          }</p>
          ${pillGridInterests(state.you.interests, "youInterests")}`;
    }

    case 2:
      return `
          <p class="flow-q">Food allergies &amp; how <em>you</em> eat?</p>
          <p class="flow-sub">Tap anything that applies so we can keep you safe when we pick the meal.</p>
          ${dietFieldsHtml(state.you.dietTags, "dietPref")}`;

    case 3:
      return `
          <p class="flow-q">What are you into drinking?</p>
          <p class="flow-sub">Pick everything that sounds good — we'll shape one stop around it.</p>
          ${pillGridDrinks(state.you.drinks)}`;

    case 4:
      return `
          <p class="flow-q">What's the budget tonight?</p>
          <p class="flow-sub">No judgment — just calibration.</p>
          <div class="budget-grid" role="radiogroup" aria-label="Budget">
            ${(["1", "2", "3"] as const)
              .map((tier) => {
                const c = state.you.budget === tier ? "checked" : "";
                const sym = "$".repeat(parseInt(tier, 10));
                const blurbs: Record<string, string> = {
                  "1": "Clever & cozy",
                  "2": "Balanced splurge",
                  "3": "Pull out the stops",
                };
                return `<label class="budget-tile">
                  <input type="radio" name="youBudget" value="${tier}" ${c} />
                  <span class="budget-symbol" aria-hidden="true">${sym}</span>
                  <span class="budget-blurb">${blurbs[tier]}</span>
                </label>`;
              })
              .join("")}
          </div>`;

    case 5:
      return `
          <p class="flow-q">Where are you two at?</p>
          <p class="flow-sub">So we don't suggest a sky-dive on a first coffee.</p>
          <div class="chip-row" role="radiogroup">
            ${(
              [
                ["first", "First real date"],
                ["early", "Early — still discovering"],
                ["steady", "Steady — deepening"],
                ["long", "Together a while"],
              ] as [string, string][]
            )
              .map(
                ([val, lab]) =>
                  `<label class="chip"><input type="radio" name="stage" value="${val}" ${
                    state.date.stage === val ? "checked" : ""
                  } />${lab}</label>`
              )
              .join("")}
          </div>`;

    case 6:
      return `
          <p class="flow-q">Their energy — pick up to three.</p>
          <p class="flow-sub">Trust your gut. This steers tone, not stereotypes.</p>
          <div class="chip-grid" role="group">
            ${(
              [
                ["warm", "Warm & easy"],
                ["curious", "Curious"],
                ["witty", "Witty"],
                ["quiet", "Quiet depth"],
                ["bold", "Bold"],
                ["grounded", "Grounded"],
                ["playful", "Playful"],
                ["spontaneous", "Spontaneous"],
              ] as [string, string][]
            )
              .map(([val, lab]) => {
                const c = state.date.vibe.includes(val) ? "checked" : "";
                return `<label class="chip"><input type="checkbox" name="dateVibe" value="${val}" ${c} />${lab}</label>`;
              })
              .join("")}
          </div>`;

    case 7:
      return `
          <p class="flow-q">Where do your interests overlap?</p>
          <p class="flow-sub">Up to three — the shared thread for your recipe.</p>
          ${pillGridInterests(state.date.overlap, "dateOverlap")}`;

    case 8:
      return `
          <p class="flow-q">Food allergies &amp; how <em>they</em> eat?</p>
          <p class="flow-sub">What you know helps us avoid landmines at the table. If you don't know, now's the time to ask.</p>
          ${dietFieldsHtml(state.date.dietTags, "dateDietPref")}`;

    case 9:
      return `
          <p class="flow-q">What does your date like to drink?</p>
          <p class="flow-sub">Not sure? Now's a great time to ask — we'll use it to shape their stop of the night.</p>
          ${pillGridDrinks(state.date.drinks, "dateDrinks")}`;

    case 10:
      return `
          <p class="flow-q">By the end of the night, you'd love for them to feel…</p>
          <p class="flow-sub">One tap. We'll shape pace and payoff around it.</p>
          <div class="goal-grid" role="radiogroup">
            ${(
              [
                ["seen", "Seen & at ease", "Soft landing, real conversation"],
                ["spark", "Playful spark", "Laughter, flirt, little risks"],
                ["closer", "Closer & more honest", "A night that opens something"],
                ["adventure", "Lit up by something new", "Shared firsts"],
                ["rest", "Restored & cared for", "Gentle, nourishing, calm"],
              ] as [string, string, string][]
            )
              .map(
                ([id, title, sub]) =>
                  `<label class="goal-card">
                    <input type="radio" name="dateGoal" value="${id}" ${
                      state.date.goal === id ? "checked" : ""
                    } />
                    <strong>${title}</strong>
                    <span>${sub}</span>
                  </label>`
              )
              .join("")}
          </div>`;

    default:
      return "";
  }
}

const bookmarkSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>`;

export function renderIdeaCardsHtml(cards: IdeaCard[]): string {
  return cards
    .map(
      (card, index) => `
          <article class="idea-card" data-card-index="${index}">
            <div class="idea-card-header">
              <p class="idea-kicker">Idea ${index + 1}</p>
              <button class="idea-bookmark" aria-label="Save idea ${index + 1}" data-card-index="${index}" type="button">${bookmarkSvg}</button>
            </div>
            <h3>${escapeHtml(card.title)}</h3>
            <p class="idea-why">${escapeHtml(card.why ?? '')}</p>
            <div class="idea-details">
              <div class="idea-detail-row">
                <span class="idea-detail-label">Activity</span>
                <span class="idea-detail-value">${escapeHtml(card.activity)}</span>
              </div>
              <div class="idea-detail-row">
                <span class="idea-detail-label">${card.bar ? 'Bar stop' : 'Dinner'}</span>
                <span class="idea-detail-value">${escapeHtml(card.bar || card.meal || '')}</span>
              </div>
            </div>
            <button class="idea-cta" data-card-index="${index}" type="button">Let's do this ›</button>
          </article>`
    )
    .join("");
}

const styleKeys = ["easy", "spark", "stretch"];
const ideaTitles = ["The easy opener", "The shared spark", "The make-it-a-night version"];

interface CityCard {
  title: string;
  activity: string;
  activityLinks: VenueLink[];
  bar?: string;
  barLinks?: VenueLink[];
  meal?: string;
  mealLinks?: VenueLink[];
}

function buildCityCard(cityKey: string, state: State, index: number): CityCard {
  const city = cityVenues[cityKey];
  const budget = state.you.budget || "2";
  const drinkId = pickDrinkPreference(state);
  const styleKey = styleKeys[index];
  const interestId = pickAnchorInterest(index, state);
  const activity = city.activity[interestId]?.[styleKey] || city.activity.food[styleKey];
  const activityLinks = getVenueLinks(cityKey, 'activity', interestId, styleKey);

  if (index === 1) {
    const bar = city.bar[drinkId] || city.bar.surprise;
    const barLinks = getVenueLinks(cityKey, 'bar', drinkId);
    return { title: ideaTitles[index], activity, activityLinks, bar, barLinks };
  }
  const mealKey = index === 0 ? "easy" : "stretch";
  const meal = city.meal[budget]?.[mealKey] || city.meal["2"][mealKey];
  const mealLinks = getVenueLinks(cityKey, 'meal', budget, mealKey);
  return { title: ideaTitles[index], activity, activityLinks, meal, mealLinks };
}

/** Render the city venue plan for one specific idea index (0 = easy, 1 = spark, 2 = stretch).
 *  Pass `genericCards` (from buildIdeaCard) to layer the original plan idea above each venue. */
export function renderCityPlanHtml(
  cityKey: string,
  state: State,
  ideaIndex?: number,
  genericCards?: IdeaCard[]
): string {
  const city = cityVenues[cityKey];
  const indices = ideaIndex !== undefined ? [ideaIndex] : [0, 1, 2];
  const cityCards = indices.map((i) => buildCityCard(cityKey, state, i));

  return `
      <h3 class="city-plan-heading">${escapeHtml(city.name)} Plan</h3>
      <div class="city-cards">
        ${cityCards.map((cityCard, i) => {
          const generic = genericCards?.[indices[i]];
          const slotLabel = cityCard.bar ? 'Bar stop' : 'Dinner';
          const genericStop = generic ? (generic.bar || generic.meal || '') : '';
          const cityStop   = cityCard.bar || cityCard.meal || '';
          const stopLinks  = cityCard.bar ? (cityCard.barLinks ?? []) : (cityCard.mealLinks ?? []);

          return `
          <article class="idea-card">
            <p class="idea-kicker">Idea ${indices[i] + 1}</p>
            <h3>${escapeHtml(cityCard.title)}</h3>
            ${generic?.why ? `<p class="idea-why">${escapeHtml(generic.why)}</p>` : ''}

            <div class="city-detail-block">
              <p class="city-detail-label">Activity</p>
              ${generic?.activity ? `<p class="city-detail-blueprint">${escapeHtml(generic.activity)}</p>` : ''}
              <p class="city-detail-venue">${escapeHtml(cityCard.activity)}</p>
              ${renderVenueLinks(cityCard.activityLinks)}
            </div>

            <div class="city-detail-block">
              <p class="city-detail-label">${escapeHtml(slotLabel)}</p>
              ${genericStop ? `<p class="city-detail-blueprint">${escapeHtml(genericStop)}</p>` : ''}
              <p class="city-detail-venue">${escapeHtml(cityStop)}</p>
              ${renderVenueLinks(stopLinks)}
            </div>
          </article>`;
        }).join('')}
      </div>`;
}
