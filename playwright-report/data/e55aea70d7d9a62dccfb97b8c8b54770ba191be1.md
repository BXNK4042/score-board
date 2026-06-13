# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tier3.spec.ts >> Tier 3 - Cross-Feature Interactions >> 6. In-Game reload preserves selected player checkmarks: if players selected for bulk action, reload retains selection
- Location: tests/tier3.spec.ts:121:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=SELECTED FOR BULK')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=SELECTED FOR BULK')

```

```yaml
- alert
- heading "In-Game Screen" [level=1]
- button "Edit game title": My Game
- button "Add player mid-game"
- button "End Game"
- text: LIVE SESSION 00:00:06
- button "Pause stopwatch"
- text: LEADER SELECTED
- checkbox "Select Alice for bulk action" [checked]
- text: A Alice
- button "Decrease score for Alice": −
- text: "0"
- button "Increase score for Alice": +
- button "Deselect all players"
- button "Reverse selection"
- button "Edit selected player names"
- button "Remove selected players"
- button "Bulk decrement score": −
- button "Bulk increment score": +
```

# Test source

```ts
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
  117 |     const afterTimeText = await page.locator('.timer-display').or(page.locator('text=00:00:')).textContent();
  118 |     expect(initialTimeText).not.toBe(afterTimeText);
  119 |   });
  120 | 
  121 |   test('6. In-Game reload preserves selected player checkmarks: if players selected for bulk action, reload retains selection', async ({ page }) => {
  122 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  123 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  124 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  125 |     await page.getByPlaceholder('Enter name').fill('Alice');
  126 |     await page.getByRole('button', { name: 'Save' }).click();
  127 |     await page.getByRole('button', { name: 'START GAME' }).click();
  128 | 
  129 |     await page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice')).click();
> 130 |     await expect(page.locator('text=SELECTED FOR BULK')).toBeVisible();
      |                                                          ^ Error: expect(locator).toBeVisible() failed
  131 | 
  132 |     await page.reload();
  133 | 
  134 |     // Selection status and bulk action bar should still be visible
  135 |     await expect(page.locator('text=SELECTED FOR BULK')).toBeVisible();
  136 |   });
  137 | 
  138 |   test('7. In-Game leader tie-breaker updates in real time: when player ties leader, tag remains on first player, but if they exceed, tag shifts', async ({ page }) => {
  139 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  140 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  141 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  142 |     await page.getByPlaceholder('Enter name').fill('Alice');
  143 |     await page.getByRole('button', { name: 'Save' }).click();
  144 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  145 |     await page.getByPlaceholder('Enter name').fill('Bob');
  146 |     await page.getByRole('button', { name: 'Save' }).click();
  147 |     await page.getByRole('button', { name: 'START GAME' }).click();
  148 | 
  149 |     // Alice is leader. Let's make Bob score 1.
  150 |     await page.getByRole('button', { name: 'Increase score for Bob' }).click();
  151 |     // Bob should be the leader
  152 |     await expect(page.locator('div').filter({ hasText: 'Bob' }).locator('text=LEADER')).toBeVisible();
  153 | 
  154 |     // Now make Alice score 1 as well.
  155 |     await page.getByRole('button', { name: 'Increase score for Alice' }).click();
  156 |     // Scores are 1-1. Alice is first in list, so Alice should become leader again by tie-break logic.
  157 |     await expect(page.locator('div').filter({ hasText: 'Alice' }).locator('text=LEADER')).toBeVisible();
  158 |     await expect(page.locator('div').filter({ hasText: 'Bob' }).locator('text=PLAYER 2')).toBeVisible();
  159 |   });
  160 | 
  161 |   test('8. End Game confirmation screen interaction: checkmark click shows modal; clicking confirm deletes persisted game state', async ({ page }) => {
  162 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  163 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  164 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  165 |     await page.getByPlaceholder('Enter name').fill('Alice');
  166 |     await page.getByRole('button', { name: 'Save' }).click();
  167 |     await page.getByRole('button', { name: 'START GAME' }).click();
  168 | 
  169 |     // End Game and Confirm
  170 |     await page.getByRole('button', { name: 'End Game' }).or(page.getByLabel('End Game')).click();
  171 |     await page.getByRole('button', { name: 'Yes, End Game' }).or(page.getByRole('button', { name: 'Confirm' })).click();
  172 | 
  173 |     // Verify we are back home and Resume button does not exist (meaning state deleted)
  174 |     await expect(page.getByRole('button', { name: 'Create New Game' })).toBeVisible();
  175 |     await expect(page.getByRole('button', { name: 'RESUME LIVE GAME' })).not.toBeVisible();
  176 |   });
  177 | });
  178 | 
```