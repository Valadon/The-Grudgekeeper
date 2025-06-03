// Dwarf name generator system

const DWARF_FIRST_NAMES = [
  // Traditional dwarf names
  'Thorin', 'Gimli', 'Balin', 'Dwalin', 'Fili', 'Kili', 'Dori', 'Nori', 'Ori',
  'Gloin', 'Bifur', 'Bofur', 'Bombur', 'Oin', 'Groin', 'Fundin', 'Thrain',
  'Dain', 'Nain', 'Durin', 'Thror', 'Frerin', 'Farin', 'Borin', 'Florin',
  
  // Grumpy/grudge-themed names
  'Grimli', 'Grumli', 'Sourli', 'Grudgin', 'Gruffin', 'Scowlin', 'Frownin',
  'Grumblin', 'Mutterin', 'Curselin', 'Glowerin', 'Broadin', 'Bearin',
  
  // Ale/drinking themed
  'Alebert', 'Brewlin', 'Hopsin', 'Barlin', 'Stoutin', 'Lagerin', 'Portin',
  'Whiskin', 'Brandin', 'Meadlin', 'Groggin', 'Tipsin', 'Swiggin',
  
  // Mining/craft themed
  'Digger', 'Ironin', 'Steelin', 'Goldwin', 'Silverin', 'Copperin', 'Forgin',
  'Hammerin', 'Anvilin', 'Pickin', 'Spelunkin', 'Gemlin', 'Orin'
]

const DWARF_EPITHETS = [
  // Grudge-themed
  'the Grudgebearer', 'the Resentful', 'the Bitter', 'the Vengeful',
  'the Unforgiving', 'the Scorned', 'the Slighted', 'the Aggrieved',
  'the Perpetually Annoyed', 'the Eternally Grumpy', 'the Forever Salty',
  
  // Death-themed (for humor)
  'the Often Dead', 'the Frequently Deceased', 'the Repeatedly Slain',
  'the Goblin Fodder', 'the Arrow Magnet', 'the Death-Prone',
  'the Unlucky', 'the Doomed', 'the Short-Lived', 'the Expendable',
  
  // Drinking-themed
  'the Ale-Soaked', 'the Perpetually Drunk', 'the Tipsy', 'the Sloshed',
  'the Beer-Bellied', 'the Keg-Drainer', 'the Tavern-Dweller',
  'the Hangover-Haver', 'the Brew-Lover', 'the Mead-Minded',
  
  // Beard-themed
  'the Bearded', 'the Magnificently Bearded', 'the Tanglebeard',
  'the Braidbeard', 'the Longbeard', 'the Greybeard', 'the Redbeard',
  'the Blackbeard', 'the Forkbeard', 'the Bushybeard', 'the Curlybeard',
  
  // Combat-themed
  'the Stubborn', 'the Headstrong', 'the Reckless', 'the Bold',
  'the Axe-Happy', 'the Hammer-Handed', 'the Shield-Splitter',
  'the Goblin-Smasher', 'the Door-Kicker', 'the Wall-Puncher',
  
  // Ship-themed
  'the Ship-Sick', 'the Void-Touched', 'the Space-Addled',
  'the Star-Crossed', 'the Hull-Scraper', 'the Deck-Mopper'
]

export interface DwarfName {
  firstName: string
  epithet: string
  fullName: string
  deathCount: number
}

export function generateDwarfName(deathCount: number): DwarfName {
  // Use better randomization
  const firstNameIndex = Math.floor(Math.random() * DWARF_FIRST_NAMES.length)
  const epithetIndex = Math.floor(Math.random() * DWARF_EPITHETS.length)
  
  const firstName = DWARF_FIRST_NAMES[firstNameIndex]
  const epithet = DWARF_EPITHETS[epithetIndex]
  
  // Add Roman numerals for multiple deaths (starting from II for second dwarf)
  const numerals = ['', ' II', ' III', ' IV', ' V', ' VI', ' VII', ' VIII', ' IX', ' X']
  const numeral = deathCount < numerals.length ? numerals[deathCount] : ` ${deathCount + 1}`
  
  console.log(`Generating dwarf #${deathCount + 1}: ${firstName} ${epithet}${numeral} (indices: ${firstNameIndex}, ${epithetIndex})`)
  
  return {
    firstName,
    epithet,
    fullName: `${firstName} ${epithet}${numeral}`,
    deathCount
  }
}

// Storage keys
const CURRENT_DWARF_KEY = 'grudgekeeper_currentDwarf'
const DEATH_COUNT_KEY = 'grudgekeeper_totalDeathCount'
const DWARF_USED_KEY = 'grudgekeeper_dwarfUsed'

export function getCurrentDwarf(): DwarfName {
  if (typeof window === 'undefined') {
    return generateDwarfName(0)
  }
  
  const stored = localStorage.getItem(CURRENT_DWARF_KEY)
  const wasUsed = localStorage.getItem(DWARF_USED_KEY) === 'true'
  console.log('getCurrentDwarf - stored value:', stored, 'wasUsed:', wasUsed)
  
  // If we have a stored dwarf that hasn't been used yet, return it
  if (stored && !wasUsed) {
    try {
      const parsed = JSON.parse(stored)
      console.log('getCurrentDwarf - returning NEW dwarf (not used yet):', parsed)
      // Mark this dwarf as used now
      localStorage.setItem(DWARF_USED_KEY, 'true')
      return parsed
    } catch (e) {
      console.error('Failed to parse dwarf name:', e)
    }
  }
  
  // If the dwarf was already used or no dwarf exists, generate a new one
  console.log('getCurrentDwarf - generating fresh dwarf (was used or missing)')
  const deathCount = getDeathCount()
  const dwarf = generateDwarfName(deathCount)
  localStorage.setItem(CURRENT_DWARF_KEY, JSON.stringify(dwarf))
  localStorage.setItem(DWARF_USED_KEY, 'true')
  return dwarf
}

export function generateNewDwarf(): DwarfName {
  if (typeof window === 'undefined') {
    return generateDwarfName(0)
  }
  
  // Increment death counter
  const newDeathCount = incrementDeathCount()
  console.log('Death count after increment:', newDeathCount)
  
  // Generate new dwarf with the death count (which represents how many dwarves have died)
  const dwarf = generateDwarfName(newDeathCount)
  console.log('Saving new dwarf to localStorage:', dwarf)
  localStorage.setItem(CURRENT_DWARF_KEY, JSON.stringify(dwarf))
  // Mark this dwarf as NOT used yet (will be used on next game start)
  localStorage.setItem(DWARF_USED_KEY, 'false')
  return dwarf
}

export function getDeathCount(): number {
  if (typeof window === 'undefined') return 0
  const stored = localStorage.getItem(DEATH_COUNT_KEY)
  return stored ? parseInt(stored, 10) : 0
}

export function incrementDeathCount(): number {
  if (typeof window === 'undefined') return 0
  const current = getDeathCount()
  const newCount = current + 1
  localStorage.setItem(DEATH_COUNT_KEY, newCount.toString())
  return newCount
}