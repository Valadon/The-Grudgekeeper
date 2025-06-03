// Ship messages by mood level
// Mood 0-2: Grumpy (default)
// Mood 3-4: Grudging Respect
// Mood 5: Almost Impressed

type ShipMood = 'grumpy' | 'grudging' | 'impressed'

interface MoodMessages {
  grumpy: Record<string, string[]>
  grudging: Record<string, string[]>
  impressed: Record<string, string[]>
}

export function getShipMood(expeditionRank: number): ShipMood {
  if (expeditionRank >= 5) return 'impressed'
  if (expeditionRank >= 3) return 'grudging'
  return 'grumpy'
}

export function getMoodColor(mood: ShipMood): string {
  switch (mood) {
    case 'impressed': return '#00ff00'  // Green
    case 'grudging': return '#ffff00'   // Yellow
    case 'grumpy': return '#ff9900'     // Orange
  }
}

export const MOOD_MESSAGES: MoodMessages = {
  grumpy: {
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
  },
  
  grudging: {
    roomEntry: [
      "Not terrible navigation, dwarf.",
      "This room has potential for carnage.",
      "You might actually survive this one.",
      "I've seen worse entrances.",
      "Your beard isn't trembling. Progress.",
    ],
    combat: [
      "Adequate form.",
      "You're learning.",
      "That almost looked intentional.",
      "Better than last time.",
      "Keep your guard up.",
    ],
    takeDamage: [
      "Walk it off.",
      "You've had worse.",
      "Pain builds character.",
      "Still standing, I see.",
      "Your ancestors felt worse.",
    ],
    enemyKill: [
      "Efficient.",
      "Clean kill.",
      "You're improving.",
      "That one counted.",
      "Acceptable technique.",
    ],
    findExit: [
      "You've earned your descent.",
      "Deeper we go.",
      "The ship approves... barely.",
      "Your progress is noted.",
      "Ready for a real challenge?",
    ],
    doorOpen: [
      "Smart choice.",
      "No hesitation. Good.",
      "You're getting the hang of this.",
      "Proceed with caution.",
      "Your instincts are improving.",
    ],
    death: [
      "You fought with honor.",
      "A worthy attempt.",
      "Your grudge will be remembered.",
      "Better than most.",
      "The ship salutes your effort.",
    ],
    idle: [
      "Planning your next move?",
      "Take your time, warrior.",
      "The ship awaits your decision.",
      "Contemplation has merit.",
      "Choose wisely.",
    ]
  },
  
  impressed: {
    roomEntry: [
      "The dungeon trembles at your approach!",
      "Another room to conquer, champion.",
      "Your reputation precedes you.",
      "The ship sings of your deeds!",
      "March forth, legendary dwarf!",
    ],
    combat: [
      "Masterful!",
      "Your enemies flee in terror!",
      "Poetry in motion!",
      "The ancestors smile upon you!",
      "Flawless execution!",
    ],
    takeDamage: [
      "A mere scratch!",
      "You barely flinched!",
      "Pain means nothing to you!",
      "Your resilience is legendary!",
      "'Tis but a flesh wound!",
    ],
    enemyKill: [
      "GLORIOUS!",
      "Another one for the saga!",
      "Your axe thirsts for more!",
      "Magnificent strike!",
      "The ship roars approval!",
    ],
    findExit: [
      "Onward to greater glory!",
      "The depths await their champion!",
      "Your legend grows!",
      "Even deeper challenges await!",
      "The ship is honored to carry you!",
    ],
    doorOpen: [
      "Nothing can stop you!",
      "Doors yield to your might!",
      "Forward, unstoppable one!",
      "Your path is clear!",
      "Destiny awaits beyond!",
    ],
    death: [
      "A LEGENDARY LAST STAND!",
      "Songs will be sung of this battle!",
      "You fell as a true warrior!",
      "Your grudge will echo through eternity!",
      "The ship weeps for its champion!",
    ],
    idle: [
      "The champion surveys the battlefield.",
      "Even legends need rest.",
      "Planning your next triumph?",
      "The ship eagerly awaits your command.",
      "Your presence alone intimidates foes.",
    ]
  }
}

// Keep the old SHIP_MESSAGES for backward compatibility
export const SHIP_MESSAGES = MOOD_MESSAGES.grumpy

// Get a random message from a category based on expedition rank
export function getRandomMessage(category: keyof typeof SHIP_MESSAGES, expeditionRank: number = 0): string {
  const mood = getShipMood(expeditionRank)
  const messages = MOOD_MESSAGES[mood][category]
  return messages[Math.floor(Math.random() * messages.length)]
}