# Graph Report - .  (2026-06-19)

## Corpus Check
- 199 files · ~86,163 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 397 nodes · 509 edges · 52 communities (31 shown, 21 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.81)
- Token cost: 15,000 input · 8,500 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Game Components|Game Components]]
- [[_COMMUNITY_Animation System|Animation System]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Setup Screen Implementation|Setup Screen Implementation]]
- [[_COMMUNITY_TypeScript Configuration|TypeScript Configuration]]
- [[_COMMUNITY_Setup Screen Exploration|Setup Screen Exploration]]
- [[_COMMUNITY_Project Documentation|Project Documentation]]
- [[_COMMUNITY_Components Configuration|Components Configuration]]
- [[_COMMUNITY_Layout Components|Layout Components]]
- [[_COMMUNITY_In-Game Screen Exploration|In-Game Screen Exploration]]
- [[_COMMUNITY_Bug Reports|Bug Reports]]
- [[_COMMUNITY_Implementation Orchestration|Implementation Orchestration]]
- [[_COMMUNITY_E2E Testing Architecture|E2E Testing Architecture]]
- [[_COMMUNITY_Validation Fixes|Validation Fixes]]
- [[_COMMUNITY_GameState Context|GameState Context]]
- [[_COMMUNITY_E2E Testing Methodology|E2E Testing Methodology]]
- [[_COMMUNITY_Test Creation Workflow|Test Creation Workflow]]
- [[_COMMUNITY_App Layout|App Layout]]
- [[_COMMUNITY_Four-Tier Testing|Four-Tier Testing]]
- [[_COMMUNITY_Screen State Management|Screen State Management]]
- [[_COMMUNITY_Test Execution|Test Execution]]
- [[_COMMUNITY_Project Origins|Project Origins]]
- [[_COMMUNITY_E2E Testing Documentation|E2E Testing Documentation]]
- [[_COMMUNITY_E2E Test Setup|E2E Test Setup]]
- [[_COMMUNITY_Quality Assurance|Quality Assurance]]
- [[_COMMUNITY_Development Strategy|Development Strategy]]
- [[_COMMUNITY_ESLint Configuration|ESLint Configuration]]
- [[_COMMUNITY_Next.js Configuration|Next.js Configuration]]
- [[_COMMUNITY_PostCSS Configuration|PostCSS Configuration]]
- [[_COMMUNITY_Orchestrator Request|Orchestrator Request]]
- [[_COMMUNITY_Orchestrator Progress|Orchestrator Progress]]
- [[_COMMUNITY_Code Review Briefing|Code Review Briefing]]
- [[_COMMUNITY_Code Review Request|Code Review Request]]
- [[_COMMUNITY_Code Review Progress|Code Review Progress]]
- [[_COMMUNITY_Review Progress Update|Review Progress Update]]
- [[_COMMUNITY_Review Fix Briefing|Review Fix Briefing]]
- [[_COMMUNITY_Review Fix Progress|Review Fix Progress]]
- [[_COMMUNITY_Second Review Briefing|Second Review Briefing]]
- [[_COMMUNITY_Second Review Progress|Second Review Progress]]
- [[_COMMUNITY_Claude Instructions|Claude Instructions]]
- [[_COMMUNITY_Project Readme|Project Readme]]
- [[_COMMUNITY_E2E Orchestration Briefing|E2E Orchestration Briefing]]
- [[_COMMUNITY_E2E Orchestration Request|E2E Orchestration Request]]
- [[_COMMUNITY_E2E Orchestration Progress|E2E Orchestration Progress]]
- [[_COMMUNITY_E2E Test Readiness|E2E Test Readiness]]

