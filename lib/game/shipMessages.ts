// Hardcoded grumpy ship messages

export const SHIP_MESSAGES = {
  roomEntry: [
    "Oh good, more goblins.",
    "This room smells worse than the last.",
    "Another identical room. How exciting.",
    "I've seen better dungeons in a dwarf's beard.",
    "Try not to die in this one.",
  ],
  
  combat: [
    "Violence. How predictable.",
    "Try not to bleed on my floors.",
    "Must you make such a mess?",
    "Fighting again? How original.",
    "This is what passes for strategy?",
  ],
  
  takeDamage: [
    "That's coming out of your ale ration.",
    "Pathetic.",
    "You call yourself a dwarf?",
    "Even the ship feels that one.",
    "Maybe dodging isn't your strong suit.",
  ],
  
  enemyKill: [
    "Finally.",
    "One down, countless to go.",
    "About time.",
    "Was that supposed to be impressive?",
    "The goblin fought better than you.",
  ],
  
  findExit: [
    "Leaving already?",
    "The next floor is probably worse.",
    "Running away, are we?",
    "Those stairs look unstable.",
    "I suppose you've earned a deeper grave.",
  ],
  
  doorOpen: [
    "Doors. The pinnacle of dungeon technology.",
    "It's probably trapped.",
    "What's behind door number one?",
    "More rooms. How delightful.",
    "Try not to get lost.",
  ],
  
  death: [
    "I'll add it to your grudge list.",
    "That was embarrassing.",
    "Should I notify your next of kin?",
    "You lasted longer than I expected.",
    "The cleanup fee will be substantial.",
  ],
  
  idle: [
    "Taking a nap?",
    "The goblins are getting bored.",
    "Time is grudge points, you know.",
    "Are you waiting for an invitation?",
    "The dungeon isn't going to clear itself.",
  ]
}

// Get a random message from a category
export function getRandomMessage(category: keyof typeof SHIP_MESSAGES): string {
  const messages = SHIP_MESSAGES[category]
  return messages[Math.floor(Math.random() * messages.length)]
}