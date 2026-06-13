# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tier4.spec.ts >> Tier 4 - Real-World Application Scenarios >> 2. Scenario 2 - 4-Player Board Game with Ties & Lead Shifts
- Location: tests/tier4.spec.ts:58:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Select color #22DD66' })

```

# Page snapshot

```yaml
- generic:
  - button "Open Next.js Dev Tools" [ref=e6] [cursor=pointer]:
    - img [ref=e7]
  - alert
  - generic:
    - generic:
      - generic:
        - generic:
          - generic:
            - img
            - generic: ScoreBoard
          - generic:
            - button: Cancel
        - heading [level=2]: Create New Game
        - generic:
          - generic:
            - generic: Title
            - textbox:
              - /placeholder: Enter game title
              - text: Board Game Night
        - generic:
          - heading [level=3]: Players
          - generic: 1 ADDED
        - generic:
          - generic:
            - generic:
              - generic:
                - generic:
                  - generic:
                    - generic:
                      - generic: P
                    - generic: P1
                  - generic:
                    - button:
                      - img
                    - button:
                      - img
        - generic:
          - button:
            - img
            - generic: ADD PLAYER
      - generic:
        - generic:
          - button:
            - img
            - generic: START GAME
  - dialog "Add Player" [ref=e11]:
    - heading "Add Player" [level=2] [ref=e13]
    - generic [ref=e14]:
      - generic [ref=e15]:
        - generic [ref=e16]: Player Name
        - textbox "Player Name" [active] [ref=e17]:
          - /placeholder: Enter name
          - text: P2
      - generic [ref=e18]:
        - generic [ref=e19]: Select Color Accent
        - generic [ref=e20]:
          - 'button "Select color #EF4444" [disabled]':
            - generic: ✕
          - 'button "Select color #F97316" [ref=e21]'
          - 'button "Select color #EAB308" [ref=e22]'
          - 'button "Select color #22C55E" [ref=e23]'
          - 'button "Select color #06B6D4" [ref=e24]'
          - 'button "Select color #3B82F6" [ref=e25]'
          - 'button "Select color #8B5CF6" [ref=e26]'
          - 'button "Select color #EC4899" [ref=e27]'
          - 'button "Select color #F43F5E" [ref=e28]'
          - 'button "Select color #84CC16" [ref=e29]'
          - 'button "Select color #0EA5E9" [ref=e30]'
          - 'button "Select color #A855F7" [ref=e31]'
      - generic [ref=e32]:
        - button "Cancel" [ref=e33]
        - button "Save" [ref=e34]
    - button "Close" [ref=e35]:
      - img [ref=e36]
      - generic [ref=e39]: Close
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Tier 4 - Real-World Application Scenarios', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/');
  6   |   });
  7   | 
  8   |   test('1. Scenario 1 - 2-Player Card Game (Happy Path)', async ({ page }) => {
  9   |     // 1. Click Create New Game
  10  |     await page.getByRole('button', { name: 'Create New Game' }).click();
  11  | 
  12  |     // 2. Set title to "Card Game"
  13  |     await page.getByPlaceholder('Enter game title').fill('Card Game');
  14  | 
  15  |     // 3. Add Player Alice
  16  |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  17  |     await page.getByPlaceholder('Enter name').fill('Alice');
  18  |     await page.getByRole('button', { name: 'Save' }).click();
  19  | 
  20  |     // 4. Add Player Bob
  21  |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  22  |     await page.getByPlaceholder('Enter name').fill('Bob');
  23  |     // Select a different color
  24  |     await page.getByRole('button', { name: 'Select color #22DD66' }).click();
  25  |     await page.getByRole('button', { name: 'Save' }).click();
  26  | 
  27  |     // 5. Click Start Game
  28  |     await page.getByRole('button', { name: 'START GAME' }).click();
  29  | 
  30  |     // 6. Verify game name is "Card Game"
  31  |     await expect(page.locator('text=Card Game')).toBeVisible();
  32  | 
  33  |     // 7. Verify Alice is LEADER initially (Alice is first in list)
  34  |     await expect(page.locator('div').filter({ hasText: 'Alice' }).locator('text=LEADER')).toBeVisible();
  35  |     await expect(page.locator('div').filter({ hasText: 'Bob' }).locator('text=PLAYER 2')).toBeVisible();
  36  | 
  37  |     // 8. Increment Alice score twice (+2)
  38  |     const incAlice = page.getByRole('button', { name: 'Increase score for Alice' });
  39  |     await incAlice.click();
  40  |     await incAlice.click();
  41  | 
  42  |     // 9. Decrement Bob score once (-1)
  43  |     await page.getByRole('button', { name: 'Decrease score for Bob' }).click();
  44  | 
  45  |     // 10. Verify score outputs: Alice has 2, Bob has -1
  46  |     await expect(page.locator('[data-testid^="player-card-"]').filter({ hasText: 'Alice' }).locator('[data-testid^="player-score-"]')).toHaveText('2');
  47  |     await expect(page.locator('[data-testid^="player-card-"]').filter({ hasText: 'Bob' }).locator('[data-testid^="player-score-"]')).toHaveText('-1');
  48  | 
  49  |     // 11. Verify Alice remains LEADER
  50  |     await expect(page.locator('div').filter({ hasText: 'Alice' }).locator('text=LEADER')).toBeVisible();
  51  | 
  52  |     // 12. End game and verify redirection
  53  |     await page.getByRole('button', { name: 'End Game' }).or(page.getByLabel('End Game')).click();
  54  |     await page.getByRole('button', { name: 'Yes, End Game' }).or(page.getByRole('button', { name: 'Confirm' })).click();
  55  |     await expect(page.getByRole('button', { name: 'Create New Game' })).toBeVisible();
  56  |   });
  57  | 
  58  |   test('2. Scenario 2 - 4-Player Board Game with Ties & Lead Shifts', async ({ page }) => {
  59  |     // 1. Setup game
  60  |     await page.getByRole('button', { name: 'Create New Game' }).click();
  61  |     await page.getByPlaceholder('Enter game title').fill('Board Game Night');
  62  | 
  63  |     const names = ['P1', 'P2', 'P3', 'P4'];
  64  |     const colors = ['#4B45D4', '#22DD66', '#D4156B', '#FFA500'];
  65  |     
  66  |     for (let i = 0; i < 4; i++) {
  67  |       await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  68  |       await page.getByPlaceholder('Enter name').fill(names[i]);
  69  |       if (i > 0) {
> 70  |         await page.getByRole('button', { name: `Select color ${colors[i]}` }).click();
      |                                                                               ^ Error: locator.click: Test timeout of 30000ms exceeded.
  71  |       }
  72  |       await page.getByRole('button', { name: 'Save' }).click();
  73  |     }
  74  | 
  75  |     await page.getByRole('button', { name: 'START GAME' }).click();
  76  | 
  77  |     // 2. Make P2 score 5
  78  |     const incP2 = page.getByRole('button', { name: 'Increase score for P2' });
  79  |     for (let i = 0; i < 5; i++) {
  80  |       await incP2.click();
  81  |     }
  82  |     // Verify P2 is LEADER
  83  |     await expect(page.locator('div').filter({ hasText: 'P2' }).locator('text=LEADER')).toBeVisible();
  84  | 
  85  |     // 3. Make P4 score 5 (ties with P2)
  86  |     const incP4 = page.getByRole('button', { name: 'Increase score for P4' });
  87  |     for (let i = 0; i < 5; i++) {
  88  |       await incP4.click();
  89  |     }
  90  |     // Scores are P2=5, P4=5. Tie-breaker: P2 is first in list, should remain LEADER
  91  |     await expect(page.locator('div').filter({ hasText: 'P2' }).locator('text=LEADER')).toBeVisible();
  92  |     await expect(page.locator('div').filter({ hasText: 'P4' }).locator('text=PLAYER 4')).toBeVisible();
  93  | 
  94  |     // 4. Increment P4 to 6
  95  |     await incP4.click();
  96  |     // P4 should now become LEADER
  97  |     await expect(page.locator('div').filter({ hasText: 'P4' }).locator('text=LEADER')).toBeVisible();
  98  |     await expect(page.locator('div').filter({ hasText: 'P2' }).locator('text=PLAYER 2')).toBeVisible();
  99  |   });
  100 | 
  101 |   test('3. Scenario 3 - Bulk Scoring & Deselection', async ({ page }) => {
  102 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  103 |     await page.getByPlaceholder('Enter game title').fill('Bulk Action Session');
  104 | 
  105 |     // Add 3 players
  106 |     for (let i = 1; i <= 3; i++) {
  107 |       await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  108 |       await page.getByPlaceholder('Enter name').fill(`Player ${i}`);
  109 |       await page.getByRole('button', { name: 'Save' }).click();
  110 |     }
  111 | 
  112 |     await page.getByRole('button', { name: 'START GAME' }).click();
  113 | 
  114 |     // Select Player 1 and Player 2
  115 |     await page.getByRole('checkbox', { name: 'Select Player 1 for bulk action' }).or(page.getByLabel('Select Player 1')).click();
  116 |     await page.getByRole('checkbox', { name: 'Select Player 2 for bulk action' }).or(page.getByLabel('Select Player 2')).click();
  117 | 
  118 |     // Bulk increment twice (+2)
  119 |     await page.getByRole('button', { name: 'Bulk increment score' }).click();
  120 |     await page.getByRole('button', { name: 'Bulk increment score' }).click();
  121 | 
  122 |     // Verify scores
  123 |     await expect(page.locator('[data-testid^="player-card-"]').filter({ hasText: 'Player 1' }).locator('[data-testid^="player-score-"]')).toHaveText('2');
  124 |     await expect(page.locator('[data-testid^="player-card-"]').filter({ hasText: 'Player 2' }).locator('[data-testid^="player-score-"]')).toHaveText('2');
  125 |     await expect(page.locator('[data-testid^="player-card-"]').filter({ hasText: 'Player 3' }).locator('[data-testid^="player-score-"]')).toHaveText('0');
  126 | 
  127 |     // Verify Player 1 is LEADER (tied score, first in list)
  128 |     await expect(page.locator('div').filter({ hasText: 'Player 1' }).locator('text=LEADER')).toBeVisible();
  129 | 
  130 |     // Deselect all
  131 |     await page.getByRole('button', { name: 'Deselect all players' }).or(page.getByLabel('Deselect all')).click();
  132 | 
  133 |     // Select Player 3
  134 |     await page.getByRole('checkbox', { name: 'Select Player 3 for bulk action' }).or(page.getByLabel('Select Player 3')).click();
  135 | 
  136 |     // Bulk increment thrice (+3)
  137 |     await page.getByRole('button', { name: 'Bulk increment score' }).click();
  138 |     await page.getByRole('button', { name: 'Bulk increment score' }).click();
  139 |     await page.getByRole('button', { name: 'Bulk increment score' }).click();
  140 | 
  141 |     // Player 3 has 3, Player 1 has 2, Player 2 has 2. Player 3 should be LEADER
  142 |     await expect(page.locator('div').filter({ hasText: 'Player 3' }).locator('text=LEADER')).toBeVisible();
  143 |   });
  144 | 
  145 |   test('4. Scenario 4 - Mid-Game Player Addition & Persistence', async ({ page }) => {
  146 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  147 |     await page.getByPlaceholder('Enter game title').fill('Persistent Session');
  148 | 
  149 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  150 |     await page.getByPlaceholder('Enter name').fill('Alice');
  151 |     await page.getByRole('button', { name: 'Save' }).click();
  152 | 
  153 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  154 |     await page.getByPlaceholder('Enter name').fill('Bob');
  155 |     await page.getByRole('button', { name: 'Save' }).click();
  156 | 
  157 |     await page.getByRole('button', { name: 'START GAME' }).click();
  158 | 
  159 |     // Increment Alice
  160 |     await page.getByRole('button', { name: 'Increase score for Alice' }).click();
  161 | 
  162 |     // Reload page
  163 |     await page.reload();
  164 | 
  165 |     // Verify state persisted
  166 |     await expect(page.locator('text=Persistent Session')).toBeVisible();
  167 |     await expect(page.locator('[data-testid^="player-card-"]').filter({ hasText: 'Alice' }).locator('[data-testid^="player-score-"]')).toHaveText('1');
  168 | 
  169 |     // Add Bob mid-game
  170 |     await page.getByRole('button', { name: 'Add player mid-game' }).or(page.getByLabel('Add Player')).click();
```