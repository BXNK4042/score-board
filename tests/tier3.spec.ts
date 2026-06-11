import { test, expect } from '@playwright/test';

test.describe('Tier 3 - Cross-Feature Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('1. Setup player edit + color picker interaction: editing a player color frees up their old color in the palette for other players', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Player 1');
    await page.getByRole('button', { name: 'Save' }).click(); // Player 1 gets color #4B45D4 by default

    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Player 2');
    await page.getByRole('button', { name: 'Select color #22DD66' }).click();
    await page.getByRole('button', { name: 'Save' }).click(); // Player 2 gets color #22DD66

    // Now edit Player 1's color to another color (e.g. #D4156B)
    await page.getByRole('button', { name: 'Edit Player 1' }).click();
    await page.getByRole('button', { name: 'Select color #D4156B' }).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // Now if we edit Player 2's color, the color #4B45D4 (Player 1's old color) should be enabled/available
    await page.getByRole('button', { name: 'Edit Player 2' }).click();
    await expect(page.getByRole('button', { name: 'Select color #4B45D4' })).toBeEnabled();
  });

  test('2. In-Game individual score action updates leader label: incrementing a player score above others immediately shifts the LEADER badge to them', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Bob');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();

    // Alice is leader initially by default
    await expect(page.locator('div').filter({ hasText: 'Alice' }).locator('text=LEADER')).toBeVisible();

    // Click Bob's increment button twice (+2)
    await page.getByRole('button', { name: 'Increase score for Bob' }).click();
    await page.getByRole('button', { name: 'Increase score for Bob' }).click();

    // Bob should now be the leader
    await expect(page.locator('div').filter({ hasText: 'Bob' }).locator('text=LEADER')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: 'Alice' }).locator('text=PLAYER 1')).toBeVisible();
  });

  test('3. In-Game bulk score action updates leader label: incrementing multiple players simultaneously recalculates leader correctly', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Bob');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();

    // Give Bob a score of -2 individually
    await page.getByRole('button', { name: 'Decrease score for Bob' }).click();
    await page.getByRole('button', { name: 'Decrease score for Bob' }).click();

    // Select Alice and Bob for bulk increment
    await page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice')).click();
    await page.getByRole('checkbox', { name: 'Select Bob for bulk action' }).or(page.getByLabel('Select Bob')).click();
    
    // Bulk increment thrice
    await page.getByRole('button', { name: 'Bulk increment score' }).click();
    await page.getByRole('button', { name: 'Bulk increment score' }).click();
    await page.getByRole('button', { name: 'Bulk increment score' }).click();

    // Alice: 0 + 3 = 3 (LEADER)
    // Bob: -2 + 3 = 1
    await expect(page.locator('div').filter({ hasText: 'Alice' }).locator('text=LEADER')).toBeVisible();
    await expect(page.locator('[data-testid^="player-card-"]').filter({ hasText: 'Alice' }).locator('[data-testid^="player-score-"]')).toHaveText('3');
    await expect(page.locator('[data-testid^="player-card-"]').filter({ hasText: 'Bob' }).locator('[data-testid^="player-score-"]')).toHaveText('1');
  });

  test('4. In-Game add player during game updates leader calculation: adding a player with score 0 is integrated and leader updated if relevant', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();

    // Alice is leader at 0. Make Alice's score -2.
    await page.getByRole('button', { name: 'Decrease score for Alice' }).click();
    await page.getByRole('button', { name: 'Decrease score for Alice' }).click();

    // Add Player Bob mid-game. Bob starts at score 0.
    await page.getByRole('button', { name: 'Add player mid-game' }).or(page.getByLabel('Add Player')).click();
    await page.getByPlaceholder('Enter name').fill('Bob');
    await page.getByRole('button', { name: 'Save' }).click();

    // Bob (score 0) is now higher than Alice (score -2), so Bob should be the leader.
    await expect(page.locator('div').filter({ hasText: 'Bob' }).locator('text=LEADER')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: 'Alice' }).locator('text=PLAYER 1')).toBeVisible();
  });

  test('5. In-Game bulk selection toggles while stopwatch is running: stopwatch keeps ticking continuously without interruption', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();

    // Stopwatch is running. Click select checkbox.
    const initialTimeText = await page.locator('.timer-display').or(page.locator('text=00:00:')).textContent();
    await page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice')).click();
    await page.waitForTimeout(1500);
    const afterTimeText = await page.locator('.timer-display').or(page.locator('text=00:00:')).textContent();
    expect(initialTimeText).not.toBe(afterTimeText);
  });

  test('6. In-Game reload preserves selected player checkmarks: if players selected for bulk action, reload retains selection', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();

    await page.getByRole('checkbox', { name: 'Select Alice for bulk action' }).or(page.getByLabel('Select Alice')).click();
    await expect(page.locator('text=SELECTED FOR BULK')).toBeVisible();

    await page.reload();

    // Selection status and bulk action bar should still be visible
    await expect(page.locator('text=SELECTED FOR BULK')).toBeVisible();
  });

  test('7. In-Game leader tie-breaker updates in real time: when player ties leader, tag remains on first player, but if they exceed, tag shifts', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Bob');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();

    // Alice is leader. Let's make Bob score 1.
    await page.getByRole('button', { name: 'Increase score for Bob' }).click();
    // Bob should be the leader
    await expect(page.locator('div').filter({ hasText: 'Bob' }).locator('text=LEADER')).toBeVisible();

    // Now make Alice score 1 as well.
    await page.getByRole('button', { name: 'Increase score for Alice' }).click();
    // Scores are 1-1. Alice is first in list, so Alice should become leader again by tie-break logic.
    await expect(page.locator('div').filter({ hasText: 'Alice' }).locator('text=LEADER')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: 'Bob' }).locator('text=PLAYER 2')).toBeVisible();
  });

  test('8. End Game confirmation screen interaction: checkmark click shows modal; clicking confirm deletes persisted game state', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('My Game');
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'START GAME' }).click();

    // End Game and Confirm
    await page.getByRole('button', { name: 'End Game' }).or(page.getByLabel('End Game')).click();
    await page.getByRole('button', { name: 'Yes, End Game' }).or(page.getByRole('button', { name: 'Confirm' })).click();

    // Verify we are back home and Resume button does not exist (meaning state deleted)
    await expect(page.getByRole('button', { name: 'Create New Game' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'RESUME LIVE GAME' })).not.toBeVisible();
  });
});
