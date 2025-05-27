# The Grudgekeeper - ASCII Reference Sheet

## Core ASCII Characters

### Environment Tiles

| Character | Name | CSS Color | Tailwind Class | Description |
|-----------|------|-----------|----------------|-------------|
| `█` | Wall | #666666 | `text-gray-600` | Solid walls, impassable |
| `·` | Floor | #333333 | `text-gray-800` | Empty floor, walkable |
| `+` | Door (Closed) | #cc9900 | `text-yellow-700` | Closed door, can be opened |
| `/` | Door (Open) | #cc9900 | `text-yellow-700` | Open door, walkable |
| `<` | Stairs Up | #00ccff | `text-cyan-400` | Return to previous level |
| `>` | Stairs Down | #00ccff | `text-cyan-400` | Proceed deeper / exit |
| `~` | Liquid | #0066ff | `text-blue-500` | Water, ale, or other liquids |
| `#` | Rubble | #444444 | `text-gray-700` | Destroyed wall, walkable but slow |

### Characters

| Character | Name | CSS Color | Tailwind Class | Description |
|-----------|------|-----------|----------------|-------------|
| `@` | Active Dwarf | #66ff00 | `text-green-400` | Currently controlled dwarf |
| `o` | Inactive Dwarf | #339900 | `text-green-700` | Dwarves in reserve |
| `g` | Goblin | #ff0066 | `text-red-500` | Basic enemy |
| `G` | Goblin Chief | #ff0033 | `text-red-600` | Stronger goblin variant |
| `s` | Space Slug | #9966ff | `text-purple-400` | Slow but tough enemy |
| `S` | Slug Queen | #6633ff | `text-purple-600` | Boss variant |
| `r` | Rust Mite | #ff9900 | `text-orange-500` | Fast, weak enemy |
| `V` | Void Horror | #ff00ff | `text-pink-500` | Dangerous void creature |
| `◙` | Boss | #ff0000 | `text-red-600` | Major boss enemy |

### Items & Objects

| Character | Name | CSS Color | Tailwind Class | Description |
|-----------|------|-----------|----------------|-------------|
| `◊` | Common Mineral | #00ccff | `text-cyan-400` | Basic crafting material |
| `◈` | Rare Mineral | #00ffff | `text-cyan-300` | Valuable crafting material |
| `♦` | Exotic Mineral | #ff00ff | `text-pink-400` | Extremely rare material |
| `▪` | Chest | #ffcc00 | `text-yellow-400` | Lootable container |
| `▫` | Open Chest | #996600 | `text-yellow-700` | Already looted |
| `!` | Item | #ffcc00 | `text-yellow-400` | Generic item pickup |
| `¿` | Unknown Item | #ff6600 | `text-orange-400` | Unidentified item |
| `%` | Food/Ale | #00ff00 | `text-green-400` | Consumable items |
| `†` | Weapon | #ffffff | `text-white` | Weapon pickup |
| `≡` | Armor | #cccccc | `text-gray-300` | Armor pickup |

### Hazards & Effects

| Character | Name | CSS Color | Tailwind Class | Description |
|-----------|------|-----------|----------------|-------------|
| `^` | Trap | #ff6600 | `text-orange-400` | Hidden trap (when revealed) |
| `*` | Explosion | #ff3300 | `text-red-500` | Explosion effect |
| `•` | Projectile | #ffff00 | `text-yellow-300` | Bullet/projectile in flight |
| `¤` | Magic Effect | #ff00ff | `text-pink-400` | Magical energy |
| `○` | Area Effect | #00ff00 | `text-green-400` | AoE indicator |
| `▓` | Gas/Smoke | #666666 | `text-gray-600` | Obscures vision |
| `░` | Weak Gas | #999999 | `text-gray-500` | Dissipating gas |

### Ship UI Elements

| Character | Name | CSS Color | Tailwind Class | Description |
|-----------|------|-----------|----------------|-------------|
| `♥` | Ship Health | #ff0000 | `text-red-500` | Ship mood indicator |
| `⚙` | Ship Organ | #cccccc | `text-gray-300` | Organ status indicator |
| `◯` | Inactive Organ | #666666 | `text-gray-600` | Damaged/offline organ |
| `⬟` | Grudge Crystal | #ff6600 | `text-orange-400` | Stored grudge power |
| `⚡` | Energy | #ffff00 | `text-yellow-300` | Ship energy level |
| `⚑` | Alert | #ff0000 | `text-red-500` | Warning indicator |

### UI Borders & Frames

```
Box Drawing:
┌─────────┐   Standard window
│         │   
└─────────┘   

├─────────┤   Section divider
┬ ┴ ├ ┤      Connectors

Double Lines:
╔═════════╗   Important/Boss areas
║         ║   
╚═════════╝   
```

### Special Characters for Mood

| Mood | Emoji | Color | Tailwind | Description |
|------|-------|-------|----------|-------------|
| Cooperative | `♪` | #66ff00 | `text-green-400` | Ship is happy |
| Grumpy | `≈` | #ff6600 | `text-orange-400` | Ship is annoyed |
| Grudging | `≠` | #ff3300 | `text-red-600` | Ship is angry |
| Furious | `╬` | #ff0000 | `text-red-500` | Ship is enraged |

## Color Palette Quick Reference

### Status Colors
- Health Full: `#66ff00` / `text-green-400`
- Health Mid: `#ffcc00` / `text-yellow-400`
- Health Low: `#ff6600` / `text-orange-400`
- Health Critical: `#ff0000` / `text-red-500`

### Rarity Colors
- Common: `#cccccc` / `text-gray-300`
- Uncommon: `#00ff00` / `text-green-400`
- Rare: `#0099ff` / `text-blue-400`
- Epic: `#ff00ff` / `text-pink-400`
- Legendary: `#ff9900` / `text-orange-400`

## Animation Patterns (Phase 8+)

### Flashing (Critical Warning)
```css
/* Alternate between two colors */
@keyframes flash {
  0%, 50% { color: #ff0000; }
  51%, 100% { color: #ffffff; }
}
```

### Pulsing (Item Glow)
```css
/* Gentle brightness pulse */
@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1.0; }
}
```

## Usage Examples

### Basic Room Layout
```
██████████
█········█
█·o····g·█
█········█
█···@····█
█········█
█···▪····█
█········█
█······>·█
██████████
```

### Combat Scene
```
██████████
█·····•··█  • = projectile
█·o···*g·█  * = explosion  
█··•·····█  
█···@····█  @ = player
█········█  g = goblin
█···^····█  ^ = trap
█········█  
█········█
██████████
```

### Ship Mood Display
```
Ship: [≈ Grumpy] ♥♥♥♡♡
"Another expedition? I suppose..."
```

## Implementation Notes

1. **Always use monospace font** (Space Mono)
2. **Keep character width consistent** - all ASCII should occupy same space
3. **Colors should be readable** on black background
4. **Reserve special characters** - don't reuse symbols for different purposes
5. **Test visibility** - ensure all characters are distinct at game size

## Future Expansions

Reserved characters for later phases:
- `$` - Currency/special treasure
- `&` - NPC/Merchant
- `?` - Mystery/secret
- `=` - Bridge/walkway
- `|` `-` - Directional indicators
- `※` - Artifact/unique item
- `◆` - Void crystal
- `★` - Achievement/milestone

---

*Remember: ASCII is our friend in early development. It's fast, clear, and doesn't distract from gameplay!*