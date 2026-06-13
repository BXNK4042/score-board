# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tier2.spec.ts >> Tier 2 - Boundary & Corner Cases >> 6. Setup - Choose duplicate color should disable save or disable selection
- Location: tests/tier2.spec.ts:51:7

# Error details

```
Error: expect(locator).toBeDisabled() failed

Locator: getByRole('button', { name: 'Select color #4B45D4' })
Expected: disabled
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeDisabled" with timeout 5000ms
  - waiting for getByRole('button', { name: 'Select color #4B45D4' })

```

```yaml
- dialog "Add Player":
  - heading "Add Player" [level=2]
  - text: Player Name
  - textbox "Player Name":
    - /placeholder: Enter name
    - text: Player 2
  - text: Select Color Accent
  - 'button "Select color #EF4444" [disabled]': ✕
  - 'button "Select color #F97316"'
  - 'button "Select color #EAB308"'
  - 'button "Select color #22C55E"'
  - 'button "Select color #06B6D4"'
  - 'button "Select color #3B82F6"'
  - 'button "Select color #8B5CF6"'
  - 'button "Select color #EC4899"'
  - 'button "Select color #F43F5E"'
  - 'button "Select color #84CC16"'
  - 'button "Select color #0EA5E9"'
  - 'button "Select color #A855F7"'
  - button "Cancel"
  - button "Save"
  - button "Close"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Tier 2 - Boundary & Corner Cases', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/');
  6   |   });
  7   | 
  8   |   // Feature 1: Setup Title Inputs
  9   |   test('1. Setup - Title input max length enforcement (max 40 chars)', async ({ page }) => {
  10  |     await page.getByRole('button', { name: 'Create New Game' }).click();
  11  |     const input = page.getByPlaceholder('Enter game title');
  12  |     const longTitle = 'a'.repeat(50);
  13  |     await input.fill(longTitle);
  14  |     await expect(input).toHaveValue('a'.repeat(40));
  15  |   });
  16  | 
  17  |   test('2. Setup - Start Game with whitespace-only title remains disabled', async ({ page }) => {
  18  |     await page.getByRole('button', { name: 'Create New Game' }).click();
  19  |     await page.getByPlaceholder('Enter game title').fill('    ');
  20  |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  21  |     await page.getByPlaceholder('Enter name').fill('Alice');
  22  |     await page.getByRole('button', { name: 'Save' }).click();
  23  |     await expect(page.getByRole('button', { name: 'START GAME' })).toBeDisabled();
  24  |   });
  25  | 
  26  |   // Feature 2: Setup Player Dialog Name Inputs
  27  |   test('3. Setup - Adding player with max length name (max 20 chars)', async ({ page }) => {
  28  |     await page.getByRole('button', { name: 'Create New Game' }).click();
  29  |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  30  |     const input = page.getByPlaceholder('Enter name');
  31  |     await input.fill('a'.repeat(30));
  32  |     await expect(input).toHaveValue('a'.repeat(20));
  33  |   });
  34  | 
  35  |   test('4. Setup - Try to save player with empty name displays error', async ({ page }) => {
  36  |     await page.getByRole('button', { name: 'Create New Game' }).click();
  37  |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  38  |     await page.getByRole('button', { name: 'Save' }).click();
  39  |     await expect(page.locator('text=Player name cannot be empty')).toBeVisible();
  40  |   });
  41  | 
  42  |   test('5. Setup - Try to save player with whitespace-only name displays error', async ({ page }) => {
  43  |     await page.getByRole('button', { name: 'Create New Game' }).click();
  44  |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  45  |     await page.getByPlaceholder('Enter name').fill('     ');
  46  |     await page.getByRole('button', { name: 'Save' }).click();
  47  |     await expect(page.locator('text=Player name cannot be empty')).toBeVisible();
  48  |   });
  49  | 
  50  |   // Feature 3: Setup Player Color Picker
  51  |   test('6. Setup - Choose duplicate color should disable save or disable selection', async ({ page }) => {
  52  |     await page.getByRole('button', { name: 'Create New Game' }).click();
  53  |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  54  |     await page.getByPlaceholder('Enter name').fill('Player 1');
  55  |     await page.getByRole('button', { name: 'Save' }).click();
  56  | 
  57  |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  58  |     await page.getByPlaceholder('Enter name').fill('Player 2');
  59  |     // First color from palette is default used for Player 1, so it should be disabled
> 60  |     await expect(page.getByRole('button', { name: 'Select color #4B45D4' })).toBeDisabled();
      |                                                                              ^ Error: expect(locator).toBeDisabled() failed
  61  |   });
  62  | 
  63  |   test('7. Setup - Unique colors enforced: 8-color palette available', async ({ page }) => {
  64  |     await page.getByRole('button', { name: 'Create New Game' }).click();
  65  |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  66  |     // Verify there are 12 color buttons in the color picker grid
  67  |     const colorButtons = page.locator('[data-testid^="color-selector-"]');
  68  |     await expect(colorButtons).toHaveCount(12); // standard palette is 12 colors
  69  |   });
  70  | 
  71  |   // Feature 4: Setup Player List Boundaries
  72  |   test('8. Setup - Maximum 10 players limit: ADD PLAYER button disappears at 10 players', async ({ page }) => {
  73  |     await page.getByRole('button', { name: 'Create New Game' }).click();
  74  |     for (let i = 1; i <= 10; i++) {
  75  |       await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  76  |       await page.getByPlaceholder('Enter name').fill(`Player ${i}`);
  77  |       await page.getByRole('button', { name: 'Save' }).click();
  78  |     }
  79  |     await expect(page.getByRole('button', { name: 'ADD PLAYER' })).not.toBeVisible();
  80  |   });
  81  | 
  82  |   test('9. Setup - Minimum 1 player requirement: START GAME disabled at 0 players', async ({ page }) => {
  83  |     await page.getByRole('button', { name: 'Create New Game' }).click();
  84  |     await page.getByPlaceholder('Enter game title').fill('Game Title');
  85  |     await expect(page.getByRole('button', { name: 'START GAME' })).toBeDisabled();
  86  |   });
  87  | 
  88  |   test('10. Setup - Edit player to empty name shows error', async ({ page }) => {
  89  |     await page.getByRole('button', { name: 'Create New Game' }).click();
  90  |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  91  |     await page.getByPlaceholder('Enter name').fill('Alice');
  92  |     await page.getByRole('button', { name: 'Save' }).click();
  93  |     await page.getByRole('button', { name: 'Edit Alice' }).click();
  94  |     await page.getByPlaceholder('Enter name').fill('');
  95  |     await page.getByRole('button', { name: 'Save' }).click();
  96  |     await expect(page.locator('text=Player name cannot be empty')).toBeVisible();
  97  |   });
  98  | 
  99  |   test('11. Setup - Edit player to whitespace-only name shows error', async ({ page }) => {
  100 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  101 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  102 |     await page.getByPlaceholder('Enter name').fill('Alice');
  103 |     await page.getByRole('button', { name: 'Save' }).click();
  104 |     await page.getByRole('button', { name: 'Edit Alice' }).click();
  105 |     await page.getByPlaceholder('Enter name').fill('    ');
  106 |     await page.getByRole('button', { name: 'Save' }).click();
  107 |     await expect(page.locator('text=Player name cannot be empty')).toBeVisible();
  108 |   });
  109 | 
  110 |   // Feature 5: In-Game Setup
  111 |   test('12. In-Game - Game title edit max length enforcement (max 40 chars)', async ({ page }) => {
  112 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  113 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  114 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  115 |     await page.getByPlaceholder('Enter name').fill('Alice');
  116 |     await page.getByRole('button', { name: 'Save' }).click();
  117 |     await page.getByRole('button', { name: 'START GAME' }).click();
  118 | 
  119 |     // Click to edit game title in-game
  120 |     await page.getByRole('button', { name: 'Edit game title' }).or(page.getByLabel('Edit game title')).click();
  121 |     const input = page.getByPlaceholder('Enter game title');
  122 |     await input.fill('b'.repeat(50));
  123 |     await expect(input).toHaveValue('b'.repeat(40));
  124 |   });
  125 | 
  126 |   test('13. In-Game - Add Player modal during game works', async ({ page }) => {
  127 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  128 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  129 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  130 |     await page.getByPlaceholder('Enter name').fill('Alice');
  131 |     await page.getByRole('button', { name: 'Save' }).click();
  132 |     await page.getByRole('button', { name: 'START GAME' }).click();
  133 | 
  134 |     await page.getByRole('button', { name: 'Add player mid-game' }).or(page.getByLabel('Add Player')).click();
  135 |     await expect(page.getByRole('heading', { name: 'Add Player' })).toBeVisible();
  136 |     await page.getByPlaceholder('Enter name').fill('Bob');
  137 |     await page.getByRole('button', { name: 'Save' }).click();
  138 |     await expect(page.locator('text=Bob')).toBeVisible();
  139 |   });
  140 | 
  141 |   test('14. In-Game - Add Player mid-game cannot exceed 10 players total', async ({ page }) => {
  142 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  143 |     for (let i = 1; i <= 9; i++) {
  144 |       await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  145 |       await page.getByPlaceholder('Enter name').fill(`Player ${i}`);
  146 |       await page.getByRole('button', { name: 'Save' }).click();
  147 |     }
  148 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  149 |     await page.getByRole('button', { name: 'START GAME' }).click();
  150 | 
  151 |     // Add 10th player
  152 |     await page.getByRole('button', { name: 'Add player mid-game' }).or(page.getByLabel('Add Player')).click();
  153 |     await page.getByPlaceholder('Enter name').fill('Player 10');
  154 |     await page.getByRole('button', { name: 'Save' }).click();
  155 |     
  156 |     // Add player button should now be disabled or hidden
  157 |     const btn = page.getByRole('button', { name: 'Add player mid-game' }).or(page.getByLabel('Add Player'));
  158 |     const isHidden = await btn.isHidden();
  159 |     if (!isHidden) {
  160 |       await expect(btn).toBeDisabled();
```