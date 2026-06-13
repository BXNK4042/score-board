# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tier1.spec.ts >> Tier 1 - Feature Coverage (Happy Paths) >> 37. Setup - Dynamic colors selection changes color button styling
- Location: tests/tier1.spec.ts:385:7

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
          - generic: 0 ADDED
        - generic:
          - generic: No players added yet. Tap '+' below to add players.
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
      - generic [ref=e18]:
        - generic [ref=e19]: Select Color Accent
        - generic [ref=e20]:
          - 'button "Select color #EF4444" [ref=e21]'
          - 'button "Select color #F97316" [ref=e22]'
          - 'button "Select color #EAB308" [ref=e23]'
          - 'button "Select color #22C55E" [ref=e24]'
          - 'button "Select color #06B6D4" [ref=e25]'
          - 'button "Select color #3B82F6" [ref=e26]'
          - 'button "Select color #8B5CF6" [ref=e27]'
          - 'button "Select color #EC4899" [ref=e28]'
          - 'button "Select color #F43F5E" [ref=e29]'
          - 'button "Select color #84CC16" [ref=e30]'
          - 'button "Select color #0EA5E9" [ref=e31]'
          - 'button "Select color #A855F7" [ref=e32]'
      - generic [ref=e33]:
        - button "Cancel" [ref=e34]
        - button "Save" [ref=e35]
    - button "Close" [ref=e36]:
      - img [ref=e37]
      - generic [ref=e40]: Close
```

# Test source

```ts
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
  304 |     await expect(page.locator('text=SELECTED FOR BULK')).toBeVisible();
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
> 389 |     await secondColorBtn.click();
      |                          ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  405 |   test('39. Setup - Editing game title updates input correctly', async ({ page }) => {
  406 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  407 |     const titleInput = page.getByPlaceholder('Enter game title');
  408 |     await titleInput.fill('Updated Title');
  409 |     await expect(titleInput).toHaveValue('Updated Title');
  410 |   });
  411 | 
  412 |   test('40. In-Game Header - Add Player button (person+) is visible in Header', async ({ page }) => {
  413 |     await page.getByRole('button', { name: 'Create New Game' }).click();
  414 |     await page.getByPlaceholder('Enter game title').fill('My Game');
  415 |     await page.getByRole('button', { name: 'ADD PLAYER' }).click();
  416 |     await page.getByPlaceholder('Enter name').fill('Alice');
  417 |     await page.getByRole('button', { name: 'Save' }).click();
  418 |     await page.getByRole('button', { name: 'START GAME' }).click();
  419 |     await expect(page.getByRole('button', { name: 'Add player mid-game' }).or(page.getByLabel('Add Player'))).toBeVisible();
  420 |   });
  421 | });
  422 | 
```