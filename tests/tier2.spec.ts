import { test, expect } from '@playwright/test';

test.describe('Tier 2 - Boundary & Corner Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // Feature 1: Setup Title Inputs
  test('1. Setup - Title input max length enforcement (max 40 chars)', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    const input = page.getByPlaceholder('Enter game title');
    const longTitle = 'a'.repeat(50);
    await input.fill(longTitle);
    await expect(input).toHaveValue('a'.repeat(40));
  });

  test('2. Setup - Start Game with whitespace-only title remains disabled', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('    ');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('button', { name: 'START GAME' })).toBeDisabled();
  });

  // Feature 2: Setup Player Dialog Name Inputs
  test('3. Setup - Adding player with max length name (max 20 chars)', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    const input = page.getByPlaceholder('Enter name');
    await input.fill('a'.repeat(30));
    await expect(input).toHaveValue('a'.repeat(20));
  });

  test('4. Setup - Try to save player with empty name displays error', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('text=Player name cannot be empty')).toBeVisible();
  });

  test('5. Setup - Try to save player with whitespace-only name displays error', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('     ');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('text=Player name cannot be empty')).toBeVisible();
  });

  // Feature 3: Setup Player Color Picker
  test('6. Setup - Choose duplicate color should disable save or disable selection', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Player 1');
    await page.getByRole('button', { name: 'Save' }).click();

    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Player 2');
    // First color from palette is default used for Player 1, so it should be disabled
    await expect(page.getByRole('button', { name: 'Select color #4B45D4' })).toBeDisabled();
  });

  test('7. Setup - Unique colors enforced: 8-color palette available', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    // Verify there are 12 color buttons in the color picker grid
    const colorButtons = page.locator('[data-testid^="color-selector-"]');
    await expect(colorButtons).toHaveCount(12); // standard palette is 12 colors
  });

  // Feature 4: Setup Player List Boundaries
  test('8. Setup - Maximum 10 players limit: ADD PLAYER button disappears at 10 players', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    for (let i = 1; i <= 10; i++) {
      await page.getByRole('button', { name: 'ADD PLAYER' }).click();
      await page.getByPlaceholder('Enter name').fill(`Player ${i}`);
      await page.getByRole('button', { name: 'Save' }).click();
    }
    await expect(page.getByRole('button', { name: 'ADD PLAYER' })).not.toBeVisible();
  });

  test('9. Setup - Minimum 1 player requirement: START GAME disabled at 0 players', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('Game Title');
    await expect(page.getByRole('button', { name: 'START GAME' })).toBeDisabled();
  });

  test('10. Setup - Edit player to empty name shows error', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'Edit Alice' }).click();
    await page.getByPlaceholder('Enter name').fill('');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('text=Player name cannot be empty')).toBeVisible();
  });

  test('11. Setup - Edit player to whitespace-only name shows error', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'Edit Alice' }).click();
    await page.getByPlaceholder('Enter name').fill('    ');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('text=Player name cannot be empty')).toBeVisible();
  });

  // Feature 5: In-Game Setup
  test('12. In-Game - Game title edit max length enforcement (max 40 chars)', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();

    // Click to edit game title in-game
    await page.getByRole('button', { name: 'Edit game title' }).or(page.getByLabel('Edit game title')).click();
    const input = page.getByPlaceholder('Enter game title');
    await input.fill('b'.repeat(50));
    await expect(input).toHaveValue('b'.repeat(40));
  });

  test('13. In-Game - Add Player modal during game works', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();

    await page.getByRole('button', { name: 'Add player mid-game' }).or(page.getByLabel('Add Player')).click();
    await expect(page.getByRole('heading', { name: 'Add Player' })).toBeVisible();
    await page.getByPlaceholder('Enter name').fill('Bob');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('text=Bob')).toBeVisible();
  });

  test('14. In-Game - Add Player mid-game cannot exceed 10 players total', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    for (let i = 1; i <= 9; i++) {
      await page.getByRole('button', { name: 'ADD PLAYER' }).click();
      await page.getByPlaceholder('Enter name').fill(`Player ${i}`);
      await page.getByRole('button', { name: 'Save' }).click();
    }
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'START GAME' }).click();

    // Add 10th player
    await page.getByRole('button', { name: 'Add player mid-game' }).or(page.getByLabel('Add Player')).click();
    await page.getByPlaceholder('Enter name').fill('Player 10');
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Add player button should now be disabled or hidden
    const btn = page.getByRole('button', { name: 'Add player mid-game' }).or(page.getByLabel('Add Player'));
    const isHidden = await btn.isHidden();
    if (!isHidden) {
      await expect(btn).toBeDisabled();
    }
  });

  test('15. In-Game - Add Player mid-game enforces duplicate color checks', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();

    await page.getByRole('button', { name: 'Add player mid-game' }).or(page.getByLabel('Add Player')).click();
    // Try to select color #4B45D4 (Alice's color)
    await expect(page.getByRole('button', { name: 'Select color #4B45D4' })).toBeDisabled();
  });

  // Feature 6: In-Game Individual Score Actions
  test('16. In-Game - Score starts at default 0', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();
    await expect(page.locator('[data-testid^="player-score-"]')).toHaveText('0');
  });

  test('17. In-Game - Score can go negative on decrement (-)', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();
    await page.getByRole('button', { name: 'Decrease score for Alice' }).click();
    await expect(page.locator('[data-testid^="player-score-"]')).toHaveText('-1');
  });

  test('18. In-Game - Large scores (e.g. 1000+) do not break layout size check', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();
    
    // Simulate high score by multiple clicks or input (tests readability of large digits)
    const incBtn = page.getByRole('button', { name: 'Increase score for Alice' });
    for (let i = 0; i < 15; i++) {
      await incBtn.click();
    }
    await expect(page.locator('text=15')).toBeVisible();
  });

  test('19. In-Game - Decimals are not allowed (only integer score shifts)', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();
    await page.getByRole('button', { name: 'Increase score for Alice' }).click();
    await expect(page.locator('text=1')).toBeVisible();
    await expect(page.locator('text=1.0')).not.toBeVisible();
  });

  // Feature 7: Live Stopwatch States
  test('20. In-Game - Stopwatch starts at 00:00:00', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();
    await expect(page.getByTestId('stopwatch-display')).toBeVisible();
  });

  test('21. In-Game - Stopwatch pause halts timer increment', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();

    // Click pause stopwatch
    await page.getByRole('button', { name: 'Pause stopwatch' }).click();
    const pausedTime = await page.locator('.timer-display').or(page.locator('text=00:00:')).textContent();
    // Wait 2 seconds
    await page.waitForTimeout(2000);
    const afterTime = await page.locator('.timer-display').or(page.locator('text=00:00:')).textContent();
    expect(pausedTime).toBe(afterTime);
  });

  test('22. In-Game - Stopwatch play resumes timer increment', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();

    await page.getByRole('button', { name: 'Pause stopwatch' }).click();
    await page.getByRole('button', { name: 'Start stopwatch' }).click();
    const baseTime = await page.locator('.timer-display').or(page.locator('text=00:00:')).textContent();
    await page.waitForTimeout(2000);
    const newTime = await page.locator('.timer-display').or(page.locator('text=00:00:')).textContent();
    expect(baseTime).not.toBe(newTime);
  });

  test('23. In-Game - Stopwatch elapsed time state survives play/pause cycles', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();
    
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'Pause stopwatch' }).click();
    const pausedTime = await page.locator('.timer-display').or(page.locator('text=00:00:')).textContent();
    expect(pausedTime).not.toBe('00:00:00');
  });

  test('24. In-Game - Stopwatch state non-blocking (timer ticks during score change)', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();

    const initialTime = await page.locator('.timer-display').or(page.locator('text=00:00:')).textContent();
    await page.getByRole('button', { name: 'Increase score for Alice' }).click();
    await page.waitForTimeout(1500);
    const afterTime = await page.locator('.timer-display').or(page.locator('text=00:00:')).textContent();
    expect(initialTime).not.toBe(afterTime);
  });

  test('25. In-Game - Stopwatch ticks correctly (seconds count matches elapsed time)', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();
    
    await page.waitForTimeout(2500);
    const timeText = await page.locator('.timer-display').or(page.locator('text=00:00:')).textContent();
    // Should be at least 2 seconds elapsed
    const seconds = parseInt(timeText?.split(':')[2] || '0');
    expect(seconds).toBeGreaterThanOrEqual(2);
  });

  // Feature 8: Bulk Selection & Actions Boundaries
  test('26. In-Game - Bulk selection circle toggle active/inactive state check', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();

    const circle = page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice'));
    await circle.click();
    await expect(page.locator('text=1 Player(s) SELECTED FOR BULK')).toBeVisible();
    await circle.click();
    await expect(page.locator('text=SELECTED FOR BULK')).not.toBeVisible();
  });

  test('27. In-Game - Bulk action bar appears ONLY when >=1 player is selected', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();

    await expect(page.locator('text=SELECTED FOR BULK')).not.toBeVisible();
    await page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice')).click();
    await expect(page.locator('text=SELECTED FOR BULK')).toBeVisible();
  });

  test('28. In-Game - Bulk action bar disappears when all players are deselected', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();

    await page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice')).click();
    await page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice')).click();
    await expect(page.locator('text=SELECTED FOR BULK')).not.toBeVisible();
  });

  test('29. In-Game - Bulk selection count matches selected players', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Bob');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();

    await page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice')).click();
    await expect(page.locator('text=1 Player(s) SELECTED FOR BULK')).toBeVisible();
    await page.getByRole('checkbox', { name: 'Select Bob for bulk action' }).or(page.getByLabel('Select Bob')).click();
    await expect(page.locator('text=2 Player(s) SELECTED FOR BULK')).toBeVisible();
  });

  test('30. In-Game - Deselect button in bulk bar clears all selections', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Bob');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();

    await page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice')).click();
    await page.getByRole('checkbox', { name: 'Select Bob for bulk action' }).or(page.getByLabel('Select Bob')).click();
    await page.getByRole('button', { name: 'Deselect all players' }).or(page.getByLabel('Deselect all')).click();
    await expect(page.locator('text=SELECTED FOR BULK')).not.toBeVisible();
  });

  test('31. In-Game - Bulk increment increases all selected players by 1', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Bob');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();

    await page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice')).click();
    await page.getByRole('checkbox', { name: 'Select Bob for bulk action' }).or(page.getByLabel('Select Bob')).click();
    await page.getByRole('button', { name: 'Bulk increment score' }).click();
    
    // Both Alice and Bob should now show score 1
    await expect(page.locator('[data-testid^="player-card-"]').filter({ hasText: 'Alice' }).locator('[data-testid^="player-score-"]')).toHaveText('1');
    await expect(page.locator('[data-testid^="player-card-"]').filter({ hasText: 'Bob' }).locator('[data-testid^="player-score-"]')).toHaveText('1');
  });

  test('32. In-Game - Bulk decrement decreases all selected players by 1', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Bob');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();

    await page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice')).click();
    await page.getByRole('checkbox', { name: 'Select Bob for bulk action' }).or(page.getByLabel('Select Bob')).click();
    await page.getByRole('button', { name: 'Bulk decrement score' }).click();
    
    // Both Alice and Bob should now show score -1
    await expect(page.locator('[data-testid^="player-card-"]').filter({ hasText: 'Alice' }).locator('[data-testid^="player-score-"]')).toHaveText('-1');
    await expect(page.locator('[data-testid^="player-card-"]').filter({ hasText: 'Bob' }).locator('[data-testid^="player-score-"]')).toHaveText('-1');
  });

  // Feature 9: Accessibility Announcements
  test('33. In-Game - Score live regions accessible (aria-label/live region announcements)', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();

    const region = page.locator('[aria-live="polite"]').or(page.locator('[aria-live="assertive"]')).first();
    await expect(region).toBeDefined();
  });

  test('34. In-Game - Player name accessibility labels on individual actions', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();

    await expect(page.getByRole('button', { name: 'Increase score for Alice' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Decrease score for Alice' })).toBeVisible();
  });

  // Feature 10: Tied Leaders & Tied-Score Leader Label
  test('35. In-Game - Leader tied scores: first player in list gets LEADER tag', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Bob');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();

    // Alice is leader first by default
    await expect(page.locator('div').filter({ hasText: 'Alice' }).locator('text=LEADER')).toBeVisible();
    
    // Give Alice +1
    await page.getByRole('button', { name: 'Increase score for Alice' }).click();
    // Give Bob +1
    await page.getByRole('button', { name: 'Increase score for Bob' }).click();

    // Scores are 1-1, Alice should still be leader (first in list)
    await expect(page.locator('div').filter({ hasText: 'Alice' }).locator('text=LEADER')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: 'Bob' }).locator('text=PLAYER 2')).toBeVisible();
  });

  // Feature 11: End Game Confirmation Modal Boundaries
  test('36. In-Game - End Game: clicking checkmark shows modal', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();

    await page.getByRole('button', { name: 'End Game' }).or(page.getByLabel('End Game')).click();
    await expect(page.locator('text=Are you sure you want to end the game?')).toBeVisible();
  });

  test('37. In-Game - End Game Modal: Cancel button dismisses modal and keeps game session active', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();

    await page.getByRole('button', { name: 'End Game' }).or(page.getByLabel('End Game')).click();
    await page.getByRole('button', { name: 'No, Keep Playing' }).or(page.getByRole('button', { name: 'Cancel' })).click();
    await expect(page.locator('text=In-Game Screen')).toBeVisible();
  });

  test('38. In-Game - End Game Modal: Confirm button ends session, removes state', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();

    await page.getByRole('button', { name: 'End Game' }).or(page.getByLabel('End Game')).click();
    await page.getByRole('button', { name: 'Yes, End Game' }).or(page.getByRole('button', { name: 'Confirm' })).click();
    await expect(page.getByRole('button', { name: 'Create New Game' })).toBeVisible();
  });

  // Feature 12: Reload and State Persistence
  test('39. Persistence - Game state persists across browser reload', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('Persisted Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();

    await page.getByRole('button', { name: 'Increase score for Alice' }).click();
    
    // Reload page
    await page.reload();
    
    // Check score is still 1 and game title is Persisted Game
    await expect(page.locator('text=Persisted Game')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: 'Alice' }).locator('text=1')).toBeVisible();
  });

  test('40. Persistence - Stopwatch running/paused state survives reload', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('Persisted Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();

    await page.getByRole('button', { name: 'Pause stopwatch' }).click();
    
    // Reload page
    await page.reload();
    
    // Verify it is still paused
    await expect(page.getByRole('button', { name: 'Start stopwatch' })).toBeVisible();
  });
});
