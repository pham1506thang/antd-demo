/**
 * Helper functions for date parsing
 * Use these when you need to convert string dates to Date objects for display
 */

/**
 * Parse a date string to Date object safely
 * @param dateString - Date string from API
 * @returns Date object or null if invalid
 */
export const parseDate = (dateString: string | null | undefined): Date | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

/**
 * Format date string to locale string
 * @param dateString - Date string from API
 * @param locale - Locale string (default: 'vi-VN')
 * @returns Formatted date string or 'N/A'
 */
export const formatDateString = (
  dateString: string | null | undefined,
  locale: string = 'vi-VN'
): string => {
  const date = parseDate(dateString);
  return date ? date.toLocaleString(locale) : 'N/A';
};

/**
 * Format date string to locale date string (date only)
 * @param dateString - Date string from API
 * @param locale - Locale string (default: 'vi-VN')
 * @returns Formatted date string or 'N/A'
 */
export const formatDateOnly = (
  dateString: string | null | undefined,
  locale: string = 'vi-VN'
): string => {
  const date = parseDate(dateString);
  return date ? date.toLocaleDateString(locale) : 'N/A';
};
