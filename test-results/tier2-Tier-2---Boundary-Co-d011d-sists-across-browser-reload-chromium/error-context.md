# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tier2.spec.ts >> Tier 2 - Boundary & Corner Cases >> 39. Persistence - Game state persists across browser reload
- Location: tests/tier2.spec.ts:521:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('div').filter({ hasText: 'Alice' }).locator('text=1')
Expected: visible
Error: strict mode violation: locator('div').filter({ hasText: 'Alice' }).locator('text=1') resolved to 2 elements:
    1) <span data-testid="stopwatch-display" class="timer-display font-mono text-2xl font-black tracking-wider">00:00:01</span> aka getByTestId('stopwatch-display')
    2) <div aria-live="polite" class="text-5xl font-black min-w-[60px] text-center" data-testid="player-score-e07c9db7-70dc-4029-afaa-948d5f1b65da">1</div> aka getByTestId('player-score-e07c9db7-70dc-4029-afaa-948d5f1b65da')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('div').filter({ hasText: 'Alice' }).locator('text=1')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - heading "In-Game Screen" [level=1] [ref=e4]
    - generic [ref=e5]:
      - generic [ref=e6]:
        - generic [ref=e7]:
          - img [ref=e8]
          - button "Edit game title" [ref=e10]: Persisted Game
        - generic [ref=e11]:
          - button "Add player mid-game" [ref=e12]:
            - img
          - button "End Game" [ref=e13]:
            - img
      - generic [ref=e14]:
        - generic [ref=e17]: LIVE SESSION
        - generic [ref=e18]:
          - generic [ref=e19]: 00:00:01
          - button "Pause stopwatch" [ref=e20]:
            - img
      - generic [ref=e25] [cursor=pointer]:
        - generic [ref=e26]:
          - generic [ref=e27]: LEADER
          - checkbox "Select Alice for bulk action" [ref=e29]
        - generic [ref=e30]:
          - generic [ref=e31]:
            - generic [ref=e33]: A
            - generic [ref=e34]: Alice
          - generic [ref=e35]:
            - button "Decrease score for Alice" [ref=e36]: −
            - generic [ref=e37]: "1"
            - button "Increase score for Alice" [ref=e38]: +
  - button "Open Next.js Dev Tools" [ref=e44] [cursor=pointer]:
    - img [ref=e45]
  - alert [ref=e48]
