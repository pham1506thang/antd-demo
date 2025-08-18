import type { FormInstance } from 'antd';
import { isApiError } from '@/models/error';

/**
 * Hook to handle API errors and display field-level errors in a form
 * @returns Function to handle API errors
 */
export const useApiFormErrorHandler = () => {
  /**
   * Handle API errors and display field-level errors
   * @param error - API error (could be FetchBaseQueryError, SerializedError, or undefined)
   * @param form - Ant Design Form instance
   */
  const handleFormApiError = (error: any, form: FormInstance) => {
    // Check if it's a server error (FetchBaseQueryError with ApiError data)
    if (isApiError(error)) {
      // Handle field-level errors
      const fieldErrors = Object.entries(error.details).map(
        ([fieldName, messages]) => ({
          name: fieldName,
          errors: messages,
        })
      );

      form.setFields(fieldErrors);
      return;
    }
  };

  return { handleFormApiError };
};
