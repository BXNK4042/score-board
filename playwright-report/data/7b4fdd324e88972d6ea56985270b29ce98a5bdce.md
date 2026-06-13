# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tier1.spec.ts >> Tier 1 - Feature Coverage (Happy Paths) >> 30. In-Game Bulk Selection - Bulk action bar appears when player selected
- Location: tests/tier1.spec.ts:295:7

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
  204 |   test('23. In-Game Player Cards - Score increment button is visible', async ({ page }) => {
  205 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  206 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  207 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  208 |     await page.getByPlaceholder('Enter name').fill('Alice');
  209 |     await page.getByRole('button', { name: 'Save' }).click();
  210 |     await page.getByRole('button', { name: 'START GAME' }).click();
  211 |     await expect(page.getByRole('button', { name: 'Increase score for Alice' })).toBeVisible();
  212 |   });
  213 | 
  214 |   test('24. In-Game Player Cards - Score decrement button is visible', async ({ page }) => {
  215 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  216 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  217 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  218 |     await page.getByPlaceholder('Enter name').fill('Alice');
  219 |     await page.getByRole('button', { name: 'Save' }).click();
  220 |     await page.getByRole('button', { name: 'START GAME' }).click();
  221 |     await expect(page.getByRole('button', { name: 'Decrease score for Alice' })).toBeVisible();
  222 |   });
  223 | 
  224 |   test('25. In-Game Individual Actions - Increment button increases score', async ({ page }) => {
  225 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  226 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  227 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  228 |     await page.getByPlaceholder('Enter name').fill('Alice');
  229 |     await page.getByRole('button', { name: 'Save' }).click();
  230 |     await page.getByRole('button', { name: 'START GAME' }).click();
  231 |     await page.getByRole('button', { name: 'Increase score for Alice' }).click();
  232 |     await expect(page.locator('[data-testid^="player-score-"]')).toHaveText('1');
  233 |   });
  234 | 
  235 |   test('26. In-Game Individual Actions - Decrement button decreases score', async ({ page }) => {
  236 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  237 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  238 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  239 |     await page.getByPlaceholder('Enter name').fill('Alice');
  240 |     await page.getByRole('button', { name: 'Save' }).click();
  241 |     await page.getByRole('button', { name: 'START GAME' }).click();
  242 |     await page.getByRole('button', { name: 'Decrease score for Alice' }).click();
  243 |     await expect(page.locator('[data-testid^="player-score-"]')).toHaveText('-1');
  244 |   });
  245 | 
  246 |   // Feature 6: In-Game Leader Tracking (In-Game Screen)
  247 |   test('27. In-Game Leader Tracking - Player with highest score is labeled LEADER', async ({ page }) => {
  248 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  249 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  250 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  251 |     await page.getByPlaceholder('Enter name').fill('Alice');
  252 |     await page.getByRole('button', { name: 'Save' }).click();
  253 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  254 |     await page.getByPlaceholder('Enter name').fill('Bob');
  255 |     await page.getByRole('button', { name: 'Save' }).click();
  256 |     await page.getByRole('button', { name: 'START GAME' }).click();
  257 |     // Default score tie: first player Alice should be leader
  258 |     await expect(page.locator('text=LEADER')).toBeVisible();
  259 |   });
  260 | 
  261 |   test('28. In-Game Leader Tracking - Score tie leader is first player in list', async ({ page }) => {
  262 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  263 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  264 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  265 |     await page.getByPlaceholder('Enter name').fill('Alice');
  266 |     await page.getByRole('button', { name: 'Save' }).click();
  267 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  268 |     await page.getByPlaceholder('Enter name').fill('Bob');
  269 |     await page.getByRole('button', { name: 'Save' }).click();
  270 |     await page.getByRole('button', { name: 'START GAME' }).click();
  271 |     
  272 |     // Alice (first) has LEADER, Bob (second) has PLAYER 2 label
  273 |     const aliceCard = page.locator('div').filter({ hasText: 'Alice' });
  274 |     await expect(aliceCard.locator('text=LEADER')).toBeVisible();
  275 |     
  276 |     const bobCard = page.locator('div').filter({ hasText: 'Bob' });
  277 |     await expect(bobCard.locator('text=PLAYER 2')).toBeVisible();
  278 |   });
  279 | 
  280 |   // Feature 7: Bulk Selection & Actions (In-Game Screen)
  281 |   test('29. In-Game Bulk Selection - Selection circle is toggleable', async ({ page }) => {
  282 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  283 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  284 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  285 |     await page.getByPlaceholder('Enter name').fill('Alice');
  286 |     await page.getByRole('button', { name: 'Save' }).click();
  287 |     await page.getByRole('button', { name: 'START GAME' }).click();
  288 |     
  289 |     const selectCircle = page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice'));
  290 |     await expect(selectCircle).toBeVisible();
  291 |     await selectCircle.click();
  292 |     await expect(page.locator('text=1 Player(s) SELECTED FOR BULK')).toBeVisible();
  293 |   });
  294 | 
  295 |   test('30. In-Game Bulk Selection - Bulk action bar appears when player selected', async ({ page }) => {
  296 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  297 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  298 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  299 |     await page.getByPlaceholder('Enter name').fill('Alice');
  300 |     await page.getByRole('button', { name: 'Save' }).click();
  301 |     await page.getByRole('button', { name: 'START GAME' }).click();
  302 |     
  303 |     await page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice')).click();
> 304 |     await expect(page.locator('text=SELECTED FOR BULK')).toBeVisible();
      |                                                          ^ Error: expect(locator).toBeVisible() failed
  305 |   });
  306 | 
  307 |   test('31. In-Game Bulk Selection - Bulk increment is functional', async ({ page }) => {
  308 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  309 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  310 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  311 |     await page.getByPlaceholder('Enter name').fill('Alice');
  312 |     await page.getByRole('button', { name: 'Save' }).click();
  313 |     await page.getByRole('button', { name: 'START GAME' }).click();
  314 |     
  315 |     await page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice')).click();
  316 |     await page.getByRole('button', { name: 'Bulk increment score' }).click();
  317 |     await expect(page.locator('[data-testid^="player-score-"]')).toHaveText('1');
  318 |   });
  319 | 
  320 |   test('32. In-Game Bulk Selection - Bulk decrement is functional', async ({ page }) => {
  321 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  322 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  323 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  324 |     await page.getByPlaceholder('Enter name').fill('Alice');
  325 |     await page.getByRole('button', { name: 'Save' }).click();
  326 |     await page.getByRole('button', { name: 'START GAME' }).click();
  327 |     
  328 |     await page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice')).click();
  329 |     await page.getByRole('button', { name: 'Bulk decrement score' }).click();
  330 |     await expect(page.locator('[data-testid^="player-score-"]')).toHaveText('-1');
  331 |   });
  332 | 
  333 |   test('33. In-Game Bulk Selection - Deselect all button is visible in bulk bar', async ({ page }) => {
  334 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  335 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  336 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  337 |     await page.getByPlaceholder('Enter name').fill('Alice');
  338 |     await page.getByRole('button', { name: 'Save' }).click();
  339 |     await page.getByRole('button', { name: 'START GAME' }).click();
  340 |     
  341 |     await page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice')).click();
  342 |     await expect(page.getByRole('button', { name: 'Deselect all players' }).or(page.getByLabel('Deselect all'))).toBeVisible();
  343 |   });
  344 | 
  345 |   // Feature 8: End Game Flow & Persistence (In-Game Screen & Reload)
  346 |   test('34. End Game - Clicking checkmark button shows confirmation modal', async ({ page }) => {
  347 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  348 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  349 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  350 |     await page.getByPlaceholder('Enter name').fill('Alice');
  351 |     await page.getByRole('button', { name: 'Save' }).click();
  352 |     await page.getByRole('button', { name: 'START GAME' }).click();
  353 |     
  354 |     // Checkmark button or end game button
  355 |     await page.getByRole('button', { name: 'End Game' }).or(page.getByLabel('End Game')).click();
  356 |     await expect(page.locator('text=Are you sure you want to end the game?')).toBeVisible();
  357 |   });
  358 | 
  359 |   test('35. End Game - Cancel button on modal keeps game active', async ({ page }) => {
  360 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  361 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  362 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  363 |     await page.getByPlaceholder('Enter name').fill('Alice');
  364 |     await page.getByRole('button', { name: 'Save' }).click();
  365 |     await page.getByRole('button', { name: 'START GAME' }).click();
  366 |     
  367 |     await page.getByRole('button', { name: 'End Game' }).or(page.getByLabel('End Game')).click();
  368 |     await page.getByRole('button', { name: 'No, Keep Playing' }).or(page.getByRole('button', { name: 'Cancel' })).click();
  369 |     await expect(page.locator('text=In-Game Screen')).toBeVisible();
  370 |   });
  371 | 
  372 |   test('36. End Game - Confirm button on modal ends session', async ({ page }) => {
  373 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  374 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  375 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  376 |     await page.getByPlaceholder('Enter name').fill('Alice');
  377 |     await page.getByRole('button', { name: 'Save' }).click();
  378 |     await page.getByRole('button', { name: 'START GAME' }).click();
  379 |     
  380 |     await page.getByRole('button', { name: 'End Game' }).or(page.getByLabel('End Game')).click();
  381 |     await page.getByRole('button', { name: 'Yes, End Game' }).or(page.getByRole('button', { name: 'Confirm' })).click();
  382 |     await expect(page.getByRole('button', { name: 'Create New Game' })).toBeVisible();
  383 |   });
  384 | 
  385 |   test('37. Setup - Dynamic colors selection changes color button styling', async ({ page }) => {
  386 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  387 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  388 |     const secondColorBtn = page.getByRole('button', { name: 'Select color #22DD66' });
  389 |     await secondColorBtn.click();
  390 |     // Assert style ring is applied or button color matches selection
  391 |     await expect(secondColorBtn).toHaveAttribute('aria-label', 'Select color #22DD66');
  392 |   });
  393 | 
  394 |   test('38. Setup - Edit player name updates input value in edit dialog', async ({ page }) => {
  395 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  396 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  397 |     await page.getByPlaceholder('Enter name').fill('Alice');
  398 |     await page.getByRole('button', { name: 'Save' }).click();
  399 |     await page.getByRole('button', { name: 'Edit Alice' }).click();
  400 |     const input = page.getByPlaceholder('Enter name');
  401 |     await input.fill('Bob');
  402 |     await expect(input).toHaveValue('Bob');
  403 |   });
  404 | 
```