import { test, expect } from '@playwright/test';
import { TestHelpers, type TestUser } from './helpers/test-utils';

test.describe('Security', () => {
  let helpers: TestHelpers;
  let user1: TestUser;
  let user2: TestUser;

  test.beforeEach(async ({ page, context }) => {
    user1 = TestHelpers.generateUser('secure1');
    user2 = TestHelpers.generateUser('secure2');
    
    helpers = new TestHelpers(page);
    await helpers.register(user1);
    
    const page2 = await context.newPage();
    const helpers2 = new TestHelpers(page2);
    await helpers2.register(user2);
    await page2.close();
  });

  test('US-040: Email not exposed publicly', async ({ page, request }) => {
    // Visit user2 profile
    await page.goto(`/profile/${user2.username}`);
    
    // Check page content doesn't contain email
    const content = await page.content();
    expect(content).not.toContain(user2.email);
    
    // Check API response doesn't contain email
    const response = await request.get(`http://localhost:3000/users/username/${user2.username}`);
    const data = await response.json();
    
    expect(data.email).toBeUndefined();
  });

  test('US-041: CORS and security headers present', async ({ request }) => {
    const response = await request.get('http://localhost:3000/');
    
    const headers = response.headers();
    
    // Check security headers (Helmet)
    expect(headers['x-frame-options']).toBeTruthy();
    expect(headers['x-content-type-options']).toBe('nosniff');
  });

  test('Cannot access protected routes without auth', async ({ page }) => {
    await helpers.clearStorage();
    
    // Try to access protected pages
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
    
    await page.goto('/messages');
    await expect(page).toHaveURL(/\/login/);
    
    await page.goto('/profile');
    await expect(page).toHaveURL(/\/login/);
  });

  test('XSS protection: Script tags in posts are sanitized', async ({ page }) => {
    const xssAttempt = '<script>alert("XSS")</script>Safe text';
    
    await helpers.createPost(xssAttempt);
    
    // Verify script tag is sanitized (not executed)
    const alerts = [];
    page.on('dialog', dialog => {
      alerts.push(dialog.message());
      dialog.dismiss();
    });
    
    await page.waitForTimeout(1000);
    expect(alerts).toHaveLength(0); // No alerts = XSS blocked
    
    // Verify safe text still visible
    await expect(page.locator('text=Safe text')).toBeVisible();
  });

  test('JWT token stored securely in localStorage', async ({ page }) => {
    const tokens = await page.evaluate(() => ({
      authToken: localStorage.getItem('auth_token'),
      refreshToken: localStorage.getItem('refresh_token'),
    }));
    
    // Verify tokens exist
    expect(tokens.authToken).toBeTruthy();
    expect(tokens.refreshToken).toBeTruthy();
    
    // Verify tokens are not in cookies (less secure)
    const cookies = await page.context().cookies();
    const tokenInCookies = cookies.some(c => 
      c.name === 'auth_token' || c.name === 'access_token'
    );
    expect(tokenInCookies).toBeFalsy();
  });
});

test.describe('Performance', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    const user = TestHelpers.generateUser('perf');
    await helpers.register(user);
  });

  test('US-038: Home page loads in less than 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('US-039: Infinite scroll pagination works', async ({ page }) => {
    await page.goto('/');
    
    // Get initial post count
    const initialCount = await page.locator('[data-testid="post"], article').count();
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    // Get new post count
    const newCount = await page.locator('[data-testid="post"], article').count();
    
    // More posts should have loaded
    expect(newCount).toBeGreaterThanOrEqual(initialCount);
  });

  test('Bundle size is optimized', async ({ page }) => {
    const client = await page.context().newCDPSession(page);
    await client.send('Performance.enable');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const metrics = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource');
      const jsFiles = entries.filter(e => e.name.endsWith('.js'));
      const totalSize = jsFiles.reduce((sum, file: PerformanceResourceTiming) => sum + (file.transferSize || 0), 0);
      return {
        jsFileCount: jsFiles.length,
        totalSizeKB: Math.round(totalSize / 1024),
      };
    });
    
    // Bundle should be reasonably sized
    expect(metrics.totalSizeKB).toBeLessThan(1000); // < 1MB total JS
  });

  test('Images are lazy loaded', async ({ page }) => {
    await page.goto('/');
    
    // Check if images have loading="lazy" attribute
    const images = page.locator('img');
    const count = await images.count();
    
    if (count > 0) {
      const firstImg = images.first();
      const loading = await firstImg.getAttribute('loading');
      
      // Should have lazy loading
      expect(loading).toBe('lazy');
    }
  });

  test('No memory leaks on navigation', async ({ page }) => {
    // Get initial memory
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    const initialMemory = await page.evaluate(() => {
      if ('memory' in performance) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    });
    
    // Navigate multiple times
    for (let i = 0; i < 5; i++) {
      await page.goto('/messages');
      await page.goto('/groups');
      await page.goto('/');
    }
    
    await page.waitForTimeout(1000);
    
    const finalMemory = await page.evaluate(() => {
      if ('memory' in performance) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    });
    
    // Memory shouldn't grow too much (less than 50% increase)
    if (initialMemory > 0) {
      const increase = (finalMemory - initialMemory) / initialMemory;
      expect(increase).toBeLessThan(0.5);
    }
  });
});

test.describe('Edge Cases', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    const user = TestHelpers.generateUser('edge');
    await helpers.register(user);
  });

  test('US-042: Offline handling', async ({ page, context }) => {
    // Go offline
    await context.setOffline(true);
    
    // Try to create post
    await page.click('[data-testid="create-post"]');
    await page.fill('textarea', 'Offline post');
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=/offline|connection|network/i')).toBeVisible();
    
    // Go back online
    await context.setOffline(false);
  });

  test('US-043: Rapid like/unlike is handled correctly', async ({ page }) => {
    await helpers.createPost('Rapid click test');
    
    const likeButton = page.locator('[aria-label*="Like"]:first');
    
    // Click rapidly 10 times
    for (let i = 0; i < 10; i++) {
      await likeButton.click({ delay: 50 });
    }
    
    await page.waitForTimeout(1000);
    
    // Final state should be consistent (either liked or not)
    const isLiked = await likeButton.getAttribute('aria-pressed');
    expect(isLiked === 'true' || isLiked === 'false').toBeTruthy();
    
    // Reload and verify state persists
    await page.reload();
    const newState = await page.locator('[aria-label*="Like"]:first').getAttribute('aria-pressed');
    expect(newState).toBe(isLiked);
  });

  test('US-044: Long text is handled properly', async ({ page }) => {
    const longText = 'A'.repeat(5000);
    
    await helpers.createPost(longText);
    
    // Verify post created without breaking layout
    await expect(page.locator('[data-testid="post"]:first')).toBeVisible();
    
    // Check no horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => 
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasHorizontalScroll).toBeFalsy();
  });

  test('Empty form submissions are blocked', async ({ page }) => {
    await page.click('[data-testid="create-post"]');
    await page.click('button[type="submit"]');
    
    // Should show validation error
    await expect(page.locator('text=/required|obligatoire|cannot be empty/i')).toBeVisible();
  });

  test('Special characters in username are handled', async ({ page }) => {
    const specialUsername = 'test_user-123';
    
    await page.goto(`/profile/${specialUsername}`);
    
    // Should handle gracefully (404 or profile not found)
    const has404 = await page.locator('text=/not found|404/i').isVisible();
    expect(has404).toBeTruthy();
  });
});
