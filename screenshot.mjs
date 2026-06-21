import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport to mobile size (project is mobile-first)
  await page.setViewportSize({ width: 375, height: 667 });

  // Navigate to app
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  // Screenshot home screen
  await page.screenshot({ path: 'screenshots/home.png', fullPage: true });

  // Navigate to setup screen
  await page.click('text=Create New Game');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'screenshots/setup.png', fullPage: true });

  // Start a game to get to in-game screen
  await page.fill('[placeholder="Game Title"]', 'Test Game');
  await page.click('text=Add Player');
  await page.click('text=Start Game');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'screenshots/ingame.png', fullPage: true });

  await browser.close();
  console.log('Screenshots saved to screenshots/');
})();
