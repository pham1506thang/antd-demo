import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { authApi } from '@/api/slices/authApi';
import { setAuth, buildAuthState } from '@/store/slices/authSlice';

/**
 * Hook to initialize authentication state
 * This will try to get auth data from server using refreshToken from httpOnly cookie
 * Only called once when app starts
 */
export const useAuthInit = () => {
  const dispatch = useAppDispatch();
  const [getAuth] = authApi.useLazyGetAuthQuery();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return; // Prevent multiple calls

    // Don't call getAuth if already on login page
    if (window.location.pathname === '/login') {
      setIsInitialized(true);
      return;
    }

    // Try to get auth data from server
    // This will use refreshToken from httpOnly cookie automatically
    getAuth()
      .unwrap()
      .then((data) => {
        const authState = buildAuthState(data);
        dispatch(setAuth(authState));
      })
      .catch((error) => {
        // If auth fails, user will be redirected to login
        console.log('Auth initialization failed:', error);
      })
      .finally(() => {
        setIsInitialized(true);
      });
  }, [dispatch, getAuth, isInitialized]);

  return { isInitialized };
};
