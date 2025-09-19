import React from 'react';
import { Form, Input, Button, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '@/api/slices/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setAuth, buildAuthState } from '@/store/slices/authSlice';

interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = authApi.useLoginMutation();
  const [getAuth] = authApi.useLazyGetAuthQuery();

  const handleSubmit = async (values: LoginForm) => {
    try {
      await login(values).unwrap();
      
      // After successful login, get auth data from server
      // This will include the new access token and user info
      const authData = await getAuth().unwrap();
      const authState = buildAuthState(authData);
      dispatch(setAuth(authState));
      
      // Navigate to the original route or home
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      // Error handling is done by axios interceptor
      console.error('Login failed:', error);
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Card style={{ width: 400, padding: '24px 24px 0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 32 }}>Đăng nhập</h2>
        <Form
          name="login"
          onFinish={handleSubmit}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Tên đăng nhập"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
              size="large"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
