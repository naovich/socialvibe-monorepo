const STORAGE_KEY = 'socialvibe_bookmarks';

class BookmarkService {
  private bookmarkedPosts: Set<string>;

  constructor() {
    this.bookmarkedPosts = this.loadFromStorage();
  }

  private loadFromStorage(): Set<string> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch (err) {
      console.error('Failed to load bookmarks:', err);
      return new Set();
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...this.bookmarkedPosts]));
    } catch (err) {
      console.error('Failed to save bookmarks:', err);
    }
  }

  isBookmarked(postId: string): boolean {
    return this.bookmarkedPosts.has(postId);
  }

  toggleBookmark(postId: string): boolean {
    if (this.bookmarkedPosts.has(postId)) {
      this.bookmarkedPosts.delete(postId);
    } else {
      this.bookmarkedPosts.add(postId);
    }
    this.saveToStorage();
    return this.bookmarkedPosts.has(postId);
  }

  getBookmarkedPosts(): string[] {
    return [...this.bookmarkedPosts];
  }

  clearAll(): void {
    this.bookmarkedPosts.clear();
    this.saveToStorage();
  }
}

export const bookmarkService = new BookmarkService();
