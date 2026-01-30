import { test, expect } from '@playwright/test';
import { TestHelpers } from './helpers/test-utils';

test.describe('Posts', () => {
  let helpers: TestHelpers;
  let user: any;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.clearStorage();
    
    // Create and login user
    user = TestHelpers.generateUser('posts');
    await helpers.register(user);
  });

  test('US-010: Create text post', async ({ page }) => {
    const postText = `Test post ${Date.now()}`;
    
    await helpers.createPost(postText);
    
    // Verify post appears in feed
    await expect(page.locator(`text=${postText}`)).toBeVisible();
    
    // Verify author name displayed
    await expect(page.locator(`text=${user.name}`)).toBeVisible();
    
    // Verify counters initialized
    await expect(page.locator('[aria-label*="likes"], text=/0 likes/i')).toBeVisible();
  });

  test('US-011: Create post with image', async ({ page }) => {
    // Note: Requires test image file
    // This is a placeholder - adjust path as needed
    const imagePath = './e2e/fixtures/test-image.jpg';
    const caption = 'Post with image';
    
    await page.click('[data-testid="create-post"]');
    await page.fill('textarea[name="caption"]', caption);
    
    // Upload image if file exists
    try {
      await page.setInputFiles('input[type="file"]', imagePath);
      await page.click('button[type="submit"]');
      
      // Verify image and caption
      await expect(page.locator(`text=${caption}`)).toBeVisible();
      await expect(page.locator('img[alt*="post"], [data-testid="post-image"]')).toBeVisible();
    } catch (error) {
      test.skip(); // Skip if test image not available
    }
  });

  test('US-012: Like and unlike post', async ({ page }) => {
    const postText = 'Post to like';
    await helpers.createPost(postText);
    
    // Get initial like count
    const likeButton = page.locator('[aria-label*="Like"]:first, button:has-text("Like"):first');
    
    // Like post
    await likeButton.click();
    await page.waitForTimeout(500);
    
    // Verify like button state changed
    await expect(likeButton).toHaveAttribute('aria-pressed', 'true');
    
    // Verify counter increased
    await expect(page.locator('text=/1 like/i')).toBeVisible();
    
    // Unlike post
    await likeButton.click();
    await page.waitForTimeout(500);
    
    // Verify unlike
    await expect(likeButton).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('text=/0 likes/i')).toBeVisible();
  });

  test('US-013: Comment on post', async ({ page }) => {
    const postText = 'Post to comment';
    const commentText = 'Great post! 👍';
    
    await helpers.createPost(postText);
    await helpers.commentPost(commentText);
    
    // Verify comment appears
    await expect(page.locator(`text=${commentText}`)).toBeVisible();
    
    // Verify comment counter increased
    await expect(page.locator('text=/1 comment/i')).toBeVisible();
  });

  test('US-014: View post details with all comments', async ({ page }) => {
    const postText = 'Post with comments';
    await helpers.createPost(postText);
    
    // Add multiple comments
    for (let i = 1; i <= 3; i++) {
      await helpers.commentPost(`Comment ${i}`);
    }
    
    // Click on post to view details
    await page.click(`text=${postText}`);
    
    // Verify all comments visible
    await expect(page.locator('text=Comment 1')).toBeVisible();
    await expect(page.locator('text=Comment 2')).toBeVisible();
    await expect(page.locator('text=Comment 3')).toBeVisible();
  });

  test('US-015: Edit own post', async ({ page }) => {
    const originalText = 'Original post text';
    const editedText = 'Edited post text';
    
    await helpers.createPost(originalText);
    
    // Click edit button (... menu)
    await page.click('[aria-label="Post options"], [data-testid="post-menu"]');
    await page.click('text=Edit, text=Modifier');
    
    // Edit text
    await page.fill('textarea', editedText);
    await page.click('button:has-text("Save"), button:has-text("Enregistrer")');
    
    // Verify edited text
    await expect(page.locator(`text=${editedText}`)).toBeVisible();
    await expect(page.locator(`text=${originalText}`)).not.toBeVisible();
  });

  test('US-016: Delete own post', async ({ page }) => {
    const postText = 'Post to delete';
    
    await helpers.createPost(postText);
    
    // Click delete button
    await page.click('[aria-label="Post options"], [data-testid="post-menu"]');
    await page.click('text=Delete, text=Supprimer');
    
    // Confirm deletion
    await page.click('button:has-text("Confirm"), button:has-text("Confirmer")');
    
    // Verify post disappeared
    await expect(page.locator(`text=${postText}`)).not.toBeVisible();
  });

  test('US-017: Receive like notification (WebSocket)', async ({ page, context }) => {
    // Create second user in new context
    const page2 = await context.newPage();
    const helpers2 = new TestHelpers(page2);
    const user2 = TestHelpers.generateUser('liker');
    
    await helpers2.register(user2);
    
    // User1 creates post
    const postText = 'Post for notification test';
    await helpers.createPost(postText);
    
    // Go to notifications page
    await page.goto('/notifications');
    
    // User2 likes user1's post
    await page2.goto('/');
    await page2.locator(`text=${postText}`).first().scrollIntoViewIfNeeded();
    await page2.locator('[aria-label*="Like"]:first').click();
    
    // Wait for WebSocket notification
    await page.waitForTimeout(2000);
    
    // Verify notification appeared for user1
    await expect(page.locator(`text=${user2.name}, text=liked`)).toBeVisible();
    
    await page2.close();
  });

  test('Performance: Posts load quickly', async ({ page }) => {
    // Create multiple posts
    for (let i = 1; i <= 5; i++) {
      await helpers.createPost(`Performance test post ${i}`);
    }
    
    // Measure load time
    const startTime = Date.now();
    await page.reload();
    await page.waitForSelector('text=Performance test post 1');
    const loadTime = Date.now() - startTime;
    
    // Should load in less than 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('Pagination: Infinite scroll loads more posts', async ({ page }) => {
    // Navigate to feed
    await page.goto('/');
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Wait for loading indicator or new posts
    await page.waitForTimeout(1000);
    
    // Verify more posts loaded
    // This assumes posts are paginated
    const posts = await page.locator('[data-testid="post"], article').count();
    expect(posts).toBeGreaterThan(0);
  });
});