## God Nodes (most connected - your core abstractions)
1. `useGameState()` - 16 edges
2. `compilerOptions` - 16 edges
3. `Milestone 2 In-Game Screen Base Implementation` - 15 edges
4. `Milestone 1 Setup Screen Implementation` - 15 edges
5. `cn()` - 11 edges
6. `useReducedMotion()` - 9 edges
7. `Button` - 8 edges
8. `createSafeVariants()` - 8 edges
9. `E2E Test Infrastructure Draft` - 7 edges
10. `AGENTS.md - ScoreBoard Project Guidelines` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Create New Game Screen Design` --exemplifies--> `Mobile-First Design Philosophy`  [EXTRACTED]
  design/Create New Game_Design.png → AGENTS.md
- `Home Screen Design Mockup` --exemplifies--> `Mobile-First Design Philosophy`  [EXTRACTED]
  design/Home_Design.png → AGENTS.md
- `Live Scoreboard Screen Design` --exemplifies--> `Mobile-First Design Philosophy`  [EXTRACTED]
  design/Live Scoreboard_Design.png → AGENTS.md
- `HomeScreen()` --calls--> `useGameState()`  [EXTRACTED]
  .agents/explorer_setup_1/proposed_HomeScreen.tsx → hooks/useGameState.ts
- `SetupScreen()` --calls--> `useGameState()`  [EXTRACTED]
  .agents/explorer_setup_1/proposed_SetupScreen.tsx → hooks/useGameState.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Multi-Agent Verification Workflow for Milestone 1** — agents_sentinel, forensic_auditor_archetype, challenger_archetype, milestone_1_audit_clean, milestone_1_fixed_clean [EXTRACTED 0.90]
- **Bug Discovery and Resolution Cycle** — playerdialog_color_bug, palette_limit_bug, react_async_state_bug, accessibility_gap_inputs, colorduplicate_fix, palette_expansion_fix, accessibility_fix [EXTRACTED 0.95]
- **Milestone 2 Explorer Triad Collaboration** — explorer_ingame_1_original_request, explorer_ingame_2_original_request, explorer_ingame_3_original_request, milestone_2_ingame_screen [EXTRACTED 0.95]
- **Milestone 1 Explorer Triad Collaboration** — explorer_setup_1_original_request, explorer_setup_2_original_request, explorer_setup_3_original_request, milestone_1_setup_screen [EXTRACTED 0.95]
- **In-Game Screen Design Pattern Collection** — ingame_component_design, leader_calculation_algorithm, accessibility_implementation, color_consistency_rule [EXTRACTED 0.90]
- **Setup Screen Architecture Pattern Collection** — global_state_hook, ssr_hydration_safety, stopwatch_non_blocking, color_uniqueness_validation [EXTRACTED 0.90]
- **E2E Test Suite Implementation** — sub_orch_e2e_scope, sub_orch_e2e_test_infra, sub_orch_e2e_test_ready, sub_orch_e2e_handoff, tier1_draft, tier2_draft, four_tier_testing, playwright_test_implementation, opaque_box_testing, feature_inventory, test_coverage_thresholds, e2e_feature_coverage, e2e_boundary_testing [EXTRACTED 0.90]
- **Milestone 1 Review Cycle** — reviewer_setup_1_briefing, reviewer_setup_1_handoff, reviewer_setup_2_briefing, reviewer_setup_2_handoff, duplicate_color_validation_bug, color_palette_exhaustion_bug, adversarial_testing, reviewer_setup_fixed_1_briefing, reviewer_setup_fixed_2_briefing, reviewer_setup_fixed_2_handoff, bug_fix_verification, ssr_hydration_protection, accessibility_labeling, synchronous_validation [EXTRACTED 0.85]
- **Implementation Workflow Hyperedge** — sub_orch_impl, worker_setup, worker_fix_setup, worker_ingame_base [EXTRACTED 0.80]
- **E2E Testing Workflow Hyperedge** — worker_setup_e2e, worker_tests_creation, worker_test_run, worker_publish_docs [EXTRACTED 0.80]
- **Milestone Sequence Hyperedge** — worker_setup, worker_fix_setup, worker_ingame_base [INFERRED 0.75]
- **ScoreBoard Design System** — scoreboard_mobile_first_design, scoreboard_ui_rules, scoreboard_animation_rules, scoreboard_home_design, scoreboard_create_game_design, scoreboard_live_scoreboard_design [EXTRACTED 0.90]
- **ScoreBoard Core Features** — scoreboard_data_model, scoreboard_ux_rules, scoreboard_state_management, scoreboard_feature_inventory [EXTRACTED 0.95]
- **ScoreBoard Testing Framework** — scoreboard_e2e_testing, scoreboard_feature_inventory, scoreboard_test_ready_md [EXTRACTED 0.95]
- **ScoreBoard History Feature Extension** — scoreboard_score_history_feature, scoreboard_undo_redo_architecture, scoreboard_history_tracking_design, scoreboard_data_model, scoreboard_state_management [EXTRACTED 0.90]

## Communities (52 total, 21 thin omitted)

### Community 0 - "Game Components"
Cohesion: 0.07
Nodes (34): BulkActionBar(), BulkActionBarProps, BallConfig, COLOR_TO_AVATAR, FOUL_BALLS, PlayerCard(), SNOOKER_BALLS, COLOR_TO_AVATAR (+26 more)

### Community 1 - "Animation System"
Cohesion: 0.09
Nodes (31): Page(), Footer(), FooterProps, BoltIcon(), GamepadIcon(), PencilIcon(), PlusIcon(), TrashIcon() (+23 more)

### Community 2 - "Package Dependencies"
Cohesion: 0.06
Nodes (33): dependencies, class-variance-authority, clsx, framer-motion, lucide-react, next, @radix-ui/react-avatar, @radix-ui/react-checkbox (+25 more)

### Community 3 - "Setup Screen Implementation"
Cohesion: 0.12
Nodes (15): HomeScreen(), PlayerCardProps, HomeScreen(), MainAppContent(), PALETTE, SetupScreen(), HomeScreen(), InGameScreenPlaceholder() (+7 more)

### Community 4 - "TypeScript Configuration"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 5 - "Setup Screen Exploration"
Cohesion: 0.11
Nodes (19): Color Uniqueness Validation System, Explorer Setup 1 Briefing, Explorer Setup 1 Original Request, Explorer Setup 1 Progress Tracker, Explorer Setup 1 Proposed Project Structure, Explorer Setup 2 Briefing, Explorer Setup 2 Original Request, Explorer Setup 2 Progress Tracker (+11 more)

### Community 6 - "Project Documentation"
Cohesion: 0.14
Nodes (19): AGENTS.md - ScoreBoard Project Guidelines, Framer Motion Animation Guidelines, Create New Game Screen Design, Game Data Model, Score History Tracking Design, Home Screen Design Mockup, Live Scoreboard Screen Design, Mobile-First Design Philosophy (+11 more)

### Community 7 - "Components Configuration"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 8 - "Layout Components"
Cohesion: 0.17
Nodes (8): HomeScreen(), SetupScreen(), Page(), DraftPlayer, Game, PALETTE, Player, useGameState()

### Community 9 - "In-Game Screen Exploration"
Cohesion: 0.13
Nodes (16): Accessibility Implementation Strategy, Player Color Consistency Design Pattern, E2E Test Requirements for In-Game Screen, Explorer Ingame 1 Briefing, Explorer Ingame 1 Original Request, Explorer Ingame 1 Progress Tracker, Explorer Ingame 2 Briefing, Explorer Ingame 2 Original Request (+8 more)

### Community 10 - "Bug Reports"
Cohesion: 0.21
Nodes (14): Accessibility Label-Input Wiring Fix, Accessibility Input Label Gap, Challenger Agent, Color Lock Bug Confirmation, Color Duplicate Check Fix, Forensic Auditor Agent, Milestone 1 Clean Audit Verdict, Milestone 1 Fixed Clean Verdict (+6 more)

### Community 11 - "Implementation Orchestration"
Cohesion: 0.18
Nodes (14): Color Palette Expansion Fix, Milestone 2 Implementation Task, Implementation Orchestrator, Implementation Orchestrator Progress, Implementation Scope and Milestones, Synchronous Validation Fix, Worker Fix Setup, Worker Fix Setup Handoff (+6 more)

### Community 12 - "E2E Testing Architecture"
Cohesion: 0.22
Nodes (10): E2E Testing Verification Plan, GameState Interface, localStorage State Persistence, Project Milestone Tracking, ScoreBoard Project Plan, Player Interface, Playwright E2E Testing Framework, Playwright Test Implementation (+2 more)

### Community 13 - "Validation Fixes"
Cohesion: 0.25
Nodes (9): Accessibility Label Implementation, Bug Fix Verification Process, Color Palette Exhaustion Bug, Duplicate Color Validation Bug, Reviewer 1 Handoff Report, Reviewer 2 Handoff Report, Reviewer Fixed 2 Handoff Report, SSR Hydration Mismatch Protection (+1 more)

### Community 14 - "GameState Context"
Cohesion: 0.22
Nodes (6): Game, GameStateContext, GameStateContextType, Player, SavedState, ScreenType

### Community 15 - "E2E Testing Methodology"
Cohesion: 0.25
Nodes (8): Boundary Value Analysis Testing, Category-Partition Testing, Feature Inventory Management, Opaque-Box Testing Approach, Pairwise Testing, E2E Test Infrastructure Draft, Test Coverage Thresholds, Workload Testing

### Community 16 - "Test Creation Workflow"
Cohesion: 0.33
Nodes (7): Tier 3 Cross-Feature Interactions Test Draft, Tier 4 Real-World Scenarios Test Draft, Worker Publish Docs, Worker Publish Docs Handoff, Worker Publish Docs Progress, Worker Tests Creation, Worker Tests Creation Progress

### Community 17 - "App Layout"
Cohesion: 0.33
Nodes (4): geistMono, geistSans, metadata, viewport

### Community 18 - "Four-Tier Testing"
Cohesion: 0.33
Nodes (6): E2E Boundary Testing, E2E Feature Coverage Testing, Four-Tier E2E Testing Strategy, E2E Testing Scope Definition, Tier 1 Feature Coverage Tests, Tier 2 Boundary Tests

### Community 19 - "Screen State Management"
Cohesion: 0.33
Nodes (5): Game, GameStateContext, GameStateContextType, Player, ScreenState

### Community 20 - "Test Execution"
Cohesion: 0.40
Nodes (5): Playwright E2E Test Execution, E2E Test Results 81 Passed 16 Failed, Worker Test Run, Worker Test Run Handoff, Worker Test Run Progress

### Community 21 - "Project Origins"
Cohesion: 0.50
Nodes (4): Sentinel Agent, Explorer Agent, Milestone 2 In-Game Screen Investigation, ScoreBoard Original User Request

### Community 22 - "E2E Testing Documentation"
Cohesion: 0.67
Nodes (4): E2E Test Architecture, Feature Inventory Matrix, TEST_INFRA.md - E2E Test Architecture, TEST_READY.md - Test Suite Status

### Community 23 - "E2E Test Setup"
Cohesion: 0.67
Nodes (3): Worker Setup E2E, Worker Setup E2E Handoff, Worker Setup E2E Progress

## Knowledge Gaps
- **193 isolated node(s):** `PALETTE`, `Player`, `Game`, `ScreenState`, `GameStateContextType` (+188 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useGameState()` connect `Setup Screen Implementation` to `Animation System`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `cn()` connect `Game Components` to `Animation System`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `PALETTE`, `Player`, `Game` to the rest of the system?**
  _201 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Game Components` be split into smaller, more focused modules?**
  _Cohesion score 0.07390648567119155 - nodes in this community are weakly interconnected._
- **Should `Animation System` be split into smaller, more focused modules?**
  _Cohesion score 0.09102564102564102 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._
- **Should `Setup Screen Implementation` be split into smaller, more focused modules?**
  _Cohesion score 0.12318840579710146 - nodes in this community are weakly interconnected._