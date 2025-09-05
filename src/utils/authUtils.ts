import { store } from '@/store';
import { clearAuth } from '@/store/slices/authSlice';
import { baseApi } from '@/api/baseApi';

/**
 * Clear all authentication data and state
 * This should be called when user needs to be logged out
 */
export const clearAuthState = () => {
  // Clear Redux auth state
  store.dispatch(clearAuth());
  
  // Clear all API cache (RTK Query cache)
  store.dispatch(baseApi.util.resetApiState());
};
