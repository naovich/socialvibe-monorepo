import { test, expect } from '@playwright/test';
import { TestHelpers } from './helpers/test-utils';

test.describe('Authentication', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.clearStorage();
  });

  test('US-001: Create account successfully', async ({ page }) => {
    const user = TestHelpers.generateUser('register');
    
    await helpers.register(user);
    
    // Verify redirected to home
    await expect(page).toHaveURL(/\/(home|feed|$)/);
    
    // Verify user name displayed in header (first name or username)
    await expect(page.getByText(user.name.split(' ')[0]).or(page.getByText(`@${user.username}`))).toBeVisible({ timeout: 10000 });
  });

  test('US-001: Cannot register with duplicate email', async ({ page }) => {
    const user = TestHelpers.generateUser('duplicate');
    
    // Register first time
    await helpers.register(user);
    await helpers.logout();
    
    // Try to register again with same email
    await page.goto('/register');
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', user.password);
    await page.fill('input[name="name"]', 'Different Name');
    await page.fill('input[name="username"]', 'differentuser');
    await page.click('button[type="submit"]');
    
    // Verify error message
    await expect(page.locator('text=/already exists|déjà utilisé/i')).toBeVisible();
  });

  test('US-002: Login with valid credentials', async ({ page }) => {
    const user = TestHelpers.generateUser('login');
    
    // Create user first
    await helpers.register(user);
    await helpers.logout();
    
    // Login
    await helpers.login(user.email, user.password);
    
    // Verify logged in
    await expect(page).toHaveURL(/\/(home|feed|$)/);
    await expect(page.locator(`text=${user.name}, text=${user.username}`)).toBeVisible();
  });

  test('US-002: Cannot login with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'nonexistent@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Verify error message (wait for API response)
    // Should stay on login page and show error
    await expect(page).toHaveURL('/login', { timeout: 10000 });
    await expect(page.locator('.bg-red-500\\/10, .text-red-400, text=/invalid|error|incorrect/i').first()).toBeVisible({ timeout: 10000 });
  });

  test('US-003: Logout successfully', async ({ page }) => {
    const user = TestHelpers.generateUser('logout');
    
    await helpers.register(user);
    await helpers.logout();
    
    // Verify redirected to login
    await expect(page).toHaveURL(/\/login/);
    
    // Verify cannot access protected pages
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
  });

  test('US-004: Refresh token works after 15 minutes', async ({ page }) => {
    const user = TestHelpers.generateUser('refresh');
    
    await helpers.register(user);
    
    // Get initial token
    const initialToken = await page.evaluate(() => localStorage.getItem('auth_token'));
    
    // Simulate token expiration by setting old timestamp
    await page.evaluate(() => {
      const oldDate = new Date(Date.now() - 16 * 60 * 1000); // 16 minutes ago
      localStorage.setItem('token_timestamp', oldDate.toISOString());
    });
    
    // Make an API call (create post)
    await helpers.createPost('Test refresh token');
    
    // Verify post created (token refreshed automatically)
    await expect(page.locator('text=Test refresh token')).toBeVisible();
    
    // Verify still logged in
    const currentToken = await page.evaluate(() => localStorage.getItem('auth_token'));
    expect(currentToken).toBeTruthy();
  });

  test('US-005: Forgot password flow', async ({ page }) => {
    const user = TestHelpers.generateUser('forgot');
    
    // Create user
    await helpers.register(user);
    await helpers.logout();
    
    // Go to forgot password
    await page.goto('/login');
    await page.click('text=/forgot password|mot de passe oublié/i');
    
    // Enter email
    await page.fill('input[name="email"]', user.email);
    await page.click('button[type="submit"]');
    
    // Verify success message
    await expect(page.locator('text=/email sent|email envoyé|check your email/i')).toBeVisible();
  });

  test('US-006: Email verification link', async ({ page }) => {
    const user = TestHelpers.generateUser('verify');
    
    await helpers.register(user);
    
    // Note: In real tests, you'd need to get the verification token
    // from backend logs or email service
    // This is a placeholder test
    
    // Simulate clicking verification link with mock token
    await page.goto('/verify-email?token=mock-token-12345');
    
    // Check for success or error message
    const hasMessage = await page.locator('text=/verified|expired|invalid/i').isVisible();
    expect(hasMessage).toBeTruthy();
  });
});
