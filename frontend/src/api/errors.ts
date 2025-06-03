export interface ApiError extends Error {
  statusCode: number;
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof Error && 'statusCode' in error;
}

export function isAuthError(error: unknown): error is ApiError {
  return isApiError(error) && error.statusCode === 401;
}

export function createApiError(message: string, statusCode: number): ApiError {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  error.name = 'ApiError';
  return error;
}