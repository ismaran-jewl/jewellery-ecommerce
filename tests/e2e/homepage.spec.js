const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test('should load correctly and show main sections', async ({ page }) => {
    await page.goto('/');
    
    // Check for Navbar
    await expect(page.locator('nav')).toBeVisible();
    
    // Check for Hero Section title or some specific text
    // Adjust this based on actual hero content
    await expect(page.locator('h1')).toBeVisible();
    
    // Check for Trust Strip
    await expect(page.getByText('BIS Hallmarked')).toBeVisible();
  });

  test('should navigate to shop page', async ({ page }) => {
    await page.goto('/');
    
    // Find a link to shop and click it
    const shopLink = page.getByRole('link', { name: /Shop/i }).first();
    if (await shopLink.isVisible()) {
      await shopLink.click();
      await expect(page).toHaveURL(/.*shop.*/);
    }
  });
});
