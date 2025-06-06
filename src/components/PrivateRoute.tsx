import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { tokenService } from '@/services/tokenService';
import { authApi } from '@/api/slices/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setMe } from '@/store/slices/meSlice';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const { isLoading, data, error } = authApi.useGetMeQuery(undefined, {
    skip: !tokenService.hasToken(),
  });

  useEffect(() => {
    if (data) {
      dispatch(setMe(data));
    }
  }, [data, dispatch]);

  if (!tokenService.hasToken()) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isLoading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    // If there's an error fetching user data, remove token and redirect to login
    tokenService.removeToken();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute; 