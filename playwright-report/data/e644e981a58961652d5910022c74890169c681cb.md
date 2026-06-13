# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tier3.spec.ts >> Tier 3 - Cross-Feature Interactions >> 1. Setup player edit + color picker interaction: editing a player color frees up their old color in the palette for other players
- Location: tests/tier3.spec.ts:8:7

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
                    - generic: Player 1
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
          - button [disabled]:
            - img
            - generic: START GAME
  - dialog "Add Player" [ref=e11]:
    - heading "Add Player" [level=2] [ref=e13]
    - generic [ref=e14]:
      - generic [ref=e15]:
        - generic [ref=e16]: Player Name
        - textbox "Player Name" [active] [ref=e17]:
          - /placeholder: Enter name
          - text: Player 2
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
  3   | test.describe('Tier 3 - Cross-Feature Interactions', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/');
  6   |   });
  7   | 
  8   |   test('1. Setup player edit + color picker interaction: editing a player color frees up their old color in the palette for other players', async ({ page }) => {
  9   |     await page.getByRole('button', { name: 'Create New Game' }).click();
  10  |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  11  |     await page.getByPlaceholder('Enter name').fill('Player 1');
  12  |     await page.getByRole('button', { name: 'Save' }).click(); // Player 1 gets color #4B45D4 by default
  13  | 
  14  |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  15  |     await page.getByPlaceholder('Enter name').fill('Player 2');
> 16  |     await page.getByRole('button', { name: 'Select color #22DD66' }).click();
      |                                                                      ^ Error: locator.click: Test timeout of 30000ms exceeded.
  17  |     await page.getByRole('button', { name: 'Save' }).click(); // Player 2 gets color #22DD66
  18  | 
  19  |     // Now edit Player 1's color to another color (e.g. #D4156B)
  20  |     await page.getByRole('button', { name: 'Edit Player 1' }).click();
  21  |     await page.getByRole('button', { name: 'Select color #D4156B' }).click();
  22  |     await page.getByRole('button', { name: 'Save' }).click();
  23  | 
  24  |     // Now if we edit Player 2's color, the color #4B45D4 (Player 1's old color) should be enabled/available
  25  |     await page.getByRole('button', { name: 'Edit Player 2' }).click();
  26  |     await expect(page.getByRole('button', { name: 'Select color #4B45D4' })).toBeEnabled();
  27  |   });
  28  | 
  29  |   test('2. In-Game individual score action updates leader label: incrementing a player score above others immediately shifts the LEADER badge to them', async ({ page }) => {
  30  |     await page.getByRole('button', { name: 'Create New Game' }).click();
  31  |     await page.getByPlaceholder('Enter game title').fill('My Game');
  32  |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  33  |     await page.getByPlaceholder('Enter name').fill('Alice');
  34  |     await page.getByRole('button', { name: 'Save' }).click();
  35  |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  36  |     await page.getByPlaceholder('Enter name').fill('Bob');
  37  |     await page.getByRole('button', { name: 'Save' }).click();
  38  |     await page.getByRole('button', { name: 'START GAME' }).click();
  39  | 
  40  |     // Alice is leader initially by default
  41  |     await expect(page.locator('div').filter({ hasText: 'Alice' }).locator('text=LEADER')).toBeVisible();
  42  | 
  43  |     // Click Bob's increment button twice (+2)
  44  |     await page.getByRole('button', { name: 'Increase score for Bob' }).click();
  45  |     await page.getByRole('button', { name: 'Increase score for Bob' }).click();
  46  | 
  47  |     // Bob should now be the leader
  48  |     await expect(page.locator('div').filter({ hasText: 'Bob' }).locator('text=LEADER')).toBeVisible();
  49  |     await expect(page.locator('div').filter({ hasText: 'Alice' }).locator('text=PLAYER 1')).toBeVisible();
  50  |   });
  51  | 
  52  |   test('3. In-Game bulk score action updates leader label: incrementing multiple players simultaneously recalculates leader correctly', async ({ page }) => {
  53  |     await page.getByRole('button', { name: 'Create New Game' }).click();
  54  |     await page.getByPlaceholder('Enter game title').fill('My Game');
  55  |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  56  |     await page.getByPlaceholder('Enter name').fill('Alice');
  57  |     await page.getByRole('button', { name: 'Save' }).click();
  58  |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  59  |     await page.getByPlaceholder('Enter name').fill('Bob');
  60  |     await page.getByRole('button', { name: 'Save' }).click();
  61  |     await page.getByRole('button', { name: 'START GAME' }).click();
  62  | 
  63  |     // Give Bob a score of -2 individually
  64  |     await page.getByRole('button', { name: 'Decrease score for Bob' }).click();
  65  |     await page.getByRole('button', { name: 'Decrease score for Bob' }).click();
  66  | 
  67  |     // Select Alice and Bob for bulk increment
  68  |     await page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice')).click();
  69  |     await page.getByRole('checkbox', { name: 'Select Bob for bulk action' }).or(page.getByLabel('Select Bob')).click();
  70  |     
  71  |     // Bulk increment thrice
  72  |     await page.getByRole('button', { name: 'Bulk increment score' }).click();
  73  |     await page.getByRole('button', { name: 'Bulk increment score' }).click();
  74  |     await page.getByRole('button', { name: 'Bulk increment score' }).click();
  75  | 
  76  |     // Alice: 0 + 3 = 3 (LEADER)
  77  |     // Bob: -2 + 3 = 1
  78  |     await expect(page.locator('div').filter({ hasText: 'Alice' }).locator('text=LEADER')).toBeVisible();
  79  |     await expect(page.locator('[data-testid^="player-card-"]').filter({ hasText: 'Alice' }).locator('[data-testid^="player-score-"]')).toHaveText('3');
  80  |     await expect(page.locator('[data-testid^="player-card-"]').filter({ hasText: 'Bob' }).locator('[data-testid^="player-score-"]')).toHaveText('1');
  81  |   });
  82  | 
  83  |   test('4. In-Game add player during game updates leader calculation: adding a player with score 0 is integrated and leader updated if relevant', async ({ page }) => {
  84  |     await page.getByRole('button', { name: 'Create New Game' }).click();
  85  |     await page.getByPlaceholder('Enter game title').fill('My Game');
  86  |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  87  |     await page.getByPlaceholder('Enter name').fill('Alice');
  88  |     await page.getByRole('button', { name: 'Save' }).click();
  89  |     await page.getByRole('button', { name: 'START GAME' }).click();
  90  | 
  91  |     // Alice is leader at 0. Make Alice's score -2.
  92  |     await page.getByRole('button', { name: 'Decrease score for Alice' }).click();
  93  |     await page.getByRole('button', { name: 'Decrease score for Alice' }).click();
  94  | 
  95  |     // Add Player Bob mid-game. Bob starts at score 0.
  96  |     await page.getByRole('button', { name: 'Add player mid-game' }).or(page.getByLabel('Add Player')).click();
  97  |     await page.getByPlaceholder('Enter name').fill('Bob');
  98  |     await page.getByRole('button', { name: 'Save' }).click();
  99  | 
  100 |     // Bob (score 0) is now higher than Alice (score -2), so Bob should be the leader.
  101 |     await expect(page.locator('div').filter({ hasText: 'Bob' }).locator('text=LEADER')).toBeVisible();
  102 |     await expect(page.locator('div').filter({ hasText: 'Alice' }).locator('text=PLAYER 1')).toBeVisible();
  103 |   });
  104 | 
  105 |   test('5. In-Game bulk selection toggles while stopwatch is running: stopwatch keeps ticking continuously without interruption', async ({ page }) => {
  106 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  107 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  108 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  109 |     await page.getByPlaceholder('Enter name').fill('Alice');
  110 |     await page.getByRole('button', { name: 'Save' }).click();
  111 |     await page.getByRole('button', { name: 'START GAME' }).click();
  112 | 
  113 |     // Stopwatch is running. Click select checkbox.
  114 |     const initialTimeText = await page.locator('.timer-display').or(page.locator('text=00:00:')).textContent();
  115 |     await page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice')).click();
  116 |     await page.waitForTimeout(1500);
```