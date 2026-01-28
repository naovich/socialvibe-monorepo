export type SearchResultType = 'user' | 'post' | 'hashtag';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  avatar?: string;
  thumbnail?: string;
  metadata?: Record<string, any>;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  recentSearches: string[];
}
