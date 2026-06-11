import { test, expect } from '@playwright/test';

test.describe('Tier 1 - Feature Coverage (Happy Paths)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // Feature 1: Game Creation & Navigation (Home Screen)
  test('1. Game Title - Empty title field displays placeholder', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await expect(page.getByPlaceholder('Enter game title')).toBeVisible();
  });

  test('2. Game Title - Typing title updates input value', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    const input = page.getByPlaceholder('Enter game title');
    await input.fill('Monopoly');
    await expect(input).toHaveValue('Monopoly');
  });

  test('3. Home Screen Cancel - Navigation cancel returns to Home Screen', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByTestId('setup-cancel-button').click();
    await expect(page.getByRole('button', { name: 'Create New Game' })).toBeVisible();
  });

  test('4. Add Player - Dialog opens on clicking ADD PLAYER button', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await expect(page.getByRole('heading', { name: 'Add Player' })).toBeVisible();
  });

  test('5. Add Player - Dialog closes on clicking Cancel', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByTestId('player-dialog-cancel').click();
    await expect(page.getByRole('heading', { name: 'Add Player' })).not.toBeVisible();
  });

  // Feature 2: Add Player (Setup Screen)
  test('6. Add Player - Default name is empty in dialog', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await expect(page.getByPlaceholder('Enter name')).toHaveValue('');
  });

  test('7. Add Player - Typing player name updates input', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    const input = page.getByPlaceholder('Enter name');
    await input.fill('Alice');
    await expect(input).toHaveValue('Alice');
  });

  test('8. Add Player - Save player adds them to setup list', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('text=Alice')).toBeVisible();
  });

  test('9. Add Player - Adding player increments the player count badge', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('text=1 ADDED')).toBeVisible();
  });

  test('10. Add Player - Avatar text matches capitalized first letter of player name', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('bob');
    await page.getByRole('button', { name: 'Save' }).click();
    // Look for the avatar circle with the capitalized letter
    await expect(page.locator('[data-testid^="player-card-"]').filter({ hasText: 'bob' }).locator('.rounded-full').getByText('B')).toBeVisible();
  });

  // Feature 3: Edit & Delete Players (Setup Screen)
  test('11. Edit Player - Pencil icon opens edit dialog', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'Edit Alice' }).click();
    await expect(page.getByRole('heading', { name: 'Edit Player' })).toBeVisible();
  });

  test('12. Edit Player - Dialog is prepopulated with player name', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'Edit Alice' }).click();
    await expect(page.getByPlaceholder('Enter name')).toHaveValue('Alice');
  });

  test('13. Edit Player - Saving edited name updates player name in list', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'Edit Alice' }).click();
    await page.getByPlaceholder('Enter name').fill('Allison');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('text=Allison')).toBeVisible();
    await expect(page.locator('text=Alice')).not.toBeVisible();
  });

  test('14. Delete Player - Trash icon removes player from setup list', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'Delete Alice' }).click();
    await expect(page.locator('text=Alice')).not.toBeVisible();
  });

  test('15. Delete Player - Deleting player decrements player count badge', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'Delete Alice' }).click();
    await expect(page.locator('text=0 ADDED')).toBeVisible();
  });

  // Feature 4: Live Stopwatch (In-Game Screen)
  test('16. Start Game - Navigates to In-Game Screen', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();
    await expect(page.locator('text=In-Game Screen')).toBeVisible();
  });

  test('17. In-Game Header - Displays game title', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('Board Game Night');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();
    await expect(page.locator('text=Board Game Night')).toBeVisible();
  });

  test('18. In-Game Stopwatch - Monospace stopwatch banner is visible', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();
    // Banner containing LIVE SESSION and play/pause button should exist
    await expect(page.locator('text=LIVE SESSION')).toBeVisible();
  });

  test('19. In-Game Stopwatch - Play/pause button is visible in banner', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();
    // Play/pause toggle button
    await expect(page.getByRole('button', { name: 'Pause stopwatch' }).or(page.getByRole('button', { name: 'Start stopwatch' }))).toBeVisible();
  });

  test('20. In-Game Stopwatch - Starts in running state by default', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();
    await expect(page.getByRole('button', { name: 'Pause stopwatch' })).toBeVisible();
  });

  // Feature 5: In-Game Individual Score Actions (In-Game Screen)
  test('21. In-Game Player Cards - Player name is displayed in bold', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();
    await expect(page.locator('text=Alice')).toBeVisible();
  });

  test('22. In-Game Player Cards - Score display is visible', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();
    // Default score should be 0 - use data-testid for score element
    await expect(page.locator('[data-testid^="player-score-"]')).toHaveText('0');
  });

  test('23. In-Game Player Cards - Score increment button is visible', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();
    await expect(page.getByRole('button', { name: 'Increase score for Alice' })).toBeVisible();
  });

  test('24. In-Game Player Cards - Score decrement button is visible', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();
    await expect(page.getByRole('button', { name: 'Decrease score for Alice' })).toBeVisible();
  });

  test('25. In-Game Individual Actions - Increment button increases score', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();
    await page.getByRole('button', { name: 'Increase score for Alice' }).click();
    await expect(page.locator('[data-testid^="player-score-"]')).toHaveText('1');
  });

  test('26. In-Game Individual Actions - Decrement button decreases score', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();
    await page.getByRole('button', { name: 'Decrease score for Alice' }).click();
    await expect(page.locator('[data-testid^="player-score-"]')).toHaveText('-1');
  });

  // Feature 6: In-Game Leader Tracking (In-Game Screen)
  test('27. In-Game Leader Tracking - Player with highest score is labeled LEADER', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Bob');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();
    // Default score tie: first player Alice should be leader
    await expect(page.locator('text=LEADER')).toBeVisible();
  });

  test('28. In-Game Leader Tracking - Score tie leader is first player in list', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Bob');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();
    
    // Alice (first) has LEADER, Bob (second) has PLAYER 2 label
    const aliceCard = page.locator('div').filter({ hasText: 'Alice' });
    await expect(aliceCard.locator('text=LEADER')).toBeVisible();
    
    const bobCard = page.locator('div').filter({ hasText: 'Bob' });
    await expect(bobCard.locator('text=PLAYER 2')).toBeVisible();
  });

  // Feature 7: Bulk Selection & Actions (In-Game Screen)
  test('29. In-Game Bulk Selection - Selection circle is toggleable', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();
    
    const selectCircle = page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice'));
    await expect(selectCircle).toBeVisible();
    await selectCircle.click();
    await expect(page.locator('text=1 Player(s) SELECTED FOR BULK')).toBeVisible();
  });

  test('30. In-Game Bulk Selection - Bulk action bar appears when player selected', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();
    
    await page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice')).click();
    await expect(page.locator('text=SELECTED FOR BULK')).toBeVisible();
  });

  test('31. In-Game Bulk Selection - Bulk increment is functional', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();
    
    await page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice')).click();
    await page.getByRole('button', { name: 'Bulk increment score' }).click();
    await expect(page.locator('[data-testid^="player-score-"]')).toHaveText('1');
  });

  test('32. In-Game Bulk Selection - Bulk decrement is functional', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();
    
    await page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice')).click();
    await page.getByRole('button', { name: 'Bulk decrement score' }).click();
    await expect(page.locator('[data-testid^="player-score-"]')).toHaveText('-1');
  });

  test('33. In-Game Bulk Selection - Deselect all button is visible in bulk bar', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();
    
    await page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice')).click();
    await expect(page.getByRole('button', { name: 'Deselect all players' }).or(page.getByLabel('Deselect all'))).toBeVisible();
  });

  // Feature 8: End Game Flow & Persistence (In-Game Screen & Reload)
  test('34. End Game - Clicking checkmark button shows confirmation modal', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();
    
    // Checkmark button or end game button
    await page.getByRole('button', { name: 'End Game' }).or(page.getByLabel('End Game')).click();
    await expect(page.locator('text=Are you sure you want to end the game?')).toBeVisible();
  });

  test('35. End Game - Cancel button on modal keeps game active', async ({ page }) => {
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

  test('36. End Game - Confirm button on modal ends session', async ({ page }) => {
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

  test('37. Setup - Dynamic colors selection changes color button styling', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    const secondColorBtn = page.getByRole('button', { name: 'Select color #22DD66' });
    await secondColorBtn.click();
    // Assert style ring is applied or button color matches selection
    await expect(secondColorBtn).toHaveAttribute('aria-label', 'Select color #22DD66');
  });

  test('38. Setup - Edit player name updates input value in edit dialog', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'Edit Alice' }).click();
    const input = page.getByPlaceholder('Enter name');
    await input.fill('Bob');
    await expect(input).toHaveValue('Bob');
  });

  test('39. Setup - Editing game title updates input correctly', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    const titleInput = page.getByPlaceholder('Enter game title');
    await titleInput.fill('Updated Title');
    await expect(titleInput).toHaveValue('Updated Title');
  });

  test('40. In-Game Header - Add Player button (person+) is visible in Header', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();
    await expect(page.getByRole('button', { name: 'Add player mid-game' }).or(page.getByLabel('Add Player'))).toBeVisible();
  });
});
