# Graph Report - .  (2026-06-28)

## Corpus Check
- Corpus is ~37,912 words - fits in a single context window. You may not need a graph.

## Summary
- 256 nodes · 373 edges · 30 communities (21 shown, 9 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Screen Routing & State|Screen Routing & State]]
- [[_COMMUNITY_In-Game UI & Player Dialog|In-Game UI & Player Dialog]]
- [[_COMMUNITY_Bulk Actions & HomeFooter|Bulk Actions & Home/Footer]]
- [[_COMMUNITY_Dev Dependencies & Tooling|Dev Dependencies & Tooling]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_shadcnui Config|shadcn/ui Config]]
- [[_COMMUNITY_Feature Inventory (Docs)|Feature Inventory (Docs)]]
- [[_COMMUNITY_Player Card & Ball Visuals|Player Card & Ball Visuals]]
- [[_COMMUNITY_Acceptance Criteria (Docs)|Acceptance Criteria (Docs)]]
- [[_COMMUNITY_Runtime Dependencies|Runtime Dependencies]]
- [[_COMMUNITY_Project Guidelines (Docs)|Project Guidelines (Docs)]]
- [[_COMMUNITY_Root Layout & Metadata|Root Layout & Metadata]]
- [[_COMMUNITY_OpenCode Plugin Config|OpenCode Plugin Config]]
- [[_COMMUNITY_OpenCode Plugin Dependency|OpenCode Plugin Dependency]]
- [[_COMMUNITY_Project Overview (Docs)|Project Overview (Docs)]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Player Avatar Assets|Player Avatar Assets]]
- [[_COMMUNITY_CLAUDE Config Reference|CLAUDE Config Reference]]
- [[_COMMUNITY_README|README]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `Feature Inventory (8 Features)` - 14 edges
3. `useReducedMotion()` - 11 edges
4. `cn()` - 11 edges
5. `createSafeVariants()` - 10 edges
6. `Button` - 9 edges
7. `tailwind` - 6 edges
8. `aliases` - 6 edges
9. `scripts` - 6 edges
10. `AGENTS.md - ScoreBoard Project Guidelines` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Create New Game Screen Design` --exemplifies--> `Mobile-First Design Philosophy`  [EXTRACTED]
  design/Create New Game_Design.png → AGENTS.md
- `Home Screen Design Mockup` --exemplifies--> `Mobile-First Design Philosophy`  [EXTRACTED]
  design/Home_Design.png → AGENTS.md
- `Live Scoreboard Screen Design` --exemplifies--> `Mobile-First Design Philosophy`  [EXTRACTED]
  design/Live Scoreboard_Design.png → AGENTS.md
- `DialogFooter()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dialog.tsx → lib/utils.ts
- `Score History Feature with Undo/Redo` --extends--> `Game Data Model`  [INFERRED]
  docs/score-history-undo-redo-plan.md → AGENTS.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **ScoreBoard Design System** — scoreboard_mobile_first_design, scoreboard_ui_rules, scoreboard_animation_rules, scoreboard_home_design, scoreboard_create_game_design, scoreboard_live_scoreboard_design [EXTRACTED 0.90]
- **ScoreBoard Core Features** — scoreboard_data_model, scoreboard_ux_rules, scoreboard_state_management, scoreboard_feature_inventory [EXTRACTED 0.95]
- **ScoreBoard History Feature Extension** — scoreboard_score_history_feature, scoreboard_undo_redo_architecture, scoreboard_history_tracking_design, scoreboard_data_model, scoreboard_state_management [EXTRACTED 0.90]
- **Complete ScoreBoard Feature Set (F1-F8)** — docs_test_infra_f1_game_setup, docs_test_infra_f2_add_player, docs_test_infra_f3_edit_delete_players, docs_test_infra_f4_stopwatch, docs_test_infra_f5_score_actions, docs_test_infra_f6_leader_tracking, docs_test_infra_f7_bulk_selection, docs_test_infra_f8_end_game_persistence [EXTRACTED 1.00]
- **Four-Tier E2E Test Methodology** — docs_test_infra_tier1, docs_test_infra_tier2, docs_test_infra_tier3, docs_test_infra_tier4, docs_test_infra_methodology [EXTRACTED 1.00]
- **Central State Management Pattern** — docs_project_usegamestate_hook, docs_project_screen_routing, docs_project_stopwatch_interval, docs_project_localstorage_persistence [EXTRACTED 1.00]

## Communities (30 total, 9 thin omitted)

### Community 0 - "Screen Routing & State"
Cohesion: 0.10
Nodes (25): Page(), HistoryScreen(), HomeScreen(), InGameScreen(), SetupScreen(), DraftPlayer, Game, ScoreChange (+17 more)

### Community 1 - "In-Game UI & Player Dialog"
Cohesion: 0.12
Nodes (17): COLOR_TO_AVATAR, PlayerDialog(), PALETTE, dialogVariants, cn(), Avatar, AvatarFallback, AvatarImage (+9 more)

### Community 2 - "Bulk Actions & Home/Footer"
Cohesion: 0.15
Nodes (17): BulkActionBar(), BulkActionBarProps, Footer(), FooterProps, BoltIcon(), GamepadIcon(), PencilIcon(), PlusIcon() (+9 more)

### Community 3 - "Dev Dependencies & Tooling"
Cohesion: 0.10
Nodes (19): devDependencies, eslint, eslint-config-next, @playwright/test, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+11 more)

