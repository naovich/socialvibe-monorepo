import type { SearchResult } from '../types/search.types';

const RECENT_SEARCHES_KEY = 'socialvibe_recent_searches';
const MAX_RECENT = 5;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockUsers = [
  { id: '1', name: 'Sarah Wilson', username: 'sarah_w', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: '2', name: 'Alex Thompson', username: 'alex_t', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: '3', name: 'Emma Johnson', username: 'emma_j', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
  { id: '4', name: 'Michael Chen', username: 'michael_c', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
];

const mockHashtags = [
  { tag: 'travel', count: 1234 },
  { tag: 'photography', count: 987 },
  { tag: 'coding', count: 756 },
  { tag: 'fitness', count: 543 },
];

class SearchService {
  async search(query: string): Promise<SearchResult[]> {
    await delay(300);

    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search users
    mockUsers
      .filter(u => 
        u.name.toLowerCase().includes(lowerQuery) || 
        u.username.toLowerCase().includes(lowerQuery)
      )
      .forEach(user => {
        results.push({
          id: user.id,
          type: 'user',
          title: user.name,
          subtitle: `@${user.username}`,
          avatar: user.avatar,
        });
      });

    // Search hashtags
    mockHashtags
      .filter(h => h.tag.toLowerCase().includes(lowerQuery))
      .forEach(hashtag => {
        results.push({
          id: hashtag.tag,
          type: 'hashtag',
          title: `#${hashtag.tag}`,
          subtitle: `${hashtag.count} posts`,
        });
      });

    return results.slice(0, 10);
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
