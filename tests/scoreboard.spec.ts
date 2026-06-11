import { test, expect } from '@playwright/test';

test.describe('ScoreBoard Setup Screen & Navigation E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show Home Screen with Create New Game button', async ({ page }) => {
    // Check scoreboard brand
    await expect(page.locator('text=ScoreBoard')).toBeVisible();
    // Check button is visible
    const createBtn = page.getByRole('button', { name: 'Create New Game' });
    await expect(createBtn).toBeVisible();
  });

  test('should navigate to Setup Screen and validate inputs', async ({ page }) => {
    // Click Create New Game
    await page.getByTestId('create-new-game-button').click();

    // Verify Setup Screen is visible
    await expect(page.locator('text=Create New Game')).toBeVisible();
    await expect(page.getByPlaceholder('Enter game title')).toBeVisible();

    // START GAME button should be disabled initially
    const startGameBtn = page.getByRole('button', { name: 'START GAME' });
    await expect(startGameBtn).toBeDisabled();

    // Enter title
    await page.getByPlaceholder('Enter game title').fill('My Board Game');
    // Button still disabled because 0 players
    await expect(startGameBtn).toBeDisabled();

    // Add a player
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();

    // Dialog should be visible
    await expect(page.getByRole('heading', { name: 'Add Player' })).toBeVisible();

    // Attempt to save empty name
    const saveBtn = page.getByRole('button', { name: 'Save' });
    await saveBtn.click();
    await expect(page.locator('text=Player name cannot be empty')).toBeVisible();

    // Fill player name
    await page.getByPlaceholder('Enter name').fill('Alice');
    await saveBtn.click();

    // Check player added to the list
    await expect(page.locator('text=Alice')).toBeVisible();
    await expect(page.locator('text=1 ADDED')).toBeVisible();

    // Now START GAME should be enabled
    await expect(startGameBtn).toBeEnabled();

    // Click START GAME
    await startGameBtn.click();

    // Should be on In-Game Screen
    await expect(page.getByTestId('in-game-screen-heading')).toBeVisible();
    await expect(page.locator('text=My Board Game')).toBeVisible();
    await expect(page.locator('text=Alice')).toBeVisible();

    // End Game
    await page.getByTestId('end-game-button').click();
    // Confirm end game
    await page.getByRole('button', { name: 'Yes, End Game' }).click();

    // Back to Home Screen
    await expect(page.getByRole('button', { name: 'Create New Game' })).toBeVisible();
  });

  test('should enforce player limit and unique colors', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('Color Test');

    // Add first player with default color
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Player 1');
    // Save
    await page.getByRole('button', { name: 'Save' }).click();

    // Add second player
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Player 2');
    
    // The second player tries to select the same color
    const firstColorBtn = page.getByRole('button', { name: 'Select color #4B45D4' });
    // It should be disabled
    await expect(firstColorBtn).toBeDisabled();

    // Choose another color
    await page.getByRole('button', { name: 'Select color #22DD66' }).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify both are added
    await expect(page.locator('text=Player 1')).toBeVisible();
    await expect(page.locator('text=Player 2')).toBeVisible();
    await expect(page.locator('text=2 ADDED')).toBeVisible();
  });
});