### Community 4 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 5 - "shadcn/ui Config"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 6 - "Feature Inventory (Docs)"
Cohesion: 0.15
Nodes (18): Bulk Action Bar, End Game Confirmation Modal, Leader Calculation Logic, Setup Validation Constraints, F1: Game Setup & Creation, F2: Add Player in Setup, F3: Edit & Delete Players, F5: Individual Player Score Actions (+10 more)

### Community 7 - "Player Card & Ball Visuals"
Cohesion: 0.15
Nodes (14): BallConfig, COLOR_TO_AVATAR, FOUL_BALLS, PlayerCard(), PlayerCardProps, SNOOKER_BALLS, Player, Card (+6 more)

### Community 8 - "Acceptance Criteria (Docs)"
Cohesion: 0.13
Nodes (16): Acceptance Criteria, R1: UI Implementation & Design Fidelity, R2: Core ScoreBoard Features, R3: State Persistence, R4: E2E Verification Suite, LocalStorage Persistence, Mobile-First Layout, Screen Routing State Machine (+8 more)

### Community 9 - "Runtime Dependencies"
Cohesion: 0.14
Nodes (14): dependencies, class-variance-authority, clsx, framer-motion, lucide-react, next, @radix-ui/react-avatar, @radix-ui/react-checkbox (+6 more)

### Community 10 - "Project Guidelines (Docs)"
Cohesion: 0.16
Nodes (14): AGENTS.md - ScoreBoard Project Guidelines, Framer Motion Animation Guidelines, Create New Game Screen Design, Game Data Model, Score History Tracking Design, Home Screen Design Mockup, Live Scoreboard Screen Design, Mobile-First Design Philosophy (+6 more)

### Community 11 - "Root Layout & Metadata"
Cohesion: 0.33
Nodes (4): geistMono, geistSans, metadata, viewport

## Knowledge Gaps
- **117 isolated node(s):** `$schema`, `plugin`, `@opencode-ai/plugin`, `geistSans`, `geistMono` (+112 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Feature Inventory (8 Features)` connect `Feature Inventory (Docs)` to `Acceptance Criteria (Docs)`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Runtime Dependencies` to `Dev Dependencies & Tooling`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `cn()` connect `In-Game UI & Player Dialog` to `Bulk Actions & Home/Footer`, `Player Card & Ball Visuals`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `Feature Inventory (8 Features)` (e.g. with `R2: Core ScoreBoard Features` and `Tier 1: Feature Coverage`) actually correct?**
  _`Feature Inventory (8 Features)` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `plugin`, `@opencode-ai/plugin` to the rest of the system?**
  _117 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Screen Routing & State` be split into smaller, more focused modules?**
  _Cohesion score 0.10483870967741936 - nodes in this community are weakly interconnected._
- **Should `In-Game UI & Player Dialog` be split into smaller, more focused modules?**
  _Cohesion score 0.11954022988505747 - nodes in this community are weakly interconnected._