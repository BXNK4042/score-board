<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — ScoreBoard

## Project Overview

ScoreBoard is a mobile-first score tracking app for board games, card games, and group activities.

Core features:
- Create a game
- Add up to 10 players
- Track scores in real-time
- Live stopwatch
- Bulk score actions
- Automatic leader detection
- Local persistence

Design style:
- Minimal
- Bold
- Vibrant Color

---

## Tech Stack

- Next.js
- TypeScript
- React
- Tailwind CSS
- shadcn/ui
- Framer Motion
- lucide-react

---

## App Structure

### Home
- Create New Game

### Game Setup
- Game title
- Add/Edit/Delete player
- Color picker
- Start game

### In Game
- Editable title
- Stopwatch
- Player list
- Score controls
- Bulk actions
- End game confirmation

---

## Data Model

```ts
type Game = {
  id: string
  title: string
  elapsedSeconds: number
  isRunning: boolean
  players: Player[]
}

type Player = {
  id: string
  name: string
  color: string
  score: number
  isSelected: boolean
}
```

---

## UX Rules

### Mobile First
- Design for phone screens first.
- Single-column layouts only.

### Score Priority
- Score is the most important visual element.
- Never make score smaller than surrounding content.

### Player Limit
- Maximum 10 players.

### Leader Logic
- Highest score becomes LEADER.
- Recalculate immediately after every score change.
- Tie → first player wins.

### Bulk Actions
- Visible only when players are selected.
- Apply changes to all selected players.

### End Game
- Always require confirmation.

### Persistence
- Game state must survive refreshes and app restarts.

---

## UI Rules

### Colors
- Store all colors in CSS variables.
- Never hardcode hex values in components.

### Icons
- Use lucide-react only.
- No inline SVGs.

### Components
Use shadcn/ui components whenever possible:

- Button
- Card
- Input
- Dialog
- Checkbox

Import from:

```ts
@/components/ui/*
```

---

## Accessibility

- All icon buttons require aria-label.
- Score updates should be screen-reader friendly.
- Maintain shadcn/ui accessibility features.

---

## Animation Rules

### Framer Motion

Animate only:
- transform
- opacity

Avoid animating:
- width
- height
- margin
- padding

### Timing

- Micro interactions: 150–200ms
- Standard transitions: 300–400ms
- Screen transitions: 400–500ms

### Performance

- Target 60fps.
- Use GPU-accelerated animations.
- Respect prefers-reduced-motion.

---

## Code Standards

### Styling

Prefer:

```tsx
bg-[var(--app-brand)]
```

Avoid:

```tsx
bg-[#4B45D4]
```

### Class Merging

Use:

```ts
cn()
```

from:

```ts
@/lib/utils
```

### Component Reuse

- Build reusable UI components.
- Avoid duplicate implementations.
- Keep business logic separate from presentation.

---

## Definition of Done

A feature is complete when:

- Mobile-first
- Accessible
- Responsive
- Uses design tokens
- Uses shadcn/ui
- Uses lucide-react
- Animates smoothly
- Persists data correctly
- Passes TypeScript checks