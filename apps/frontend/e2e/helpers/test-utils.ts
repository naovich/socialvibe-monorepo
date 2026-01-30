import { Page, expect } from '@playwright/test';

/**
 * Test utilities for SocialVibe E2E tests
 */

export interface TestUser {
  email: string;
  password: string;
  name: string;
  username: string;
}

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Generate unique test user
   */
  static generateUser(prefix: string = 'test'): TestUser {
    const timestamp = Date.now();
    return {
      email: `${prefix}${timestamp}@example.com`,
      password: 'Test123!',
      name: `Test User ${timestamp}`,
      username: `${prefix}${timestamp}`,
    };
  }

  /**
   * Register new user
   */
  async register(user: TestUser) {
    await this.page.goto('/register');
    
    // Use existing name attributes (elegant, no need for data-testid)
    await this.page.fill('input[name="name"]', user.name);
    await this.page.fill('input[name="username"]', user.username);
    await this.page.fill('input[name="email"]', user.email);
    await this.page.fill('input[name="password"]', user.password);
    
    // Submit button
    await this.page.click('button[type="submit"]');
    
    // Wait for redirect to home (accept /, /home, or /feed)
    // Increased timeout: Home.tsx loads currentUser + posts + stories
    await this.page.waitForURL((url) => {
      const path = new URL(url).pathname;
      return path === '/' || path === '/home' || path === '/feed';
    }, { timeout: 30000 });
    
    // Wait for localStorage to be populated (auth.ts sets it after API response)
    await this.page.waitForFunction(() => {
      return localStorage.getItem('access_token') !== null;
    }, { timeout: 5000 });
    
    // Verify JWT tokens stored (backend returns access_token)
    const authToken = await this.page.evaluate(() => localStorage.getItem('access_token'));
    const refreshToken = await this.page.evaluate(() => localStorage.getItem('refresh_token'));
    expect(authToken).toBeTruthy();
    expect(refreshToken).toBeTruthy();
    
    return user;
  }

  /**
   * Login with existing user
   */
  async login(email: string, password: string) {
    await this.page.goto('/login');
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
    
    // Wait for redirect (accept /, /home, or /feed)
    // Increased timeout: Home.tsx loads currentUser + posts + stories
    await this.page.waitForURL((url) => {
      const path = new URL(url).pathname;
      return path === '/' || path === '/home' || path === '/feed';
    }, { timeout: 30000 });
    
    // Wait for localStorage to be populated (auth.ts sets it after API response)
    await this.page.waitForFunction(() => {
      return localStorage.getItem('access_token') !== null;
    }, { timeout: 5000 });
    
    // Verify tokens (backend returns access_token)
    const authToken = await this.page.evaluate(() => localStorage.getItem('access_token'));
    expect(authToken).toBeTruthy();
  }

  /**
   * Logout
   */
  async logout() {
    // Click profile menu or logout button
    await this.page.click('[data-testid="user-menu"], [aria-label="User menu"]');
    await this.page.click('text=Logout, text=Déconnexion');
    
    // Wait for redirect to login
    await this.page.waitForURL(/\/login/);
    
    // Verify tokens cleared (use correct key: access_token)
    const authToken = await this.page.evaluate(() => localStorage.getItem('access_token'));
    expect(authToken).toBeNull();
  }

  /**
   * Create a post
   */
  async createPost(caption: string, imagePath?: string) {
    // Try multiple selectors (data-testid first, then text fallbacks)
    const createButton = this.page.locator('[data-testid="create-post"]').or(this.page.getByText(/create post|créer un post/i));
    await createButton.click();
    await this.page.fill('textarea[name="caption"]', caption);
    
    if (imagePath) {
      await this.page.setInputFiles('input[type="file"]', imagePath);
    }
    
    await this.page.click('button[type="submit"], text=Publish, text=Publier');
    
    // Wait for post to appear
    await this.page.waitForSelector(`text=${caption.substring(0, 20)}`);
  }

  /**
   * Like a post
   */
  async likePost(postId?: string) {
    const selector = postId 
      ? `[data-post-id="${postId}"] [aria-label*="Like"], [data-post-id="${postId}"] button:has-text("Like")`
      : '[aria-label*="Like"]:first, button:has-text("Like"):first';
    
    await this.page.click(selector);
    await this.page.waitForTimeout(500); // Wait for animation
  }

  /**
   * Comment on a post
   */
  async commentPost(text: string, postId?: string) {
    const selector = postId 
      ? `[data-post-id="${postId}"] [placeholder*="comment"]`
      : '[placeholder*="comment"]:first';
    
    await this.page.fill(selector, text);
    await this.page.press(selector, 'Enter');
    
    // Wait for comment to appear
    await this.page.waitForSelector(`text=${text}`);
  }

  /**
   * Search for user
   */
  async searchUser(username: string) {
    await this.page.fill('[placeholder*="Search"], [type="search"]', username);
    await this.page.waitForTimeout(500); // Debounce
    await this.page.waitForSelector(`text=${username}`);
  }

  /**
   * Follow a user
   */
  async followUser(username: string) {
    await this.searchUser(username);
    await this.page.click(`text=${username}`);
    await this.page.click('button:has-text("Follow"), button:has-text("Suivre")');
    await this.page.waitForTimeout(500);
  }

  /**
   * Send private message
   */
  async sendMessage(recipientUsername: string, messageText: string) {
    // Go to messages
    await this.page.goto('/messages');
    
    // Search recipient or click on conversation
    await this.page.click(`text=${recipientUsername}, [href*="${recipientUsername}"]`);
    
    // Type message
    await this.page.fill('[placeholder*="message"], textarea', messageText);
    await this.page.press('[placeholder*="message"], textarea', 'Enter');
    
    // Wait for message to appear
    await this.page.waitForSelector(`text=${messageText}`);
  }

  /**
   * Create a group
   */
  async createGroup(name: string, description?: string, isPrivate: boolean = false) {
    await this.page.goto('/groups');
    await this.page.click('text=Create Group, text=Créer un groupe');
    
    await this.page.fill('input[name="name"]', name);
    if (description) {
      await this.page.fill('textarea[name="description"], input[name="description"]', description);
    }
    if (isPrivate) {
      await this.page.check('input[type="checkbox"][name="isPrivate"]');
    }
    
    await this.page.click('button[type="submit"]');
    
    // Wait for group to be created
    await this.page.waitForSelector(`text=${name}`);
  }

  /**
   * Wait for WebSocket connection
   */
  async waitForWebSocket() {
    await this.page.waitForFunction(() => {
      // Check if WebSocket is connected (implementation specific)
      return true; // Placeholder
    });
  }

  /**
   * Clear all localStorage
   */
  async clearStorage() {
    // Navigate to a page first to have access to localStorage
    await this.page.goto('/login');
    await this.page.evaluate(() => localStorage.clear());
  }
}

/**
 * API Helpers for backend interactions
 */
export class ApiHelpers {
  constructor(private baseURL: string = 'http://localhost:3000') {}

  /**
   * Create user via API (faster than UI)
   */
  async createUser(user: TestUser): Promise<{ user: any; tokens: any }> {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Login via API
   */
  async loginUser(email: string, password: string): Promise<{ access_token: string; refresh_token: string }> {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`Failed to login: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Delete user (cleanup)
   */
  async deleteUser(userId: string, token: string) {
    // Note: You may need to implement this endpoint in backend
    const response = await fetch(`${this.baseURL}/users/${userId}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    return response.ok;
  }
}
