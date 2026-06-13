# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tier2.spec.ts >> Tier 2 - Boundary & Corner Cases >> 15. In-Game - Add Player mid-game enforces duplicate color checks
- Location: tests/tier2.spec.ts:164:7

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
- text: "0"
- dialog "Add Player":
  - heading "Add Player" [level=2]
  - text: Player Name
  - textbox "Player Name":
    - /placeholder: Enter name
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
  161 |     }
  162 |   });
  163 | 
  164 |   test('15. In-Game - Add Player mid-game enforces duplicate color checks', async ({ page }) => {
  165 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  166 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  167 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  168 |     await page.getByPlaceholder('Enter name').fill('Alice');
  169 |     await page.getByRole('button', { name: 'Save' }).click();
  170 |     await page.getByRole('button', { name: 'START GAME' }).click();
  171 | 
  172 |     await page.getByRole('button', { name: 'Add player mid-game' }).or(page.getByLabel('Add Player')).click();
  173 |     // Try to select color #4B45D4 (Alice's color)
> 174 |     await expect(page.getByRole('button', { name: 'Select color #4B45D4' })).toBeDisabled();
      |                                                                              ^ Error: expect(locator).toBeDisabled() failed
  175 |   });
  176 | 
  177 |   // Feature 6: In-Game Individual Score Actions
  178 |   test('16. In-Game - Score starts at default 0', async ({ page }) => {
  179 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  180 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  181 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  182 |     await page.getByPlaceholder('Enter name').fill('Alice');
  183 |     await page.getByRole('button', { name: 'Save' }).click();
  184 |     await page.getByRole('button', { name: 'START GAME' }).click();
  185 |     await expect(page.locator('[data-testid^="player-score-"]')).toHaveText('0');
  186 |   });
  187 | 
  188 |   test('17. In-Game - Score can go negative on decrement (-)', async ({ page }) => {
  189 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  190 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  191 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  192 |     await page.getByPlaceholder('Enter name').fill('Alice');
  193 |     await page.getByRole('button', { name: 'Save' }).click();
  194 |     await page.getByRole('button', { name: 'START GAME' }).click();
  195 |     await page.getByRole('button', { name: 'Decrease score for Alice' }).click();
  196 |     await expect(page.locator('[data-testid^="player-score-"]')).toHaveText('-1');
  197 |   });
  198 | 
  199 |   test('18. In-Game - Large scores (e.g. 1000+) do not break layout size check', async ({ page }) => {
  200 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  201 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  202 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  203 |     await page.getByPlaceholder('Enter name').fill('Alice');
  204 |     await page.getByRole('button', { name: 'Save' }).click();
  205 |     await page.getByRole('button', { name: 'START GAME' }).click();
  206 |     
  207 |     // Simulate high score by multiple clicks or input (tests readability of large digits)
  208 |     const incBtn = page.getByRole('button', { name: 'Increase score for Alice' });
  209 |     for (let i = 0; i < 15; i++) {
  210 |       await incBtn.click();
  211 |     }
  212 |     await expect(page.locator('text=15')).toBeVisible();
  213 |   });
  214 | 
  215 |   test('19. In-Game - Decimals are not allowed (only integer score shifts)', async ({ page }) => {
  216 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  217 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  218 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  219 |     await page.getByPlaceholder('Enter name').fill('Alice');
  220 |     await page.getByRole('button', { name: 'Save' }).click();
  221 |     await page.getByRole('button', { name: 'START GAME' }).click();
  222 |     await page.getByRole('button', { name: 'Increase score for Alice' }).click();
  223 |     await expect(page.locator('text=1')).toBeVisible();
  224 |     await expect(page.locator('text=1.0')).not.toBeVisible();
  225 |   });
  226 | 
  227 |   // Feature 7: Live Stopwatch States
  228 |   test('20. In-Game - Stopwatch starts at 00:00:00', async ({ page }) => {
  229 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  230 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  231 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  232 |     await page.getByPlaceholder('Enter name').fill('Alice');
  233 |     await page.getByRole('button', { name: 'Save' }).click();
  234 |     await page.getByRole('button', { name: 'START GAME' }).click();
  235 |     await expect(page.getByTestId('stopwatch-display')).toBeVisible();
  236 |   });
  237 | 
  238 |   test('21. In-Game - Stopwatch pause halts timer increment', async ({ page }) => {
  239 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  240 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  241 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  242 |     await page.getByPlaceholder('Enter name').fill('Alice');
  243 |     await page.getByRole('button', { name: 'Save' }).click();
  244 |     await page.getByRole('button', { name: 'START GAME' }).click();
  245 | 
  246 |     // Click pause stopwatch
  247 |     await page.getByRole('button', { name: 'Pause stopwatch' }).click();
  248 |     const pausedTime = await page.locator('.timer-display').or(page.locator('text=00:00:')).textContent();
  249 |     // Wait 2 seconds
  250 |     await page.waitForTimeout(2000);
  251 |     const afterTime = await page.locator('.timer-display').or(page.locator('text=00:00:')).textContent();
  252 |     expect(pausedTime).toBe(afterTime);
  253 |   });
  254 | 
  255 |   test('22. In-Game - Stopwatch play resumes timer increment', async ({ page }) => {
  256 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  257 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  258 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  259 |     await page.getByPlaceholder('Enter name').fill('Alice');
  260 |     await page.getByRole('button', { name: 'Save' }).click();
  261 |     await page.getByRole('button', { name: 'START GAME' }).click();
  262 | 
  263 |     await page.getByRole('button', { name: 'Pause stopwatch' }).click();
  264 |     await page.getByRole('button', { name: 'Start stopwatch' }).click();
  265 |     const baseTime = await page.locator('.timer-display').or(page.locator('text=00:00:')).textContent();
  266 |     await page.waitForTimeout(2000);
  267 |     const newTime = await page.locator('.timer-display').or(page.locator('text=00:00:')).textContent();
  268 |     expect(baseTime).not.toBe(newTime);
  269 |   });
  270 | 
  271 |   test('23. In-Game - Stopwatch elapsed time state survives play/pause cycles', async ({ page }) => {
  272 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  273 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  274 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
```