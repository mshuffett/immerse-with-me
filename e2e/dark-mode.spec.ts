import { test, expect } from '@playwright/test';

test.describe('Dark Mode Toggle', () => {
  test('renders in light mode by default and can switch to dark', async ({ page }) => {
    // Navigate and wait for page to fully load
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for the theme toggle button to be visible (it mounts after hydration)
    const toggleButton = page.locator('button[aria-label*="Switch to"]');
    await expect(toggleButton).toBeVisible({ timeout: 10000 });

    // Screenshot: Light mode full page
    await page.screenshot({ path: 'screenshots/light-mode-full.png', fullPage: true });

    // Screenshot: Header area in light mode (theme toggle visible)
    const header = page.locator('header');
    await header.screenshot({ path: 'screenshots/light-mode-header.png' });

    // Verify we're in light mode - html should NOT have 'dark' class
    const htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass).not.toContain('dark');

    // Click the toggle to switch to dark mode
    await toggleButton.click();

    // Wait for theme to apply
    await page.waitForTimeout(500);

    // Verify dark class is applied
    const darkHtmlClass = await page.locator('html').getAttribute('class');
    expect(darkHtmlClass).toContain('dark');

    // Screenshot: Dark mode full page
    await page.screenshot({ path: 'screenshots/dark-mode-full.png', fullPage: true });

    // Screenshot: Header area in dark mode
    await header.screenshot({ path: 'screenshots/dark-mode-header.png' });

    // Verify the toggle now shows Sun icon (to switch back to light)
    const sunIcon = toggleButton.locator('svg');
    await expect(sunIcon).toBeVisible();
  });

  test('toggle button has correct aria-label', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const toggleButton = page.locator('button[aria-label*="Switch to"]');
    await expect(toggleButton).toBeVisible({ timeout: 10000 });

    // In light mode, aria-label should mention switching to dark
    const label = await toggleButton.getAttribute('aria-label');
    expect(label).toContain('dark');

    // Click toggle
    await toggleButton.click();
    await page.waitForTimeout(500);

    // Now aria-label should mention switching to light
    const newLabel = await toggleButton.getAttribute('aria-label');
    expect(newLabel).toContain('light');
  });

  test('dark mode applies correct background color', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const toggleButton = page.locator('button[aria-label*="Switch to"]');
    await expect(toggleButton).toBeVisible({ timeout: 10000 });

    // Switch to dark mode
    await toggleButton.click();
    await page.waitForTimeout(500);

    // Verify background is dark (oklch(0.15 0.01 260) is a very dark color)
    const bgColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--background').trim();
    });
    expect(bgColor).toBe('oklch(0.15 0.01 260)');

    // Screenshot: Stats cards in dark mode
    const statsGrid = page.locator('.grid.sm\\:grid-cols-3');
    if (await statsGrid.isVisible()) {
      await statsGrid.screenshot({ path: 'screenshots/dark-mode-stats.png' });
    }

    // Screenshot: Live activity feed in dark mode
    await page.screenshot({ path: 'screenshots/dark-mode-activity.png', fullPage: true });
  });

  test('can toggle back to light mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const toggleButton = page.locator('button[aria-label*="Switch to"]');
    await expect(toggleButton).toBeVisible({ timeout: 10000 });

    // Switch to dark mode
    await toggleButton.click();
    await page.waitForTimeout(500);

    // Switch back to light mode
    await toggleButton.click();
    await page.waitForTimeout(500);

    // Verify we're back in light mode
    const htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass).not.toContain('dark');

    // Screenshot: Back in light mode
    await page.screenshot({ path: 'screenshots/light-mode-restored.png', fullPage: true });
  });
});
