import { test, expect } from '@playwright/test';

test('portfolio page loads and shows project cards', async ({ page }) => {
    await page.goto('/es/portfolio');
    await expect(page.locator('main')).toBeVisible();
    // Should have at least one project card (bento-card elements)
    const cards = page.locator('.bento-card');
    await expect(cards.first()).toBeVisible();
});

test('portfolio slug pages are reachable', async ({ page }) => {
    const slugs = ['gymapp', 'datawarehouse', 'c-animation', 'ios-store', 'appointment-app', 'predictive-analysis'];
    for (const slug of slugs) {
        const response = await page.goto(`/es/portfolio/${slug}`);
        expect(response?.status(), `Expected 200 for /es/portfolio/${slug}`).toBe(200);
    }
});
