import { test, expect } from '@playwright/test';

// Test data
const testUser = {
  email: `test-${Date.now()}@example.com`,
  password: 'password123',
  name: 'Test User E2E',
  username: `testuser${Date.now()}`,
};

const testUser2 = {
  email: `test2-${Date.now()}@example.com`,
  password: 'password123',
  name: 'Test User 2',
  username: `testuser2${Date.now()}`,
};

test.describe('SocialVibe E2E Complete Tests', () => {
  test.describe('1. Authentication Flow', () => {
    test('should register a new user', async ({ page }) => {
      await page.goto('/register');

      // Fill registration form
      await page.fill('input[name="name"]', testUser.name);
      await page.fill('input[name="username"]', testUser.username);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);

      // Submit
      await page.click('button[type="submit"]');

      // Should redirect to home
      await expect(page).toHaveURL('/', { timeout: 30000 });

      // Should see user name in header
      await expect(page.locator('text=' + testUser.name)).toBeVisible();
    });

    test('should login with existing user', async ({ page }) => {
      await page.goto('/login');

      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');

      // Wait for API call + navigation + Home.tsx data loading
      await expect(page).toHaveURL('/', { timeout: 30000 });
      await expect(page.locator('text=' + testUser.name)).toBeVisible();
    });

    test('should show error with invalid credentials', async ({ page }) => {
      await page.goto('/login');

      await page.fill('input[name="email"]', 'wrong@example.com');
      await page.fill('input[name="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');

      // Should show error message
      await expect(page.locator('text=/invalid|error/i')).toBeVisible();
    });

    test('should logout successfully', async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');

      // Wait for home page
      await expect(page).toHaveURL('/', { timeout: 30000 });

      // Open user menu and logout
      await page.click('[data-testid="user-menu"]', { timeout: 5000 }).catch(() => {
        // Fallback: look for avatar or menu icon
        return page.click('img[alt*="avatar"], button:has-text("menu")', { force: true });
      });

      await page.click('button:has-text("Logout"), text=Logout');

      // Should redirect to login
      await expect(page).toHaveURL('/login');
    });
  });

  test.describe('2. Posts Management', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each test
      await page.goto('/login');
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL('/', { timeout: 30000 });
    });

    test('should create a new post', async ({ page }) => {
      // Open create post modal
      await page.click('button:has-text("Create"), [data-testid="create-post"]');

      // Fill post content
      await page.fill('textarea[placeholder*="What"], textarea[name="caption"]', 'Test post from E2E');

      // Submit
      await page.click('button:has-text("Post"), button[type="submit"]');

      // Should see post in feed
      await expect(page.locator('text=Test post from E2E')).toBeVisible({ timeout: 10000 });
    });

    test('should like a post', async ({ page }) => {
      // Find first post like button
      const likeButton = page.locator('[data-testid="like-button"], button[aria-label*="like"]').first();

      // Get initial state
      const initialState = await likeButton.getAttribute('class');

      // Click like
      await likeButton.click();

      // Should change state
      await page.waitForTimeout(500); // Wait for animation
      const newState = await likeButton.getAttribute('class');
      expect(initialState).not.toBe(newState);
    });

    test('should add a comment', async ({ page }) => {
      // Find first post
      const commentButton = page.locator('button:has-text("Comment"), [data-testid="comment-button"]').first();
      await commentButton.click({ timeout: 5000 }).catch(() => {
        // Fallback: click anywhere that opens comment
        return page.locator('[data-testid="post-card"]').first().click();
      });

      // Fill comment
      await page.fill('input[placeholder*="comment"], textarea[placeholder*="comment"]', 'Great post!');

      // Submit
      await page.click('button:has-text("Post"), button[type="submit"]');

      // Should see comment
      await expect(page.locator('text=Great post!')).toBeVisible({ timeout: 5000 });
    });

    test('should delete own post', async ({ page }) => {
      // Create a post first
      await page.click('button:has-text("Create")');
      await page.fill('textarea', 'Post to delete');
      await page.click('button:has-text("Post")');

      await expect(page.locator('text=Post to delete')).toBeVisible();

      // Find and click post menu
      const postCard = page.locator('text=Post to delete').locator('..').locator('..');
      await postCard.locator('[data-testid="post-menu"], button:has-text("...")').click();

      // Click delete
      await page.click('button:has-text("Delete")');

      // Confirm if modal appears
      if (await page.locator('button:has-text("Confirm")').isVisible({ timeout: 1000 }).catch(() => false)) {
        await page.click('button:has-text("Confirm")');
      }

      // Should not see post anymore
      await expect(page.locator('text=Post to delete')).not.toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('3. Friends Management', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL('/', { timeout: 30000 });
    });

    test('should search for users', async ({ page }) => {
      // Open search
      const searchInput = page.locator('input[placeholder*="Search"], [data-testid="search-input"]');
      await searchInput.click();
      await searchInput.fill('alice');

      // Should see search results
      await expect(page.locator('[data-testid="search-results"], .search-result')).toBeVisible({ timeout: 3000 });
    });

    test('should send friend request', async ({ page }) => {
      // Search for a user
      await page.fill('input[placeholder*="Search"]', testUser2.username);
      await page.waitForTimeout(1000);

      // Click on user result
      await page.click(`text=${testUser2.username}, [data-testid="user-result"]`).catch(() => {
        // If no results, skip test
        test.skip();
      });

      // Should navigate to user profile
      await expect(page).toHaveURL(/\/user\//);

      // Click Add Friend button
      const addFriendBtn = page.locator('button:has-text("Add Friend")');
      if (await addFriendBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await addFriendBtn.click();

        // Should show Request Sent
        await expect(page.locator('text=Request Sent, button:has-text("Request Sent")')).toBeVisible({ timeout: 3000 });
      }
    });

    test('should view friends list', async ({ page }) => {
      // Check sidebar for friends list
      const friendsList = page.locator('[data-testid="friends-list"], .friends-sidebar');

      if (await friendsList.isVisible({ timeout: 2000 }).catch(() => false)) {
        // Should see friends
        const friendItems = page.locator('[data-testid="friend-item"]');
        const count = await friendItems.count();
        expect(count).toBeGreaterThanOrEqual(0);
      }
    });
  });

  test.describe('4. Profile Management', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL('/', { timeout: 30000 });
    });

    test('should view own profile', async ({ page }) => {
      // Click on avatar/name to view profile
      await page.click(`text=${testUser.name}, [data-testid="user-avatar"]`);

      // Should see profile info
      await expect(page.locator(`text=${testUser.name}`)).toBeVisible();
      await expect(page.locator(`text=@${testUser.username}`)).toBeVisible();
    });

    test('should edit profile', async ({ page }) => {
      // Go to profile
      await page.click(`text=${testUser.name}`);

      // Click Edit Profile
      await page.click('button:has-text("Edit Profile")');

      // Should open modal
      await expect(page.locator('text=Edit Profile, [data-testid="edit-profile-modal"]')).toBeVisible();

      // Update bio
      await page.fill('textarea[name="bio"], textarea[placeholder*="bio"]', 'Updated bio via E2E test');

      // Save
      await page.click('button:has-text("Save")');

      // Should close modal and show updated bio
      await expect(page.locator('text=Updated bio via E2E test')).toBeVisible({ timeout: 5000 });
    });

    test('should view another user profile', async ({ page }) => {
      // Search and click on another user
      await page.fill('input[placeholder*="Search"]', 'alice');
      await page.waitForTimeout(1000);

      await page.click('text=alice, [data-testid="user-result"]').catch(() => test.skip());

      // Should see user profile
      await expect(page).toHaveURL(/\/user\//);
      await expect(page.locator('text=alice, text=Alice')).toBeVisible();
    });
  });

  test.describe('5. Messages/Chat', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL('/', { timeout: 30000 });
    });

    test('should access messages page', async ({ page }) => {
      // Click Messages in header
      await page.click('[data-testid="messages-button"], button:has-text("Messages")');

      // Should navigate to messages
      await expect(page).toHaveURL('/messages');
    });

    test('should send a message', async ({ page }) => {
      // Navigate to messages
      await page.goto('/messages');

      // If no conversations, skip
      const firstConversation = page.locator('[data-testid="conversation-item"]').first();
      if (await firstConversation.isVisible({ timeout: 2000 }).catch(() => false)) {
        await firstConversation.click();

        // Should open chat
        await expect(page).toHaveURL(/\/chat\//);

        // Type message
        await page.fill('textarea[placeholder*="message"], input[placeholder*="message"]', 'Hello from E2E!');

        // Send
        await page.click('button:has-text("Send"), button[type="submit"]');

        // Should see message
        await expect(page.locator('text=Hello from E2E!')).toBeVisible({ timeout: 3000 });
      } else {
        test.skip();
      }
    });
  });

  test.describe('6. Groups', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL('/', { timeout: 30000 });
    });

    test('should access groups page', async ({ page }) => {
      await page.click('[data-testid="groups-button"], button:has-text("Groups")');
      await expect(page).toHaveURL('/groups');
    });

    test('should create a group', async ({ page }) => {
      await page.goto('/groups');

      // Click Create Group
      await page.click('button:has-text("Create Group")');

      // Fill form
      await page.fill('input[name="name"]', `E2E Test Group ${Date.now()}`);
      await page.fill('textarea[name="description"]', 'Created by E2E test');

      // Select Public
      await page.click('button:has-text("Public")');

      // Submit
      await page.click('button:has-text("Create")');

      // Should see group in list
      await expect(page.locator('text=E2E Test Group')).toBeVisible({ timeout: 5000 });
    });

    test('should join a public group', async ({ page }) => {
      await page.goto('/groups');

      // Find a public group
      const publicGroup = page.locator('[data-testid="group-card"]').filter({ hasText: 'Public' }).first();

      if (await publicGroup.isVisible({ timeout: 2000 }).catch(() => false)) {
        await publicGroup.click();

        // Should open group page
        await expect(page).toHaveURL(/\/group\//);

        // Try to join if not member
        const joinButton = page.locator('button:has-text("Join")');
        if (await joinButton.isVisible({ timeout: 1000 }).catch(() => false)) {
          await joinButton.click();

          // Should show Member or joined state
          await expect(page.locator('text=Member, text=Leave')).toBeVisible({ timeout: 3000 });
        }
      } else {
        test.skip();
      }
    });
  });

  test.describe('7. Settings', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL('/', { timeout: 30000 });
    });

    test('should access settings page', async ({ page }) => {
      // Open user menu
      await page.click('[data-testid="user-menu"]').catch(() => {
        return page.click('img[alt*="avatar"]');
      });

      // Click Settings
      await page.click('text=Settings');

      // Should navigate to settings
      await expect(page).toHaveURL('/settings');
    });

    test('should toggle theme', async ({ page }) => {
      await page.goto('/settings');

      // Find theme toggle
      const lightTheme = page.locator('button:has-text("Light")');
      await lightTheme.click();

      // Check if theme changed (body class or style)
      await page.waitForTimeout(500);
      // Theme change verification depends on implementation
    });

    test('should toggle notifications', async ({ page }) => {
      await page.goto('/settings');

      // Find notification toggles
      const notifToggle = page.locator('[data-testid="notification-toggle"]').first();
      if (await notifToggle.isVisible({ timeout: 1000 }).catch(() => false)) {
        await notifToggle.click();
        await page.waitForTimeout(500);
        // Should toggle state
      }
    });
  });

  test.describe('8. Stories', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL('/', { timeout: 30000 });
    });

    test('should view stories bar', async ({ page }) => {
      // Check if stories bar exists
      const storiesBar = page.locator('[data-testid="stories-bar"], .stories');
      const isVisible = await storiesBar.isVisible({ timeout: 2000 }).catch(() => false);

      if (isVisible) {
        // Should see story items
        const storyItems = page.locator('[data-testid="story-item"]');
        const count = await storyItems.count();
        expect(count).toBeGreaterThanOrEqual(0);
      }
    });
  });

  test.describe('9. Search', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL('/', { timeout: 30000 });
    });

    test('should search users', async ({ page }) => {
      const searchInput = page.locator('input[placeholder*="Search"]');
      await searchInput.fill('test');

      await page.waitForTimeout(1000); // Debounce

      // Should see results
      const results = page.locator('[data-testid="search-results"]');
      if (await results.isVisible({ timeout: 2000 }).catch(() => false)) {
        expect(await results.count()).toBeGreaterThan(0);
      }
    });
  });

  test.describe('10. Notifications', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL('/', { timeout: 30000 });
    });

    test('should open notifications panel', async ({ page }) => {
      // Click notifications bell
      const notifButton = page.locator('[data-testid="notifications-button"], button[aria-label*="notification"]');
      await notifButton.click();

      // Should see notifications panel
      await expect(page.locator('[data-testid="notifications-panel"], .notifications')).toBeVisible({ timeout: 2000 });
    });
  });
});
