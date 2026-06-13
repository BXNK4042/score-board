# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: scoreboard.spec.ts >> ScoreBoard Setup Screen & Navigation E2E >> should enforce player limit and unique colors
- Location: tests/scoreboard.spec.ts:72:7

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
  3   | test.describe('ScoreBoard Setup Screen & Navigation E2E', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/');
  6   |   });
  7   | 
  8   |   test('should show Home Screen with Create New Game button', async ({ page }) => {
  9   |     // Check scoreboard brand
  10  |     await expect(page.locator('text=ScoreBoard')).toBeVisible();
  11  |     // Check button is visible
  12  |     const createBtn = page.getByRole('button', { name: 'Create New Game' });
  13  |     await expect(createBtn).toBeVisible();
  14  |   });
  15  | 
  16  |   test('should navigate to Setup Screen and validate inputs', async ({ page }) => {
  17  |     // Click Create New Game
  18  |     await page.getByTestId('create-new-game-button').click();
  19  | 
  20  |     // Verify Setup Screen is visible
  21  |     await expect(page.locator('text=Create New Game')).toBeVisible();
  22  |     await expect(page.getByPlaceholder('Enter game title')).toBeVisible();
  23  | 
  24  |     // START GAME button should be disabled initially
  25  |     const startGameBtn = page.getByRole('button', { name: 'START GAME' });
  26  |     await expect(startGameBtn).toBeDisabled();
  27  | 
  28  |     // Enter title
  29  |     await page.getByPlaceholder('Enter game title').fill('My Board Game');
  30  |     // Button still disabled because 0 players
  31  |     await expect(startGameBtn).toBeDisabled();
  32  | 
  33  |     // Add a player
  34  |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  35  | 
  36  |     // Dialog should be visible
  37  |     await expect(page.getByRole('heading', { name: 'Add Player' })).toBeVisible();
  38  | 
  39  |     // Attempt to save empty name
  40  |     const saveBtn = page.getByRole('button', { name: 'Save' });
  41  |     await saveBtn.click();
  42  |     await expect(page.locator('text=Player name cannot be empty')).toBeVisible();
  43  | 
  44  |     // Fill player name
  45  |     await page.getByPlaceholder('Enter name').fill('Alice');
  46  |     await saveBtn.click();
  47  | 
  48  |     // Check player added to the list
  49  |     await expect(page.locator('text=Alice')).toBeVisible();
  50  |     await expect(page.locator('text=1 ADDED')).toBeVisible();
  51  | 
  52  |     // Now START GAME should be enabled
  53  |     await expect(startGameBtn).toBeEnabled();
  54  | 
  55  |     // Click START GAME
  56  |     await startGameBtn.click();
  57  | 
  58  |     // Should be on In-Game Screen
  59  |     await expect(page.getByTestId('in-game-screen-heading')).toBeVisible();
  60  |     await expect(page.locator('text=My Board Game')).toBeVisible();
  61  |     await expect(page.locator('text=Alice')).toBeVisible();
  62  | 
  63  |     // End Game
  64  |     await page.getByTestId('end-game-button').click();
  65  |     // Confirm end game
  66  |     await page.getByRole('button', { name: 'Yes, End Game' }).click();
  67  | 
  68  |     // Back to Home Screen
  69  |     await expect(page.getByRole('button', { name: 'Create New Game' })).toBeVisible();
  70  |   });
  71  | 
  72  |   test('should enforce player limit and unique colors', async ({ page }) => {
  73  |     await page.getByRole('button', { name: 'Create New Game' }).click();
  74  |     await page.getByPlaceholder('Enter game title').fill('Color Test');
  75  | 
  76  |     // Add first player with default color
  77  |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  78  |     await page.getByPlaceholder('Enter name').fill('Player 1');
  79  |     // Save
  80  |     await page.getByRole('button', { name: 'Save' }).click();
  81  | 
  82  |     // Add second player
  83  |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  84  |     await page.getByPlaceholder('Enter name').fill('Player 2');
  85  |     
  86  |     // The second player tries to select the same color
  87  |     const firstColorBtn = page.getByRole('button', { name: 'Select color #4B45D4' });
  88  |     // It should be disabled
> 89  |     await expect(firstColorBtn).toBeDisabled();
      |                                 ^ Error: expect(locator).toBeDisabled() failed
  90  | 
  91  |     // Choose another color
  92  |     await page.getByRole('button', { name: 'Select color #22DD66' }).click();
  93  |     await page.getByRole('button', { name: 'Save' }).click();
  94  | 
  95  |     // Verify both are added
  96  |     await expect(page.locator('text=Player 1')).toBeVisible();
  97  |     await expect(page.locator('text=Player 2')).toBeVisible();
  98  |     await expect(page.locator('text=2 ADDED')).toBeVisible();
  99  |   });
  100 | });
  101 | 
```