```

# Test source

```ts
  436 |     await page.getByPlaceholder('Enter name').fill('Alice');
  437 |     await page.getByRole('button', { name: 'Save' }).click();
  438 |     await page.getByRole('button', { name: 'START GAME' }).click();
  439 | 
  440 |     const region = page.locator('[aria-live="polite"]').or(page.locator('[aria-live="assertive"]')).first();
  441 |     await expect(region).toBeDefined();
  442 |   });
  443 | 
  444 |   test('34. In-Game - Player name accessibility labels on individual actions', async ({ page }) => {
  445 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  446 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  447 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  448 |     await page.getByPlaceholder('Enter name').fill('Alice');
  449 |     await page.getByRole('button', { name: 'Save' }).click();
  450 |     await page.getByRole('button', { name: 'START GAME' }).click();
  451 | 
  452 |     await expect(page.getByRole('button', { name: 'Increase score for Alice' })).toBeVisible();
  453 |     await expect(page.getByRole('button', { name: 'Decrease score for Alice' })).toBeVisible();
  454 |   });
  455 | 
  456 |   // Feature 10: Tied Leaders & Tied-Score Leader Label
  457 |   test('35. In-Game - Leader tied scores: first player in list gets LEADER tag', async ({ page }) => {
  458 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  459 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  460 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  461 |     await page.getByPlaceholder('Enter name').fill('Alice');
  462 |     await page.getByRole('button', { name: 'Save' }).click();
  463 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  464 |     await page.getByPlaceholder('Enter name').fill('Bob');
  465 |     await page.getByRole('button', { name: 'Save' }).click();
  466 |     await page.getByRole('button', { name: 'START GAME' }).click();
  467 | 
  468 |     // Alice is leader first by default
  469 |     await expect(page.locator('div').filter({ hasText: 'Alice' }).locator('text=LEADER')).toBeVisible();
  470 |     
  471 |     // Give Alice +1
  472 |     await page.getByRole('button', { name: 'Increase score for Alice' }).click();
  473 |     // Give Bob +1
  474 |     await page.getByRole('button', { name: 'Increase score for Bob' }).click();
  475 | 
  476 |     // Scores are 1-1, Alice should still be leader (first in list)
  477 |     await expect(page.locator('div').filter({ hasText: 'Alice' }).locator('text=LEADER')).toBeVisible();
  478 |     await expect(page.locator('div').filter({ hasText: 'Bob' }).locator('text=PLAYER 2')).toBeVisible();
  479 |   });
  480 | 
  481 |   // Feature 11: End Game Confirmation Modal Boundaries
  482 |   test('36. In-Game - End Game: clicking checkmark shows modal', async ({ page }) => {
  483 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  484 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  485 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  486 |     await page.getByPlaceholder('Enter name').fill('Alice');
  487 |     await page.getByRole('button', { name: 'Save' }).click();
  488 |     await page.getByRole('button', { name: 'START GAME' }).click();
  489 | 
  490 |     await page.getByRole('button', { name: 'End Game' }).or(page.getByLabel('End Game')).click();
  491 |     await expect(page.locator('text=Are you sure you want to end the game?')).toBeVisible();
  492 |   });
  493 | 
  494 |   test('37. In-Game - End Game Modal: Cancel button dismisses modal and keeps game session active', async ({ page }) => {
  495 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  496 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  497 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  498 |     await page.getByPlaceholder('Enter name').fill('Alice');
  499 |     await page.getByRole('button', { name: 'Save' }).click();
  500 |     await page.getByRole('button', { name: 'START GAME' }).click();
  501 | 
  502 |     await page.getByRole('button', { name: 'End Game' }).or(page.getByLabel('End Game')).click();
  503 |     await page.getByRole('button', { name: 'No, Keep Playing' }).or(page.getByRole('button', { name: 'Cancel' })).click();
  504 |     await expect(page.locator('text=In-Game Screen')).toBeVisible();
  505 |   });
  506 | 
  507 |   test('38. In-Game - End Game Modal: Confirm button ends session, removes state', async ({ page }) => {
  508 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  509 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  510 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  511 |     await page.getByPlaceholder('Enter name').fill('Alice');
  512 |     await page.getByRole('button', { name: 'Save' }).click();
  513 |     await page.getByRole('button', { name: 'START GAME' }).click();
  514 | 
  515 |     await page.getByRole('button', { name: 'End Game' }).or(page.getByLabel('End Game')).click();
  516 |     await page.getByRole('button', { name: 'Yes, End Game' }).or(page.getByRole('button', { name: 'Confirm' })).click();
  517 |     await expect(page.getByRole('button', { name: 'Create New Game' })).toBeVisible();
  518 |   });
  519 | 
  520 |   // Feature 12: Reload and State Persistence
  521 |   test('39. Persistence - Game state persists across browser reload', async ({ page }) => {
  522 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  523 |     await page.getByPlaceholder('Enter game title').fill('Persisted Game');
  524 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  525 |     await page.getByPlaceholder('Enter name').fill('Alice');
  526 |     await page.getByRole('button', { name: 'Save' }).click();
  527 |     await page.getByRole('button', { name: 'START GAME' }).click();
  528 | 
  529 |     await page.getByRole('button', { name: 'Increase score for Alice' }).click();
  530 |     
  531 |     // Reload page
  532 |     await page.reload();
  533 |     
  534 |     // Check score is still 1 and game title is Persisted Game
  535 |     await expect(page.locator('text=Persisted Game')).toBeVisible();
> 536 |     await expect(page.locator('div').filter({ hasText: 'Alice' }).locator('text=1')).toBeVisible();
      |                                                                                      ^ Error: expect(locator).toBeVisible() failed
  537 |   });
  538 | 
  539 |   test('40. Persistence - Stopwatch running/paused state survives reload', async ({ page }) => {
  540 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  541 |     await page.getByPlaceholder('Enter game title').fill('Persisted Game');
  542 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  543 |     await page.getByPlaceholder('Enter name').fill('Alice');
  544 |     await page.getByRole('button', { name: 'Save' }).click();
  545 |     await page.getByRole('button', { name: 'START GAME' }).click();
  546 | 
  547 |     await page.getByRole('button', { name: 'Pause stopwatch' }).click();
  548 |     
  549 |     // Reload page
  550 |     await page.reload();
  551 |     
  552 |     // Verify it is still paused
  553 |     await expect(page.getByRole('button', { name: 'Start stopwatch' })).toBeVisible();
  554 |   });
  555 | });
  556 | 
```