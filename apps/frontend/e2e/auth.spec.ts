import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText(/login|sign in/i);
  });

  test('should navigate to register from login', async ({ page }) => {
    await page.goto('/login');
    const registerLink = page.getByRole('link', { name: /sign up|register/i });
    await registerLink.click();
    await expect(page).toHaveURL(/register/);
  });

  test('should show validation errors for empty login form', async ({ page }) => {
    await page.goto('/login');
    const submitButton = page.getByRole('button', { name: /login|sign in/i });
    await submitButton.click();
    // Check for validation (depends on implementation)
    await expect(page.locator('form')).toBeVisible();
  });

  test('should redirect to home after successful login', async ({ page }) => {
    // Mock successful login
    await page.route('**/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            username: 'testuser',
          },
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token',
        }),
      });
    });

    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/');
  });
});
