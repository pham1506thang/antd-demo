export interface ApiError {
  statusCode: number;
  error: string;
  message: string;
  details: Record<string, string[]>;
}

export const isApiError = (error: any): error is ApiError => {
  return (
    error !== null &&
    typeof error === 'object' &&
    typeof error.statusCode === 'number' &&
    typeof error.error === 'string' &&
    typeof error.message === 'string' &&
    typeof error.details === 'object'
  );
};
