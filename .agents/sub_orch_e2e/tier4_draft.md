# Tier 4 - Real-World Application Scenarios Draft Spec

```typescript
import { test, expect } from '@playwright/test';

test.describe('Tier 4 - Real-World Application Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('1. Scenario 1 - 2-Player Card Game (Happy Path)', async ({ page }) => {
    // 1. Click Create New Game
    await page.getByRole('button', { name: 'Create New Game' }).click();

    // 2. Set title to "Card Game"
    await page.getByPlaceholder('Enter game title').fill('Card Game');

    // 3. Add Player Alice
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();

    // 4. Add Player Bob
    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Bob');
    // Select a different color
    await page.getByRole('button', { name: 'Select color #22DD66' }).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // 5. Click Start Game
    await page.getByRole('button', { name: 'START GAME' }).click();

    // 6. Verify game name is "Card Game"
    await expect(page.locator('text=Card Game')).toBeVisible();

    // 7. Verify Alice is LEADER initially (Alice is first in list)
    await expect(page.locator('div').filter({ hasText: 'Alice' }).locator('text=LEADER')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: 'Bob' }).locator('text=PLAYER 2')).toBeVisible();

    // 8. Increment Alice score twice (+2)
    const incAlice = page.getByRole('button', { name: 'Increase score for Alice' });
    await incAlice.click();
    await incAlice.click();

    // 9. Decrement Bob score once (-1)
    await page.getByRole('button', { name: 'Decrease score for Bob' }).click();

    // 10. Verify score outputs: Alice has 2, Bob has -1
    await expect(page.locator('div').filter({ hasText: 'Alice' }).locator('text=2')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: 'Bob' }).locator('text=-1')).toBeVisible();

    // 11. Verify Alice remains LEADER
    await expect(page.locator('div').filter({ hasText: 'Alice' }).locator('text=LEADER')).toBeVisible();

    // 12. End game and verify redirection
    await page.getByRole('button', { name: 'End Game' }).or(page.getByLabel('End Game')).click();
    await page.getByRole('button', { name: 'Yes, End Game' }).or(page.getByRole('button', { name: 'Confirm' })).click();
    await expect(page.getByRole('button', { name: 'Create New Game' })).toBeVisible();
  });

  test('2. Scenario 2 - 4-Player Board Game with Ties & Lead Shifts', async ({ page }) => {
    // 1. Setup game
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('Board Game Night');

    const names = ['P1', 'P2', 'P3', 'P4'];
    const colors = ['#4B45D4', '#22DD66', '#D4156B', '#FFA500'];
    
    for (let i = 0; i < 4; i++) {
      await page.getByRole('button', { name: 'ADD PLAYER' }).click();
      await page.getByPlaceholder('Enter name').fill(names[i]);
      if (i > 0) {
        await page.getByRole('button', { name: `Select color ${colors[i]}` }).click();
      }
      await page.getByRole('button', { name: 'Save' }).click();
    }

    await page.getByRole('button', { name: 'START GAME' }).click();

    // 2. Make P2 score 5
    const incP2 = page.getByRole('button', { name: 'Increase score for P2' });
    for (let i = 0; i < 5; i++) {
      await incP2.click();
    }
    // Verify P2 is LEADER
    await expect(page.locator('div').filter({ hasText: 'P2' }).locator('text=LEADER')).toBeVisible();

    // 3. Make P4 score 5 (ties with P2)
    const incP4 = page.getByRole('button', { name: 'Increase score for P4' });
    for (let i = 0; i < 5; i++) {
      await incP4.click();
    }
    // Scores are P2=5, P4=5. Tie-breaker: P2 is first in list, should remain LEADER
    await expect(page.locator('div').filter({ hasText: 'P2' }).locator('text=LEADER')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: 'P4' }).locator('text=PLAYER 4')).toBeVisible();

    // 4. Increment P4 to 6
    await incP4.click();
    // P4 should now become LEADER
    await expect(page.locator('div').filter({ hasText: 'P4' }).locator('text=LEADER')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: 'P2' }).locator('text=PLAYER 2')).toBeVisible();
  });

  test('3. Scenario 3 - Bulk Scoring & Deselection', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('Bulk Action Session');

    // Add 3 players
    for (let i = 1; i <= 3; i++) {
      await page.getByRole('button', { name: 'ADD PLAYER' }).click();
      await page.getByPlaceholder('Enter name').fill(`Player ${i}`);
      await page.getByRole('button', { name: 'Save' }).click();
    }

    await page.getByRole('button', { name: 'START GAME' }).click();

    // Select Player 1 and Player 2
    await page.getByRole('checkbox', { name: 'Select Player 1 for bulk action' }).or(page.getByLabel('Select Player 1')).click();
    await page.getByRole('checkbox', { name: 'Select Player 2 for bulk action' }).or(page.getByLabel('Select Player 2')).click();

    // Bulk increment twice (+2)
    await page.getByRole('button', { name: 'Bulk increment score' }).click();
    await page.getByRole('button', { name: 'Bulk increment score' }).click();

    // Verify scores
    await expect(page.locator('div').filter({ hasText: 'Player 1' }).locator('text=2')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: 'Player 2' }).locator('text=2')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: 'Player 3' }).locator('text=0')).toBeVisible();

    // Verify Player 1 is LEADER (tied score, first in list)
    await expect(page.locator('div').filter({ hasText: 'Player 1' }).locator('text=LEADER')).toBeVisible();

    // Deselect all
    await page.getByRole('button', { name: 'Deselect all players' }).or(page.getByLabel('Deselect all')).click();

    // Select Player 3
    await page.getByRole('checkbox', { name: 'Select Player 3 for bulk action' }).or(page.getByLabel('Select Player 3')).click();

    // Bulk increment thrice (+3)
    await page.getByRole('button', { name: 'Bulk increment score' }).click();
    await page.getByRole('button', { name: 'Bulk increment score' }).click();
    await page.getByRole('button', { name: 'Bulk increment score' }).click();

    // Player 3 has 3, Player 1 has 2, Player 2 has 2. Player 3 should be LEADER
    await expect(page.locator('div').filter({ hasText: 'Player 3' }).locator('text=LEADER')).toBeVisible();
  });

  test('4. Scenario 4 - Mid-Game Player Addition & Persistence', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('Persistent Session');

    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();

    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Bob');
    await page.getByRole('button', { name: 'Save' }).click();

    await page.getByRole('button', { name: 'START GAME' }).click();

    // Increment Alice
    await page.getByRole('button', { name: 'Increase score for Alice' }).click();

    // Reload page
    await page.reload();

    // Verify state persisted
    await expect(page.locator('text=Persistent Session')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: 'Alice' }).locator('text=1')).toBeVisible();

    // Add Bob mid-game
    await page.getByRole('button', { name: 'Add player mid-game' }).or(page.getByLabel('Add Player')).click();
    await page.getByPlaceholder('Enter name').fill('Charlie');
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify Charlie added with score 0
    await expect(page.locator('text=Charlie')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: 'Charlie' }).locator('text=0')).toBeVisible();

    // End game
    await page.getByRole('button', { name: 'End Game' }).or(page.getByLabel('End Game')).click();
    await page.getByRole('button', { name: 'Yes, End Game' }).or(page.getByRole('button', { name: 'Confirm' })).click();
  });

  test('5. Scenario 5 - Complete Game Lifecycle with Stopwatch Checks & End Game Confirmation', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Game' }).click();
    await page.getByPlaceholder('Enter game title').fill('Lifecycle Session');

    await page.getByRole('button', { name: 'ADD PLAYER' }).click();
    await page.getByPlaceholder('Enter name').fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();

    await page.getByRole('button', { name: 'START GAME' }).click();

    // Verify stopwatch starts running
    await expect(page.getByRole('button', { name: 'Pause stopwatch' })).toBeVisible();
    await page.waitForTimeout(2000);

    // Pause stopwatch
    await page.getByRole('button', { name: 'Pause stopwatch' }).click();
    const timeText = await page.locator('.timer-display').or(page.locator('text=00:00:')).textContent();

    // Wait a moment and check it hasn't incremented
    await page.waitForTimeout(1500);
    const afterTimeText = await page.locator('.timer-display').or(page.locator('text=00:00:')).textContent();
    expect(timeText).toBe(afterTimeText);

    // Click checkmark button to end game
    await page.getByRole('button', { name: 'End Game' }).or(page.getByLabel('End Game')).click();
    // Verify confirmation modal visible
    await expect(page.locator('text=Are you sure you want to end the game?')).toBeVisible();

    // Click cancel
    await page.getByRole('button', { name: 'No, Keep Playing' }).or(page.getByRole('button', { name: 'Cancel' })).click();
    // Verify game still active and stopwatch still paused
    await expect(page.locator('text=Lifecycle Session')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start stopwatch' })).toBeVisible();

    // Click checkmark and confirm end
    await page.getByRole('button', { name: 'End Game' }).or(page.getByLabel('End Game')).click();
    await page.getByRole('button', { name: 'Yes, End Game' }).or(page.getByRole('button', { name: 'Confirm' })).click();

    // Back to Home screen and no resume button visible
    await expect(page.getByRole('button', { name: 'Create New Game' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'RESUME LIVE GAME' })).not.toBeVisible();
  });
});
```
