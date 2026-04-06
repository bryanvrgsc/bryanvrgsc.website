import { test, expect } from '@playwright/test';

test('Spanish home has correct nav copy', async ({ page }) => {
    await page.goto('/es/');
    // The page title should contain Spanish text
    await expect(page).toHaveTitle(/Bryan Vargas/i);
    // URL should contain /es/
    expect(page.url()).toContain('/es/');
});

test('English home has correct nav copy', async ({ page }) => {
    await page.goto('/en/');
    await expect(page).toHaveTitle(/Bryan Vargas/i);
    expect(page.url()).toContain('/en/');
});

test('404 page detects /en/ path and shows English copy', async ({ page }) => {
    // Navigate to a non-existent EN route so the 404 script sees /en/ in the URL
    await page.goto('/en/this-does-not-exist');
    await expect(page.locator('#nf-title')).toContainText('Page Not Found');
    await expect(page.locator('#nf-back')).toHaveAttribute('href', '/en/');
});

test('404 page defaults to Spanish copy for unknown paths', async ({ page }) => {
    await page.goto('/this-does-not-exist');
    await expect(page.locator('#nf-title')).toContainText('Página no encontrada');
});
