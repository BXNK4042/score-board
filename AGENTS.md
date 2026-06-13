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

11. **Icon System (lucide-react)**: All icons must use lucide-react components instead of custom SVG implementations. Icon wrapper components (e.g., `GamepadIcon`, `PlusIcon`) should maintain consistent styling and be exported from their screen files for reuse. Never create inline SVG icons — always import from lucide-react and apply consistent `strokeWidth` and sizing props.

12. **Color Management (global.css)**: All colors must be defined as CSS variables in `app/globals.css` and referenced using Tailwind's arbitrary value syntax (e.g., `bg-[var(--app-brand)]`). Never hardcode hex colors in components. The color system includes semantic variables for background, text, brand, danger, success, and UI elements. This enables global theming, consistent design tokens, and future dark mode support.

13. **CSS Variable Naming**: Follow the `--app-*` naming convention for all application-specific CSS variables to distinguish them from framework defaults. Use semantic names like `--app-text-primary` rather than generic names like `--text-color` to indicate purpose and usage context.

14. **shadcn/ui Integration**: All shadcn/ui components MUST be imported from `@/components/ui/*`. Use the `cn()` utility from `@/lib/utils` for conditional class merging. Preserve the `--app-*` CSS variable system for ScoreBoard-specific theming. shadcn/ui components SHOULD be customized with CSS variables, not hardcoded values. Component variants (size, variant) MUST align with mobile-first design constraints.

15. **Component Customization Rules**: shadcn/ui component props TAKE PRECEDENCE over custom className overrides. When customizing shadcn/ui components, prefer variant props over arbitrary Tailwind classes. Maintain consistent border-radius: Cards/inputs use 20px, full buttons use 999px. Preserve existing spacing and gap patterns in component layouts. Icon buttons SHOULD use `size="icon"` prop for consistent sizing.

16. **Dual CSS Variable System**: The project uses TWO separate CSS variable systems: (1) `--app-*` variables for ScoreBoard-specific styling (brand colors, player accents, game theming) and (2) shadcn/ui variables (e.g., `--primary`, `--muted`, `--destructive`) for component library theming. Use `--app-*` variables for game-specific colors and shadcn/ui variables for component-specific theming. NEVER mix variable systems in the same component unless intentional.

17. **Component Usage Guidelines**:
    - **Dialog**: Use for all modal overlays (add player, confirmations, bulk operations). Maintain proper open/close state management with `onOpenChange` callbacks.
    - **Button**: Replace all custom button elements. Use `variant="outline"` for secondary actions, `variant="ghost"` for icon-only buttons, `size="icon"` for circular icon buttons.
    - **Card**: Use for player cards and content containers. Maintain mobile-first padding (p-4) and border-radius (20px) patterns.
    - **Input/Label**: Replace all custom input elements. Maintain label association with `htmlFor` props and focus states with CSS variables.
    - **Checkbox**: Use for player selection and form inputs. Apply custom styling with CSS variables while maintaining accessibility.

18. **Mobile-First shadcn/ui Constraints**: All shadcn/ui components must respect 390px max-width layouts. Dialog components need proper mobile sizing (max-w-[390px] or smaller). Button sizing must work well on touch targets (minimum 44px for interactive elements). Component padding and spacing must maintain consistent mobile patterns.

19. **Accessibility with shadcn/ui**: shadcn/ui components provide built-in accessibility features that must be preserved. All icon buttons MUST include proper `aria-label` attributes describing the action. Form components maintain proper label association for screen readers. Dialog components handle focus trapping and ESC key closing automatically.

20. **Styling Consistency**: When customizing shadcn/ui components, prioritize CSS variable references over hardcoded values. Use `bg-[var(--app-brand)]` instead of `bg-[#4B45D4]`. Maintain consistent shadow patterns (shadow-sm, shadow-md, shadow-xl) across components. Preserve transform effects (active:scale-95, active:scale-98) for interactive feedback.

21. **Animation Performance**: All animations MUST use GPU-accelerated properties (transform, opacity) exclusively. Never animate layout-triggering properties (width, height, margin, padding) directly. Use framer-motion's `layout` prop for smooth layout transitions with FLIP technique. Target 60fps for all animations on mobile devices. Limit simultaneous animated elements to under 10. Test animations on actual mobile devices (390px viewport) to ensure smooth performance.

22. **Reduced Motion Support**: All animations MUST respect `prefers-reduced-motion` user preferences. Provide reduced-motion alternatives that disable or simplify animations while maintaining functionality. Use the `useReducedMotion` hook from `@/lib/animations` for conditional animation logic. Apply safe variants that disable motion effects when users prefer reduced motion.

23. **Animation Duration Standards**: Standard animation duration is 300-400ms. Screen transitions can use 400-500ms. Micro-interactions (button press) should use 150-200ms. Spring animations should use `damping: 20-30` and `stiffness: 300-400` for natural mobile feel. Use presets from `@/lib/animations` for consistent timing across the app.

24. **Accessibility with Animations**: Animated elements MUST maintain accessibility features. Dialogs MUST trap focus during animations. List items MUST maintain proper ARIA labels during animated reordering. Score updates MUST preserve `aria-live` announcements. Ensure keyboard navigation works without animation delays and that focus management remains intact during transitions.

25. **Animation Bundle Size**: Import framer-motion components individually to minimize bundle size. Use tree-shaking-friendly imports: `import { motion, AnimatePresence } from 'framer-motion'`. Avoid importing the entire library. Monitor bundle size impact and keep under 50KB increase. Import animation utilities from `@/lib/animations` instead of duplicating code.

26. **Mobile Animation Performance**: Target 60fps for all animations on mobile devices. Limit simultaneous animated elements to under 10. Test animations on actual mobile devices (390px viewport) to ensure smooth performance. Use GPU-accelerated transforms exclusively (translate, scale, rotate) and avoid animating layout-triggering properties. Monitor frame rates using Chrome DevTools during development.

27. **Accordion/Collapsible Height Animation Guidelines**: When animating the height of a conditionally rendered container (e.g. drawers/accordions) inside a parent list item that uses Framer Motion's `layout` propagation:
    - **Avoid `layout` on height-animating elements**: Do not apply the `layout` prop directly to the component that explicitly animates `height` (e.g., from `0` to `auto`). This prevents scale projection calculations from clashing with height interpolations, which causes stutters/snaps.
    - **Use `layout="position"` on parent**: Use `layout="position"` on the parent list item container. This prevents parent-level size/height scaling transforms from stretching inner text and content during resizing, while still allowing neighboring elements to slide smoothly.
    - **Clean animating wrapper**: The outer height-animating container must have NO direct padding, margins, borders, or background styles. Apply these layout details (e.g., `mt-2`, `border-2`, backgrounds) on an **inner wrapper `div`** instead, ensuring the outer container can collapse to exactly `0px` total height on exit.
    - **Avoid Flexbox gaps on conditional components**: Do not use `gap-*` on parent flexbox containers that hold conditional child components. On unmount, the parent flex box collapses the gap instantly, creating a snap/jump. Instead, remove the container gap and use top/bottom margins (e.g., `mt-*`) on individual child components.