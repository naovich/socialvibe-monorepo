import { test, expect } from '@playwright/test';
import { TestHelpers, type TestUser } from './helpers/test-utils';

test.describe('Social - Friends & Followers', () => {
  let helpers1: TestHelpers;
  let helpers2: TestHelpers;
  let user1: TestUser;
  let user2: TestUser;

  test.beforeEach(async ({ page, context }) => {
    // Create two users for social interactions
    user1 = TestHelpers.generateUser('user1');
    user2 = TestHelpers.generateUser('user2');
    
    helpers1 = new TestHelpers(page);
    await helpers1.register(user1);
    
    // Create second user in new page
    const page2 = await context.newPage();
    helpers2 = new TestHelpers(page2);
    await helpers2.register(user2);
    await page2.close();
  });

  test('US-018: Follow another user', async ({ page }) => {
    await helpers1.searchUser(user2.username);
    
    // Click on user2 profile
    await page.click(`text=${user2.name}`);
    
    // Click follow button
    await page.click('button:has-text("Follow"), button:has-text("Suivre")');
    
    // Verify button changed to "Following" or "Unfollow"
    await expect(page.locator('button:has-text("Following"), button:has-text("Unfollow"), button:has-text("Abonné")')).toBeVisible();
    
    // Verify followers count increased
    await expect(page.locator('text=/1 follower|1 abonné/i')).toBeVisible();
  });

  test('US-019: Unfollow a user', async ({ page }) => {
    // Follow first
    await helpers1.followUser(user2.username);
    
    // Click unfollow
    await page.click('button:has-text("Unfollow"), button:has-text("Ne plus suivre")');
    
    // Verify button back to "Follow"
    await expect(page.locator('button:has-text("Follow"), button:has-text("Suivre")')).toBeVisible();
  });

  test('US-020: View my followers list', async ({ page, context }) => {
    // User2 follows user1
    const page2 = await context.newPage();
    const helpers2Temp = new TestHelpers(page2);
    await helpers2Temp.login(user2.email, user2.password);
    await helpers2Temp.followUser(user1.username);
    await page2.close();
    
    // User1 checks followers
    await page.goto(`/profile/${user1.username}`);
    await page.click('text=/followers|abonnés/i');
    
    // Verify user2 in followers list
    await expect(page.locator(`text=${user2.name}`)).toBeVisible();
  });

  test('US-021: View my following list', async ({ page }) => {
    // Follow user2
    await helpers1.followUser(user2.username);
    
    // Go to my following list
    await page.goto(`/profile/${user1.username}`);
    await page.click('text=/following|abonnements/i');
    
    // Verify user2 in following list
    await expect(page.locator(`text=${user2.name}`)).toBeVisible();
  });

  test('Cannot follow yourself', async ({ page }) => {
    // Go to own profile
    await page.goto(`/profile/${user1.username}`);
    
    // Verify no follow button
    await expect(page.locator('button:has-text("Follow")')).not.toBeVisible();
  });
});
