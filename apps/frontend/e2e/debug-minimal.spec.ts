import { test } from '@playwright/test';

test('DEBUG: Minimal register test', async ({ page }) => {
  console.log('🔍 Starting minimal test');
  
  await page.goto('/register');
  console.log('✅ Page loaded');
  
  const timestamp = Date.now();
  await page.fill('input[name="name"]', `Debug User ${timestamp}`);
  await page.fill('input[name="username"]', `debug${timestamp}`);
  await page.fill('input[name="email"]', `debug${timestamp}@test.com`);
  await page.fill('input[name="password"]', 'Test123!');
  console.log('✅ Form filled');
  
  // Monitor network requests
  page.on('request', req => console.log('→ REQUEST:', req.method(), req.url()));
  page.on('response', res => console.log('← RESPONSE:', res.status(), res.url()));
  
  await page.click('button[type="submit"]');
  console.log('✅ Submit clicked');
  
  // Wait max 10s to see what happens
  await page.waitForTimeout(10000);
  
  console.log('Current URL:', page.url());
});
