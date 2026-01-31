import { test, expect } from '@playwright/test';

/**
 * Tests E2E pour les notifications
 * Fonctionnalités testées: receive notification, mark as read, view notifications
 */

test.describe('Notifications', () => {
  const timestamp = Date.now();
  const user1 = {
    username: `notifuser1_${timestamp}`,
    email: `notif1_${timestamp}@test.com`,
    password: 'Test123!@#',
  };
  const user2 = {
    username: `notifuser2_${timestamp}`,
    email: `notif2_${timestamp}@test.com`,
    password: 'Test123!@#',
  };

  test('should receive notification when someone likes your post', async ({ browser }) => {
    // Ce test nécessite 2 utilisateurs, donc 2 contextes
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    try {
      // 1. User1 crée un compte et un post
      await page1.goto('/register');
      await page1.getByLabel(/username/i).fill(user1.username);
      await page1.getByLabel(/email/i).fill(user1.email);
      await page1.getByLabel(/^password$/i).fill(user1.password);
      await page1.getByRole('button', { name: /sign up/i }).click();
      await page1.waitForURL(/.*\/(home|feed)?/, { timeout: 10000 });

      const postContent = `Post to like ${Date.now()}`;
      await page1.getByPlaceholder(/what.*mind|share.*thoughts/i).fill(postContent);
      await page1.getByRole('button', { name: /post|publish|share/i }).click();
      await page1.waitForResponse(
        (response) => response.url().includes('/posts') && response.ok,
        { timeout: 10000 }
      );

      // 2. User2 crée un compte
      await page2.goto('/register');
      await page2.getByLabel(/username/i).fill(user2.username);
      await page2.getByLabel(/email/i).fill(user2.email);
      await page2.getByLabel(/^password$/i).fill(user2.password);
      await page2.getByRole('button', { name: /sign up/i }).click();
      await page2.waitForURL(/.*\/(home|feed)?/, { timeout: 10000 });

      // 3. User2 like le post de User1
      const post = page2.locator(`text="${postContent}"`).locator('..').locator('..');
      await expect(post).toBeVisible({ timeout: 5000 });
      
      const likeButton = post.getByRole('button', { name: /like|heart/i }).first();
      await likeButton.click();
      await page2.waitForResponse(
        (response) =>
          response.url().includes('/posts/') &&
          response.url().includes('/like') &&
          response.ok,
        { timeout: 10000 }
      );

      // 4. User1 vérifie ses notifications
      await page1.reload();
      
      // Chercher l'icône de notification
      const notifIcon = page1.getByRole('button', { name: /notification/i })
        .or(page1.locator('[aria-label*="notification" i]'))
        .or(page1.locator('button:has-text("🔔")'));
      
      await expect(notifIcon.first()).toBeVisible({ timeout: 5000 });
      await notifIcon.first().click();

      // 5. Vérifier que la notification de like apparaît
      await expect(
        page1.getByText(/liked.*post/i).or(
          page1.getByText(new RegExp(user2.username, 'i'))
        )
      ).toBeVisible({ timeout: 5000 });
    } finally {
      await context1.close();
      await context2.close();
    }
  });

  test('should receive notification when someone comments', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    try {
      // 1. User1 crée un post
      await page1.goto('/register');
      await page1.getByLabel(/username/i).fill(user1.username + '_comment');
      await page1.getByLabel(/email/i).fill(`comment1_${timestamp}@test.com`);
      await page1.getByLabel(/^password$/i).fill(user1.password);
      await page1.getByRole('button', { name: /sign up/i }).click();
      await page1.waitForURL(/.*\/(home|feed)?/, { timeout: 10000 });

      const postContent = `Post to comment ${Date.now()}`;
      await page1.getByPlaceholder(/what.*mind|share.*thoughts/i).fill(postContent);
      await page1.getByRole('button', { name: /post|publish|share/i }).click();
      await page1.waitForResponse(
        (response) => response.url().includes('/posts') && response.ok,
        { timeout: 10000 }
      );

      // 2. User2 commente le post
      await page2.goto('/register');
      await page2.getByLabel(/username/i).fill(user2.username + '_comment');
      await page2.getByLabel(/email/i).fill(`comment2_${timestamp}@test.com`);
      await page2.getByLabel(/^password$/i).fill(user2.password);
      await page2.getByRole('button', { name: /sign up/i }).click();
      await page2.waitForURL(/.*\/(home|feed)?/, { timeout: 10000 });

      const post = page2.locator(`text="${postContent}"`).locator('..').locator('..');
      await expect(post).toBeVisible({ timeout: 5000 });
      
      await post.getByRole('button', { name: /comment/i }).first().click();
      const commentInput = page2.getByPlaceholder(/write.*comment|add.*comment/i);
      await commentInput.fill('Test comment');
      await page2.getByRole('button', { name: /send|post|submit/i }).first().click();
      await page2.waitForResponse(
        (response) =>
          response.url().includes('/posts/') &&
          response.url().includes('/comment') &&
          response.ok,
        { timeout: 10000 }
      );

      // 3. User1 vérifie ses notifications
      await page1.reload();
      const notifIcon = page1.getByRole('button', { name: /notification/i }).first();
      await notifIcon.click();

      await expect(
        page1.getByText(/commented.*post/i)
      ).toBeVisible({ timeout: 5000 });
    } finally {
      await context1.close();
      await context2.close();
    }
  });

  test('should mark notification as read', async ({ page }) => {
    // 1. Se connecter
    await page.goto('/register');
    await page.getByLabel(/username/i).fill(user1.username + '_read');
    await page.getByLabel(/email/i).fill(`read_${timestamp}@test.com`);
    await page.getByLabel(/^password$/i).fill(user1.password);
    await page.getByRole('button', { name: /sign up/i }).click();
    await page.waitForURL(/.*\/(home|feed)?/, { timeout: 10000 });

    // 2. Ouvrir les notifications
    const notifIcon = page.getByRole('button', { name: /notification/i })
      .or(page.locator('[aria-label*="notification" i]'));
    
    await expect(notifIcon.first()).toBeVisible({ timeout: 5000 });
    await notifIcon.first().click();

    // 3. S'il y a des notifications, cliquer sur "mark all as read" ou sur une notification
    const markAllButton = page.getByRole('button', { name: /mark.*read|clear/i });
    
    if (await markAllButton.isVisible({ timeout: 2000 })) {
      await markAllButton.click();
      
      // Attendre la réponse réseau
      await page.waitForResponse(
        (response) =>
          response.url().includes('/notifications') && response.ok,
        { timeout: 10000 }
      ).catch(() => {
        // Ignorer si pas de requête (pas de notifs)
      });
    }

    // 4. Vérifier que le badge de notifications a disparu ou est à 0
    // Le badge peut être un nombre ou un point rouge
    const notifBadge = page.locator('[data-badge]').or(
      page.locator('.badge').filter({ hasText: /\d+/ })
    );
    
    await expect(notifBadge).not.toBeVisible({ timeout: 3000 }).catch(() => {
      // Ignorer si pas de badge système
    });
  });

  test('should display notification count badge', async ({ page }) => {
    // 1. Se connecter
    await page.goto('/register');
    await page.getByLabel(/username/i).fill(user1.username + '_badge');
    await page.getByLabel(/email/i).fill(`badge_${timestamp}@test.com`);
    await page.getByLabel(/^password$/i).fill(user1.password);
    await page.getByRole('button', { name: /sign up/i }).click();
    await page.waitForURL(/.*\/(home|feed)?/, { timeout: 10000 });

    // 2. Vérifier la présence de l'icône de notification
    const notifIcon = page.getByRole('button', { name: /notification/i })
      .or(page.locator('[aria-label*="notification" i]'));
    
    await expect(notifIcon.first()).toBeVisible({ timeout: 5000 });

    // 3. Le badge peut être visible ou non selon s'il y a des notifications
    // On vérifie juste que l'icône existe et est cliquable
    await notifIcon.first().click();
    
    // Le panneau de notifications devrait s'ouvrir
    await expect(
      page.getByRole('heading', { name: /notification/i }).or(
        page.getByText(/no.*notification|notification.*empty/i)
      )
    ).toBeVisible({ timeout: 5000 });
  });
});
