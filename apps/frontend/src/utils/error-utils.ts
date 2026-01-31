/**
 * Type guard and utilities for error handling
 */

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  );
}

export function getErrorMessage(error: unknown, defaultMessage: string): string {
  if (isApiError(error)) {
    return error.response?.data?.message || defaultMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
}
