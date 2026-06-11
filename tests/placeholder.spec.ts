import { test, expect } from '@playwright/test';

test('placeholder test - visits home page', async ({ page }) => {
  // Go to the base URL (defined as http://localhost:3000 in config)
  await page.goto('/');

  // Simple assertion to verify the page loaded and URL matches
  await expect(page).toHaveURL('http://localhost:3000/');
});
