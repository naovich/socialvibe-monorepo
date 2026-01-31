import { test } from '@playwright/test';

test('Debug register API call', async ({ page }) => {
  // Enable console logs
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  
  // Catch errors
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  // Monitor network requests
  page.on('request', request => {
    if (request.url().includes('auth/register')) {
      console.log('→ REQUEST:', request.url(), request.postDataJSON());
    }
  });
  
  page.on('response', async response => {
    if (response.url().includes('auth/register')) {
      console.log('← RESPONSE:', response.status(), await response.text().catch(() => 'body unavailable'));
    }
  });
  
  // Go to register page
  await page.goto('/register');
  
  // Fill form
  await page.fill('input[name="name"]', 'Test Debug');
  await page.fill('input[name="username"]', `debug${Date.now()}`);
  await page.fill('input[name="email"]', `debug${Date.now()}@test.com`);
  await page.fill('input[name="password"]', 'Test123!');
  
  // Submit
  await page.click('button[type="submit"]');
  
  // Wait a bit
  await page.waitForTimeout(3000);
  
  // Check localStorage
  const accessToken = await page.evaluate(() => localStorage.getItem('access_token'));
  const refreshToken = await page.evaluate(() => localStorage.getItem('refresh_token'));
  
  console.log('ACCESS TOKEN:', accessToken ? 'PRESENT' : 'NULL');
  console.log('REFRESH TOKEN:', refreshToken ? 'PRESENT' : 'NULL');
  console.log('CURRENT URL:', page.url());
  
  // Take screenshot
  await page.screenshot({ path: '/tmp/debug-register.png' });
});
