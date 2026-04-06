import { test, expect } from '@playwright/test';

const ROUTES = [
    { path: '/es/', titleContains: 'Bryan Vargas' },
    { path: '/en/', titleContains: 'Bryan Vargas' },
    { path: '/es/services', titleContains: 'Bryan Vargas' },
    { path: '/en/services', titleContains: 'Bryan Vargas' },
    { path: '/es/portfolio', titleContains: 'Bryan Vargas' },
    { path: '/en/portfolio', titleContains: 'Bryan Vargas' },
    { path: '/es/resources', titleContains: 'Bryan Vargas' },
    { path: '/en/resources', titleContains: 'Bryan Vargas' },
    { path: '/es/contact', titleContains: 'Bryan Vargas' },
    { path: '/en/contact', titleContains: 'Bryan Vargas' },
];

for (const route of ROUTES) {
    test(`loads ${route.path}`, async ({ page }) => {
        await page.goto(route.path);
        await expect(page).toHaveTitle(new RegExp(route.titleContains, 'i'));
        // Main content should be visible
        await expect(page.locator('main')).toBeVisible();
    });
}

test('custom 404 page renders', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');
    expect(response?.status()).toBe(404);
    await expect(page.locator('#nf-code')).toContainText('404');
});

test('footer is visible on home page', async ({ page }) => {
    await page.goto('/es/');
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer')).toContainText('@bryanvrgsc');
});
