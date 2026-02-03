import { test, expect } from '@playwright/test';

test.describe('Feed', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      localStorage.setItem('access_token', 'mock-token');
      localStorage.setItem('refresh_token', 'mock-refresh-token');
    });

    // Mock posts API
    await page.route('**/posts*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          posts: [
            {
              id: '1',
              caption: 'Test post 1',
              image: 'https://via.placeholder.com/600',
              author: {
                id: '1',
                name: 'Test User',
                username: 'testuser',
                avatar: null,
              },
              likes: 10,
              comments: [],
              isLiked: false,
              createdAt: new Date().toISOString(),
            },
            {
              id: '2',
              caption: 'Test post 2',
              image: null,
              author: {
                id: '2',
                name: 'Another User',
                username: 'anotheruser',
                avatar: null,
              },
              likes: 5,
              comments: [],
              isLiked: true,
              createdAt: new Date().toISOString(),
            },
          ],
          pagination: {
            page: 1,
            limit: 20,
            total: 2,
            totalPages: 1,
            hasMore: false,
          },
        }),
      });
    });
  });

  test('should display posts in feed', async ({ page }) => {
    await page.goto('/');
    
    // Wait for posts to load
    await page.waitForSelector('[data-testid="post"]', { timeout: 5000 });
    
    // Check that posts are displayed
    const posts = await page.locator('[data-testid="post"]').count();
    expect(posts).toBeGreaterThan(0);
  });

  test('should toggle like on a post', async ({ page }) => {
    // Mock like toggle
    await page.route('**/posts/*/like', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ liked: true }),
      });
    });

    await page.goto('/');
    await page.waitForSelector('[data-testid="post"]');
    
    const likeButton = page.locator('[data-testid="like-button"]').first();
    await likeButton.click();
    
    // Check optimistic UI update
    await expect(likeButton).toHaveAttribute('data-liked', 'true');
  });

  test('should open create post modal', async ({ page }) => {
    await page.goto('/');
    
    const createButton = page.getByRole('button', { name: /create|new post/i });
    await createButton.click();
    
    await expect(page.locator('[data-testid="create-post-modal"]')).toBeVisible();
  });
});
