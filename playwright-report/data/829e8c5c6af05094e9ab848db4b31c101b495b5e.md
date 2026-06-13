# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tier2.spec.ts >> Tier 2 - Boundary & Corner Cases >> 27. In-Game - Bulk action bar appears ONLY when >=1 player is selected
- Location: tests/tier2.spec.ts:331:7

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
  275 |     await page.getByPlaceholder('Enter name').fill('Alice');
  276 |     await page.getByRole('button', { name: 'Save' }).click();
  277 |     await page.getByRole('button', { name: 'START GAME' }).click();
  278 |     
  279 |     await page.waitForTimeout(1500);
  280 |     await page.getByRole('button', { name: 'Pause stopwatch' }).click();
  281 |     const pausedTime = await page.locator('.timer-display').or(page.locator('text=00:00:')).textContent();
  282 |     expect(pausedTime).not.toBe('00:00:00');
  283 |   });
  284 | 
  285 |   test('24. In-Game - Stopwatch state non-blocking (timer ticks during score change)', async ({ page }) => {
  286 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  287 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  288 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  289 |     await page.getByPlaceholder('Enter name').fill('Alice');
  290 |     await page.getByRole('button', { name: 'Save' }).click();
  291 |     await page.getByRole('button', { name: 'START GAME' }).click();
  292 | 
  293 |     const initialTime = await page.locator('.timer-display').or(page.locator('text=00:00:')).textContent();
  294 |     await page.getByRole('button', { name: 'Increase score for Alice' }).click();
  295 |     await page.waitForTimeout(1500);
  296 |     const afterTime = await page.locator('.timer-display').or(page.locator('text=00:00:')).textContent();
  297 |     expect(initialTime).not.toBe(afterTime);
  298 |   });
  299 | 
  300 |   test('25. In-Game - Stopwatch ticks correctly (seconds count matches elapsed time)', async ({ page }) => {
  301 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  302 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  303 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  304 |     await page.getByPlaceholder('Enter name').fill('Alice');
  305 |     await page.getByRole('button', { name: 'Save' }).click();
  306 |     await page.getByRole('button', { name: 'START GAME' }).click();
  307 |     
  308 |     await page.waitForTimeout(2500);
  309 |     const timeText = await page.locator('.timer-display').or(page.locator('text=00:00:')).textContent();
  310 |     // Should be at least 2 seconds elapsed
  311 |     const seconds = parseInt(timeText?.split(':')[2] || '0');
  312 |     expect(seconds).toBeGreaterThanOrEqual(2);
  313 |   });
  314 | 
  315 |   // Feature 8: Bulk Selection & Actions Boundaries
  316 |   test('26. In-Game - Bulk selection circle toggle active/inactive state check', async ({ page }) => {
  317 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  318 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  319 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  320 |     await page.getByPlaceholder('Enter name').fill('Alice');
  321 |     await page.getByRole('button', { name: 'Save' }).click();
  322 |     await page.getByRole('button', { name: 'START GAME' }).click();
  323 | 
  324 |     const circle = page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice'));
  325 |     await circle.click();
  326 |     await expect(page.locator('text=1 Player(s) SELECTED FOR BULK')).toBeVisible();
  327 |     await circle.click();
  328 |     await expect(page.locator('text=SELECTED FOR BULK')).not.toBeVisible();
  329 |   });
  330 | 
  331 |   test('27. In-Game - Bulk action bar appears ONLY when >=1 player is selected', async ({ page }) => {
  332 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  333 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  334 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  335 |     await page.getByPlaceholder('Enter name').fill('Alice');
  336 |     await page.getByRole('button', { name: 'Save' }).click();
  337 |     await page.getByRole('button', { name: 'START GAME' }).click();
  338 | 
  339 |     await expect(page.locator('text=SELECTED FOR BULK')).not.toBeVisible();
  340 |     await page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice')).click();
> 341 |     await expect(page.locator('text=SELECTED FOR BULK')).toBeVisible();
      |                                                          ^ Error: expect(locator).toBeVisible() failed
  342 |   });
  343 | 
  344 |   test('28. In-Game - Bulk action bar disappears when all players are deselected', async ({ page }) => {
  345 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  346 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  347 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  348 |     await page.getByPlaceholder('Enter name').fill('Alice');
  349 |     await page.getByRole('button', { name: 'Save' }).click();
  350 |     await page.getByRole('button', { name: 'START GAME' }).click();
  351 | 
  352 |     await page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice')).click();
  353 |     await page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice')).click();
  354 |     await expect(page.locator('text=SELECTED FOR BULK')).not.toBeVisible();
  355 |   });
  356 | 
  357 |   test('29. In-Game - Bulk selection count matches selected players', async ({ page }) => {
  358 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  359 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  360 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  361 |     await page.getByPlaceholder('Enter name').fill('Alice');
  362 |     await page.getByRole('button', { name: 'Save' }).click();
  363 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  364 |     await page.getByPlaceholder('Enter name').fill('Bob');
  365 |     await page.getByRole('button', { name: 'Save' }).click();
  366 |     await page.getByRole('button', { name: 'START GAME' }).click();
  367 | 
  368 |     await page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice')).click();
  369 |     await expect(page.locator('text=1 Player(s) SELECTED FOR BULK')).toBeVisible();
  370 |     await page.getByRole('checkbox', { name: 'Select Bob for bulk action' }).or(page.getByLabel('Select Bob')).click();
  371 |     await expect(page.locator('text=2 Player(s) SELECTED FOR BULK')).toBeVisible();
  372 |   });
  373 | 
  374 |   test('30. In-Game - Deselect button in bulk bar clears all selections', async ({ page }) => {
  375 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  376 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  377 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  378 |     await page.getByPlaceholder('Enter name').fill('Alice');
  379 |     await page.getByRole('button', { name: 'Save' }).click();
  380 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  381 |     await page.getByPlaceholder('Enter name').fill('Bob');
  382 |     await page.getByRole('button', { name: 'Save' }).click();
  383 |     await page.getByRole('button', { name: 'START GAME' }).click();
  384 | 
  385 |     await page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice')).click();
  386 |     await page.getByRole('checkbox', { name: 'Select Bob for bulk action' }).or(page.getByLabel('Select Bob')).click();
  387 |     await page.getByRole('button', { name: 'Deselect all players' }).or(page.getByLabel('Deselect all')).click();
  388 |     await expect(page.locator('text=SELECTED FOR BULK')).not.toBeVisible();
  389 |   });
  390 | 
  391 |   test('31. In-Game - Bulk increment increases all selected players by 1', async ({ page }) => {
  392 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  393 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  394 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  395 |     await page.getByPlaceholder('Enter name').fill('Alice');
  396 |     await page.getByRole('button', { name: 'Save' }).click();
  397 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  398 |     await page.getByPlaceholder('Enter name').fill('Bob');
  399 |     await page.getByRole('button', { name: 'Save' }).click();
  400 |     await page.getByRole('button', { name: 'START GAME' }).click();
  401 | 
  402 |     await page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice')).click();
  403 |     await page.getByRole('checkbox', { name: 'Select Bob for bulk action' }).or(page.getByLabel('Select Bob')).click();
  404 |     await page.getByRole('button', { name: 'Bulk increment score' }).click();
  405 |     
  406 |     // Both Alice and Bob should now show score 1
  407 |     await expect(page.locator('[data-testid^="player-card-"]').filter({ hasText: 'Alice' }).locator('[data-testid^="player-score-"]')).toHaveText('1');
  408 |     await expect(page.locator('[data-testid^="player-card-"]').filter({ hasText: 'Bob' }).locator('[data-testid^="player-score-"]')).toHaveText('1');
  409 |   });
  410 | 
  411 |   test('32. In-Game - Bulk decrement decreases all selected players by 1', async ({ page }) => {
  412 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  413 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  414 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  415 |     await page.getByPlaceholder('Enter name').fill('Alice');
  416 |     await page.getByRole('button', { name: 'Save' }).click();
  417 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  418 |     await page.getByPlaceholder('Enter name').fill('Bob');
  419 |     await page.getByRole('button', { name: 'Save' }).click();
  420 |     await page.getByRole('button', { name: 'START GAME' }).click();
  421 | 
  422 |     await page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice')).click();
  423 |     await page.getByRole('checkbox', { name: 'Select Bob for bulk action' }).or(page.getByLabel('Select Bob')).click();
  424 |     await page.getByRole('button', { name: 'Bulk decrement score' }).click();
  425 |     
  426 |     // Both Alice and Bob should now show score -1
  427 |     await expect(page.locator('[data-testid^="player-card-"]').filter({ hasText: 'Alice' }).locator('[data-testid^="player-score-"]')).toHaveText('-1');
  428 |     await expect(page.locator('[data-testid^="player-card-"]').filter({ hasText: 'Bob' }).locator('[data-testid^="player-score-"]')).toHaveText('-1');
  429 |   });
  430 | 
  431 |   // Feature 9: Accessibility Announcements
  432 |   test('33. In-Game - Score live regions accessible (aria-label/live region announcements)', async ({ page }) => {
  433 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  434 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  435 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  436 |     await page.getByPlaceholder('Enter name').fill('Alice');
  437 |     await page.getByRole('button', { name: 'Save' }).click();
  438 |     await page.getByRole('button', { name: 'START GAME' }).click();
  439 | 
  440 |     const region = page.locator('[aria-live="polite"]').or(page.locator('[aria-live="assertive"]')).first();
  441 |     await expect(region).toBeDefined();
```