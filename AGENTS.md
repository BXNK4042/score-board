<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — ScoreBoard App

## Project Overview

**ScoreBoard** is a mobile-first score-tracking app for tabletop games, card games, and group activities. It lets players create a game session, add up to 10 players with individual colors, and track scores in real time with a live stopwatch, bulk selection actions, and a leader indicator.

The visual direction is **Minimal + Bold + Vibrant Color**: a soft off-white/lavender background (`#F0EFFF` approx), deep indigo brand color (`#4B45D4` approx), large bold typography for scores, and per-player accent colors (indigo, green, pink/red, orange, etc.) displayed as colored left-border accents and icon backgrounds on player cards.

---

## App Structure (Sitemap)

```
ScoreBoard
├── Home Screen
│   └── "Create New Game" button  →  Setup Screen
│
├── Setup Screen
│   ├── Title input ("Enter game title")
│   ├── Player List (up to 10 players)
│   │   └── Each player: Name · Color · Default Score 0
│   │       (edit pencil icon · delete trash icon · colored left-border)
│   ├── Add Player button (+)
│   └── START GAME button  →  In-Game Screen
│
└── In-Game Screen
    ├── Header
    │   ├── Game title (adjustable/editable)
    │   ├── Add Player button (person+ icon)
    │   └── End Game / Confirm button (checkmark icon)
    ├── Stopwatch Banner
    │   └── Live session stopwatch (HH:MM:SS · play/pause)
    ├── Player Cards (scrollable list)
    │   ├── Role label (LEADER / PLAYER 2 / etc.)
    │   ├── Player name (large bold)
    │   ├── Score (extra-large bold, player accent color)
    │   ├── Decrement (−) button
    │   ├── Increment (+) button (player accent color)
    │   └── Selection circle (top-right, toggleable)
    └── Bulk Action Bar (bottom, appears when ≥1 player selected)
        ├── Selection count ("N Player(s) SELECTED FOR BULK")
        ├── Deselect/Reverse selection button
        ├── Bulk Decrement (−) button
        └── Bulk Increment (+) button
```

---

## Screens & UI Specifications

### 1. Home Screen
- Full-screen soft lavender background.
- Top-left: gamepad icon + **ScoreBoard** wordmark in bold indigo.
- Center: large circular indigo `+` button with a soft glow/shadow.
- Below button: "Create New Game" label in bold dark text.

### 2. Setup Screen ("Create New Game")
- Header: same ScoreBoard logo top-left.
- Section title: "Create New Game" in large bold text.
- **Title Field**: rounded card input, label `TITLE` (uppercase small), placeholder "Enter game title".
- **Players Section**:
  - "Players" heading + pill badge showing "N ADDED" count (indigo/pink pill).
  - Each player card: rounded white card with colored left-border accent, avatar icon with matching tinted background, player name, subtitle (optional nickname/mode), edit (pencil) icon, delete (trash, red) icon.
  - `+` FAB button to add a new player.
- **START GAME** button: full-width rounded pill, bold indigo, uppercase with ⚡ icon.

### 3. In-Game Screen
- **Header row**: gamepad icon + editable game title (bold, large, wraps to 2 lines) + `person+` icon button + checkmark icon button (end game).
- **Stopwatch Banner**: full-width rounded pill in bold indigo. Green live dot + "LIVE SESSION" label + large monospace time + play/pause `▶` icon.
- **Player Cards**:
  - Rounded white cards with a colored border outline for the selected/leader card (pink/magenta border for selected).
  - Role label above name: `LEADER` (bold uppercase, player accent color) or `PLAYER N` (grey, uppercase small).
  - `SELECTED` pill badge (pink/magenta) in top-right when selected.
  - Player name in large bold black.
  - Score in extra-large bold (black for leader, grey for others).
  - `−` button: large circle, light grey background.
  - `+` button: large circle, player accent color background, white `+`.
- **Bulk Action Bar** (sticky bottom):
  - Dark indigo pill/card.
  - Deselect icon (grid/unselect) on left.
  - Center: "N Player(s) / SELECTED FOR BULK" text.
  - `−` button (dark circle) and `+` button (white circle) on right.

---

## Data Model

```
Game {
  id: string
  title: string
  createdAt: timestamp
  elapsedSeconds: number      // stopwatch state
  isRunning: boolean
  players: Player[]
}

Player {
  id: string
  name: string
  color: string               // hex accent color
  score: number               // default 0
  isSelected: boolean         // for bulk actions
}
```

---

## Key Behaviors & Logic

- **Player limit**: Maximum 10 players per game.
- **Score**: Integer, can go negative. Default is 0.
- **Leader**: The player with the highest score is automatically labeled "LEADER". Ties: first player in list wins the label.
- **Stopwatch**: Counts up in HH:MM:SS from 00:00:00. Play/pause toggleable from the banner. Timer state is part of the game record.
- **Bulk Selection**: Tapping a player's selection circle toggles them into the bulk-action set. The bulk bar appears when ≥1 player is selected. `+`/`−` in the bulk bar increments/decrements all selected players by 1 simultaneously.
- **End Game**: Tapping the checkmark icon shows a confirmation popup before ending the session.
- **Player color**: Each player has a unique accent color used for their card's left border (setup screen), card border outline (in-game selected), score text, and `+` button background.

---

## Design Tokens

| Token | Value (approx) |
|---|---|
| Background | `#EEEEF8` (soft lavender-white) |
| Brand / Primary | `#4B45D4` (deep indigo) |
| Text Primary | `#1A1A2E` (near-black) |
| Text Secondary | `#9999AA` (mid-grey) |
| Card Background | `#FFFFFF` |
| Danger (delete) | `#E04040` (red) |
| Selected Accent | `#D4156B` (pink/magenta) |
| Live Dot | `#22DD66` (green) |
| Border Radius (card) | `20px` |
| Border Radius (pill/button) | `999px` |
| Font Weight (score) | `900` (black) |
| Font Weight (headings) | `700–800` (bold/extrabold) |

---

## Agent Guidelines

When implementing or modifying this app:

1. **Mobile-first**: All layouts are designed for a single-column phone viewport (~390px wide). Do not introduce multi-column grid layouts on the main screens.

2. **Color consistency**: Each player's accent color must propagate to all four of their UI surfaces: left-border (setup), avatar background, score text (in-game), and `+` button. Never hardcode a single color for all players.

3. **Score display**: The score number must always be the largest typographic element on a player card. Do not shrink it below `48px` regardless of digit count — scale the card height if needed.

4. **Stopwatch is non-blocking**: The timer must continue running while the user scrolls, selects players, or edits scores. Use a dedicated interval that updates state independently of user interaction.

5. **Bulk action bar lifecycle**: The bar must animate in from the bottom when the first player is selected and animate out when all are deselected. It must not overlap the last player card when visible — add bottom padding to the scroll list equal to the bar height.

6. **End-game confirmation**: Never end a game without showing a modal confirmation. Accidental taps on the checkmark must be recoverable.

7. **Leader recalculation**: Recalculate the leader label on every score change, including bulk increments/decrements. The label must update in real time, not on a delay.

8. **Player color picker**: During setup, offer a palette of at least 8 distinct, visually accessible colors. Prevent two players from sharing the same color.

9. **Persistence**: Game state (players, scores, elapsed time, running/paused) should survive an app background/foreground cycle. Use local storage or equivalent on the target platform.

10. **Accessibility**: `+` and `−` buttons must have accessible labels (`aria-label` or equivalent) that include the player name, e.g. "Increase score for Alex". Score regions should be live regions so screen readers announce changes.