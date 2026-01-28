export type SearchResultType = 'user' | 'post' | 'hashtag';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  avatar?: string;
  thumbnail?: string;
  metadata?: Record<string, unknown>;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  recentSearches: string[];
}
