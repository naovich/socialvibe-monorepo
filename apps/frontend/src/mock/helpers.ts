// Mock data utilities

const DELAY_MS = 2000;

export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomDate = (daysBack: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.random() * daysBack);
  return date.toISOString();
};

export const randomElement = <T,>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const delay = (): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, DELAY_MS));
};

export const shortenNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export const formatDate = (date: string): string => {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
};

export const withDelay = async <T,>(data: T): Promise<T> => {
  await delay();
  return data;
};
