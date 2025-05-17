import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { tokenService } from '@/services/tokenService';
import { authApi } from '@/api/slices/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setMe } from '@/store/slices/meSlice';

interface AppInitProps {
  children: React.ReactNode;
}

const AppInit: React.FC<AppInitProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Use lazy query to control when to fetch
  const [getMe] = authApi.useLazyGetMeQuery();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If we have a token, try to fetch the user data
    if (tokenService.hasToken()) {
      getMe().unwrap()
        .then((data) => {
          dispatch(setMe(data));
          setIsLoading(false);
        })
        .catch((error) => {
          console.log('error', error);
        });
    } else {
      navigate('/login', { 
        replace: true,
        state: { from: location }
      });
    }
  }, []);

  // Show loading while fetching profile
  if (isLoading) {
    return (
      <div style={{ 
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f2f5'
      }}>
        <Spin size="large" tip="Initializing..." fullscreen/>
      </div>
    );
  }

  return <>{children}</>;
};

export default AppInit; 