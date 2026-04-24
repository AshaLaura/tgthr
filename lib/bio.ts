/**
 * Generates a short, natural-sounding bio from a user's questionnaire preferences.
 * Each combination of interests + drinks + diet produces a distinct sentence.
 */

// ── Interest phrases ──────────────────────────────────────────────────────────

const singleInterest: Record<string, string> = {
  film:     'Lives for a great story.',
  music:    'Always chasing a good show.',
  food:     'In it for the meal.',
  art:      'Drawn to art and new perspectives.',
  outdoors: 'Happiest when outside.',
  games:    'Brings the playful energy.',
  books:    'A reader and a talker.',
  wellness: 'Moves through life with intention.',
}

// Key pairs — order-independent (sorted alphabetically)
const pairInterest: Record<string, string> = {
  'film+food':      'Good films and great meals.',
  'film+music':     'Into stories and live music.',
  'film+art':       'Stories, screens, and galleries.',
  'film+outdoors':  'A film person who needs fresh air.',
  'film+books':     'Collects good stories in every format.',
  'film+games':     'Narrative games, good films, long evenings.',
  'film+wellness':  'Storytelling and stillness in equal measure.',
  'music+food':     'Lives for a show and a long dinner.',
  'music+art':      'Art and music, always.',
  'music+outdoors': 'Open air and live sound.',
  'music+games':    'Playful energy, good taste in music.',
  'music+books':    'Listens as much as reads.',
  'music+wellness': 'Moves to good music, moves with intention.',
  'food+art':       'Eats well, looks closely.',
  'food+outdoors':  'Farmers markets and long walks.',
  'food+games':     'Competitive about both food and games.',
  'food+books':     'Reads menus like novels.',
  'food+wellness':  'Nourishment over noise.',
  'art+outdoors':   'Finds the beauty inside and out.',
  'art+games':      'Creative and competitive.',
  'art+books':      'Art and ideas, always.',
  'art+wellness':   'Beauty and stillness.',
  'outdoors+games': 'Happiest in motion.',
  'outdoors+books': 'Reads outside when possible.',
  'outdoors+wellness': 'Lives in the body, thinks in the open.',
  'games+books':    'Plays hard, reads harder.',
  'games+wellness': 'Competitive in the gym, playful everywhere else.',
  'books+wellness': 'Reads a lot, moves deliberately.',
}

// Three-interest vibe clusters
function tripleInterest(ids: string[]): string {
  const set = new Set(ids)
  const has = (id: string) => set.has(id)

  if (has('film') && has('music') && has('art'))    return 'Culture first — films, music, art.'
  if (has('food') && has('music') && has('art'))    return 'Feeds all the senses.'
  if (has('food') && has('music') && has('outdoors')) return 'Good food, live music, open air.'
  if (has('outdoors') && has('games') && has('music')) return 'Movement, play, and good sound.'
  if (has('books') && has('art') && has('film'))    return 'Stories in every medium.'
  if (has('wellness') && has('books') && has('outdoors')) return 'Calm, deliberate, and alive outside.'
  if (has('food') && has('books') && has('art'))    return 'Taste, ideas, and beauty.'
  if (has('games') && has('music') && has('food'))  return 'Competitive, loud, and hungry.'

  // Fallback: describe using first two
  const sorted = [...ids].sort()
  const key = sorted.slice(0, 2).join('+')
  return pairInterest[key] || singleInterest[ids[0]] || ''
}

function interestSentence(ids: string[]): string {
  if (ids.length === 0) return ''
  if (ids.length === 1) return singleInterest[ids[0]] || ''
  if (ids.length === 2) {
    const key = [...ids].sort().join('+')
    return pairInterest[key] || `Into ${ids.map(id => id).join(' and ')}.`
  }
  return tripleInterest(ids)
}

// ── Drink + diet sentence ─────────────────────────────────────────────────────

function drinkDietSentence(drinks: string[], dietTags: string[]): string {
  const d = new Set(drinks)
  const t = new Set(dietTags)

  const isVegan       = t.has('vegan')
  const isVeg         = t.has('vegetarian') || isVegan
  const isPesc        = t.has('pescatarian')
  const isGF          = t.has('gluten_free')
  const isDF          = t.has('dairy_free')
  const isNutAllergy  = t.has('nut_allergy')
  const hasDiet       = dietTags.length > 0

  // Build drink phrase
  let drinkPhrase = ''
  if (d.has('na') && drinks.length === 1) {
    drinkPhrase = 'Keeps it alcohol-free'
  } else if (d.has('surprise') && drinks.length === 1) {
    drinkPhrase = 'Open to being surprised at the bar'
  } else if (d.has('coffee') && drinks.length === 1) {
    drinkPhrase = 'Coffee over cocktails'
  } else if (d.has('wine') && d.has('cocktails') && drinks.length === 2) {
    drinkPhrase = 'Wine or a well-made cocktail'
  } else if (d.has('wine') && drinks.length === 1) {
    drinkPhrase = 'A wine person'
  } else if (d.has('cocktails') && drinks.length === 1) {
    drinkPhrase = 'Cocktails, always'
  } else if (d.has('beer') && drinks.length === 1) {
    drinkPhrase = 'Beer first'
  } else if (drinks.length >= 2) {
    const labels: Record<string, string> = {
      wine: 'wine', cocktails: 'cocktails', beer: 'beer',
      na: 'non-alc', coffee: 'coffee', surprise: 'anything good',
    }
    const picked = drinks.slice(0, 2).map(id => labels[id] || id)
    drinkPhrase = `Drinks ${picked.join(' or ')}`
  }

  // Build diet modifier
  let dietPhrase = ''
  if (isVegan) {
    dietPhrase = 'fully plant-based'
  } else if (isVeg && isGF) {
    dietPhrase = 'vegetarian and gluten-free'
  } else if (isVeg) {
    dietPhrase = 'no meat'
  } else if (isPesc && isGF) {
    dietPhrase = 'pescatarian, gluten-free'
  } else if (isPesc) {
    dietPhrase = 'pescatarian'
  } else if (isGF && isDF) {
    dietPhrase = 'gluten-free and dairy-free'
  } else if (isGF) {
    dietPhrase = 'gluten-free'
  } else if (isDF) {
    dietPhrase = 'dairy-free'
  } else if (isNutAllergy) {
    dietPhrase = 'nut allergy'
  }

  // Combine
  if (!drinkPhrase && !hasDiet) return ''
  if (!drinkPhrase && dietPhrase) return `Keeps it ${dietPhrase}.`
  if (drinkPhrase && !dietPhrase) return `${drinkPhrase}.`

  // Natural combos
  if (d.has('na') && isVegan) return 'Alcohol-free and fully plant-based.'
  if (d.has('wine') && isVegan) return 'Wine drinker, keeps it plant-based.'
  if (d.has('wine') && isPesc) return 'Wine with fish, mostly.'
  if (d.has('cocktails') && isVegan) return 'Cocktails, plant-based.'
  if (d.has('cocktails') && isGF) return 'Cocktails, gluten-free.'
  if (d.has('beer') && isPesc) return 'Beer drinker, pescatarian.'
  if (d.has('beer') && isVeg) return 'Beer first, no meat.'

  return `${drinkPhrase}, ${dietPhrase}.`
}

// ── Public API ────────────────────────────────────────────────────────────────

export function generateBio(
  interests: string[],
  drinks: string[],
  dietTags: string[]
): string {
  const s1 = interestSentence(interests)
  const s2 = drinkDietSentence(drinks, dietTags)
  return [s1, s2].filter(Boolean).join(' ')
}
