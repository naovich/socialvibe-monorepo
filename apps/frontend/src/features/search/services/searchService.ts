import type { SearchResult } from '../types/search.types';
import { searchAPI } from '../../../services/api';

const RECENT_SEARCHES_KEY = 'socialvibe_recent_searches';
const MAX_RECENT = 5;

class SearchService {
  async search(query: string): Promise<SearchResult[]> {
    if (!query.trim() || query.length < 2) return [];

    try {
      const { users, posts } = await searchAPI.search(query);
      const results: SearchResult[] = [];

      // Add users
      users.forEach((user: any) => {
        results.push({
          id: user.id,
          type: 'user',
          title: user.name,
          subtitle: `@${user.username}`,
          avatar: user.avatar,
        });
      });

      // Add posts count as hashtag result
      if (posts.length > 0) {
        results.push({
          id: `posts-${query}`,
          type: 'hashtag',
          title: `#${query}`,
          subtitle: `${posts.length} post${posts.length > 1 ? 's' : ''}`,
        });
      }

      return results.slice(0, 10);
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  }

  getRecentSearches(): string[] {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  addRecentSearch(query: string): void {
    if (!query.trim()) return;

    try {
      let recent = this.getRecentSearches();
      recent = [query, ...recent.filter(q => q !== query)].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent));
    } catch (err) {
      console.error('Failed to save recent search:', err);
    }
  }

  clearRecentSearches(): void {
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (err) {
      console.error('Failed to clear recent searches:', err);
    }
  }
}

export const searchService = new SearchService();
